-- migrate:up
CREATE TYPE audit_event_type AS ENUM();

CREATE TABLE
  audit_events (
    audit_event_id BIGINT GENERATED ALWAYS AS IDENTITY,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    user_id uuid NOT NULL,
    audit_event_type audit_event_type NOT NULL,
    payload json,
    PRIMARY KEY (audit_event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
  );

-- migrate:down
DROP TABLE audit_events;

DROP TYPE audit_event_type;