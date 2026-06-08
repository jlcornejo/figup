-- FigUp Database Schema
-- Run this in your Supabase SQL Editor

-- Users collection table
-- Each row = one sticker a user owns, with quantity
create table if not exists collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  sticker_code text not null,
  quantity integer not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Each user can only have one row per sticker
  unique(user_id, sticker_code)
);

-- Index for fast lookups
create index if not exists idx_collections_user_id on collections(user_id);
create index if not exists idx_collections_sticker on collections(user_id, sticker_code);

-- Enable Row Level Security
alter table collections enable row level security;

-- Policy: users can only see their own collection
create policy "Users can view own collection"
  on collections for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own stickers
create policy "Users can insert own stickers"
  on collections for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own stickers
create policy "Users can update own stickers"
  on collections for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own stickers
create policy "Users can delete own stickers"
  on collections for delete
  using (auth.uid() = user_id);

-- Function to update the updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger collections_updated_at
  before update on collections
  for each row
  execute function update_updated_at();
