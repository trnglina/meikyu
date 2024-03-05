import { Username } from '$lib/models/user';
import { z } from 'zod';

export const AuthParams = z.object({
  username: Username,
});
export type AuthParams = z.infer<typeof AuthParams>;
