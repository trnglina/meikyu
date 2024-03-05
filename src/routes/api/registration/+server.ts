import * as auth from '$config/auth.config';
import { startRegistration } from '$lib/server/services/auth';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const username = await request.text();
  const [registrationId, options] = await startRegistration({ username });
  cookies.set(auth.REGISTRATION_ID_COOKIE_NAME, registrationId, { path: '' });
  return json(options);
};
