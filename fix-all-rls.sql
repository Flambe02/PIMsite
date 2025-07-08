-- Script complet pour corriger toutes les politiques RLS et la structure des tables
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ========================================
-- 1. VÉRIFICATION ET CRÉATION DES TABLES
-- ========================================

-- Vérifier si la table holerites existe
CREATE TABLE IF NOT EXISTS holerites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  upload_id TEXT,
  nome TEXT,
  empresa TEXT,
  salario_liquido TEXT,
  structured_data JSONB,
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter la colonne user_id si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'holerites' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE holerites ADD COLUMN user_id TEXT;
        RAISE NOTICE 'Coluna user_id adicionada à tabela holerites';
    ELSE
        RAISE NOTICE 'Coluna user_id já existe na tabela holerites';
    END IF;
END $$;

-- ========================================
-- 2. CRÉATION DU BUCKET PAYSLIPS
-- ========================================

-- Vérifier que le bucket payslips existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('payslips', 'payslips', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 3. SUPPRESSION DES ANCIENNES POLITIQUES
-- ========================================

-- Supprimer les anciennes politiques RLS pour storage.objects
DROP POLICY IF EXISTS "Users can upload their own payslips" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payslips" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own payslips" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON storage.objects;

-- Supprimer les anciennes politiques RLS pour holerites
DROP POLICY IF EXISTS "Users can insert their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can view their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can update their own holerites" ON holerites;
DROP POLICY IF EXISTS "Users can delete their own holerites" ON holerites;

-- ========================================
-- 4. ACTIVATION DE RLS
-- ========================================

-- Activer RLS sur les tables
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE holerites ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. CRÉATION DES NOUVELLES POLITIQUES
-- ========================================

-- Politiques pour storage.objects (bucket payslips)
CREATE POLICY "Users can upload their own payslips" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payslips' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payslips" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payslips' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own payslips" ON storage.objects
FOR DELETE USING (
  bucket_id = 'payslips' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politiques pour la table holerites
CREATE POLICY "Users can insert their own holerites" ON holerites
FOR INSERT WITH CHECK (
  auth.uid()::text = user_id
);

CREATE POLICY "Users can view their own holerites" ON holerites
FOR SELECT USING (
  auth.uid()::text = user_id
);

CREATE POLICY "Users can update their own holerites" ON holerites
FOR UPDATE USING (
  auth.uid()::text = user_id
);

CREATE POLICY "Users can delete their own holerites" ON holerites
FOR DELETE USING (
  auth.uid()::text = user_id
);

-- ========================================
-- 6. VÉRIFICATIONS
-- ========================================

-- Vérifier que les politiques ont été créées
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
WHERE (tablename = 'holerites' AND schemaname = 'public')
   OR (tablename = 'objects' AND schemaname = 'storage')
ORDER BY schemaname, tablename, policyname;

-- Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE (schemaname = 'public' AND tablename = 'holerites')
   OR (schemaname = 'storage' AND tablename = 'objects');

-- Vérifier la structure de la table holerites
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'holerites'
ORDER BY ordinal_position;

-- Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'payslips';

-- ========================================
-- 7. MESSAGE DE CONFIRMATION
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '=== CONFIGURAÇÃO RLS CONCLUÍDA ===';
    RAISE NOTICE '✓ Tabela holerites configurada';
    RAISE NOTICE '✓ Bucket payslips configurado';
    RAISE NOTICE '✓ Políticas RLS criadas para storage.objects';
    RAISE NOTICE '✓ Políticas RLS criadas para holerites';
    RAISE NOTICE '✓ RLS ativado em todas as tabelas';
    RAISE NOTICE '=== PRONTO PARA USO ===';
END $$; 