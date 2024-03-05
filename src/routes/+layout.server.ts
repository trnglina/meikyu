import { extractActor } from '$lib/server/extractors/auth';
import { extractLang } from '$lib/server/extractors/lang';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => ({
  lang: extractLang(event),
  actor: await extractActor(event),
});
