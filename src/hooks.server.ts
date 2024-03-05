import logger from '$lib/logger';
import { extractLang } from '$lib/server/extractors/lang';
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) =>
  await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', extractLang(event)),
  });

export const handleError: HandleServerError = ({ status, error, message }) => {
  if (status !== 404) logger.error(error);
  return { message };
};
