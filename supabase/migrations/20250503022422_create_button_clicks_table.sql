create table public.button_clicks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  button_name text not null,
  clicked_at timestamp with time zone default timezone('utc', now()) not null,
  metadata jsonb
);
