import { type Group, Permission } from '$lib/models/group';
import { isNonNullable } from '$lib/predicates';
import type { AliasedRawBuilder, ExpressionBuilder } from 'kysely';
import type { DB } from 'kysely-codegen';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { match } from 'ts-pattern';

interface UserGroupsRows {
  groupId: string;
  groupName: string;
  permissions: { permissionValue: string; }[];
}

export const withUserGroupsRows = (
  eb: ExpressionBuilder<DB, 'currentUsers'>,
): AliasedRawBuilder<UserGroupsRows[], 'groups'> =>
  jsonArrayFrom(
    eb.selectFrom('userGroups')
      .innerJoin('groups', 'userGroups.groupId', 'groups.groupId')
      .whereRef('userGroups.userId', '=', 'currentUsers.userId')
      .select(['userGroups.groupId', 'groups.groupName'])
      .select((eb) => [
        jsonArrayFrom(
          eb.selectFrom('groupPermissions')
            .whereRef('groupPermissions.groupId', '=', 'userGroups.groupId')
            .select(['groupPermissions.permissionValue']),
        ).as('permissions'),
      ]),
  ).as('groups');

export const fromUserGroupsRows = (groups: UserGroupsRows[]): Group[] => {
  return groups.map(({ permissions, ...rest }) => ({
    ...rest,
    permissions: permissions.map(({ permissionValue }) =>
      match(Permission.safeParse(permissionValue))
        .with({ success: true }, (p) => p.data)
        .otherwise(() => null)
    ).filter(isNonNullable),
  }));
};
