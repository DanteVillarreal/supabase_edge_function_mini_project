-- Create user_actions table
create table if not exists user_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action_type text not null,
  details jsonb,
  created_at timestamptz not null default now(),
  foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable RLS
alter table user_actions enable row level security;

-- Create policy to allow users to view their own actions
create policy "Users can view their own actions"
  on user_actions
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own actions
create policy "Users can insert their own actions"
  on user_actions
  for insert
  with check (auth.uid() = user_id);