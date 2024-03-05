-- migrate:up
ALTER TYPE audit_event_type
ADD VALUE 'group_created';

ALTER TYPE audit_event_type
ADD VALUE 'group_changed';

ALTER TYPE audit_event_type
ADD VALUE 'group_deleted';

ALTER TYPE audit_event_type
ADD VALUE 'user_groups_changed';

CREATE TABLE
  permissions (
    permission_value text NOT NULL,
    PRIMARY KEY (permission_value)
  );

INSERT INTO
  permissions (permission_value)
VALUES
  ('manage_groups'),
  ('manage_users');

CREATE TABLE
  groups (
    group_id BIGINT GENERATED ALWAYS AS IDENTITY,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    group_name text NOT NULL,
    PRIMARY KEY (group_id)
  );

CREATE TABLE
  group_permissions (
    group_id BIGINT NOT NULL,
    permission_value text NOT NULL,
    PRIMARY KEY (group_id, permission_value),
    FOREIGN KEY (group_id) REFERENCES groups (group_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_value) REFERENCES permissions (permission_value) ON DELETE CASCADE
  );

CREATE TABLE
  user_groups (
    user_id uuid NOT NULL,
    group_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups (group_id) ON DELETE CASCADE
  );

-- migrate:down
DROP TABLE user_groups;

DROP TABLE group_permissions;

DROP TABLE groups;

DROP TABLE permissions;