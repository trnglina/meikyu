<script lang="ts">
import { css } from '$lib/styled-system/css';
import { vstack } from '$lib/styled-system/patterns';
import { pageContent, pageHeading } from '$lib/styles/page';
import { localize, Localized } from '@nubolab-ffwd/svelte-fluent';
import type { PageData } from './$types';

export let data: PageData;
</script>

<svelte:head>
  {#if data.userProfile.displayName}
    <title>{$localize('user-profile-heading-with-display-name', { displayName: data.userProfile.displayName })}</title>
  {:else}
    <title>
      {$localize('user-profile-heading-without-display-name')}
    </title>
  {/if}
</svelte:head>

<div class={css(vstack.raw({ gap: '6' }), pageContent.raw(), { maxWidth: '4xl' })}>
  <h1 class={pageHeading({ fontWeight: '{fontWeights.normal}' })}>
    {#if data.userProfile.displayName}
      <Localized id="user-profile-heading-with-display-name" args={{ displayName: data.userProfile.displayName }} />
    {:else}
      <Localized id="user-profile-heading-without-display-name" />
    {/if}
  </h1>
</div>
