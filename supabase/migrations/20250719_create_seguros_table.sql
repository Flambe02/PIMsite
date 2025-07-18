create table if not exists seguros (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references auth.users(id),
  type         text        not null,    -- 'saude','vida','acidentes','odontologico','rcp','pet'
  detected     boolean     not null,
  comment      text        not null,
  link         text        not null,
  priority     integer     not null default 0, -- Pour ordonner l'affichage
  updated_at   timestamptz not null default now()
);

-- RLS Policies for seguros
alter table seguros enable row level security;

create policy "Users can view their own seguros"
on seguros for select
using ( auth.uid() = user_id );

create policy "Users can insert their own seguros"
on seguros for insert
with check ( auth.uid() = user_id );

create policy "Users can update their own seguros"
on seguros for update
using ( auth.uid() = user_id );

create policy "Users can delete their own seguros"
on seguros for delete
using ( auth.uid() = user_id );
