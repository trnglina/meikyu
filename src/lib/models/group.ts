import { z } from 'zod';

export const Permission = z.enum(['manage_groups', 'manage_users']);
export type Permission = z.infer<typeof Permission>;

export interface Group {
  readonly groupId: string;
  readonly groupName: string;
  readonly permissions: Permission[];
}
