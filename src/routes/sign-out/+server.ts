import { extractActor, extractSessionId } from '$lib/server/extractors/auth';
import { deleteSessionById } from '$lib/server/services/session';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  const actor = await extractActor(event);
  const sessionId = extractSessionId(event);
  if (actor !== null && sessionId !== null) await deleteSessionById(actor, sessionId);
  redirect(303, '/');
};
