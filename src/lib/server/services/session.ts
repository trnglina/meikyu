import type { Session } from '$lib/models/session';
import type { Actor } from '$lib/policies';
import { canDeleteSession } from '$lib/policies/session';
import { isErr, NotFoundError, type PromiseResult, UnauthorizedError } from '$lib/result';
import db from '$lib/server/db';

export const $getSessionById = async (sessionId: string): PromiseResult<Session, NotFoundError> => {
  const session = await db
    .selectFrom('sessions')
    .where('sessionId', '=', sessionId)
    .select(['userId', 'sessionId', 'credentialId'])
    .executeTakeFirst();
  if (!session) return new NotFoundError();
  return session;
};

export const $deleteSessionById = async (sessionId: string): PromiseResult<void, NotFoundError> => {
  const { numDeletedRows } = await db
    .deleteFrom('sessions')
    .where('sessionId', '=', sessionId)
    .executeTakeFirst();
  if (numDeletedRows <= 0) return new NotFoundError();
};

export const deleteSessionById = async (
  actor: Actor,
  sessionId: string,
): PromiseResult<void, NotFoundError | UnauthorizedError> => {
  const session = await $getSessionById(sessionId);
  if (isErr(session)) return session;
  if (!canDeleteSession({ actor, session })) return new UnauthorizedError();
  return await $deleteSessionById(sessionId);
};
