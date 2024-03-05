<script lang="ts">
import { css } from '$lib/styled-system/css';
import { center } from '$lib/styled-system/patterns';
import { Localized } from '@nubolab-ffwd/svelte-fluent';

let cssProp: Parameters<typeof css> = [];
export { cssProp as css };
export let href: string;
</script>

<a
  class={css(
    center.raw({
      background: 'amber.400',
      color: 'zinc.900',

      '&:focus': {
        boxShadow: '[none]',
        zIndex: 'skipLink',
      },
    }),
    ...cssProp,
  )}
  {href}
>
  <Localized id="skip-link-label" />
</a>
