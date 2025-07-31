-- Test du pipeline complet : Scan → Analyse IA → Sauvegarde → Affichage
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier l'état général de la table holerites
SELECT 
  'État général' as info,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN structured_data IS NOT NULL THEN 1 END) as avec_structured_data,
  COUNT(CASE WHEN structured_data->>'final_data' IS NOT NULL THEN 1 END) as avec_final_data,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 2. Analyser les 5 derniers holerites uploadés
SELECT 
  id,
  created_at,
  user_id,
  -- Colonnes directes
  salario_bruto as direct_salario_bruto,
  salario_liquido as direct_salario_liquido,
  period,
  nome,
  empresa,
  -- Vérifier structured_data
  structured_data IS NOT NULL as has_structured_data,
  structured_data->>'final_data' IS NOT NULL as has_final_data,
  -- Extraire les valeurs depuis structured_data
  structured_data->'final_data'->>'salario_bruto' as structured_final_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as structured_final_salario_liquido,
  structured_data->>'salario_bruto' as structured_direct_salario_bruto,
  structured_data->>'salario_liquido' as structured_direct_salario_liquido,
  -- Vérifier les recommandations IA
  structured_data->'analysis_result'->>'recommendations' IS NOT NULL as has_ai_recommendations,
  structured_data->'recommendations'->>'recommendations' IS NOT NULL as has_old_recommendations,
  -- Vérifier les descontos
  structured_data->'final_data'->>'descontos' as structured_descontos,
  -- Statut des données
  CASE 
    WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 'OK'
    WHEN structured_data->'final_data'->>'salario_bruto' IS NOT NULL THEN 'STRUCTURED_ONLY'
    ELSE 'MISSING'
  END as salario_bruto_status,
  CASE 
    WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 'OK'
    WHEN structured_data->'final_data'->>'salario_liquido' IS NOT NULL THEN 'STRUCTURED_ONLY'
    ELSE 'MISSING'
  END as salario_liquido_status
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Vérifier les triggers existants
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'holerites';

-- 4. Vérifier les fonctions d'extraction
SELECT 
  routine_name,
  routine_type,
  routine_definition IS NOT NULL as has_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%extract%' 
  OR routine_name LIKE '%holerite%'
  OR routine_name LIKE '%salary%';

-- 5. Test de simulation d'un nouveau holerite
-- (Ceci simule ce qui se passe lors d'un scan)
WITH test_data AS (
  SELECT 
    'test-scan-' || EXTRACT(EPOCH FROM NOW())::text as test_id,
    '{"final_data": {"salario_bruto": "15000", "salario_liquido": "12000", "descontos": "3000", "employee_name": "Test User", "company_name": "Test Company", "period": "12/2024"}, "analysis_result": {"recommendations": {"recommendations": [{"description": "Test recommendation"}], "score_optimisation": 85}}}'::jsonb as test_structured_data
)
SELECT 
  'SIMULATION NOUVEAU HOLERITE' as test_type,
  test_id,
  test_structured_data->'final_data'->>'salario_bruto' as simulated_salario_bruto,
  test_structured_data->'final_data'->>'salario_liquido' as simulated_salario_liquido,
  test_structured_data->'final_data'->>'descontos' as simulated_descontos,
  test_structured_data->'analysis_result'->'recommendations'->>'score_optimisation' as simulated_score,
  test_structured_data->'final_data'->>'employee_name' as simulated_employee_name,
  test_structured_data->'final_data'->>'company_name' as simulated_company_name
FROM test_data;

-- 6. Vérifier les RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'holerites';

-- 7. Statistiques par utilisateur
SELECT 
  user_id,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN structured_data IS NOT NULL THEN 1 END) as avec_structured_data,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok,
  MAX(created_at) as dernier_upload
FROM public.holerites 
GROUP BY user_id 
ORDER BY dernier_upload DESC; 