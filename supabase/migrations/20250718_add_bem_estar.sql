-- 20250718_add_bem_estar.sql
-- Crée la table de suivi Bien-Être des utilisateurs

-- Extension pour UUID
create extension if not exists "uuid-ossp";

create table if not exists public.bem_estar (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  type         text        not null check (type in ('conges','pass_gym','sante','sante_mentale','equilibre_wt','psychologie','carte_culture')),
  status_value text        not null, -- ex: "12/30", "Offert", etc.
  comment      text        not null,
  action_link  text        not null,
  metadata     jsonb,
  updated_at   timestamptz not null default now()
);

create index if not exists bem_estar_user_idx on public.bem_estar(user_id);

-- Row Level Security
alter table public.bem_estar enable row level security;

create policy "Select own bem_estar" on public.bem_estar
  for select using (auth.uid() = user_id);

create policy "Insert own bem_estar" on public.bem_estar
  for insert with check (auth.uid() = user_id);

create policy "Update own bem_estar" on public.bem_estar
  for update using (auth.uid() = user_id); 