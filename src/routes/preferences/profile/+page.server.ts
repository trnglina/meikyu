import { DisplayName, Username } from '$lib/models/user';
import { extractActor } from '$lib/server/extractors/auth';
import { updateUserProfileByUserId } from '$lib/server/services/user';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const UpdateUserFormParams = z.object({
  username: Username,
  displayName: DisplayName,
});

export const load: PageServerLoad = async (event) => {
  const { actor } = await event.parent();
  if (actor === null) return redirect(303, '/sign-in');

  return {
    form: await superValidate(zod(UpdateUserFormParams), { defaults: actor.user }),
    actor,
  };
};

export const actions = {
  default: async (event) => {
    const actor = await extractActor(event);
    const form = await superValidate(event.request, zod(UpdateUserFormParams));
    if (actor === null) return redirect(303, '/sign-in');
    if (!form.valid) return fail(422, { form });
    await updateUserProfileByUserId(actor, actor.user.userId, form.data);
  },
} satisfies Actions;
