import { z } from 'zod';

export const LANGS = ['en', 'ja'] as const;
export const Lang = z.enum(LANGS);
export type Lang = z.infer<typeof Lang>;
