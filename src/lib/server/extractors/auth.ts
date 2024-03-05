import * as auth from '$config/auth.config';
import type { Actor } from '$lib/policies';
import { getActor } from '$lib/server/services/auth';
import type { RequestEvent } from '@sveltejs/kit';

export const extractSessionId = (event: RequestEvent): string | null => {
  return event.cookies.get(auth.SESSION_ID_COOKIE_NAME) ?? null;
};

export const extractActor = async (event: RequestEvent): Promise<Actor | null> => {
  const sessionId = extractSessionId(event);
  if (sessionId === null) return null;
  return getActor(sessionId);
};
