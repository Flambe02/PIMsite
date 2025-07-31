-- Script de vérification et correction du trigger d'extraction
-- À exécuter dans Supabase Dashboard

-- 1. Vérifier si le trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'holerites';

-- 2. Vérifier si la fonction d'extraction existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%extract%' 
  OR routine_name LIKE '%period%'
  OR routine_name LIKE '%holerite%';

-- 3. Créer ou recréer la fonction d'extraction
CREATE OR REPLACE FUNCTION extract_period_from_structured_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Extraire la période
  NEW.period = COALESCE(
    NEW.structured_data->>'period',
    NEW.structured_data->>'periodo',
    NEW.structured_data->>'mes_referencia',
    NEW.structured_data->>'month_reference',
    TO_CHAR(NEW.created_at, 'MM/YYYY')
  );
  
  -- Extraire le nom
  NEW.nome = COALESCE(
    NEW.structured_data->>'employee_name',
    NEW.structured_data->>'nome',
    NEW.structured_data->>'name'
  );
  
  -- Extraire l'entreprise
  NEW.empresa = COALESCE(
    NEW.structured_data->>'company_name',
    NEW.structured_data->>'empresa',
    NEW.structured_data->>'company'
  );
  
  -- Extraire le salario_bruto
  NEW.salario_bruto = COALESCE(
    NEW.structured_data->'final_data'->>'salario_bruto',
    NEW.structured_data->>'salario_bruto',
    NEW.structured_data->>'gross_salary',
    '0.00'
  );
  
  -- Extraire le salario_liquido
  NEW.salario_liquido = COALESCE(
    NEW.structured_data->'final_data'->>'salario_liquido',
    NEW.structured_data->>'salario_liquido',
    NEW.structured_data->>'net_salary',
    '0.00'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer ou recréer le trigger
DROP TRIGGER IF EXISTS trigger_extract_holerite_data ON public.holerites;

CREATE TRIGGER trigger_extract_holerite_data
  BEFORE INSERT OR UPDATE ON public.holerites
  FOR EACH ROW
  EXECUTE FUNCTION extract_period_from_structured_data();

-- 5. Tester le trigger sur un enregistrement existant
-- (Simuler une mise à jour pour déclencher l'extraction)
UPDATE public.holerites 
SET structured_data = structured_data
WHERE structured_data IS NOT NULL
  AND (salario_bruto IS NULL OR salario_bruto = '' OR salario_bruto = '0' OR salario_bruto = '0.00'
    OR salario_liquido IS NULL OR salario_liquido = '' OR salario_liquido = '0' OR salario_liquido = '0.00');

-- 6. Vérifier les résultats après déclenchement du trigger
SELECT 
  id,
  created_at,
  salario_bruto,
  salario_liquido,
  nome,
  empresa,
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

-- 7. Statistiques finales
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