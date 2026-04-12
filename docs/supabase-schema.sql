-- AIShortHub Phase 6 suggested Supabase schema
create table if not exists profiles (
  id uuid primary key,
  email text unique not null,
  name text,
  role text default 'member',
  viewer_plan text default 'free',
  creator_plan text,
  created_at timestamptz default now()
);

create table if not exists viewer_subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  plan_id text not null,
  creator_plan_id text,
  status text default 'active',
  renew_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists creator_plans (
  id text primary key,
  name text not null,
  monthly_price numeric,
  commission_rate numeric,
  created_at timestamptz default now()
);

create table if not exists creators (
  id text primary key,
  profile_id uuid references profiles(id) on delete cascade,
  studio_name text,
  bio text,
  report_count int default 0,
  flagged boolean default false,
  created_at timestamptz default now()
);

create table if not exists series (
  id text primary key,
  creator_id text references creators(id) on delete cascade,
  title text not null,
  synopsis text,
  category text,
  tags text[],
  status text default 'draft',
  visibility text default 'private',
  cover_url text,
  trailer_url text,
  review_note text,
  report_count int default 0,
  flagged boolean default false,
  created_at timestamptz default now()
);

create table if not exists episodes (
  id text primary key,
  series_id text references series(id) on delete cascade,
  number int not null,
  title text,
  video_url text,
  duration_seconds int,
  is_preview boolean default false,
  created_at timestamptz default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  series_id text references series(id) on delete cascade,
  asset_type text not null,
  url text not null,
  storage_bucket text,
  storage_path text,
  created_at timestamptz default now()
);

create table if not exists service_orders (
  id text primary key,
  requester_id uuid references profiles(id),
  service_type text not null,
  project_title text,
  request_details text,
  budget text,
  contact text,
  entitlement text,
  add_on_price text,
  status text default 'pending',
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

create table if not exists payments (
  id text primary key,
  profile_id uuid references profiles(id),
  provider text default 'stripe',
  checkout_type text,
  amount numeric,
  currency text default 'USD',
  status text,
  external_ref text,
  created_at timestamptz default now()
);

create table if not exists payouts (
  id text primary key,
  creator_id text references creators(id),
  gross_amount numeric,
  platform_fee_rate numeric,
  net_amount numeric,
  status text,
  created_at timestamptz default now()
);

create table if not exists review_logs (
  id uuid primary key default gen_random_uuid(),
  series_id text references series(id) on delete cascade,
  reviewer_id uuid references profiles(id),
  decision text,
  reason text,
  created_at timestamptz default now()
);
