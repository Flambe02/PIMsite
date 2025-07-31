-- Script de correction : Extraire les données depuis structured_data
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier les données dans structured_data
SELECT 
  id,
  created_at,
  salario_bruto as current_salario_bruto,
  salario_liquido as current_salario_liquido,
  structured_data->'final_data'->>'salario_bruto' as structured_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as structured_salario_liquido,
  structured_data->>'salario_bruto' as direct_structured_salario_bruto,
  structured_data->>'salario_liquido' as direct_structured_salario_liquido
FROM public.holerites 
WHERE structured_data IS NOT NULL
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Extraire les données depuis structured_data vers les colonnes directes
UPDATE public.holerites 
SET salario_bruto = COALESCE(
  structured_data->'final_data'->>'salario_bruto',
  structured_data->>'salario_bruto',
  structured_data->>'gross_salary',
  '0.00'
)
WHERE structured_data IS NOT NULL 
  AND (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00');

UPDATE public.holerites 
SET salario_liquido = COALESCE(
  structured_data->'final_data'->>'salario_liquido',
  structured_data->>'salario_liquido',
  structured_data->>'net_salary',
  '0.00'
)
WHERE structured_data IS NOT NULL 
  AND (salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00');

-- 3. Vérifier les résultats après extraction
SELECT 
  id,
  created_at,
  salario_bruto as updated_salario_bruto,
  salario_liquido as updated_salario_liquido,
  CASE 
    WHEN salario_bruto ~ '^[0-9]+\.?[0-9]*$' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 'EXTRACTED'
    WHEN salario_bruto = '0' OR salario_bruto = '0.00' THEN 'ZERO'
    ELSE 'INVALID'
  END as salario_bruto_status,
  CASE 
    WHEN salario_liquido ~ '^[0-9]+\.?[0-9]*$' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 'EXTRACTED'
    WHEN salario_liquido = '0' OR salario_liquido = '0.00' THEN 'ZERO'
    ELSE 'INVALID'
  END as salario_liquido_status
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Statistiques après extraction
SELECT 
  'salario_bruto' as field,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_bruto ~ '^[0-9]+\.?[0-9]*$' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as extracted_values,
  COUNT(CASE WHEN salario_bruto = '0' OR salario_bruto = '0.00' THEN 1 END) as zero_values,
  COUNT(CASE WHEN salario_bruto IS NULL OR salario_bruto = '' THEN 1 END) as null_values
FROM public.holerites
UNION ALL
SELECT 
  'salario_liquido' as field,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_liquido ~ '^[0-9]+\.?[0-9]*$' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as extracted_values,
  COUNT(CASE WHEN salario_liquido = '0' OR salario_liquido = '0.00' THEN 1 END) as zero_values,
  COUNT(CASE WHEN salario_liquido IS NULL OR salario_liquido = '' THEN 1 END) as null_values
FROM public.holerites;

-- 5. Identifier les holerites qui n'ont toujours pas de données
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  structured_data IS NOT NULL as has_structured_data,
  structured_data->>'final_data' IS NOT NULL as has_final_data
FROM public.holerites 
WHERE (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00')
   OR (salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00')
ORDER BY created_at DESC; 