-- Vérification du processus d'OCR et des données stockées
-- À exécuter dans Supabase Dashboard

-- 1. Voir la structure complète d'un holerite récent
SELECT 
  'STRUCTURE COMPLÈTE' as info,
  id,
  created_at,
  -- Voir tout le contenu de structured_data
  structured_data,
  -- Vérifier si structured_data est NULL
  structured_data IS NULL as is_structured_data_null,
  -- Vérifier la taille de structured_data
  jsonb_array_length(structured_data) as structured_data_length,
  -- Voir les clés principales
  jsonb_object_keys(structured_data) as main_keys
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 1;

-- 2. Vérifier si les données sont dans une structure différente
SELECT 
  'RECHERCHE DANS TOUTES LES STRUCTURES' as info,
  id,
  created_at,
  -- Chercher dans toutes les sections possibles
  structured_data->'ocr_data' as ocr_data,
  structured_data->'analysis_data' as analysis_data,
  structured_data->'extracted_data' as extracted_data,
  structured_data->'processed_data' as processed_data,
  structured_data->'raw_data' as raw_data,
  structured_data->'salary_data' as salary_data,
  structured_data->'compensation_data' as compensation_data,
  -- Vérifier si c'est un tableau
  jsonb_array_length(structured_data) as array_length,
  -- Voir le premier élément si c'est un tableau
  structured_data->0 as first_array_element
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 3. Vérifier si les données sont dans une structure imbriquée
SELECT 
  'RECHERCHE IMBRIQUÉE' as info,
  id,
  created_at,
  -- Chercher dans des structures plus profondes
  structured_data->'data'->'salary' as nested_salary,
  structured_data->'data'->'compensation' as nested_compensation,
  structured_data->'result'->'salary' as result_salary,
  structured_data->'output'->'salary' as output_salary,
  -- Vérifier si c'est une chaîne JSON
  CASE 
    WHEN jsonb_typeof(structured_data) = 'string' THEN 'IS_STRING'
    WHEN jsonb_typeof(structured_data) = 'object' THEN 'IS_OBJECT'
    WHEN jsonb_typeof(structured_data) = 'array' THEN 'IS_ARRAY'
    ELSE 'OTHER_TYPE'
  END as structured_data_type
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 4. Vérifier si les données sont dans une autre table
SELECT 
  'VÉRIFICATION AUTRES TABLES' as info,
  -- Vérifier si les données sont dans ocr_results
  (SELECT COUNT(*) FROM public.ocr_results WHERE holerite_id = h.id) as ocr_results_count,
  -- Vérifier si les données sont dans analyses
  (SELECT COUNT(*) FROM public.analyses WHERE holerite_id = h.id) as analyses_count,
  -- Vérifier si les données sont dans scan_results
  (SELECT COUNT(*) FROM public.scan_results WHERE holerite_id = h.id) as scan_results_count,
  h.id,
  h.created_at
FROM public.holerites h
ORDER BY h.created_at DESC 
LIMIT 3;

-- 5. Vérifier le contenu des autres tables
SELECT 
  'CONTENU OCR_RESULTS' as info,
  holerite_id,
  created_at,
  result_data,
  -- Chercher les salaires dans result_data
  result_data->>'salario_bruto' as ocr_salario_bruto,
  result_data->>'salario_liquido' as ocr_salario_liquido,
  result_data->>'gross_salary' as ocr_gross_salary,
  result_data->>'net_salary' as ocr_net_salary
FROM public.ocr_results 
ORDER BY created_at DESC 
LIMIT 3;

-- 6. Vérifier le contenu des analyses
SELECT 
  'CONTENU ANALYSES' as info,
  holerite_id,
  created_at,
  analysis_result,
  -- Chercher les salaires dans analysis_result
  analysis_result->>'salario_bruto' as analysis_salario_bruto,
  analysis_result->>'salario_liquido' as analysis_salario_liquido,
  analysis_result->>'gross_salary' as analysis_gross_salary,
  analysis_result->>'net_salary' as analysis_net_salary
FROM public.analyses 
ORDER BY created_at DESC 
LIMIT 3; 