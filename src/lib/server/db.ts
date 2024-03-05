import logger from '$lib/logger';
import { CamelCasePlugin, Kysely } from 'kysely';
import type { DB } from 'kysely-codegen';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';

export default new Kysely<DB>({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.DATABASE_URL!),
  }),
  plugins: [
    new CamelCasePlugin(),
  ],
  log(event): void {
    switch (event.level) {
      case 'error':
        logger.error(
          `${event.query.sql} in ${event.queryDurationMillis.toString()}`,
          event.query.parameters,
          event.error,
        );
        break;
      case 'query':
        logger.debug(
          `${event.query.sql} in ${event.queryDurationMillis.toString()}`,
          event.query.parameters,
        );
        break;
    }
  },
});
