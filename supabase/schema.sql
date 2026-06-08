-- FigUp Database Schema
-- Run this in your Supabase SQL Editor

-- Drop old table if exists (fresh start)
drop table if exists collections;

-- Collections table using device_id (no auth required)
create table collections (
  id uuid default gen_random_uuid() primary key,
  device_id text not null,
  sticker_code text not null,
  quantity integer not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Each device can only have one row per sticker
  unique(device_id, sticker_code)
);

-- Index for fast lookups
create index idx_collections_device on collections(device_id);
create index idx_collections_device_sticker on collections(device_id, sticker_code);

-- Disable RLS for now (no auth required)
alter table collections disable row level security;

-- Function to update the updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
drop trigger if exists collections_updated_at on collections;
create trigger collections_updated_at
  before update on collections
  for each row
  execute function update_updated_at();
