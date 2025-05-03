create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamp with time zone default timezone('utc', now()) not null,
  avatar_url text
);
