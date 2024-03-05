import type { ListParams } from '$lib/models/list';
import type { UpdateUserProfileParams, UserGroups, UserProfile } from '$lib/models/user';
import type { Actor } from '$lib/policies';
import { canDeleteUserProfile, canListUserProfiles, canUpdateUserProfile } from '$lib/policies/user';
import { isErr, NotFoundError, type PromiseResult, UnauthorizedError } from '$lib/result';
import db from '$lib/server/db';
import { fromUserGroupsRows, withUserGroupsRows } from '$lib/server/queries/user';
import invariant from 'tiny-invariant';

export const $listUserProfiles = async (
  params: ListParams,
): Promise<UserProfile[]> => {
  const rows = await db
    .selectFrom('currentUsers')
    .offset(params.offset)
    .limit(params.limit)
    .select(['userId', 'username', 'displayName'])
    .execute();

  return rows.map(({ userId, username, ...rest }) => {
    invariant(userId);
    invariant(username);
    return { userId, username, ...rest };
  });
};

export const listUserProfiles = async (
  actor: Actor,
  params: ListParams,
): PromiseResult<UserProfile[], UnauthorizedError> => {
  if (!canListUserProfiles({ actor })) return new UnauthorizedError();
  return await $listUserProfiles(params);
};

export const getUserProfileByUserId = async (
  userId: string,
): PromiseResult<UserProfile, NotFoundError> => {
  const row = await (async () => {
    try {
      return await db
        .selectFrom('currentUsers')
        .where('userId', '=', userId)
        .select(['displayName'])
        .executeTakeFirst();
    } catch (e) {
      return null;
    }
  })();
  if (!row) return new NotFoundError();

  return { userId, ...row };
};

export const getUserProfileByUsername = async (
  username: string,
): PromiseResult<UserProfile, NotFoundError> => {
  const row = await db
    .selectFrom('currentUsers')
    .where('username', '=', username)
    .select(['userId', 'displayName'])
    .executeTakeFirst();
  if (!row) return new NotFoundError();

  const { userId, ...rest } = row;
  invariant(userId);
  return { userId, ...rest };
};

export const $updateUserProfileByUserId = async (
  userId: string,
  params: UpdateUserProfileParams,
): PromiseResult<void, NotFoundError> => {
  return await db.transaction().execute(async (trx) => {
    const user = await trx
      .selectFrom('users')
      .where('users.userId', '=', userId)
      .leftJoin('userVersions', 'users.userId', 'userVersions.userId')
      .orderBy('users.userId')
      .orderBy('userVersions.revisedAt desc')
      .select(['users.userId', 'versionId'])
      .executeTakeFirst();
    if (!user) return new NotFoundError();

    if (params.displayName !== undefined) {
      await trx
        .insertInto('userVersions')
        .values({
          userId: user.userId,
          parentId: user.versionId,
          displayName: params.displayName,
        })
        .execute();
    }
  });
};

export const updateUserProfileByUserId = async (
  actor: Actor,
  userId: string,
  params: UpdateUserProfileParams,
): PromiseResult<void, NotFoundError | UnauthorizedError> => {
  const userProfile = await getUserProfileByUserId(userId);
  if (isErr(userProfile)) return userProfile;
  if (!canUpdateUserProfile({ actor, userProfile })) return new UnauthorizedError();
  return await $updateUserProfileByUserId(userId, params);
};

export const getUserGroupsByUserId = async (
  userId: string,
): PromiseResult<UserGroups, NotFoundError> => {
  const row = await db
    .selectFrom('currentUsers')
    .where('userId', '=', userId)
    .select((eb) => [
      withUserGroupsRows(eb),
    ])
    .executeTakeFirst();
  if (!row) return new NotFoundError();

  return {
    userId,
    groups: fromUserGroupsRows(row.groups),
  };
};

export const $deleteUserByUserId = async (
  userId: string,
): PromiseResult<void, NotFoundError> => {
  const { numDeletedRows } = await db
    .deleteFrom('users')
    .where('userId', '=', userId)
    .executeTakeFirst();
  if (numDeletedRows <= 0) return new NotFoundError();
};

export const deleteUserByUserId = async (
  actor: Actor,
  userId: string,
): PromiseResult<void, NotFoundError | UnauthorizedError> => {
  const userProfile = await getUserProfileByUserId(userId);
  if (isErr(userProfile)) return userProfile;
  if (!canDeleteUserProfile({ actor, userProfile })) return new UnauthorizedError();

  return await $deleteUserByUserId(userId);
};
