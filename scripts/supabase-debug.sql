-- Script SQL pour déboguer le stockage des holerites dans Supabase
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure de la table holerites
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerites' 
ORDER BY ordinal_position;

-- 2. Lister tous les holerites avec leurs métadonnées
SELECT 
    id,
    user_id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    period,
    created_at,
    updated_at,
    CASE 
        WHEN structured_data IS NOT NULL THEN '✅ Présent'
        ELSE '❌ Absent'
    END as structured_data_status,
    CASE 
        WHEN structured_data IS NOT NULL THEN jsonb_typeof(structured_data)
        ELSE 'N/A'
    END as structured_data_type
FROM holerites 
ORDER BY created_at DESC;

-- 3. Vérifier le dernier holerite scanné (Arley G. Vieira)
SELECT 
    id,
    user_id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    period,
    created_at,
    structured_data->>'final_data' as final_data_exists,
    structured_data->'final_data'->>'employee_name' as employee_name,
    structured_data->'final_data'->>'period' as period_from_data,
    structured_data->'final_data'->'gross_salary'->>'valor' as gross_salary_valor,
    structured_data->'final_data'->'net_salary'->>'valor' as net_salary_valor
FROM holerites 
WHERE nome ILIKE '%Arley%' OR nome ILIKE '%Vieira%'
ORDER BY created_at DESC;

-- 4. Vérifier les données structured_data du dernier holerite
SELECT 
    id,
    nome,
    created_at,
    structured_data,
    -- Extraire les données importantes
    structured_data->'final_data'->>'employee_name' as employee_name,
    structured_data->'final_data'->>'period' as period,
    structured_data->'final_data'->'gross_salary'->>'valor' as gross_salary,
    structured_data->'final_data'->'net_salary'->>'valor' as net_salary,
    structured_data->'recommendations'->>'recommendations' as recommendations_count
FROM holerites 
ORDER BY created_at DESC 
LIMIT 1;

-- 5. Vérifier les permissions RLS (Row Level Security)
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
WHERE tablename = 'holerites';

-- 6. Vérifier les contraintes de la table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'holerites'::regclass;

-- 7. Vérifier les index
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'holerites';

-- 8. Vérifier les triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'holerites';

-- 9. Vérifier les données par utilisateur
SELECT 
    user_id,
    COUNT(*) as holerite_count,
    MAX(created_at) as dernier_holerite,
    MIN(created_at) as premier_holerite,
    STRING_AGG(DISTINCT nome, ', ') as noms_employes
FROM holerites 
GROUP BY user_id 
ORDER BY dernier_holerite DESC;

-- 10. Vérifier la cohérence des données
SELECT 
    id,
    nome,
    salario_bruto,
    salario_liquido,
    CASE 
        WHEN salario_bruto > 0 AND salario_liquido > 0 THEN 
            ROUND(((salario_liquido / salario_bruto) * 100)::numeric, 2)
        ELSE 0 
    END as efficacite_pourcentage,
    CASE 
        WHEN salario_bruto > 0 AND salario_liquido > 0 THEN 
            salario_bruto - salario_liquido
        ELSE 0 
    END as descontos_calcules,
    period,
    created_at
FROM holerites 
WHERE salario_bruto > 0 OR salario_liquido > 0
ORDER BY created_at DESC;
