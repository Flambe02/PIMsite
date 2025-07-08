-- Script pour vérifier et corriger la structure de la table holerites
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure actuelle de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'holerites'
ORDER BY ordinal_position;

-- 2. Ajouter la colonne user_id si elle n'existe pas
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

-- 3. Vérifier que le bucket payslips existe
SELECT * FROM storage.buckets WHERE id = 'payslips';

-- 4. Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('payslips', 'payslips', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Vérifier les politiques RLS actuelles
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