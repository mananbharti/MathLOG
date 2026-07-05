create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table phases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  description text,
  display_order integer not null,
  target_hours numeric not null default 0
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  phase_id uuid references phases(id) on delete set null,
  title text not null,
  status text not null check (status in ('Not Started', 'Learning', 'Practicing', 'Done', 'Frozen')),
  difficulty integer not null check (difficulty between 1 and 5),
  confidence integer not null check (confidence between 1 and 10),
  estimated_hours numeric not null default 0,
  actual_hours numeric not null default 0,
  markdown_notes text not null default '',
  start_date date,
  target_date date,
  completed_date date,
  last_studied date,
  next_review date,
  review_interval integer not null default 1,
  ease_factor numeric not null default 2.5,
  repetitions integer not null default 0,
  ai_summary text not null default '',
  frozen boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table topic_dependencies (
  prerequisite_topic_id uuid references topics(id) on delete cascade,
  dependent_topic_id uuid references topics(id) on delete cascade,
  primary key (prerequisite_topic_id, dependent_topic_id)
);

create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_minutes integer not null,
  notes text,
  ai_questions jsonb not null default '[]',
  resources_opened jsonb not null default '[]',
  confidence_before integer,
  confidence_after integer
);

create table review_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  reviewed_at timestamptz not null default now(),
  quality integer not null check (quality between 0 and 5),
  repetitions integer not null,
  interval_days integer not null,
  ease_factor numeric not null,
  confidence_before integer,
  confidence_after integer
);

create table resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  title text not null,
  resource_type text not null check (resource_type in ('YouTube', 'PDF', 'Book', 'Article', 'Link')),
  url text not null,
  quality integer not null default 0
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  title text not null,
  content_markdown text not null default '',
  content_json jsonb not null default '{}',
  ai_summary text,
  updated_at timestamptz not null default now()
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null
);

create table topic_tags (
  topic_id uuid references topics(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (topic_id, tag_id)
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  target_date date,
  status text not null default 'active'
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  unlocked_at timestamptz
);

create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  topic_id uuid references topics(id) on delete set null,
  title text not null,
  event_date date not null,
  event_type text not null check (event_type in ('review', 'study', 'milestone'))
);

create table ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  messages jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table ai_analysis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  analysis_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table settings (
  user_id uuid primary key references users(id) on delete cascade,
  openrouter_model text not null default 'openai/gpt-4o-mini',
  encrypted_openrouter_key text,
  preferences jsonb not null default '{}'
);

create table attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  created_at timestamptz not null default now()
);
