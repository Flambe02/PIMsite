-- Script de correction spécifique pour l'affichage des salaires
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier l'état actuel des données
SELECT 
  'État actuel' as info,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 2. Fonction pour extraire les valeurs numériques de manière robuste
CREATE OR REPLACE FUNCTION extract_salary_value(json_data jsonb, field_name text) 
RETURNS text AS $$
DECLARE
  value text;
  numeric_value text;
BEGIN
  -- Essayer plusieurs chemins pour trouver la valeur
  value := COALESCE(
    json_data->'final_data'->>field_name,
    json_data->>field_name,
    json_data->>'gross_salary',
    json_data->>'net_salary',
    json_data->>(field_name || '_total'),
    json_data->>('total_' || field_name)
  );
  
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

-- 3. Mettre à jour les salaires avec la fonction robuste
UPDATE public.holerites 
SET salario_bruto = COALESCE(
  extract_salary_value(structured_data, 'salario_bruto'),
  '0.00'
)
WHERE structured_data IS NOT NULL 
  AND (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00');

UPDATE public.holerites 
SET salario_liquido = COALESCE(
  extract_salary_value(structured_data, 'salario_liquido'),
  '0.00'
)
WHERE structured_data IS NOT NULL 
  AND (salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00');

-- 4. Vérifier les résultats après correction
SELECT 
  'Après correction' as info,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_bruto IS NOT NULL AND salario_bruto != '' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as salario_bruto_ok,
  COUNT(CASE WHEN salario_liquido IS NOT NULL AND salario_liquido != '' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as salario_liquido_ok
FROM public.holerites;

-- 5. Afficher quelques exemples de données corrigées
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
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

-- 6. Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS extract_salary_value(jsonb, text); 