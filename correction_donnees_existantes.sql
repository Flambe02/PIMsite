-- Correction des données existantes avec le trigger
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier l'état actuel
SELECT 
  'ÉTAT ACTUEL' as info,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 2. Déclencher le trigger sur les données existantes
UPDATE public.holerites 
SET structured_data = structured_data
WHERE structured_data IS NOT NULL 
  AND (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00'
    OR salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00');

-- 3. Vérifier les résultats après correction
SELECT 
  'RÉSULTATS APRÈS CORRECTION' as info,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 4. Vérifier les 5 derniers holerites
SELECT 
  'DERNIERS HOLERITES' as info,
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
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