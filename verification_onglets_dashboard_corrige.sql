-- Vérification des données pour les onglets du dashboard (CORRIGÉ)
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier les données du dernier holerite scanné
SELECT 
  'DERNIER HOLERITE' as info,
  id,
  created_at,
  nome,
  empresa,
  salario_bruto,
  salario_liquido,
  -- Vérifier les données dans structured_data
  structured_data->>'beneficios' as beneficios_extraits,
  structured_data->>'seguros' as seguros_extraits,
  structured_data->>'credito' as credito_extraits,
  structured_data->>'outros' as outros_extraits,
  -- Vérifier les données dans final_data
  structured_data->'final_data'->>'beneficios' as beneficios_final_data,
  structured_data->'final_data'->>'seguros' as seguros_final_data,
  -- Vérifier les données dans analysis_result
  structured_data->'analysis_result'->>'beneficios' as beneficios_analysis,
  structured_data->'analysis_result'->>'seguros' as seguros_analysis
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 1;

-- 2. Vérifier les données dans la table beneficios_usuario (CORRIGÉ)
SELECT 
  'BENEFICIOS USUARIO' as info,
  user_id,
  tipo,
  ativo
FROM public.beneficios_usuario 
ORDER BY user_id DESC 
LIMIT 10;

-- 3. Vérifier les données dans la table seguros
SELECT 
  'SEGUROS' as info,
  user_id,
  type,
  detected,
  comment
FROM public.seguros 
ORDER BY user_id DESC 
LIMIT 10;

-- 4. Vérifier les données dans la table investimentos
SELECT 
  'INVESTIMENTOS' as info,
  user_id,
  tipo,
  valor
FROM public.investimentos 
ORDER BY user_id DESC 
LIMIT 10;

-- 5. Vérifier la structure complète des données extraites
SELECT 
  'STRUCTURE COMPLÈTE' as info,
  id,
  created_at,
  -- Voir tout le contenu de structured_data
  structured_data,
  -- Vérifier les clés disponibles
  jsonb_object_keys(structured_data) as cles_disponibles
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 1; 