-- migrate:up
CREATE TABLE
  users (
    user_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    username citext NOT NULL,
    UNIQUE (username),
    PRIMARY KEY (user_id)
  );

CREATE TABLE
  user_versions (
    version_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    revised_at timestamptz NOT NULL DEFAULT NOW(),
    user_id uuid NOT NULL,
    parent_id bigint,
    display_name text,
    UNIQUE (version_id, parent_id),
    UNIQUE (version_id, user_id),
    UNIQUE (parent_id),
    UNIQUE NULLS NOT DISTINCT (user_id, parent_id),
    PRIMARY KEY (version_id),
    FOREIGN KEY (user_id, parent_id) REFERENCES user_versions (user_id, parent_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
  );

CREATE VIEW
  current_users AS
SELECT DISTINCT
  ON (user_id) *
FROM
  users
  NATURAL LEFT JOIN user_versions
ORDER BY
  user_id,
  revised_at DESC;

CREATE TABLE
  credentials (
    credential_id text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    user_id uuid NOT NULL,
    credential_public_key bytea NOT NULL,
    counter bigint NOT NULL,
    credential_device_type text NOT NULL,
    credential_backed_up boolean NOT NULL,
    transports text[] NOT NULL,
    UNIQUE (credential_id, user_id),
    PRIMARY KEY (credential_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
  );

CREATE TABLE
  registrations (
    registration_id uuid NOT NULL DEFAULT gen_random_uuid (),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    challenge text NOT NULL,
    user_id uuid NOT NULL,
    username citext NOT NULL,
    PRIMARY KEY (registration_id)
  );

CREATE TABLE
  authentications (
    authentication_id uuid NOT NULL DEFAULT gen_random_uuid (),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    user_id uuid NOT NULL,
    challenge text NOT NULL,
    PRIMARY KEY (authentication_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
  );

CREATE TABLE
  sessions (
    session_id uuid NOT NULL DEFAULT gen_random_uuid (),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    credential_id text NOT NULL,
    user_id uuid NOT NULL,
    PRIMARY KEY (session_id),
    FOREIGN KEY (credential_id, user_id) REFERENCES credentials (credential_id, user_id) ON DELETE CASCADE
  );

-- migrate:down
DROP TABLE sessions;

DROP TABLE authentications;

DROP TABLE registrations;

DROP TABLE credentials;

DROP VIEW current_users;

DROP TABLE user_versions;

DROP TABLE users;