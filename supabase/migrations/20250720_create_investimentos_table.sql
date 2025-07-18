create table if not exists investimentos (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references auth.users(id),
  asset_class text        not null,    -- pour l'instant : 'previdencia'
  amount      numeric     not null,
  yield_pct   numeric,
  description text        not null,
  updated_at  timestamptz not null default now()
);

alter table investimentos enable row level security;

create policy "Investimentos: Select own" on investimentos for select using ( auth.uid() = user_id );
create policy "Investimentos: Insert own" on investimentos for insert with check ( auth.uid() = user_id );
create policy "Investimentos: Update own" on investimentos for update using ( auth.uid() = user_id );
create policy "Investimentos: Delete own" on investimentos for delete using ( auth.uid() = user_id ); 