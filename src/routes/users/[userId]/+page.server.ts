import { isErr } from '$lib/result';
import { getUserGroupsByUserId, getUserProfileByUserId } from '$lib/server/services/user';
import { parseUrlId } from '$lib/urlid';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const userId = parseUrlId(event.params.userId);
  const userProfile = await getUserProfileByUserId(userId);
  if (isErr(userProfile)) return error(404, 'Not Found');
  const userGroups = await getUserGroupsByUserId(userId);
  if (isErr(userGroups)) return error(404, 'Not Found');
  return { userProfile, userGroups };
};
