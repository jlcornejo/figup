-- Players table - enriched data from Wikipedia 2026 FIFA World Cup squads
-- Source: https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_squads (CC BY-SA 4.0)

create table if not exists players (
  id serial primary key,
  sticker_code text unique not null,
  name text not null,
  team_code text not null,
  team_name text not null,
  shirt_number integer,
  position text, -- GK, DF, MF, FW
  date_of_birth date,
  age integer,
  club text,
  club_country text,
  caps integer default 0,
  goals integer default 0,
  is_captain boolean default false,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_players_team on players(team_code);
create index if not exists idx_players_sticker on players(sticker_code);

-- Disable RLS (public read data)
alter table players disable row level security;
