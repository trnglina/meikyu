SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgroonga; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgroonga WITH SCHEMA public;


--
-- Name: EXTENSION pgroonga; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgroonga IS 'Super fast and all languages supported full text search index based on Groonga';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: audit_event_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.audit_event_type AS ENUM (
    'group_created',
    'group_changed',
    'group_deleted',
    'user_groups_changed'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_events (
    audit_event_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    audit_event_type public.audit_event_type NOT NULL,
    payload json
);


--
-- Name: audit_events_audit_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.audit_events ALTER COLUMN audit_event_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.audit_events_audit_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authentications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authentications (
    authentication_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    challenge text NOT NULL
);


--
-- Name: credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credentials (
    credential_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    credential_public_key bytea NOT NULL,
    counter bigint NOT NULL,
    credential_device_type text NOT NULL,
    credential_backed_up boolean NOT NULL,
    transports text[] NOT NULL
);


--
-- Name: user_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_versions (
    version_id bigint NOT NULL,
    revised_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    parent_id bigint,
    display_name text
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    username public.citext NOT NULL
);


--
-- Name: current_users; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.current_users AS
 SELECT DISTINCT ON (users.user_id) users.user_id,
    users.created_at,
    users.updated_at,
    users.username,
    user_versions.version_id,
    user_versions.revised_at,
    user_versions.parent_id,
    user_versions.display_name
   FROM (public.users
     LEFT JOIN public.user_versions USING (user_id))
  ORDER BY users.user_id, user_versions.revised_at DESC;


--
-- Name: group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_permissions (
    group_id bigint NOT NULL,
    permission_value text NOT NULL
);


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    group_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    group_name text NOT NULL
);


--
-- Name: groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.groups ALTER COLUMN group_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.groups_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    permission_value text NOT NULL
);


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registrations (
    registration_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    challenge text NOT NULL,
    user_id uuid NOT NULL,
    username public.citext NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    session_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    credential_id text NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_groups (
    user_id uuid NOT NULL,
    group_id bigint NOT NULL
);


--
-- Name: user_versions_version_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_versions ALTER COLUMN version_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_versions_version_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: audit_events audit_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_events
    ADD CONSTRAINT audit_events_pkey PRIMARY KEY (audit_event_id);


--
-- Name: authentications authentications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications
    ADD CONSTRAINT authentications_pkey PRIMARY KEY (authentication_id);


--
-- Name: credentials credentials_credential_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_credential_id_user_id_key UNIQUE (credential_id, user_id);


--
-- Name: credentials credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_pkey PRIMARY KEY (credential_id);


--
-- Name: group_permissions group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_permissions
    ADD CONSTRAINT group_permissions_pkey PRIMARY KEY (group_id, permission_value);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (permission_value);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (registration_id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- Name: user_groups user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pkey PRIMARY KEY (user_id, group_id);


--
-- Name: user_versions user_versions_parent_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_versions
    ADD CONSTRAINT user_versions_parent_id_key UNIQUE (parent_id);


--
-- Name: user_versions user_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_versions
    ADD CONSTRAINT user_versions_pkey PRIMARY KEY (version_id);


--
-- Name: user_versions user_versions_user_id_parent_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_versions
    ADD CONSTRAINT user_versions_user_id_parent_id_key UNIQUE NULLS NOT DISTINCT (user_id, parent_id);


--
-- Name: user_versions user_versions_version_id_parent_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_versions
    ADD CONSTRAINT user_versions_version_id_parent_id_key UNIQUE (version_id, parent_id);


--
-- Name: user_versions user_versions_version_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_versions
    ADD CONSTRAINT user_versions_version_id_user_id_key UNIQUE (version_id, user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: audit_events audit_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_events
    ADD CONSTRAINT audit_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: authentications authentications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications
    ADD CONSTRAINT authentications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: credentials credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: group_permissions group_permissions_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_permissions
    ADD CONSTRAINT group_permissions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id) ON DELETE CASCADE;


--
-- Name: group_permissions group_permissions_permission_value_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_permissions
    ADD CONSTRAINT group_permissions_permission_value_fkey FOREIGN KEY (permission_value) REFERENCES public.permissions(permission_value) ON DELETE CASCADE;


--
-- Name: sessions sessions_credential_id_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_credential_id_user_id_fkey FOREIGN KEY (credential_id, user_id) REFERENCES public.credentials(credential_id, user_id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_versions user_versions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_versions
    ADD CONSTRAINT user_versions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_versions user_versions_user_id_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_versions
    ADD CONSTRAINT user_versions_user_id_parent_id_fkey FOREIGN KEY (user_id, parent_id) REFERENCES public.user_versions(user_id, parent_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20240201092459'),
    ('20240201092901'),
    ('20240201093333'),
    ('20240425060059'),
    ('20240425075408');
