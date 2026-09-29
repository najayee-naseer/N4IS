-- =====================================================================
-- N4IS CMS — schema, authorization and row level security
--
-- Content is public only once it is published. Everything else — drafts,
-- media metadata, contact messages, roles — is visible to CMS users only,
-- and every write is authorised in the database, never in the browser.
--
--   owner   manages roles, settings and everything below
--   admin   settings, content, deletes
--   editor  creates and edits content and media; cannot delete content
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type public.app_role as enum ('owner', 'admin', 'editor');

create type public.project_status as enum (
  'planning', 'prototype', 'in_development', 'built', 'active', 'archived'
);

create type public.lab_status as enum (
  'experimental', 'research', 'prototype', 'in_development', 'archived', 'promoted'
);

create type public.media_placement as enum ('gallery', 'additional');

-- ---------------------------------------------------------------------
-- Shared trigger: keep updated_at honest
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- People: profiles + roles
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index user_roles_user_idx on public.user_roles (user_id);

-- Every new auth user gets a profile row. Roles are never granted here.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role checks. SECURITY DEFINER so policies can call them without the
-- caller needing (or being able to widen) read access to user_roles.
create or replace function public.has_any_role(roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = any (roles)
  );
$$;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['owner', 'admin', 'editor']::public.app_role[]);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['owner', 'admin']::public.app_role[]);
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['owner']::public.app_role[]);
$$;

-- ---------------------------------------------------------------------
-- Media: every uploaded file, addressed by its storage path
-- ---------------------------------------------------------------------
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'n4is-media',
  storage_path text not null,
  folder text not null default 'library',
  filename text not null,
  mime_type text not null,
  file_size bigint not null check (file_size >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text not null default '',
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, storage_path)
);

create index media_assets_folder_idx on public.media_assets (folder);
create index media_assets_created_idx on public.media_assets (created_at desc);

create trigger media_assets_touch before update on public.media_assets
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  project_number text not null default '',
  title text not null check (char_length(title) between 1 and 120),
  short_description text not null default '',
  description text not null default '',
  category text not null default '',
  status public.project_status not null default 'planning',
  stage_label text not null default '',
  technologies text[] not null default '{}',
  stack text[] not null default '{}',
  focus text[] not null default '{}',
  -- the long-form story: [{ "label", "title", "body" }, …]
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  preserve_case boolean not null default false,
  live_url text,
  github_url text,
  hero_media_id uuid references public.media_assets (id) on delete set null,
  logo_media_id uuid references public.media_assets (id) on delete set null,
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_idx on public.projects (published, sort_order);
create index projects_featured_idx on public.projects (featured, published, sort_order);
create index projects_updated_idx on public.projects (updated_at desc);

create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  media_id uuid not null references public.media_assets (id) on delete cascade,
  placement public.media_placement not null default 'gallery',
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (project_id, media_id, placement)
);

create index project_media_project_idx on public.project_media (project_id, placement, sort_order);
create index project_media_media_idx on public.project_media (media_id);

-- ---------------------------------------------------------------------
-- Lab
-- ---------------------------------------------------------------------
create table public.lab_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  entry_number text not null default '',
  title text not null check (char_length(title) between 1 and 120),
  summary text not null default '',
  description text not null default '',
  category text not null default '',
  status public.lab_status not null default 'experimental',
  date_label text not null default '',
  technologies text[] not null default '{}',
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  cover_media_id uuid references public.media_assets (id) on delete set null,
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lab_entries_published_idx on public.lab_entries (published, sort_order);
create index lab_entries_updated_idx on public.lab_entries (updated_at desc);

create trigger lab_entries_touch before update on public.lab_entries
  for each row execute function public.touch_updated_at();

create table public.lab_media (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.lab_entries (id) on delete cascade,
  media_id uuid not null references public.media_assets (id) on delete cascade,
  placement public.media_placement not null default 'gallery',
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (entry_id, media_id, placement)
);

create index lab_media_entry_idx on public.lab_media (entry_id, placement, sort_order);
create index lab_media_media_idx on public.lab_media (media_id);

-- ---------------------------------------------------------------------
-- Single-row content. Long prose lives in a validated `content` document;
-- anything that points at a file is a real foreign key.
-- ---------------------------------------------------------------------
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default 'N4IS',
  tagline text not null default '',
  description text not null default '',
  contact_email text,
  contact_phone text,
  location text,
  social_links jsonb not null default '[]'::jsonb check (jsonb_typeof(social_links) = 'array'),
  -- words and principles the studio works by: { "process": [], "principles": [] }
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.homepage_content (
  id smallint primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.about_content (
  id smallint primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  image_media_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default true,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.founder_content (
  id smallint primary key default 1 check (id = 1),
  name text not null default '',
  role text not null default 'Founder & CEO',
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  photo_media_id uuid references public.media_assets (id) on delete set null,
  social_links jsonb not null default '[]'::jsonb check (jsonb_typeof(social_links) = 'array'),
  published boolean not null default true,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();
create trigger homepage_content_touch before update on public.homepage_content
  for each row execute function public.touch_updated_at();
create trigger about_content_touch before update on public.about_content
  for each row execute function public.touch_updated_at();
create trigger founder_content_touch before update on public.founder_content
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Contact messages — written by visitors, read only by the studio
-- ---------------------------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject text not null check (char_length(subject) between 3 and 200),
  message text not null check (char_length(message) between 20 and 5000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------
-- Is a media asset used by anything the public can see?
-- Drives the public read policy on media_assets.
-- ---------------------------------------------------------------------
create or replace function public.media_is_public(asset uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (select 1 from projects p where p.published and (p.hero_media_id = asset or p.logo_media_id = asset))
    or exists (select 1 from project_media pm join projects p on p.id = pm.project_id where pm.media_id = asset and p.published)
    or exists (select 1 from lab_entries l where l.published and l.cover_media_id = asset)
    or exists (select 1 from lab_media lm join lab_entries l on l.id = lm.entry_id where lm.media_id = asset and l.published)
    or exists (select 1 from founder_content f where f.published and f.photo_media_id = asset)
    or exists (select 1 from about_content a where a.published and a.image_media_id = asset);
$$;

-- Lets the public site tell "unpublished" apart from "not created yet" for
-- the About and Founder pages without being able to read the hidden row.
create or replace function public.singleton_is_hidden(target text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case target
    when 'about_content' then exists (select 1 from about_content where not published)
    when 'founder_content' then exists (select 1 from founder_content where not published)
    else false
  end;
$$;

-- =====================================================================
-- Row level security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.media_assets enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.lab_entries enable row level security;
alter table public.lab_media enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_content enable row level security;
alter table public.about_content enable row level security;
alter table public.founder_content enable row level security;
alter table public.contact_messages enable row level security;

-- profiles: yourself, or an admin
create policy "profiles: read own or as admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- user_roles: see your own roles; only an owner grants or revokes
create policy "roles: read own or as admin" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "roles: owner inserts" on public.user_roles
  for insert to authenticated with check (public.is_owner());
create policy "roles: owner updates" on public.user_roles
  for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "roles: owner deletes" on public.user_roles
  for delete to authenticated using (public.is_owner());

-- media_assets: public only when something published uses it
create policy "media: public reads what is published" on public.media_assets
  for select to anon, authenticated using (public.is_editor() or public.media_is_public(id));
create policy "media: editors insert" on public.media_assets
  for insert to authenticated with check (public.is_editor());
create policy "media: editors update" on public.media_assets
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "media: admins delete" on public.media_assets
  for delete to authenticated using (public.is_admin());

-- projects
create policy "projects: public reads published" on public.projects
  for select to anon, authenticated using (published or public.is_editor());
create policy "projects: editors insert" on public.projects
  for insert to authenticated with check (public.is_editor());
create policy "projects: editors update" on public.projects
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "projects: admins delete" on public.projects
  for delete to authenticated using (public.is_admin());

create policy "project media: public reads published" on public.project_media
  for select to anon, authenticated using (
    public.is_editor()
    or exists (select 1 from public.projects p where p.id = project_id and p.published)
  );
create policy "project media: editors insert" on public.project_media
  for insert to authenticated with check (public.is_editor());
create policy "project media: editors update" on public.project_media
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "project media: editors delete" on public.project_media
  for delete to authenticated using (public.is_editor());

-- lab
create policy "lab: public reads published" on public.lab_entries
  for select to anon, authenticated using (published or public.is_editor());
create policy "lab: editors insert" on public.lab_entries
  for insert to authenticated with check (public.is_editor());
create policy "lab: editors update" on public.lab_entries
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "lab: admins delete" on public.lab_entries
  for delete to authenticated using (public.is_admin());

create policy "lab media: public reads published" on public.lab_media
  for select to anon, authenticated using (
    public.is_editor()
    or exists (select 1 from public.lab_entries l where l.id = entry_id and l.published)
  );
create policy "lab media: editors insert" on public.lab_media
  for insert to authenticated with check (public.is_editor());
create policy "lab media: editors update" on public.lab_media
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "lab media: editors delete" on public.lab_media
  for delete to authenticated using (public.is_editor());

-- site settings: public read, admins write
create policy "settings: public read" on public.site_settings
  for select to anon, authenticated using (true);
create policy "settings: admins insert" on public.site_settings
  for insert to authenticated with check (public.is_admin());
create policy "settings: admins update" on public.site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- homepage: public read, editors write
create policy "homepage: public read" on public.homepage_content
  for select to anon, authenticated using (true);
create policy "homepage: editors insert" on public.homepage_content
  for insert to authenticated with check (public.is_editor());
create policy "homepage: editors update" on public.homepage_content
  for update to authenticated using (public.is_editor()) with check (public.is_editor());

-- about / founder: public read when published, editors write
create policy "about: public reads published" on public.about_content
  for select to anon, authenticated using (published or public.is_editor());
create policy "about: editors insert" on public.about_content
  for insert to authenticated with check (public.is_editor());
create policy "about: editors update" on public.about_content
  for update to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "founder: public reads published" on public.founder_content
  for select to anon, authenticated using (published or public.is_editor());
create policy "founder: editors insert" on public.founder_content
  for insert to authenticated with check (public.is_editor());
create policy "founder: editors update" on public.founder_content
  for update to authenticated using (public.is_editor()) with check (public.is_editor());

-- contact messages: anyone may send one; only the studio reads them
create policy "messages: anyone sends" on public.contact_messages
  for insert to anon, authenticated with check (read_at is null);
create policy "messages: editors read" on public.contact_messages
  for select to authenticated using (public.is_editor());
create policy "messages: editors mark read" on public.contact_messages
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "messages: admins delete" on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- visitors can send a message but never read one back
revoke select on public.contact_messages from anon;

-- =====================================================================
-- Storage: one public-read bucket, written only by CMS users.
-- Public read keeps next/image optimisation and CDN caching simple; the
-- trade-off is that a draft's file is reachable by anyone who already
-- knows its exact path. Paths carry a random id, so they are not guessable.
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'n4is-media',
  'n4is-media',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "n4is-media: editors upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'n4is-media' and public.is_editor());

create policy "n4is-media: editors update" on storage.objects
  for update to authenticated
  using (bucket_id = 'n4is-media' and public.is_editor())
  with check (bucket_id = 'n4is-media' and public.is_editor());

create policy "n4is-media: admins delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'n4is-media' and public.is_admin());

-- listing objects through the API is for CMS users; public files are
-- still served by the public URL, which does not consult this policy
create policy "n4is-media: editors list" on storage.objects
  for select to authenticated
  using (bucket_id = 'n4is-media' and public.is_editor());
