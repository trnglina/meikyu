import { cva } from '$lib/styled-system/css';

export const dialogCard = cva({
  base: {
    marginTop: '20',
    marginInline: 'auto',
    padding: '4',
    background: 'zinc.100',
    borderRadius: 'md',
    boxShadow: 'md',
    maxWidth: 'sm',
    '&::backdrop': {
      backgroundColor: 'zinc.600/40',
      backdropFilter: 'auto',
      backdropBlur: 'sm',
    },
  },
});

export const dialogHeading = cva({
  base: {
    fontSize: '2xl',
    fontWeight: 'semibold',
  },
});
