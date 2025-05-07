-- Drop existing policies if they exist
drop policy if exists "Users can view their own actions" on user_actions;
drop policy if exists "Users can insert their own actions" on user_actions;

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

-- Ensure RLS is enabled
alter table user_actions enable row level security;
