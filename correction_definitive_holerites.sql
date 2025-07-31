-- Script de correction définitive des données holerites
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier l'état actuel des données
SELECT 
  'État actuel' as info,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok,
  COUNT(CASE WHEN structured_data IS NOT NULL THEN 1 END) as has_structured_data
FROM public.holerites;

-- 2. Analyser la structure des données dans structured_data
SELECT 
  id,
  created_at,
  salario_bruto as current_salario_bruto,
  salario_liquido as current_salario_liquido,
  structured_data->'final_data'->>'salario_bruto' as final_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as final_salario_liquido,
  structured_data->>'salario_bruto' as direct_structured_salario_bruto,
  structured_data->>'salario_liquido' as direct_structured_salario_liquido,
  structured_data->>'gross_salary' as gross_salary,
  structured_data->>'net_salary' as net_salary
FROM public.holerites 
WHERE structured_data IS NOT NULL
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Fonction pour extraire les valeurs numériques de manière robuste
CREATE OR REPLACE FUNCTION extract_numeric_value(json_data jsonb, path text) 
RETURNS text AS $$
DECLARE
  value text;
  numeric_value text;
BEGIN
  -- Extraire la valeur depuis le chemin JSON
  value := json_data #>> string_to_array(path, '.');
  
  -- Si la valeur est NULL ou vide, retourner NULL
  IF value IS NULL OR value = '' THEN
    RETURN NULL;
  END IF;
  
  -- Si c'est un objet JSON avec propriété 'valor'
  IF value LIKE '%"valor"%' THEN
    BEGIN
      numeric_value := (value::jsonb ->> 'valor');
      IF numeric_value IS NOT NULL AND numeric_value != '' THEN
        RETURN numeric_value;
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;
  END IF;
  
  -- Si c'est un objet JSON avec propriété 'value'
  IF value LIKE '%"value"%' THEN
    BEGIN
      numeric_value := (value::jsonb ->> 'value');
      IF numeric_value IS NOT NULL AND numeric_value != '' THEN
        RETURN numeric_value;
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;
  END IF;
  
  -- Si c'est déjà une valeur numérique
  IF value ~ '^[0-9]+\.?[0-9]*$' THEN
    RETURN value;
  END IF;
  
  -- Essayer de nettoyer la valeur (enlever caractères non numériques)
  numeric_value := regexp_replace(value, '[^\d.,]', '', 'g');
  numeric_value := replace(numeric_value, ',', '.');
  
  IF numeric_value ~ '^[0-9]+\.?[0-9]*$' THEN
    RETURN numeric_value;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. Extraire et corriger les données avec la fonction robuste
UPDATE public.holerites 
SET salario_bruto = COALESCE(
  -- Essayer d'extraire depuis final_data.salario_bruto
  extract_numeric_value(structured_data, 'final_data.salario_bruto'),
  -- Essayer d'extraire depuis final_data.gross_salary
  extract_numeric_value(structured_data, 'final_data.gross_salary'),
  -- Essayer d'extraire depuis salario_bruto direct
  extract_numeric_value(structured_data, 'salario_bruto'),
  -- Essayer d'extraire depuis gross_salary direct
  extract_numeric_value(structured_data, 'gross_salary'),
  -- Essayer d'extraire depuis salario_bruto_total
  extract_numeric_value(structured_data, 'salario_bruto_total'),
  -- Essayer d'extraire depuis total_gross_salary
  extract_numeric_value(structured_data, 'total_gross_salary'),
  -- Valeur par défaut
  '0.00'
)
WHERE structured_data IS NOT NULL 
  AND (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00');

UPDATE public.holerites 
SET salario_liquido = COALESCE(
  -- Essayer d'extraire depuis final_data.salario_liquido
  extract_numeric_value(structured_data, 'final_data.salario_liquido'),
  -- Essayer d'extraire depuis final_data.net_salary
  extract_numeric_value(structured_data, 'final_data.net_salary'),
  -- Essayer d'extraire depuis salario_liquido direct
  extract_numeric_value(structured_data, 'salario_liquido'),
  -- Essayer d'extraire depuis net_salary direct
  extract_numeric_value(structured_data, 'net_salary'),
  -- Essayer d'extraire depuis salario_liquido_total
  extract_numeric_value(structured_data, 'salario_liquido_total'),
  -- Essayer d'extraire depuis total_net_salary
  extract_numeric_value(structured_data, 'total_net_salary'),
  -- Valeur par défaut
  '0.00'
)
WHERE structured_data IS NOT NULL 
  AND (salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00');

-- 5. Vérifier les résultats après correction
SELECT 
  'Après correction' as info,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 6. Afficher quelques exemples de données corrigées
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  period,
  CASE 
    WHEN salario_bruto ~ '^[0-9]+\.?[0-9]*$' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 'EXTRACTED'
    WHEN salario_bruto = '0' OR salario_bruto = '0.00' THEN 'ZERO'
    ELSE 'INVALID'
  END as salario_bruto_status,
  CASE 
    WHEN salario_liquido ~ '^[0-9]+\.?[0-9]*$' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 'EXTRACTED'
    WHEN salario_liquido = '0' OR salario_liquido = '0.00' THEN 'ZERO'
    ELSE 'INVALID'
  END as salario_liquido_status
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 10;

-- 7. Identifier les holerites qui n'ont toujours pas de données valides
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  structured_data IS NOT NULL as has_structured_data,
  structured_data->>'final_data' IS NOT NULL as has_final_data
FROM public.holerites 
WHERE (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00')
   OR (salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00')
ORDER BY created_at DESC;

-- 8. Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS extract_numeric_value(jsonb, text); 