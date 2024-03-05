<script lang="ts">
import { css } from '$lib/styled-system/css';
import { hstack, vstack } from '$lib/styled-system/patterns';
import { button, iconButton } from '$lib/styles/button';
import { dialogCard, dialogHeading } from '$lib/styles/dialog';
import { localize, Localized, Overlay } from '@nubolab-ffwd/svelte-fluent';
import X from 'phosphor-svelte/lib/X';
import { sectionHeading } from '../styles';

let dialog: HTMLDialogElement;
</script>

<svelte:head>
  <title>{$localize('account-preferences-title')}</title>
</svelte:head>

<div class={vstack({ gap: '6' })}>
  <h2 class={sectionHeading()}><Localized id="account-preferences-heading" /></h2>

  <button class={css(button.raw({ type: 'destructive' }), { alignSelf: 'start' })} type="button" on:click={() => dialog.showModal()}>
    <Localized id="account-delete-user-button" />
  </button>
</div>

<dialog class={dialogCard()} bind:this={dialog}>
  <div class={vstack({ gap: '6' })}>
    <div class={vstack({ gap: '4' })}>
      <div class={hstack({ gap: '4', alignItems: 'start', justifyContent: 'space-between' })}>
        <h3 class={dialogHeading()}><Localized id="account-delete-user-dialog-heading" /></h3>
        <button
          aria-label={$localize('account-delete-user-dialog-close-button-label')}
          class={iconButton()}
          type="button"
          on:click={() => dialog.close()}
        ><X aria-hidden /></button>
      </div>
      <p><Overlay id="account-delete-user-dialog-description" /></p>
    </div>
    <form method="POST" action="?/delete">
      <button class={button({ type: 'destructive' })} type="submit">
        <Localized id="account-delete-user-dialog-submit-button" />
      </button>
    </form>
  </div>
</dialog>
