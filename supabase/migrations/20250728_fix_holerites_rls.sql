-- Migration: Correction des politiques RLS pour la table holerites
-- Date: 2025-07-28
-- Description: Ajoute les politiques RLS pour permettre aux utilisateurs d'accéder à leurs données

-- Activer RLS sur la table holerites
ALTER TABLE public.holerites ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres holerites
CREATE POLICY "Users can view their own holerites" ON public.holerites
  FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs d'insérer leurs propres holerites
CREATE POLICY "Users can insert their own holerites" ON public.holerites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres holerites
CREATE POLICY "Users can update their own holerites" ON public.holerites
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres holerites
CREATE POLICY "Users can delete their own holerites" ON public.holerites
  FOR DELETE USING (auth.uid() = user_id);

-- Politique pour permettre aux admins d'accéder à toutes les données (optionnel)
-- CREATE POLICY "Admins can access all holerites" ON public.holerites
--   FOR ALL USING (auth.uid() IN (
--     SELECT user_id FROM user_roles WHERE role = 'admin'
--   ));

-- Commentaire sur les politiques
COMMENT ON POLICY "Users can view their own holerites" ON public.holerites IS 'Permet aux utilisateurs de voir leurs propres holerites';
COMMENT ON POLICY "Users can insert their own holerites" ON public.holerites IS 'Permet aux utilisateurs d\'insérer leurs propres holerites';
COMMENT ON POLICY "Users can update their own holerites" ON public.holerites IS 'Permet aux utilisateurs de mettre à jour leurs propres holerites';
COMMENT ON POLICY "Users can delete their own holerites" ON public.holerites IS 'Permet aux utilisateurs de supprimer leurs propres holerites'; 