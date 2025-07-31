-- Analyse et correction des données dans structured_data
-- À exécuter dans Supabase Dashboard

-- 1. Analyser la structure complète de structured_data
SELECT 
  'ANALYSE COMPLÈTE' as info,
  id,
  created_at,
  -- Voir la structure complète
  structured_data as structured_data_complete,
  -- Vérifier si final_data existe
  structured_data->'final_data' IS NOT NULL as has_final_data,
  -- Vérifier les chemins possibles pour salario_bruto
  structured_data->'final_data'->>'salario_bruto' as path1_salario_bruto,
  structured_data->>'salario_bruto' as path2_salario_bruto,
  structured_data->'final_data'->>'gross_salary' as path3_gross_salary,
  structured_data->>'gross_salary' as path4_gross_salary,
  -- Vérifier les chemins possibles pour salario_liquido
  structured_data->'final_data'->>'salario_liquido' as path1_salario_liquido,
  structured_data->>'salario_liquido' as path2_salario_liquido,
  structured_data->'final_data'->>'net_salary' as path3_net_salary,
  structured_data->>'net_salary' as path4_net_salary,
  -- Vérifier les descontos (qui fonctionnent)
  structured_data->'final_data'->>'descontos' as descontos_working
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 2. Vérifier si les données sont dans d'autres chemins
SELECT 
  'RECHERCHE CHEMINS ALTERNATIFS' as info,
  id,
  created_at,
  -- Chercher dans tous les chemins possibles
  structured_data->'final_data'->>'salario_bruto' as final_data_salario_bruto,
  structured_data->'final_data'->>'gross_salary' as final_data_gross_salary,
  structured_data->'final_data'->>'total_gross_salary' as final_data_total_gross,
  structured_data->'final_data'->>'salario_bruto_total' as final_data_salario_bruto_total,
  structured_data->>'salario_bruto' as root_salario_bruto,
  structured_data->>'gross_salary' as root_gross_salary,
  -- Même chose pour salario_liquido
  structured_data->'final_data'->>'salario_liquido' as final_data_salario_liquido,
  structured_data->'final_data'->>'net_salary' as final_data_net_salary,
  structured_data->'final_data'->>'total_net_salary' as final_data_total_net,
  structured_data->'final_data'->>'salario_liquido_total' as final_data_salario_liquido_total,
  structured_data->>'salario_liquido' as root_salario_liquido,
  structured_data->>'net_salary' as root_net_salary
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 3. Vérifier si les données sont dans des objets avec 'valor'
SELECT 
  'RECHERCHE OBJETS VALOR' as info,
  id,
  created_at,
  -- Vérifier si salario_bruto est un objet avec 'valor'
  structured_data->'final_data'->'salario_bruto' as obj_salario_bruto,
  structured_data->'final_data'->'salario_bruto'->>'valor' as obj_salario_bruto_valor,
  structured_data->'final_data'->'salario_bruto'->>'value' as obj_salario_bruto_value,
  -- Vérifier si salario_liquido est un objet avec 'valor'
  structured_data->'final_data'->'salario_liquido' as obj_salario_liquido,
  structured_data->'final_data'->'salario_liquido'->>'valor' as obj_salario_liquido_valor,
  structured_data->'final_data'->'salario_liquido'->>'value' as obj_salario_liquido_value
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 4. Vérifier si les données sont dans d'autres structures
SELECT 
  'RECHERCHE AUTRES STRUCTURES' as info,
  id,
  created_at,
  -- Chercher dans d'autres chemins possibles
  structured_data->'analysis_result'->>'salario_bruto' as analysis_salario_bruto,
  structured_data->'analysis_result'->>'gross_salary' as analysis_gross_salary,
  structured_data->'ocr_result'->>'salario_bruto' as ocr_salario_bruto,
  structured_data->'ocr_result'->>'gross_salary' as ocr_gross_salary,
  -- Vérifier les clés disponibles dans final_data
  jsonb_object_keys(structured_data->'final_data') as available_keys
FROM public.holerites 
WHERE structured_data->'final_data' IS NOT NULL
ORDER BY created_at DESC 
LIMIT 3; 