-- Test d'insertion d'un holerite pour diagnostiquer le problème
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure exacte de la table holerites
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'holerites' 
ORDER BY ordinal_position;

-- 2. Vérifier les contraintes et triggers
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'holerites'::regclass;

-- 3. Vérifier les politiques RLS
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'holerites';

-- 4. Tester l'insertion d'un holerite de test
-- ATTENTION: Remplacer 'USER_ID_TEST' par un vrai user_id de votre base
INSERT INTO holerites (
    user_id,
    scan_id,
    nome,
    empresa,
    perfil,
    salario_bruto,
    salario_liquido,
    period,
    structured_data,
    created_at
) VALUES (
    '505e01f5-8b95-4349-b709-ae2a95bd4ee1', -- Remplacer par un vrai user_id
    'test-scan-123',
    'TEST ARLEY G. VIEIRA',
    'TEST EMPRESA LTDA',
    'CLT',
    2500.00,
    2170.17,
    '2024-01',
    '{"test": "data", "final_data": {"employee_name": "TEST ARLEY"}}'::jsonb,
    NOW()
) RETURNING id, nome, created_at;

-- 5. Vérifier que l'insertion a fonctionné
SELECT 
    id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    period,
    created_at
FROM holerites 
WHERE scan_id = 'test-scan-123';

-- 6. Nettoyer le test
DELETE FROM holerites WHERE scan_id = 'test-scan-123';
