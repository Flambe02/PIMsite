-- Correction définitive de l'extraction des données
-- À exécuter dans Supabase Dashboard

-- 1. D'abord, analyser la structure exacte des données
SELECT 
  'ANALYSE STRUCTURE' as info,
  id,
  created_at,
  -- Voir la structure complète de structured_data
  structured_data->'final_data' as final_data,
  structured_data->'analysis_result' as analysis_result,
  -- Vérifier les chemins exacts
  structured_data->'final_data'->>'salario_bruto' as path_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as path_salario_liquido,
  structured_data->'final_data'->>'gross_salary' as path_gross_salary,
  structured_data->'final_data'->>'net_salary' as path_net_salary,
  -- Vérifier s'il y a des objets avec 'valor'
  structured_data->'final_data'->'salario_bruto' as obj_salario_bruto,
  structured_data->'final_data'->'salario_liquido' as obj_salario_liquido
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 3;

-- 2. Créer une fonction d'extraction robuste
CREATE OR REPLACE FUNCTION extract_salary_robust(json_data jsonb, field_name text) 
RETURNS text AS $$
DECLARE
  extracted_value text;
  obj_value jsonb;
BEGIN
  -- Essayer d'abord le chemin direct
  extracted_value := json_data->'final_data'->>field_name;
  
  -- Si c'est un objet avec 'valor', extraire la valeur
  IF extracted_value IS NULL THEN
    obj_value := json_data->'final_data'->field_name;
    IF obj_value IS NOT NULL AND jsonb_typeof(obj_value) = 'object' THEN
      extracted_value := obj_value->>'valor';
      IF extracted_value IS NULL THEN
        extracted_value := obj_value->>'value';
      END IF;
    END IF;
  END IF;
  
  -- Essayer les chemins alternatifs
  IF extracted_value IS NULL THEN
    IF field_name = 'salario_bruto' THEN
      extracted_value := COALESCE(
        json_data->'final_data'->>'gross_salary',
        json_data->>'salario_bruto',
        json_data->>'gross_salary',
        json_data->'final_data'->>'salario_bruto_total',
        json_data->'final_data'->>'total_gross_salary'
      );
    ELSIF field_name = 'salario_liquido' THEN
      extracted_value := COALESCE(
        json_data->'final_data'->>'net_salary',
        json_data->>'salario_liquido',
        json_data->>'net_salary',
        json_data->'final_data'->>'salario_liquido_total',
        json_data->'final_data'->>'total_net_salary'
      );
    END IF;
  END IF;
  
  -- Nettoyer et valider la valeur
  IF extracted_value IS NOT NULL AND extracted_value != '' THEN
    -- Enlever les caractères non numériques sauf point et virgule
    extracted_value := regexp_replace(extracted_value, '[^\d.,]', '', 'g');
    -- Remplacer virgule par point
    extracted_value := replace(extracted_value, ',', '.');
    -- Vérifier que c'est un nombre valide
    IF extracted_value ~ '^[0-9]+\.?[0-9]*$' THEN
      RETURN extracted_value;
    END IF;
  END IF;
  
  RETURN '0.00';
END;
$$ LANGUAGE plpgsql;

-- 3. Tester la fonction d'extraction
SELECT 
  'TEST EXTRACTION' as info,
  id,
  extract_salary_robust(structured_data, 'salario_bruto') as extracted_salario_bruto,
  extract_salary_robust(structured_data, 'salario_liquido') as extracted_salario_liquido,
  structured_data->'final_data'->>'descontos' as extracted_descontos
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Mettre à jour les colonnes directes avec les valeurs extraites
UPDATE public.holerites 
SET 
  salario_bruto = extract_salary_robust(structured_data, 'salario_bruto'),
  salario_liquido = extract_salary_robust(structured_data, 'salario_liquido')
WHERE structured_data IS NOT NULL 
  AND (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00')
  AND (salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00');

-- 5. Vérifier les résultats
SELECT 
  'RÉSULTATS APRÈS CORRECTION' as info,
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  structured_data->'final_data'->>'descontos' as descontos,
  CASE 
    WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 'OK'
    ELSE 'PROBLÈME'
  END as salario_bruto_status,
  CASE 
    WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 'OK'
    ELSE 'PROBLÈME'
  END as salario_liquido_status
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS extract_salary_robust(jsonb, text); 