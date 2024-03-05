import * as auth from '$config/auth.config';
import { finishAuthentication } from '$lib/server/services/auth';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const authenticationId = cookies.get(auth.AUTHENTICATION_ID_COOKIE_NAME);
  const assertion: unknown = await request.json();
  if (authenticationId === undefined) return json(null, { status: 403 });

  const sessionId = await finishAuthentication(authenticationId, assertion);
  cookies.set(auth.SESSION_ID_COOKIE_NAME, sessionId, { path: '/' });
  return new Response(null, { status: 204 });
};
