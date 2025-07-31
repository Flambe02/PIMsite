-- Script de diagnostic des données holerites
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'holerites' 
ORDER BY ordinal_position;

-- 2. Vérifier les données des holerites récents
SELECT 
  id,
  created_at,
  user_id,
  salario_bruto,
  salario_liquido,
  nome,
  empresa,
  period,
  structured_data IS NOT NULL as has_structured_data,
  structured_data->>'final_data' IS NOT NULL as has_final_data
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Analyser les valeurs de salario_bruto
SELECT 
  'salario_bruto' as field,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_bruto IS NULL THEN 1 END) as null_values,
  COUNT(CASE WHEN salario_bruto = 0 THEN 1 END) as zero_values,
  COUNT(CASE WHEN salario_bruto > 0 THEN 1 END) as positive_values,
  AVG(salario_bruto) as avg_value,
  MIN(salario_bruto) as min_value,
  MAX(salario_bruto) as max_value
FROM public.holerites;

-- 4. Analyser les valeurs de salario_liquido
SELECT 
  'salario_liquido' as field,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_liquido IS NULL THEN 1 END) as null_values,
  COUNT(CASE WHEN salario_liquido = 0 THEN 1 END) as zero_values,
  COUNT(CASE WHEN salario_liquido > 0 THEN 1 END) as positive_values,
  AVG(salario_liquido) as avg_value,
  MIN(salario_liquido) as min_value,
  MAX(salario_liquido) as max_value
FROM public.holerites;

-- 5. Vérifier les données dans structured_data
SELECT 
  id,
  created_at,
  structured_data->>'final_data' as final_data_exists,
  structured_data->'final_data'->>'salario_bruto' as structured_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as structured_salario_liquido,
  structured_data->>'salario_bruto' as direct_structured_salario_bruto,
  structured_data->>'salario_liquido' as direct_structured_salario_liquido,
  salario_bruto as direct_salario_bruto,
  salario_liquido as direct_salario_liquido
FROM public.holerites 
WHERE structured_data IS NOT NULL
ORDER BY created_at DESC 
LIMIT 5;

-- 6. Identifier les holerites avec des données manquantes
SELECT 
  id,
  created_at,
  user_id,
  CASE 
    WHEN salario_bruto IS NULL OR salario_bruto = 0 THEN 'MISSING'
    ELSE 'OK'
  END as salario_bruto_status,
  CASE 
    WHEN salario_liquido IS NULL OR salario_liquido = 0 THEN 'MISSING'
    ELSE 'OK'
  END as salario_liquido_status,
  CASE 
    WHEN structured_data IS NULL THEN 'NO_STRUCTURED_DATA'
    WHEN structured_data->>'final_data' IS NULL THEN 'NO_FINAL_DATA'
    ELSE 'HAS_STRUCTURED_DATA'
  END as structured_data_status
FROM public.holerites 
WHERE salario_bruto IS NULL OR salario_bruto = 0 
   OR salario_liquido IS NULL OR salario_liquido = 0
ORDER BY created_at DESC; 