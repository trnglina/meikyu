import { extractActor } from '$lib/server/extractors/auth';
import { deleteUserByUserId } from '$lib/server/services/user';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { actor } = await event.parent();
  if (actor === null) return redirect(303, '/sign-in');
  return { actor };
};

export const actions = {
  delete: async (event) => {
    const actor = await extractActor(event);
    if (actor === null) return redirect(303, '/sign-in');
    await deleteUserByUserId(actor, actor.user.userId);
  },
} satisfies Actions;
