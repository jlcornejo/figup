-- FigUp Database Schema v2 - With user authentication
-- Run this in your Supabase SQL Editor

-- Drop old table
drop table if exists collections;

-- Users profile (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Collections table - linked to authenticated users
create table collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  sticker_code text not null,
  quantity integer not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id, sticker_code)
);

-- Indexes
create index idx_collections_user on collections(user_id);
create index idx_collections_user_sticker on collections(user_id, sticker_code);

-- Enable RLS
alter table profiles enable row level security;
alter table collections enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Collections policies
create policy "Users can view own collection"
  on collections for select using (auth.uid() = user_id);

create policy "Users can insert own stickers"
  on collections for insert with check (auth.uid() = user_id);

create policy "Users can update own stickers"
  on collections for update using (auth.uid() = user_id);

create policy "Users can delete own stickers"
  on collections for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auto-creating profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists collections_updated_at on collections;
create trigger collections_updated_at
  before update on collections
  for each row
  execute function update_updated_at();
