<script lang="ts">
import { page } from '$app/stores';
import * as intl from '$config/intl.config';
import type { Lang } from '$lib/intl/langs';
import { css } from '$lib/styled-system/css';
import { hstack } from '$lib/styled-system/patterns';
import { localize } from '@nubolab-ffwd/svelte-fluent';
import CaretDown from 'phosphor-svelte/lib/CaretDown';
import Translate from 'phosphor-svelte/lib/Translate';

let cssProp: Parameters<typeof css> = [];
export { cssProp as css };
export let lang: Lang;
</script>

<span
  class={css(
    hstack.raw({
      gap: '0',
      paddingInline: '3',
      background: 'zinc.900',
      transition: 'background',
      '&:hover': {
        background: 'zinc.800',
        transition: 'background',
      },
    }),
    ...cssProp,
  )}
>
  <span class={css({ pointerEvents: 'none' })}>
    <Translate aria-hidden weight="bold" />
  </span>
  <select
    class={css({
      height: '[100%]',
      paddingBlock: '1',
      paddingInline: '[calc(1em + {sizes.5})]',
      marginInline: '[calc(-1em - {sizes.3})]',
    })}
    aria-label={$localize('language-select-label')}
    on:change={(e) => {
      const params = new URLSearchParams($page.url.searchParams);
      params.set(intl.LANG_SEARCH_PARAM, e.currentTarget.value);
      location.replace(`?${params.toString()}`);
    }}
  >
    <option value="en" selected={lang === 'en'}>English</option>
    <option value="ja" selected={lang === 'ja'}>日本語</option>
  </select>
  <span class={css({ pointerEvents: 'none' })}>
    <CaretDown aria-hidden />
  </span>
</span>
