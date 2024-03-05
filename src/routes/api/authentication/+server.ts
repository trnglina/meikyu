import * as auth from '$config/auth.config';
import { startAuthentication } from '$lib/server/services/auth';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const username = await request.text();
  const result = await startAuthentication({ username });
  if (result === null) return json(null, { status: 404 });
  const [authenticationId, options] = result;
  cookies.set(auth.AUTHENTICATION_ID_COOKIE_NAME, authenticationId, { path: '' });
  return json(options);
};
