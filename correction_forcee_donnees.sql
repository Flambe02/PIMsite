-- Correction forcée des données existantes
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier l'état actuel
SELECT 
  'ÉTAT ACTUEL' as info,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 2. Analyser la structure des données pour comprendre le problème
SELECT 
  'ANALYSE STRUCTURE' as info,
  id,
  created_at,
  -- Vérifier si structured_data contient les bonnes données
  structured_data->'final_data'->>'salario_bruto' as structured_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as structured_salario_liquido,
  structured_data->'final_data'->>'gross_salary' as structured_gross_salary,
  structured_data->'final_data'->>'net_salary' as structured_net_salary,
  -- Vérifier les colonnes directes
  salario_bruto as direct_salario_bruto,
  salario_liquido as direct_salario_liquido
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 3. Correction forcée avec la fonction d'extraction
UPDATE public.holerites 
SET 
  salario_bruto = COALESCE(
    extract_numeric_from_json_standalone(structured_data, 'salario_bruto'),
    '0.00'
  ),
  salario_liquido = COALESCE(
    extract_numeric_from_json_standalone(structured_data, 'salario_liquido'),
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

-- 5. Vérifier les 5 derniers holerites
SELECT 
  'DERNIERS HOLERITES' as info,
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
  -- Vérifier les données dans structured_data
  structured_data->'final_data'->>'salario_bruto' as structured_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as structured_salario_liquido,
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