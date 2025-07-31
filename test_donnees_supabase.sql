-- Test des données dans Supabase pour le dernier holerite uploadé
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier le dernier holerite uploadé
SELECT 
  id,
  created_at,
  user_id,
  -- Colonnes directes
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
  -- Structured data
  structured_data IS NOT NULL as has_structured_data,
  structured_data->>'final_data' IS NOT NULL as has_final_data,
  -- Valeurs dans structured_data
  structured_data->'final_data'->>'salario_bruto' as structured_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as structured_salario_liquido,
  structured_data->'final_data'->>'descontos' as structured_descontos,
  structured_data->'final_data'->>'employee_name' as structured_employee_name,
  structured_data->'final_data'->>'company_name' as structured_company_name,
  structured_data->'final_data'->>'period' as structured_period,
  -- Recommandations IA
  structured_data->'analysis_result'->'recommendations'->>'score_optimisation' as ai_score,
  structured_data->'analysis_result'->'recommendations'->>'recommendations' IS NOT NULL as has_ai_recommendations
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 1;

-- 2. Vérifier si les triggers fonctionnent
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'holerites';

-- 3. Vérifier les fonctions d'extraction
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%extract%' 
  OR routine_name LIKE '%holerite%'
  OR routine_name LIKE '%salary%';

-- 4. Test d'extraction manuelle des valeurs
WITH latest_holerite AS (
  SELECT * FROM public.holerites 
  ORDER BY created_at DESC 
  LIMIT 1
)
SELECT 
  'EXTRACTION MANUELLE' as test_type,
  -- Colonnes directes
  salario_bruto as direct_salario_bruto,
  salario_liquido as direct_salario_liquido,
  -- Extraction depuis structured_data
  structured_data->'final_data'->>'salario_bruto' as extracted_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as extracted_salario_liquido,
  structured_data->'final_data'->>'descontos' as extracted_descontos,
  -- Conversion en nombres
  CASE 
    WHEN structured_data->'final_data'->>'salario_bruto' ~ '^[0-9]+\.?[0-9]*$' 
    THEN (structured_data->'final_data'->>'salario_bruto')::decimal 
    ELSE 0 
  END as converted_salario_bruto,
  CASE 
    WHEN structured_data->'final_data'->>'salario_liquido' ~ '^[0-9]+\.?[0-9]*$' 
    THEN (structured_data->'final_data'->>'salario_liquido')::decimal 
    ELSE 0 
  END as converted_salario_liquido
FROM latest_holerite; 