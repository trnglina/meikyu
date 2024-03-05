import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { actor } = await event.parent();
  if (actor === null) return redirect(303, '/sign-in');
  return { actor };
};

export const actions = {} satisfies Actions;
