-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.button_clicks enable row level security;

-- Allow users to view and update their own profile
create policy "Users can view their own profile"
  on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update using (auth.uid() = id);

-- Allow users to insert/select their own button clicks
create policy "Users can insert their own button clicks"
  on public.button_clicks
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own button clicks"
  on public.button_clicks
  for select using (auth.uid() = user_id);
