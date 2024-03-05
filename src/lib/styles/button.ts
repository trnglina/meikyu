import { cva } from '$lib/styled-system/css';

export const iconButton = cva({
  base: {
    aspectRatio: 'square',
    padding: '2',
    borderRadius: 'md',
    '&:hover': {
      bg: 'zinc.100',
    },
    '&:active': {
      bg: 'zinc.200',
    },
  },
});

export const button = cva({
  base: {
    paddingBlock: '2',
    paddingInline: '4',
    borderRadius: 'md',
    fontWeight: 'semibold',
    transition: 'background',
  },
  variants: {
    type: {
      primary: {
        color: 'zinc.100',
        bg: 'sky.500',
        '&:hover': {
          bg: 'sky.400',
        },
        '&:active': {
          bg: 'sky.600',
        },
      },
      destructive: {
        color: 'zinc.100',
        bg: 'red.500',
        '&:hover': {
          bg: 'red.400',
        },
        '&:active': {
          bg: 'red.600',
        },
      },
    },
  },
});
