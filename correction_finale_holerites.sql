-- Script de correction finale des données holerites
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier la structure actuelle des données
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  structured_data IS NOT NULL as has_structured_data,
  structured_data->>'final_data' IS NOT NULL as has_final_data,
  structured_data->'final_data'->>'salario_bruto' as final_salario_bruto,
  structured_data->'final_data'->>'salario_liquido' as final_salario_liquido,
  structured_data->>'salario_bruto' as direct_structured_salario_bruto,
  structured_data->>'salario_liquido' as direct_structured_salario_liquido
FROM public.holerites 
WHERE structured_data IS NOT NULL
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Extraire et corriger les données avec une approche robuste
UPDATE public.holerites 
SET salario_bruto = CASE
  -- Si la colonne directe est vide ou 0, extraire depuis structured_data
  WHEN salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00' THEN
    COALESCE(
      -- Essayer d'extraire depuis final_data
      CASE 
        WHEN structured_data->'final_data'->>'salario_bruto' ~ '^[0-9]+\.?[0-9]*$' 
        THEN (structured_data->'final_data'->>'salario_bruto')::decimal
        ELSE NULL
      END,
      -- Essayer d'extraire depuis final_data.gross_salary
      CASE 
        WHEN structured_data->'final_data'->>'gross_salary' ~ '^[0-9]+\.?[0-9]*$' 
        THEN (structured_data->'final_data'->>'gross_salary')::decimal
        ELSE NULL
      END,
      -- Essayer d'extraire depuis structured_data direct
      CASE 
        WHEN structured_data->>'salario_bruto' ~ '^[0-9]+\.?[0-9]*$' 
        THEN (structured_data->>'salario_bruto')::decimal
        ELSE NULL
      END,
      -- Essayer d'extraire depuis gross_salary direct
      CASE 
        WHEN structured_data->>'gross_salary' ~ '^[0-9]+\.?[0-9]*$' 
        THEN (structured_data->>'gross_salary')::decimal
        ELSE NULL
      END,
      -- Essayer d'extraire depuis un objet JSON avec 'valor'
      CASE 
        WHEN structured_data->>'salario_bruto' LIKE '%"valor"%' 
        THEN (structured_data->'salario_bruto'->>'valor')::decimal
        ELSE NULL
      END,
      -- Valeur par défaut
      '0.00'
    )
  ELSE salario_bruto
END
WHERE structured_data IS NOT NULL;

UPDATE public.holerites 
SET salario_liquido = CASE
  -- Si la colonne directe est vide ou 0, extraire depuis structured_data
  WHEN salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00' THEN
    COALESCE(
      -- Essayer d'extraire depuis final_data
      CASE 
        WHEN structured_data->'final_data'->>'salario_liquido' ~ '^[0-9]+\.?[0-9]*$' 
        THEN (structured_data->'final_data'->>'salario_liquido')::decimal
        ELSE NULL
      END,
      -- Essayer d'extraire depuis final_data.net_salary
      CASE 
        WHEN structured_data->'final_data'->>'net_salary' ~ '^[0-9]+\.?[0-9]*$' 
        THEN (structured_data->'final_data'->>'net_salary')::decimal
        ELSE NULL
      END,
      -- Essayer d'extraire depuis structured_data direct
      CASE 
        WHEN structured_data->>'salario_liquido' ~ '^[0-9]+\.?[0-9]*$' 
        THEN (structured_data->>'salario_liquido')::decimal
        ELSE NULL
      END,
      -- Essayer d'extraire depuis net_salary direct
      CASE 
        WHEN structured_data->>'net_salary' ~ '^[0-9]+\.?[0-9]*$' 
        THEN (structured_data->>'net_salary')::decimal
        ELSE NULL
      END,
      -- Essayer d'extraire depuis un objet JSON avec 'valor'
      CASE 
        WHEN structured_data->>'salario_liquido' LIKE '%"valor"%' 
        THEN (structured_data->'salario_liquido'->>'valor')::decimal
        ELSE NULL
      END,
      -- Valeur par défaut
      '0.00'
    )
  ELSE salario_liquido
END
WHERE structured_data IS NOT NULL;

-- 3. Vérifier les résultats après correction
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
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

-- 4. Statistiques finales
SELECT 
  'salario_bruto' as field,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_bruto ~ '^[0-9]+\.?[0-9]*$' AND salario_bruto != '0' AND salario_bruto != '0.00' THEN 1 END) as extracted_values,
  COUNT(CASE WHEN salario_bruto = '0' OR salario_bruto = '0.00' THEN 1 END) as zero_values,
  COUNT(CASE WHEN salario_bruto IS NULL OR salario_bruto = '' THEN 1 END) as null_values
FROM public.holerites
UNION ALL
SELECT 
  'salario_liquido' as field,
  COUNT(*) as total_records,
  COUNT(CASE WHEN salario_liquido ~ '^[0-9]+\.?[0-9]*$' AND salario_liquido != '0' AND salario_liquido != '0.00' THEN 1 END) as extracted_values,
  COUNT(CASE WHEN salario_liquido = '0' OR salario_liquido = '0.00' THEN 1 END) as zero_values,
  COUNT(CASE WHEN salario_liquido IS NULL OR salario_liquido = '' THEN 1 END) as null_values
FROM public.holerites;

-- 5. Identifier les holerites qui n'ont toujours pas de données valides
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