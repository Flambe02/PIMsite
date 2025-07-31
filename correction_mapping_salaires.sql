-- Correction du mapping des salaires pour les données existantes
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier l'état actuel
SELECT 
  'ÉTAT ACTUEL' as info,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 2. Analyser les données dans structured_data pour comprendre le mapping
SELECT 
  'ANALYSE MAPPING' as info,
  id,
  created_at,
  -- Vérifier les différents chemins possibles pour les salaires
  structured_data->>'salary_bruto' as salary_bruto_direct,
  structured_data->>'salary_liquido' as salary_liquido_direct,
  structured_data->'final_data'->>'salary_bruto' as salary_bruto_final_data,
  structured_data->'final_data'->>'salary_liquido' as salary_liquido_final_data,
  structured_data->>'gross_salary' as gross_salary_direct,
  structured_data->>'net_salary' as net_salary_direct,
  structured_data->'final_data'->>'gross_salary' as gross_salary_final_data,
  structured_data->'final_data'->>'net_salary' as net_salary_final_data,
  -- Vérifier les colonnes directes actuelles
  salario_bruto as current_salario_bruto,
  salario_liquido as current_salario_liquido
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Correction avec le bon mapping
UPDATE public.holerites 
SET 
  salario_bruto = COALESCE(
    NULLIF(structured_data->>'salary_bruto', ''),
    NULLIF(structured_data->'final_data'->>'salary_bruto', ''),
    NULLIF(structured_data->>'gross_salary', ''),
    NULLIF(structured_data->'final_data'->>'gross_salary', ''),
    NULLIF(structured_data->>'salario_bruto', ''),
    NULLIF(structured_data->'final_data'->>'salario_bruto', ''),
    '0.00'
  ),
  salario_liquido = COALESCE(
    NULLIF(structured_data->>'salary_liquido', ''),
    NULLIF(structured_data->'final_data'->>'salary_liquido', ''),
    NULLIF(structured_data->>'net_salary', ''),
    NULLIF(structured_data->'final_data'->>'net_salary', ''),
    NULLIF(structured_data->>'salario_liquido', ''),
    NULLIF(structured_data->'final_data'->>'salario_liquido', ''),
    '0.00'
  )
WHERE structured_data IS NOT NULL 
  AND (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00'
    OR salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00');

-- 4. Vérifier les résultats après correction
SELECT 
  'RÉSULTATS APRÈS CORRECTION' as info,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 5. Vérifier les 5 derniers holerites après correction
SELECT 
  'DERNIERS HOLERITES CORRIGÉS' as info,
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
  -- Vérifier les données dans structured_data
  structured_data->>'salary_bruto' as structured_salary_bruto,
  structured_data->>'salary_liquido' as structured_salary_liquido,
  CASE 
    WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 'OK'
    ELSE 'PROBLÈME'
  END as salario_bruto_status,
  CASE 
    WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 'OK'
    ELSE 'PROBLÈME'
  END as salario_liquido_status
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 5; 