-- Vérification rapide des holerites
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier le nombre total de holerites
SELECT COUNT(*) as total_holerites FROM holerites;

-- 2. Vérifier le dernier holerite créé
SELECT 
    id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    period,
    created_at
FROM holerites 
ORDER BY created_at DESC 
LIMIT 1;

-- 3. Vérifier si Arley G. Vieira existe
SELECT 
    id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    period,
    created_at
FROM holerites 
WHERE nome ILIKE '%Arley%' OR nome ILIKE '%Vieira%'
ORDER BY created_at DESC;

-- 4. Vérifier les données structured_data du dernier holerite
SELECT 
    id,
    nome,
    created_at,
    structured_data->'final_data'->>'employee_name' as employee_name,
    structured_data->'final_data'->>'period' as period,
    structured_data->'final_data'->'gross_salary'->>'valor' as gross_salary,
    structured_data->'final_data'->'net_salary'->>'valor' as net_salary
FROM holerites 
ORDER BY created_at DESC 
LIMIT 1;
