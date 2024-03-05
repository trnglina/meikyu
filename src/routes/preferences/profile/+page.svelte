<script lang="ts">
import { css } from '$lib/styled-system/css';
import { vstack } from '$lib/styled-system/patterns';
import { button } from '$lib/styles/button';
import { input, inputError } from '$lib/styles/input';
import { localize, Localized } from '@nubolab-ffwd/svelte-fluent';
import { superForm } from 'sveltekit-superforms';
import { sectionHeading } from '../styles';
import type { PageData } from './$types';

export let data: PageData;

const { form, errors, enhance } = superForm(data.form);
</script>

<svelte:head>
  <title>{$localize('profile-preferences-title')}</title>
</svelte:head>

<div class={vstack({ gap: '6' })}>
  <h2 class={sectionHeading()}><Localized id="profile-preferences-heading" /></h2>
  <form class={vstack({ gap: '6' })} method="POST" use:enhance>
    <label class={vstack({ gap: '2' })}>
      <Localized id="profile-form-username-label" />
      <input
        class={input()}
        aria-invalid={$errors.username ? 'true' : undefined}
        autocomplete="username"
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
    </label>
    <label class={vstack({ gap: '2' })}>
      <Localized id="profile-form-display-name-label" />
      <input
        class={input()}
        aria-invalid={$errors.displayName ? 'true' : undefined}
        autocomplete="name"
        type="text"
        name="displayName"
        bind:value={$form.displayName}
      />
      {#if $errors.displayName}
        <ul class={inputError()}>
          {#each $errors.displayName as error}
            <li><Localized id={error} /></li>
          {/each}
        </ul>
      {/if}
    </label>
    <button class={css(button.raw({ type: 'primary' }), { alignSelf: 'start' })} type="submit">
      <Localized id="profile-form-submit-button" />
    </button>
  </form>
</div>
