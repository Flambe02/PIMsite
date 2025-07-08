-- Script pour corriger les politiques RLS de la table holerites
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier que la table existe
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'holerites';

-- 2. Supprimer les anciennes politiques RLS si elles existent
DROP POLICY IF EXISTS "Users can insert their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can view their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can update their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can delete their own holerites" ON holerites;

-- 3. Activer RLS sur la table holerites
ALTER TABLE holerites ENABLE ROW LEVEL SECURITY;

-- 4. Créer les nouvelles politiques RLS pour la table holerites
-- Politique pour l'insertion (INSERT)
CREATE POLICY "Users can insert their own holerites" ON holerites
FOR INSERT WITH CHECK (
  auth.uid()::text = user_id
);

-- Politique pour la lecture (SELECT)
CREATE POLICY "Users can view their own holerites" ON holerites
FOR SELECT USING (
  auth.uid()::text = user_id
);

-- Politique pour la mise à jour (UPDATE)
CREATE POLICY "Users can update their own holerites" ON holerites
FOR UPDATE USING (
  auth.uid()::text = user_id
);

-- Politique pour la suppression (DELETE)
CREATE POLICY "Users can delete their own holerites" ON holerites
FOR DELETE USING (
  auth.uid()::text = user_id
);

-- 5. Vérifier que les politiques ont été créées
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'holerites' 
AND schemaname = 'public';

-- 6. Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'holerites';

-- 7. Vérifier la structure de la table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'holerites'
ORDER BY ordinal_position; 