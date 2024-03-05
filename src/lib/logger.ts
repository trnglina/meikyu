import { dev } from '$app/environment';
import pino from 'pino';

export default pino(
  dev
    ? {
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }
    : {
      level: 'info',
    },
);
