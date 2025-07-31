-- Script pour corriger les valeurs de salaire
-- À exécuter dans Supabase Dashboard

-- 1. Voir les holerites avec salaire à 0
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  structured_data->>'salario_bruto' as salario_bruto_from_data,
  structured_data->>'gross_salary' as gross_salary_from_data,
  structured_data->>'salario_bruto_total' as salario_bruto_total_from_data
FROM public.holerites 
WHERE (salario_bruto = 0 OR salario_bruto IS NULL) 
  AND structured_data IS NOT NULL
ORDER BY created_at DESC;

-- 2. Mettre à jour les salaires depuis structured_data
UPDATE public.holerites 
SET salario_bruto = COALESCE(
  NULLIF(structured_data->>'salario_bruto', '')::decimal,
  NULLIF(structured_data->>'gross_salary', '')::decimal,
  NULLIF(structured_data->>'salario_bruto_total', '')::decimal,
  0
)
WHERE (salario_bruto = 0 OR salario_bruto IS NULL) 
  AND structured_data IS NOT NULL;

UPDATE public.holerites 
SET salario_liquido = COALESCE(
  NULLIF(structured_data->>'salario_liquido', '')::decimal,
  NULLIF(structured_data->>'net_salary', '')::decimal,
  NULLIF(structured_data->>'salario_liquido_total', '')::decimal,
  0
)
WHERE (salario_liquido = 0 OR salario_liquido IS NULL) 
  AND structured_data IS NOT NULL;

-- 3. Vérification finale
SELECT 
  'Salaires corrigés' as status,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN salario_bruto > 0 THEN 1 END) as holerites_with_salary,
  COUNT(CASE WHEN salario_bruto = 0 OR salario_bruto IS NULL THEN 1 END) as holerites_without_salary,
  AVG(salario_bruto) as avg_salary
FROM public.holerites;

-- 4. Afficher quelques exemples
SELECT 
  id,
  created_at,
  period,
  salario_bruto,
  salario_liquido
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 10; 