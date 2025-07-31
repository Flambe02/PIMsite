-- Test du processus de scan complet
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier que le trigger fonctionne pour les nouveaux holerites
-- Simuler l'insertion d'un nouveau holerite avec structured_data

-- D'abord, créer un test holerite
INSERT INTO public.holerites (
  user_id,
  structured_data,
  created_at
) VALUES (
  (SELECT user_id FROM public.holerites ORDER BY created_at DESC LIMIT 1),
  '{
    "final_data": {
      "salario_bruto": "25000",
      "salario_liquido": "20000", 
      "descontos": "5000",
      "employee_name": "Test Employee",
      "company_name": "Test Company",
      "period": "12/2024"
    },
    "analysis_result": {
      "recommendations": {
        "recommendations": [
          {
            "description": "Test recommendation 1",
            "category": "salary"
          },
          {
            "description": "Test recommendation 2", 
            "category": "benefits"
          }
        ],
        "score_optimisation": 90
      }
    }
  }'::jsonb,
  NOW()
) RETURNING id, salario_bruto, salario_liquido, period, nome, empresa;

-- 2. Vérifier que le trigger a bien extrait les données
SELECT 
  'APRÈS INSERTION' as test_phase,
  id,
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
  structured_data->'final_data'->>'salario_bruto' as structured_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as structured_salario_liquido,
  structured_data->'analysis_result'->'recommendations'->>'score_optimisation' as ai_score,
  CASE 
    WHEN salario_bruto = '25000' THEN 'TRIGGER_OK'
    ELSE 'TRIGGER_FAILED'
  END as trigger_status
FROM public.holerites 
WHERE id = (SELECT id FROM public.holerites ORDER BY created_at DESC LIMIT 1);

-- 3. Simuler une mise à jour pour tester le trigger UPDATE
UPDATE public.holerites 
SET structured_data = structured_data
WHERE id = (SELECT id FROM public.holerites ORDER BY created_at DESC LIMIT 1);

-- 4. Vérifier après mise à jour
SELECT 
  'APRÈS UPDATE' as test_phase,
  id,
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
  CASE 
    WHEN salario_bruto = '25000' THEN 'TRIGGER_OK'
    ELSE 'TRIGGER_FAILED'
  END as trigger_status
FROM public.holerites 
WHERE id = (SELECT id FROM public.holerites ORDER BY created_at DESC LIMIT 1);

-- 5. Nettoyer le test
DELETE FROM public.holerites 
WHERE id = (SELECT id FROM public.holerites ORDER BY created_at DESC LIMIT 1);

-- 6. Vérifier l'état final
SELECT 
  'ÉTAT FINAL' as info,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites; 