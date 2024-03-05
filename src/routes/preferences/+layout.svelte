<script lang="ts">
import { page } from '$app/stores';
import { css } from '$lib/styled-system/css';
import { grid, gridItem, vstack } from '$lib/styled-system/patterns';
import { pageContent, pageHeading } from '$lib/styles/page';
import { Localized } from '@nubolab-ffwd/svelte-fluent';
import { navLink } from './styles';

const links = [
  { label: 'preferences-profile-link', href: '/preferences/profile' },
  { label: 'preferences-security-link', href: '/preferences/security' },
  { label: 'preferences-account-link', href: '/preferences/account' },
];
</script>

<div
  class={css(
    grid.raw({ columns: '{sizes.60} 1fr', rows: 'auto auto', gap: '6' }),
    pageContent.raw(),
    { maxWidth: '4xl' },
  )}
>
  <h1 class={css(gridItem.raw({ row: '1', column: '1 / -1' }), pageHeading.raw())}>
    <Localized id="preferences-heading" />
  </h1>

  <nav class={css(gridItem.raw({ area: '2 / 1' }), vstack.raw({ gap: '2', justifyContent: 'start' }))} data-sveltekit-keepfocus>
    {#each links as { label, href }}
      {@const variant = href === $page.url.pathname ? 'active' : undefined}
      <a class={navLink({ variant })} {href}><Localized id={label} /></a>
    {/each}
  </nav>

  <div class={gridItem({ area: '2 / 2' })}>
    <slot />
  </div>
</div>
