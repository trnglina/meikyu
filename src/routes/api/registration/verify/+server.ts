import * as auth from '$config/auth.config';
import { finishRegistration } from '$lib/server/services/auth';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const registrationId = cookies.get(auth.REGISTRATION_ID_COOKIE_NAME);
  const attestation: unknown = await request.json();
  if (registrationId === undefined) return json(null, { status: 403 });

  const sessionId = await finishRegistration(registrationId, attestation);
  cookies.set(auth.SESSION_ID_COOKIE_NAME, sessionId, { path: '/', maxAge: auth.SESSION_ID_MAX_AGE });
  return new Response(null, { status: 204 });
};
