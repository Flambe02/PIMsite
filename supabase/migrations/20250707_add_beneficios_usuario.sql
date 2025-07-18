-- 20250707_add_beneficios_usuario.sql
-- Criação da tabela que armazena benefícios associados ao usuário

create table if not exists public.beneficios_usuario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null,
  ativo boolean not null default true,
  origem text not null check (origem in ('holerite', 'manual')),
  criado_em timestamptz not null default now(),
  unique (user_id, tipo, origem)
);

-- Index para consultas rápidas por usuário
create index if not exists beneficios_usuario_user_idx on public.beneficios_usuario(user_id); 