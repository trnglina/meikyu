<script lang="ts">
import { vstack } from '$lib/styled-system/patterns';
import { localize, Localized } from '@nubolab-ffwd/svelte-fluent';
import { sectionHeading } from '../styles';
</script>

<svelte:head>
  <title>{$localize('security-preferences-title')}</title>
</svelte:head>

<div class={vstack({ gap: '6' })}>
  <h2 class={sectionHeading()}><Localized id="security-preferences-heading" /></h2>
</div>
