-- Script pour configurer les politiques de sécurité du bucket payslips
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payslips', 
  'payslips', 
  true, 
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can upload payslips" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their payslips" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their payslips" ON storage.objects;

-- 3. Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Users can upload payslips" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payslips' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Politique pour permettre la lecture des fichiers uploadés
CREATE POLICY "Users can view their payslips" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payslips' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Politique pour permettre la suppression de ses propres fichiers
CREATE POLICY "Users can delete their payslips" ON storage.objects
FOR DELETE USING (
  bucket_id = 'payslips' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Vérifier que tout est bien configuré
SELECT 
  'Bucket created/updated' as status,
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets 
WHERE id = 'payslips';

SELECT 
  'Policies created' as status,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'; 