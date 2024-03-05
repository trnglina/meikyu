import { z } from 'zod';

export const ListParams = z.object({
  limit: z.number().default(50),
  offset: z.number().default(0),
});
export type ListParams = z.infer<typeof ListParams>;
