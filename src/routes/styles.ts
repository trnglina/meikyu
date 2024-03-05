import { cva } from '$lib/styled-system/css';

export const navLink = cva({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '2',
    paddingBlock: '1',
    paddingInline: '2',
    color: '[inherit]',
    textDecoration: 'none',
    background: 'zinc.900',
    transition: 'background',
    '&:hover': {
      background: 'zinc.800',
      transition: 'background',
    },
  },
});
