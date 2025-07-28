-- Migration: Correction des politiques RLS pour holerites (v3)
-- Date: 2025-01-29 14:30
-- Description: Ajout des politiques RLS pour la table holerites (version finale)

-- Vérifier si la politique existe déjà avant de la créer
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'holerites' 
    AND policyname = 'Users can view their own holerites'
  ) THEN
    CREATE POLICY "Users can view their own holerites" ON public.holerites
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Vérifier si la politique INSERT existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'holerites' 
    AND policyname = 'Users can insert their own holerites'
  ) THEN
    CREATE POLICY "Users can insert their own holerites" ON public.holerites
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Vérifier si la politique UPDATE existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'holerites' 
    AND policyname = 'Users can update their own holerites'
  ) THEN
    CREATE POLICY "Users can update their own holerites" ON public.holerites
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Vérifier si la politique DELETE existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'holerites' 
    AND policyname = 'Users can delete their own holerites'
  ) THEN
    CREATE POLICY "Users can delete their own holerites" ON public.holerites
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$; 