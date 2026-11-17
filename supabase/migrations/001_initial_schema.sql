-- MarketPulse Initial Database Schema & Row Level Security (Supabase / Postgres)
-- Every table includes id uuid default gen_random_uuid() and created_at timestamptz default now()

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text not null default '',
  avatar_url text,
  company_name text not null default '',
  industry text not null default 'Retail & Local Business',
  plan text not null default 'Growth Subscription'
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  industry text not null default 'Retail & Local Business',
  demo_mode boolean not null default true
);

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'linkedin', 'x', 'facebook', 'tiktok')),
  handle text not null,
  is_connected boolean not null default false
);

create table if not exists public.metrics_daily (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'linkedin', 'x', 'facebook', 'tiktok')),
  date date not null,
  reach integer not null default 0,
  impressions integer not null default 0,
  engagement integer not null default 0,
  followers integer not null default 0,
  clicks integer not null default 0
);

create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  platform text not null check (platform in ('instagram', 'linkedin', 'x', 'facebook', 'tiktok')),
  handle text not null,
  notes text not null default ''
);

create table if not exists public.competitor_metrics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  date date not null,
  reach integer not null default 0,
  engagement integer not null default 0,
  followers integer not null default 0
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  platform text not null check (platform in ('instagram', 'linkedin', 'x', 'facebook', 'tiktok')),
  objective text not null,
  status text not null check (status in ('draft', 'active', 'paused', 'completed')),
  start_date date not null,
  end_date date not null,
  budget numeric(12,2) not null default 0,
  spend numeric(12,2) not null default 0
);

create table if not exists public.campaign_metrics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  date date not null,
  impressions integer not null default 0,
  clicks integer not null default 0,
  conversions integer not null default 0,
  engagement integer not null default 0
);

create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  category text not null,
  severity text not null check (severity in ('high', 'medium', 'low')),
  title text not null,
  body text not null,
  recommendation text not null,
  generated_by text not null check (generated_by in ('llm', 'heuristic')),
  is_dismissed boolean not null default false
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  period_start date not null,
  period_end date not null,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  subject text not null,
  message text not null
);

-- Enable Row Level Security on every table
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.social_accounts enable row level security;
alter table public.metrics_daily enable row level security;
alter table public.competitors enable row level security;
alter table public.competitor_metrics enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_metrics enable row level security;
alter table public.ai_insights enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;
alter table public.contact_messages enable row level security;

-- Profiles policies
create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid());
create policy "profiles_delete_own" on public.profiles for delete using (id = auth.uid());

-- Workspaces policies
create policy "workspaces_all_own" on public.workspaces
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Workspace-scoped table policies
create policy "social_accounts_workspace_owner" on public.social_accounts
  for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid()))
  with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "metrics_daily_workspace_owner" on public.metrics_daily
  for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid()))
  with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "competitors_workspace_owner" on public.competitors
  for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid()))
  with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "competitor_metrics_workspace_owner" on public.competitor_metrics
  for all using (competitor_id in (
    select c.id from public.competitors c
    join public.workspaces w on w.id = c.workspace_id
    where w.owner_id = auth.uid()
  ));

create policy "campaigns_workspace_owner" on public.campaigns
  for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid()))
  with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "campaign_metrics_workspace_owner" on public.campaign_metrics
  for all using (campaign_id in (
    select c.id from public.campaigns c
    join public.workspaces w on w.id = c.workspace_id
    where w.owner_id = auth.uid()
  ));

create policy "ai_insights_workspace_owner" on public.ai_insights
  for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid()))
  with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "notifications_user_own" on public.notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "reports_workspace_owner" on public.reports
  for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid()))
  with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "contact_messages_public_insert" on public.contact_messages
  for insert with check (true);
