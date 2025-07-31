-- Script de diagnostic pour l'affichage des salaires
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier les données du dernier holerite de l'utilisateur
SELECT 
  id,
  created_at,
  user_id,
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
  -- Vérifier si structured_data existe
  structured_data IS NOT NULL as has_structured_data,
  -- Vérifier si final_data existe
  structured_data->>'final_data' IS NOT NULL as has_final_data,
  -- Extraire les valeurs depuis structured_data
  structured_data->'final_data'->>'salario_bruto' as structured_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as structured_salario_liquido,
  structured_data->>'salario_bruto' as direct_structured_salario_bruto,
  structured_data->>'salario_liquido' as direct_structured_salario_liquido,
  -- Vérifier les types de données
  pg_typeof(salario_bruto) as salario_bruto_type,
  pg_typeof(salario_liquido) as salario_liquido_type
FROM public.holerites 
WHERE user_id = (
  SELECT user_id 
  FROM public.holerites 
  ORDER BY created_at DESC 
  LIMIT 1
)
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Vérifier les types de colonnes
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'holerites' 
  AND table_schema = 'public'
  AND column_name IN ('salario_bruto', 'salario_liquido', 'period', 'nome', 'empresa');

-- 3. Compter les valeurs non-nulles par colonne
SELECT 
  'salario_bruto' as column_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as non_zero_values,
  COUNT(CASE WHEN salario_bruto = '0' OR salario_bruto = '0.00' THEN 1 END) as zero_values,
  COUNT(CASE WHEN salario_bruto IS NULL OR salario_bruto = '' THEN 1 END) as null_values
FROM public.holerites
UNION ALL
SELECT 
  'salario_liquido' as column_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as non_zero_values,
  COUNT(CASE WHEN salario_liquido = '0' OR salario_liquido = '0.00' THEN 1 END) as zero_values,
  COUNT(CASE WHEN salario_liquido IS NULL OR salario_liquido = '' THEN 1 END) as null_values
FROM public.holerites;

-- 4. Vérifier les valeurs dans structured_data pour les enregistrements récents
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  -- Extraire toutes les valeurs possibles de salario_bruto
  structured_data->'final_data'->>'salario_bruto' as final_salario_bruto,
  structured_data->>'salario_bruto' as direct_structured_salario_bruto,
  structured_data->>'gross_salary' as gross_salary,
  structured_data->>'salario_bruto_total' as salario_bruto_total,
  -- Extraire toutes les valeurs possibles de salario_liquido
  structured_data->'final_data'->>'salario_liquido' as final_salario_liquido,
  structured_data->>'salario_liquido' as direct_structured_salario_liquido,
  structured_data->>'net_salary' as net_salary,
  structured_data->>'salario_liquido_total' as salario_liquido_total
FROM public.holerites 
WHERE structured_data IS NOT NULL
ORDER BY created_at DESC 
LIMIT 10; 