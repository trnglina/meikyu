import { cva } from '$lib/styled-system/css';

export const pageContent = cva({
  base: {
    marginInline: 'auto',
    paddingBlock: '10',
    paddingInline: '4',
  },
});

export const pageHeading = cva({
  base: {
    fontSize: '3xl',
    fontWeight: 'light',
  },
});
