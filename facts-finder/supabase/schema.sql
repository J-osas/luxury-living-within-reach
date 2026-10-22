-- Facts-Finder accounts, progress, and feedback.
-- Run this once in the Supabase SQL editor.
-- Then open Authentication → Sign In / Providers → Email and turn off
-- Confirm email, so Create account signs the player in immediately.
-- Put the project URL and the anon public key in the app.
-- Never put the service_role key in the app. Read emails under
-- Authentication → Users, notes under Table Editor → feedback, and
-- voice files under Storage → feedback-audio.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  username text not null unique,
  username_changed_at timestamptz,
  avatar jsonb not null default '{"portrait":"fox","color":"cyan"}'::jsonb,
  created_at timestamptz not null default now(),
  constraint username_shape check (username ~ '^[a-z0-9]{3,16}$')
);

create table if not exists public.progress (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  xp integer not null default 0,
  streak integer not null default 0,
  last_played_date date,
  daily_cleared_on date,
  paths jsonb not null,
  badge text not null default 'Curious mind',
  feedback_prompted boolean not null default false
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  body text,
  audio_path text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.feedback enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "read own progress" on public.progress;
create policy "read own progress"
  on public.progress for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "update own progress" on public.progress;
create policy "update own progress"
  on public.progress for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "insert feedback" on public.feedback;
create policy "insert feedback"
  on public.feedback for insert
  to anon, authenticated
  with check (
    (auth.uid() is null and user_id is null)
    or auth.uid() = user_id
  );

grant select on public.profiles to authenticated;
grant update (username, avatar) on public.profiles to authenticated;
grant select, update on public.progress to authenticated;
grant insert on public.feedback to anon, authenticated;

create or replace function public.username_taken(candidate text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where username = candidate
  );
$$;

revoke all on function public.username_taken(text) from public;
grant execute on function public.username_taken(text) to anon, authenticated;

create or replace function public.guard_username()
returns trigger
language plpgsql
as $$
begin
  if new.username is distinct from old.username then
    if old.username_changed_at is not null
       and old.username_changed_at > now() - interval '3 months' then
      raise exception 'username_locked';
    end if;
    if new.username !~ '^[a-z0-9]{3,16}$' then
      raise exception 'username_invalid';
    end if;
    new.username_changed_at := now();
  else
    new.username_changed_at := old.username_changed_at;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_username on public.profiles;
create trigger profiles_guard_username
  before update on public.profiles
  for each row execute function public.guard_username();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, username)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'first_name'), ''), 'Player'),
    coalesce(trim(new.raw_user_meta_data->>'last_name'), ''),
    coalesce(new.raw_user_meta_data->>'username', 'player')
  );
  insert into public.progress (user_id, paths)
  values (
    new.id,
    '{"general":{"completed":[],"attempts":0},"history":{"completed":[],"attempts":0},"science":{"completed":[],"attempts":0}}'::jsonb
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('feedback-audio', 'feedback-audio', false)
on conflict (id) do nothing;

drop policy if exists "insert feedback audio" on storage.objects;
create policy "insert feedback audio"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'feedback-audio');
