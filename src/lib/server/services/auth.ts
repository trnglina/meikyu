import * as auth from '$config/auth.config';
import * as webauthn from '$config/webauthn.config';
import type { AuthParams } from '$lib/models/auth';
import type { Actor } from '$lib/policies';
import db from '$lib/server/db';
import { fromUserGroupsRows, withUserGroupsRows } from '$lib/server/queries/user';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';
import { randomUUID } from 'crypto';
import { Base64 } from 'js-base64';
import { sql } from 'kysely';
import invariant from 'tiny-invariant';

// TODO: Error handling
export const startRegistration = async (
  { username }: AuthParams,
): Promise<[string, PublicKeyCredentialCreationOptionsJSON]> => {
  const userId = randomUUID();
  const options = await generateRegistrationOptions({
    rpName: webauthn.RP_NAME,
    rpID: webauthn.RP_ID,
    userID: userId,
    userName: username,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
  });

  const { registrationId } = await db
    .insertInto('registrations')
    .values({
      challenge: options.challenge,
      userId,
      username,
    })
    .returning(['registrationId'])
    .executeTakeFirstOrThrow();

  return [registrationId, options];
};

// TODO: Error handling
export const finishRegistration = async (
  registrationId: string,
  payload: unknown,
): Promise<string> => {
  const response = payload as RegistrationResponseJSON;
  const sessionId = await db.transaction().execute(async (trx) => {
    const { challenge, userId, username } = await trx
      .selectFrom('registrations')
      .where(sql<boolean>`
        registration_id = ${registrationId} and
        NOW() < created_at + INTERVAL '${sql.raw(auth.REGISTRATION_ID_MAX_AGE.toString())} second'
      `)
      .select(['challenge', 'userId', 'username'])
      .executeTakeFirstOrThrow();

    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: webauthn.RP_ORIGIN,
      expectedRPID: webauthn.RP_ID,
    });

    if (!verified || !registrationInfo) throw new Error('Response verification failed');

    await trx
      .insertInto('users')
      .values({
        userId,
        username,
      })
      .returning(['userId'])
      .execute();

    const credentialId = Base64.fromUint8Array(registrationInfo.credentialID, true);
    await trx
      .insertInto('credentials')
      .values({
        credentialId,
        userId,
        credentialPublicKey: Buffer.from(registrationInfo.credentialPublicKey),
        counter: registrationInfo.counter,
        credentialDeviceType: registrationInfo.credentialDeviceType,
        credentialBackedUp: registrationInfo.credentialBackedUp,
        transports: response.response.transports ?? [],
      })
      .execute();

    const { sessionId } = await trx
      .insertInto('sessions')
      .values({
        credentialId,
        userId,
      })
      .returning(['sessionId'])
      .executeTakeFirstOrThrow();

    return sessionId;
  });

  return sessionId;
};

// TODO: Error handling
export const startAuthentication = async (
  { username }: AuthParams,
): Promise<[string, PublicKeyCredentialRequestOptionsJSON] | null> => {
  const credentials = await db
    .selectFrom('credentials')
    .innerJoin('users', 'credentials.userId', 'users.userId')
    .where('users.username', '=', username)
    .select(['users.userId', 'credentials.credentialId', 'credentials.transports'])
    .execute();

  // If the user does not exist or has no credentials, return null.
  if (!credentials[0]) return null;

  const options = await generateAuthenticationOptions({
    rpID: webauthn.RP_ID,
    allowCredentials: credentials.map(({ credentialId, transports }) => ({
      id: Base64.toUint8Array(credentialId),
      type: 'public-key',
      transports: transports as AuthenticatorTransportFuture[],
    })),
    userVerification: 'preferred',
  });

  const { authenticationId } = await db
    .insertInto('authentications')
    .values({
      userId: credentials[0].userId,
      challenge: options.challenge,
    })
    .returning(['authenticationId'])
    .executeTakeFirstOrThrow();

  return [authenticationId, options];
};

// TODO: Error handling
export const finishAuthentication = async (
  authenticationId: string,
  payload: unknown,
): Promise<string> => {
  const response = payload as AuthenticationResponseJSON;
  const sessionId = await db.transaction().execute(async (trx) => {
    const { challenge, userId } = await trx
      .selectFrom('authentications')
      .where(sql<boolean>`
        authentications.authentication_id = ${authenticationId} and
        NOW() < authentications.created_at + INTERVAL '${sql.raw(auth.AUTHENTICATION_ID_MAX_AGE.toString())} second'
      `)
      .select(['challenge', 'userId'])
      .executeTakeFirstOrThrow();

    const credential = await trx
      .selectFrom('credentials')
      .where('credentialId', '=', response.id)
      .select(['credentialId', 'credentialPublicKey', 'counter', 'transports'])
      .executeTakeFirstOrThrow();

    const { verified, authenticationInfo: { newCounter } } = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: webauthn.RP_ORIGIN,
      expectedRPID: webauthn.RP_ID,
      authenticator: {
        credentialID: Base64.toUint8Array(credential.credentialId),
        credentialPublicKey: credential.credentialPublicKey,
        counter: Number(credential.counter),
        transports: credential.transports as AuthenticatorTransportFuture[],
      },
    });

    if (!verified) throw new Error('Response verification failed');

    await trx
      .updateTable('credentials')
      .set({
        counter: newCounter,
      })
      .where('credentialId', '=', credential.credentialId)
      .execute();

    const { sessionId } = await trx
      .insertInto('sessions')
      .values({
        credentialId: credential.credentialId,
        userId,
      })
      .returning(['sessionId'])
      .executeTakeFirstOrThrow();

    return sessionId;
  });

  return sessionId;
};

export const getActor = async (sessionId: string): Promise<Actor | null> => {
  const row = await db
    .selectFrom('sessions')
    .innerJoin('currentUsers', 'sessions.userId', 'currentUsers.userId')
    .where(sql<boolean>`
      session_id = ${sessionId} and
      NOW() < sessions.created_at + INTERVAL '${sql.raw(auth.SESSION_ID_MAX_AGE.toString())} second'
    `)
    .select([
      'currentUsers.userId',
      'currentUsers.username',
      'currentUsers.displayName',
      'sessions.credentialId',
    ])
    .select((eb) => [
      withUserGroupsRows(eb),
    ])
    .executeTakeFirst();
  if (!row) return null;

  const { userId, username, displayName, credentialId, groups } = row;
  invariant(userId !== null && username !== null);

  return {
    user: {
      userId,
      username,
      displayName,
      groups: fromUserGroupsRows(groups),
    },
    session: { userId, sessionId, credentialId },
  };
};
