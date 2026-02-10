-- 1. Create or replace the robust trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id, "authId", email, name, avatar, "createdAt", "updatedAt")
  values (
    new.id::text, -- Cast UUID to text
    new.id::text, -- Cast UUID to text
    new.email,
    -- Fallback for name
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1),
      'User'
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2. Re-create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Backfill missing users
insert into public."User" (id, "authId", email, name, avatar, "createdAt", "updatedAt")
select
  id::text, -- Cast UUID to text
  id::text, -- Cast UUID to text
  email,
  coalesce(
    raw_user_meta_data ->> 'full_name',
    raw_user_meta_data ->> 'name',
    split_part(email, '@', 1),
    'User'
  ),
  raw_user_meta_data ->> 'avatar_url',
  coalesce(created_at, now()),
  now()
from auth.users
where not exists (
  select 1 from public."User" where public."User".id = auth.users.id::text -- Explicit cast for comparison
);
