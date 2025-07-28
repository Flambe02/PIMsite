-- Migration: Désactivation temporaire de RLS pour le développement
-- Date: 2025-07-28
-- Description: Désactive RLS sur la table holerites pour permettre les tests

-- Désactiver RLS temporairement pour le développement
ALTER TABLE public.holerites DISABLE ROW LEVEL SECURITY;

-- Commentaire pour rappeler que c'est temporaire
COMMENT ON TABLE public.holerites IS 'RLS désactivé temporairement pour le développement - À réactiver en production';

-- Note: Pour réactiver RLS plus tard, utiliser:
-- ALTER TABLE public.holerites ENABLE ROW LEVEL SECURITY; 