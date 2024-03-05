import * as intl from '$config/intl.config';
import { Lang, LANGS } from '$lib/intl/langs';
import type { RequestEvent } from '@sveltejs/kit';
import * as parser from 'accept-language-parser';

export const extractLang = (event: RequestEvent): Lang => {
  // If the lang is explicitly specified in the query string, use it
  const query = Lang.safeParse(event.url.searchParams.get(intl.LANG_SEARCH_PARAM));
  if (query.success) {
    event.cookies.set(intl.LANG_COOKIE_NAME, query.data, { path: '/' });
    return query.data;
  }

  // If the lang is stored in a cookie, use it
  const stored = Lang.safeParse(event.cookies.get(intl.LANG_COOKIE_NAME));
  if (stored.success) {
    return stored.data;
  }

  // Otherwise, perform negotiation using the `Accept-Language` header
  const picked = parser.pick([...LANGS], event.request.headers.get('accept-language') ?? '') ?? LANGS[0];
  event.cookies.set(intl.LANG_COOKIE_NAME, picked, { path: '/' });
  return picked;
};
