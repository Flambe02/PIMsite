-- Script pour corriger les politiques RLS du bucket payslips
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'payslips';

-- 2. Supprimer les anciennes politiques RLS si elles existent
DROP POLICY IF EXISTS "Users can upload their own payslips" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payslips" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own payslips" ON storage.objects;

-- 3. Créer les nouvelles politiques RLS pour le bucket payslips
-- Politique pour l'upload (INSERT)
CREATE POLICY "Users can upload their own payslips" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payslips' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour la lecture (SELECT)
CREATE POLICY "Users can view their own payslips" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payslips' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour la suppression (DELETE)
CREATE POLICY "Users can delete their own payslips" ON storage.objects
FOR DELETE USING (
  bucket_id = 'payslips' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Vérifier que les politiques ont été créées
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
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 5. Activer RLS sur la table objects si ce n'est pas déjà fait
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 6. Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects'; 