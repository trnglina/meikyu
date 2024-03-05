import type { Group } from '$lib/models/group';
import { z } from 'zod';

export interface User {
  readonly userId: string;
  readonly username: string;
  readonly displayName: string | null;
  readonly groups: Group[];
}

export type UserProfile = Pick<User, 'userId' | 'displayName'>;
export type UserGroups = Pick<User, 'userId' | 'groups'>;
export type UserCredentials = Pick<User, 'userId' | 'username'>;

export const Username = z.string()
  .regex(/^([a-zA-Z_][a-zA-Z0-9_.-]*)?$/, 'validation-username-invalid')
  .min(4, 'validation-username-too-short')
  .max(100, 'validation-username-too-long');

export const DisplayName = z.string()
  .min(1, 'validation-display-name-too-short')
  .max(50, 'validation-display-name-too-long')
  .nullable();

export const UpdateUserProfileParams = z.object({
  displayName: z.optional(DisplayName),
});
export type UpdateUserProfileParams = z.infer<typeof UpdateUserProfileParams>;
