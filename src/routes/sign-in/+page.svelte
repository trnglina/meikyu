<script lang="ts">
import { css } from '$lib/styled-system/css';
import { hstack, vstack } from '$lib/styled-system/patterns';
import { button } from '$lib/styles/button';
import { input, inputError } from '$lib/styles/input';
import { pageContent, pageHeading } from '$lib/styles/page';
import { localize, Localized } from '@nubolab-ffwd/svelte-fluent';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import type { ActionResult } from '@sveltejs/kit';
import { superForm } from 'sveltekit-superforms';
import type { ActionData, PageData } from './$types';

export let data: PageData;

const { form, errors, enhance } = superForm(data.form, {
  async onResult(event) {
    const result = event.result as ActionResult & { data?: ActionData; };
    if (result.type !== 'success' || result.data === undefined) return;
    const { userProfile, form } = result.data;

    if (userProfile) {
      const startResponse = await fetch('/api/authentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: form.data.username,
      });
      const assertion = await startAuthentication(await startResponse.json() as PublicKeyCredentialRequestOptionsJSON);
      await fetch('/api/authentication/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assertion),
      });
    } else {
      const startResponse = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: form.data.username,
      });
      const attestation = await startRegistration(await startResponse.json() as PublicKeyCredentialCreationOptionsJSON);
      await fetch('/api/registration/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attestation),
      });
    }

    location.replace('/');
  },
});
</script>

<svelte:head>
  <title>{$localize('auth-title')}</title>
</svelte:head>

<div class={css(vstack.raw({ gap: '6' }), pageContent.raw(), { maxWidth: 'xl' })}>
  <h1 class={pageHeading({ fontWeight: '{fontWeights.normal}' })}>
    <Localized id="auth-heading" />
  </h1>

  <form class={hstack({ gap: '4', alignItems: 'start' })} method="POST" use:enhance>
    <span class={vstack({ gap: '2', flex: '1' })}>
      <input
        class={input()}
        aria-label={$localize('auth-form-username-label')}
        aria-invalid={$errors.username ? 'true' : undefined}
        autocomplete="username webauthn"
        placeholder={$localize('auth-form-username-label')}
        type="text"
        name="username"
        bind:value={$form.username}
      />
      {#if $errors.username}
        <ul class={inputError()}>
          {#each $errors.username as error}
            <li><Localized id={error} /></li>
          {/each}
        </ul>
      {/if}
    </span>
    <button class={button({ type: 'primary' })}>
      <Localized id="auth-form-submit-button" />
    </button>
  </form>
</div>
