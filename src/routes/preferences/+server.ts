import { extractActor } from '$lib/server/extractors/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const actor = await extractActor(event);
  if (actor === null) return redirect(303, '/sign-in');
  return redirect(303, '/preferences/profile');
};
