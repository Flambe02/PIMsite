-- Migration: Ajout de données structurées pour le parser v2
-- Date: 2025-07-05
-- Description: Ajoute le support pour les données structurées JSONB et la liaison avec les fichiers uploadés

-- Ajoute le JSONB pour le parser v2
-- Cette colonne stockera les données extraites de manière structurée (employeur, salarié, lignes, totaux)
alter table public.holerites
  add column structured_data jsonb;

-- Lie le bulletin à son fichier upload
-- Permet de tracer quel fichier a généré quelles données extraites
alter table public.holerites
  add column upload_id uuid references public.user_payslip_uploads(id);

-- Ajoute un index sur structured_data pour les requêtes JSONB
create index idx_holerites_structured_data on public.holerites using gin (structured_data);

-- Ajoute un index sur upload_id pour les jointures
create index idx_holerites_upload_id on public.holerites (upload_id);

-- Commentaire sur la structure attendue du JSONB
comment on column public.holerites.structured_data is 'Données structurées extraites du bulletin (employeur, salarié, lignes, totaux)';
comment on column public.holerites.upload_id is 'Référence vers le fichier uploadé qui a généré ces données'; 