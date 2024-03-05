import { cva } from '$lib/styled-system/css';

export const input = cva({
  base: {
    paddingBlock: '2',
    paddingInline: '3',
    borderRadius: 'md',
    background: 'zinc.200',
  },
});

export const inputError = cva({
  base: {
    paddingLeft: '[1em]',
    listStyle: 'disc',
    color: 'red.500',
  },
});
