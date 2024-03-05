import { cva } from '$lib/styled-system/css';

export const sectionHeading = cva({
  base: {
    paddingBlockEnd: '3',
    borderBlockEndColor: 'zinc.900',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    fontSize: '2xl',
    fontWeight: 'semibold',
  },
});

export const navLink = cva({
  base: {
    paddingBlock: '1.5',
    paddingInline: '3',
    borderRadius: 'lg',
    color: '[inherit]',
    textDecoration: 'none',
    transition: 'background',
    '&:hover': {
      background: 'zinc.200',
    },
  },
  variants: {
    variant: {
      active: {
        background: 'zinc.600',
        color: 'zinc.100',
        '&:hover': {
          background: 'zinc.600',
        },
      },
    },
  },
});
