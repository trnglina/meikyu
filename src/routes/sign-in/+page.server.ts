import { AuthParams } from '$lib/models/auth';
import { isErr } from '$lib/result';
import { getUserProfileByUsername } from '$lib/server/services/user';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { actor } = await event.parent();
  if (actor !== null) return redirect(303, '/');

  return {
    form: await superValidate(zod(AuthParams)),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(AuthParams));
    if (!form.valid) return fail(422, { form, userProfile: null });
    const userProfile = await getUserProfileByUsername(form.data.username);
    if (isErr(userProfile)) return { form, userProfile: null };
    return { form, userProfile };
  },
} satisfies Actions;
