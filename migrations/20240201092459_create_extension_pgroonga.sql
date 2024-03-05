-- migrate:up
CREATE EXTENSION IF NOT EXISTS pgroonga;

-- migrate:down
DROP EXTENSION IF EXISTS pgroonga;