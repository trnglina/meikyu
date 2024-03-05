<script lang="ts">
import { isNonNullable } from '$lib/predicates';
import { css } from '$lib/styled-system/css';
import { vstack } from '$lib/styled-system/patterns';
import { pageContent, pageHeading } from '$lib/styles/page';
import { Localized, localize } from '@nubolab-ffwd/svelte-fluent';
import projects from './licenses.json';
</script>

<svelte:head>
  <title>{$localize('third-party-title')}</title>
</svelte:head>

<div class={css(vstack.raw({ gap: '6' }), pageContent.raw(), { maxWidth: '2xl' })}>
  <h1 class={pageHeading({ fontWeight: '{fontWeights.normal}' })}>
    <Localized id="third-party-heading" />
  </h1>

  <ul class={vstack({ gap: '6' })}>
    {#each projects.sort((a, b) => a.name.localeCompare(b.name)) as project}
      <li class={vstack({ gap: '2' })}>
        <div>
          <p>
            <strong><a href={project.homepage}>{project.name}</a></strong>
            - {project.license}
          </p>
          {#if project.author !== null || project.maintainers.length > 0 || project.contributors.length > 0}
            {@const authors = [[project.author], project.maintainers, project.contributors].flat().filter(isNonNullable)}
            <p class={css({ fontStyle: 'italic' })}>
              {#each authors as author, i}<a href={author.url} target="_blank" rel="noopener noreferrer">{author.name}</a
                >{#if i < authors.length - 1},
                {/if}{/each}
            </p>
          {/if}
          {#if project.description}
            <p>{project.description}</p>
          {/if}
        </div>
        {#if project.licenseText}
          <code class={css({ display: 'block', background: 'zinc.200', borderRadius: 'md' })}><pre
              class={css({ padding: '4', fontSize: 'sm', overflow: 'auto' })}
            >{project.licenseText}</pre></code>
        {/if}
      </li>
    {/each}
  </ul>
</div>
