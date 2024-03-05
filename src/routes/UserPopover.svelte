<script lang="ts">
import type { User } from '$lib/models/user';
import { css } from '$lib/styled-system/css';
import { vstack } from '$lib/styled-system/patterns';
import { formatUrlId } from '$lib/urlid';
import { Localized } from '@nubolab-ffwd/svelte-fluent';
import CaretDown from 'phosphor-svelte/lib/CaretDown';
import CaretUp from 'phosphor-svelte/lib/CaretUp';
import SignOut from 'phosphor-svelte/lib/SignOut';
import UserCircle from 'phosphor-svelte/lib/UserCircle';
import Wrench from 'phosphor-svelte/lib/Wrench';
import { createPopover } from 'svelte-headlessui';
import { navLink } from './styles';

let cssProp: Parameters<typeof css> = [];
export { cssProp as css };
export let user: User;

const popover = createPopover({});
</script>

<div class={css({ position: 'relative' }, ...cssProp)}>
  <button class={css({ textDecoration: 'underline' }, navLink.raw())} use:popover.button>
    {user.displayName ?? user.username}
    {#if $popover.expanded}
      <CaretUp aria-hidden />
    {:else}
      <CaretDown aria-hidden />
    {/if}
  </button>
  {#if $popover.expanded}
    <div
      class={vstack({
        gap: '0',
        position: 'absolute',
        top: '[100%]',
        right: '0',
        width: 'max',
        minWidth: '40',
        background: 'zinc.900',
        color: 'zinc.100',
      })}
      use:popover.panel
    >
      <a href="/users/{formatUrlId(user.userId)}" class={navLink()} on:click={popover.close}>
        <UserCircle aria-hidden weight="bold" />
        <Localized id="user-popover-profile" />
      </a>
      <a href="/preferences" class={navLink()} on:click={popover.close}>
        <Wrench aria-hidden weight="bold" />
        <Localized id="user-popover-preferences" />
      </a>
      <form method="POST" action="/sign-out" class={css({ display: 'contents' })}>
        <button type="submit" class={navLink()}>
          <SignOut aria-hidden weight="bold" />
          <Localized id="user-popover-sign-out" />
        </button>
      </form>
    </div>
  {/if}
</div>
