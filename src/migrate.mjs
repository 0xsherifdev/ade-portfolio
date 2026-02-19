import pg from 'pg'

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URI

if (!connectionString) {
  console.log('No POSTGRES_URL found, skipping migration')
  process.exit(0)
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })

const sql = `
-- Payload internal tables
CREATE TABLE IF NOT EXISTS "payload_locked" (
  "id" serial PRIMARY KEY,
  "document" varchar,
  "global_slug" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
  "id" serial PRIMARY KEY,
  "key" varchar,
  "value" jsonb,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  "id" serial PRIMARY KEY,
  "order" integer,
  "parent_id" integer NOT NULL REFERENCES "payload_preferences" ON DELETE CASCADE,
  "path" varchar NOT NULL,
  "users_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
  "id" serial PRIMARY KEY,
  "name" varchar,
  "batch" numeric,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

-- Users
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "email" varchar NOT NULL,
  "reset_password_token" varchar,
  "reset_password_expiration" timestamp(3) with time zone,
  "salt" varchar,
  "hash" varchar,
  "login_attempts" numeric DEFAULT 0,
  "lock_until" timestamp(3) with time zone
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "users_sessions" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "users" ON DELETE CASCADE,
  "created_at" timestamp(3) with time zone,
  "expires_at" timestamp(3) with time zone
);

-- Media
CREATE TABLE IF NOT EXISTS "media" (
  "id" serial PRIMARY KEY,
  "alt" varchar NOT NULL,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "url" varchar,
  "thumbnail_u_r_l" varchar,
  "filename" varchar,
  "mime_type" varchar,
  "filesize" numeric,
  "width" numeric,
  "height" numeric,
  "focal_x" numeric,
  "focal_y" numeric
);

-- Technologies
CREATE TABLE IF NOT EXISTS "technologies" (
  "id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "icon" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "technologies_name_idx" ON "technologies" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "technologies_slug_idx" ON "technologies" ("slug");

-- Projects
CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY,
  "title" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "subtitle" varchar,
  "description" varchar NOT NULL,
  "links_code" varchar,
  "links_demo" varchar,
  "image_id" integer REFERENCES "media" ON DELETE SET NULL,
  "icon" varchar,
  "featured" boolean DEFAULT false,
  "client" varchar,
  "location" varchar,
  "service_type" varchar,
  "overview" jsonb,
  "final_thoughts" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "testimonial_content" varchar,
  "testimonial_author" varchar,
  "testimonial_role" varchar
);
CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_idx" ON "projects" ("slug");

CREATE TABLE IF NOT EXISTS "projects_process" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "projects" ON DELETE CASCADE,
  "step" varchar
);

CREATE TABLE IF NOT EXISTS "projects_results" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "projects" ON DELETE CASCADE,
  "label" varchar,
  "value" varchar
);

CREATE TABLE IF NOT EXISTS "projects_rels" (
  "id" serial PRIMARY KEY,
  "order" integer,
  "parent_id" integer NOT NULL REFERENCES "projects" ON DELETE CASCADE,
  "path" varchar NOT NULL,
  "technologies_id" integer REFERENCES "technologies" ON DELETE CASCADE
);

-- Home global
CREATE TABLE IF NOT EXISTS "home" (
  "id" serial PRIMARY KEY,
  "hero_top_text" varchar DEFAULT 'Web3 Developer',
  "hero_headline" jsonb,
  "hero_subheadline" varchar,
  "about_title" varchar DEFAULT 'About',
  "about_content" jsonb,
  "skills_title" varchar DEFAULT 'Tech Stack',
  "projects_title" varchar DEFAULT 'Featured Projects',
  "projects_description" varchar DEFAULT 'A collection of my work in blockchain, AI, and full-stack development.',
  "contact_title" varchar DEFAULT 'Contact',
  "contact_heading" varchar DEFAULT 'Let''s build something together',
  "contact_content" varchar,
  "contact_email" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "home_hero_buttons" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "home" ON DELETE CASCADE,
  "label" varchar,
  "link" varchar,
  "style" varchar DEFAULT 'primary'
);

CREATE TABLE IF NOT EXISTS "home_about_stats" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "home" ON DELETE CASCADE,
  "number" varchar,
  "label" varchar
);

CREATE TABLE IF NOT EXISTS "home_skills_categories" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "home" ON DELETE CASCADE,
  "category" varchar
);

CREATE TABLE IF NOT EXISTS "home_contact_social_links" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "home" ON DELETE CASCADE,
  "platform" varchar,
  "url" varchar
);

CREATE TABLE IF NOT EXISTS "home_rels" (
  "id" serial PRIMARY KEY,
  "order" integer,
  "parent_id" integer NOT NULL REFERENCES "home" ON DELETE CASCADE,
  "path" varchar NOT NULL,
  "technologies_id" integer REFERENCES "technologies" ON DELETE CASCADE
);

-- Site Settings global
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" serial PRIMARY KEY,
  "title" varchar DEFAULT 'Ade | Web3 Developer',
  "description" varchar,
  "logo_text" varchar DEFAULT 'ade.dev',
  "footer_text" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_settings_nav_items" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "site_settings" ON DELETE CASCADE,
  "label" varchar,
  "link" varchar
);

-- Insert initial home row if empty
INSERT INTO "home" ("id", "updated_at", "created_at")
SELECT 1, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "home" LIMIT 1);

-- Insert initial site_settings row if empty
INSERT INTO "site_settings" ("id", "updated_at", "created_at")
SELECT 1, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "site_settings" LIMIT 1);
`

async function run() {
  try {
    await client.connect()
    console.log('Connected to Postgres, running migrations...')
    await client.query(sql)
    console.log('Migration complete!')
    await client.end()
  } catch (err) {
    console.error('Migration failed:', err.message)
    // Don't exit with error - let the build continue with fallback
    try { await client.end() } catch {}
  }
}

run()
