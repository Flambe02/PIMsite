-- Script de correction des types de données holerites
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier les types actuels
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'holerites' 
  AND column_name IN ('salario_bruto', 'salario_liquido');

-- 2. Vérifier les données avant conversion
SELECT 
  'salario_bruto' as column_name,
  COUNT(*) as total,
  COUNT(CASE WHEN salario_bruto IS NULL THEN 1 END) as null_count,
  COUNT(CASE WHEN salario_bruto = '' THEN 1 END) as empty_count,
  COUNT(CASE WHEN salario_bruto ~ '^[0-9]+\.?[0-9]*$' THEN 1 END) as numeric_count,
  COUNT(CASE WHEN salario_bruto !~ '^[0-9]+\.?[0-9]*$' AND salario_bruto IS NOT NULL AND salario_bruto != '' THEN 1 END) as non_numeric_count
FROM public.holerites
UNION ALL
SELECT 
  'salario_liquido' as column_name,
  COUNT(*) as total,
  COUNT(CASE WHEN salario_liquido IS NULL THEN 1 END) as null_count,
  COUNT(CASE WHEN salario_liquido = '' THEN 1 END) as empty_count,
  COUNT(CASE WHEN salario_liquido ~ '^[0-9]+\.?[0-9]*$' THEN 1 END) as numeric_count,
  COUNT(CASE WHEN salario_liquido !~ '^[0-9]+\.?[0-9]*$' AND salario_liquido IS NOT NULL AND salario_liquido != '' THEN 1 END) as non_numeric_count
FROM public.holerites;

-- 3. Nettoyer et convertir les données (si les colonnes sont en text)
-- ATTENTION: Exécuter seulement si les colonnes sont de type text

-- Option A: Convertir en decimal (recommandé)
-- ALTER TABLE public.holerites 
-- ALTER COLUMN salario_bruto TYPE decimal(10,2) 
-- USING CASE 
--   WHEN salario_bruto IS NULL OR salario_bruto = '' THEN NULL
--   WHEN salario_bruto ~ '^[0-9]+\.?[0-9]*$' THEN salario_bruto::decimal(10,2)
--   ELSE NULL
-- END;

-- ALTER TABLE public.holerites 
-- ALTER COLUMN salario_liquido TYPE decimal(10,2) 
-- USING CASE 
--   WHEN salario_liquido IS NULL OR salario_liquido = '' THEN NULL
--   WHEN salario_liquido ~ '^[0-9]+\.?[0-9]*$' THEN salario_liquido::decimal(10,2)
--   ELSE NULL
-- END;

-- Option B: Mettre à jour les valeurs vides avec des valeurs par défaut
UPDATE public.holerites 
SET salario_bruto = '0.00'
WHERE salario_bruto IS NULL OR salario_bruto = '';

UPDATE public.holerites 
SET salario_liquido = '0.00'
WHERE salario_liquido IS NULL OR salario_liquido = '';

-- 4. Vérifier les données après nettoyage
SELECT 
  'salario_bruto' as column_name,
  COUNT(*) as total,
  COUNT(CASE WHEN salario_bruto IS NULL THEN 1 END) as null_count,
  COUNT(CASE WHEN salario_bruto = '' THEN 1 END) as empty_count,
  COUNT(CASE WHEN salario_bruto = '0.00' THEN 1 END) as zero_count,
  COUNT(CASE WHEN salario_bruto ~ '^[0-9]+\.?[0-9]*$' THEN 1 END) as numeric_count
FROM public.holerites
UNION ALL
SELECT 
  'salario_liquido' as column_name,
  COUNT(*) as total,
  COUNT(CASE WHEN salario_liquido IS NULL THEN 1 END) as null_count,
  COUNT(CASE WHEN salario_liquido = '' THEN 1 END) as empty_count,
  COUNT(CASE WHEN salario_liquido = '0.00' THEN 1 END) as zero_count,
  COUNT(CASE WHEN salario_liquido ~ '^[0-9]+\.?[0-9]*$' THEN 1 END) as numeric_count
FROM public.holerites;

-- 5. Afficher quelques exemples de données nettoyées
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  CASE 
    WHEN salario_bruto ~ '^[0-9]+\.?[0-9]*$' THEN 'VALID'
    ELSE 'INVALID'
  END as salario_bruto_status,
  CASE 
    WHEN salario_liquido ~ '^[0-9]+\.?[0-9]*$' THEN 'VALID'
    ELSE 'INVALID'
  END as salario_liquido_status
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 10; 