<script lang="ts">
import '../app.css';

import type { Lang } from '$lib/intl/langs';
import { LANGS } from '$lib/intl/langs';
import { RESOURCES } from '$lib/intl/resources';
import logger from '$lib/logger';
import { css } from '$lib/styled-system/css';
import { grid, gridItem } from '$lib/styled-system/patterns';
import { FluentBundle } from '@fluent/bundle';
import { FluentProvider, Localized } from '@nubolab-ffwd/svelte-fluent';
import type { LayoutData } from './$types';
import LanguageSelect from './LanguageSelect.svelte';
import SkipLink from './SkipLink.svelte';
import { navLink } from './styles';
import UserPopover from './UserPopover.svelte';

export let data: LayoutData;

const makeBundle = (lang: Lang): FluentBundle => {
  const bundle = new FluentBundle(lang);
  for (const error of bundle.addResource(RESOURCES[lang])) {
    logger.error(`error loading resource '${lang}'`, error);
  }
  return bundle;
};

const bundles = (() => {
  if (data.lang === LANGS[0]) {
    return [makeBundle(data.lang)];
  }

  return [makeBundle(data.lang), makeBundle(LANGS[0])];
})();
</script>

<FluentProvider bundles={bundles}>
  <div
    class={grid({
      rows: 'auto 1fr',
      minHeight: '[100dvh]',
      background: 'zinc.100',
      color: 'zinc.900',
    })}
  >
    <SkipLink href="#main-content" css={[gridItem.raw({ area: '1 / 1' })]} />
    <nav
      class={css(
        gridItem.raw({ area: '1 / 1' }),
        grid.raw({ columns: 'auto 1fr auto minmax(0, auto)' }),
        {
          background: 'zinc.900',
          color: 'zinc.100',
          fontSize: 'sm',
          fontWeight: 'semibold',
        },
      )}
    >
      <a class={css(gridItem.raw({ column: '1' }), navLink.raw())} href="/">
        <Localized id="primary-nav-home" />
      </a>
      <LanguageSelect lang={data.lang} css={[gridItem.raw({ column: '3' })]} />
      {#if !data.actor}
        <a class={css(gridItem.raw({ column: '4' }), navLink.raw())} href="/sign-in">
          <Localized id="primary-nav-sign-in" />
        </a>
      {:else}
        <UserPopover user={data.actor.user} css={[gridItem.raw({ column: '4' })]} />
      {/if}
    </nav>
    <main class={gridItem({ area: '2 / 1' })} id="main-content">
      <slot />
    </main>
  </div>
</FluentProvider>
