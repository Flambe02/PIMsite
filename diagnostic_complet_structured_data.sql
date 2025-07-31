-- Diagnostic complet du contenu de structured_data
-- À exécuter dans Supabase Dashboard

-- 1. Voir le contenu COMPLET de structured_data pour le dernier holerite
SELECT 
  'CONTENU COMPLET' as info,
  id,
  created_at,
  -- Voir tout le JSON brut
  structured_data as structured_data_complete,
  -- Vérifier le type de données
  jsonb_typeof(structured_data) as data_type,
  -- Voir les clés principales
  jsonb_object_keys(structured_data) as main_keys
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 1;

-- 2. Analyser la structure en détail
SELECT 
  'ANALYSE DÉTAILLÉE' as info,
  id,
  created_at,
  -- Vérifier si c'est un objet ou un tableau
  CASE 
    WHEN jsonb_typeof(structured_data) = 'object' THEN 'OBJECT'
    WHEN jsonb_typeof(structured_data) = 'array' THEN 'ARRAY'
    WHEN jsonb_typeof(structured_data) = 'string' THEN 'STRING'
    ELSE 'OTHER'
  END as structure_type,
  -- Voir la taille
  jsonb_array_length(structured_data) as array_length,
  -- Voir les clés disponibles
  jsonb_object_keys(structured_data) as available_keys,
  -- Vérifier si final_data existe
  structured_data->'final_data' IS NOT NULL as has_final_data,
  -- Voir le contenu de final_data s'il existe
  structured_data->'final_data' as final_data_content
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 3. Chercher les données de salaire dans TOUS les chemins possibles
SELECT 
  'RECHERCHE SALAIRES' as info,
  id,
  created_at,
  -- Chercher dans tous les chemins imaginables
  structured_data->>'salary_bruto' as path1,
  structured_data->>'salary_liquido' as path2,
  structured_data->>'gross_salary' as path3,
  structured_data->>'net_salary' as path4,
  structured_data->>'salario_bruto' as path5,
  structured_data->>'salario_liquido' as path6,
  structured_data->>'bruto' as path7,
  structured_data->>'liquido' as path8,
  -- Chercher dans final_data
  structured_data->'final_data'->>'salary_bruto' as final_path1,
  structured_data->'final_data'->>'salary_liquido' as final_path2,
  structured_data->'final_data'->>'gross_salary' as final_path3,
  structured_data->'final_data'->>'net_salary' as final_path4,
  structured_data->'final_data'->>'salario_bruto' as final_path5,
  structured_data->'final_data'->>'salario_liquido' as final_path6,
  -- Chercher dans d'autres sections possibles
  structured_data->'analysis_result'->>'salary_bruto' as analysis_path1,
  structured_data->'analysis_result'->>'salary_liquido' as analysis_path2,
  structured_data->'ocr_result'->>'salary_bruto' as ocr_path1,
  structured_data->'ocr_result'->>'salary_liquido' as ocr_path2,
  -- Vérifier les colonnes directes
  salario_bruto as direct_salario_bruto,
  salario_liquido as direct_salario_liquido
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 4. Vérifier si les données sont dans une autre table
SELECT 
  'VÉRIFICATION AUTRES TABLES' as info,
  h.id as holerite_id,
  h.created_at,
  -- Vérifier scan_results
  (SELECT COUNT(*) FROM public.scan_results WHERE user_id = h.user_id AND created_at::date = h.created_at::date) as scan_results_count,
  -- Vérifier ocr_results
  (SELECT COUNT(*) FROM public.ocr_results WHERE holerite_id = h.id) as ocr_results_count,
  -- Vérifier analyses
  (SELECT COUNT(*) FROM public.analyses WHERE holerite_id = h.id) as analyses_count
FROM public.holerites h
ORDER BY h.created_at DESC 
LIMIT 3;

-- 5. Vérifier le contenu de scan_results pour le même utilisateur
SELECT 
  'CONTENU SCAN_RESULTS' as info,
  user_id,
  created_at,
  file_name,
  -- Voir le contenu de structured_data dans scan_results
  structured_data as scan_structured_data,
  -- Chercher les salaires dans scan_results
  structured_data->>'salary_bruto' as scan_salary_bruto,
  structured_data->>'salary_liquido' as scan_salary_liquido,
  structured_data->>'gross_salary' as scan_gross_salary,
  structured_data->>'net_salary' as scan_net_salary
FROM public.scan_results 
ORDER BY created_at DESC 
LIMIT 3; 