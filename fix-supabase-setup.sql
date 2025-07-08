-- Script complet pour corriger la configuration Supabase
-- Exécute ce script dans l'éditeur SQL de Supabase

-- 1. Créer le bucket 'payslips' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('payslips', 'payslips', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Activer RLS sur la table holerites
ALTER TABLE holerites ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes policies s'il y en a
DROP POLICY IF EXISTS "Users can insert their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can manage their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can view their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can update their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can delete their own holerites" ON holerites;

-- 4. Créer les nouvelles policies pour INSERT (avec WITH CHECK)
CREATE POLICY "Users can insert their own holerites"
ON holerites
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 5. Créer la policy pour SELECT/UPDATE/DELETE (avec USING)
CREATE POLICY "Users can manage their own holerites"
ON holerites
FOR ALL
USING (user_id = auth.uid());

-- 6. Créer les policies pour le bucket storage
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Policy pour upload (INSERT)
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'payslips' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy pour lecture (SELECT)
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payslips' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy pour suppression (DELETE)
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'payslips' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 7. Vérifier que la colonne user_id existe dans holerites
-- Si elle n'existe pas, l'ajouter
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'holerites' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE holerites ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- 8. Afficher les policies créées
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
WHERE tablename IN ('holerites', 'objects')
ORDER BY tablename, policyname; 