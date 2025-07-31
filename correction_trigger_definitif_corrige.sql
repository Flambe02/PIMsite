-- Correction définitive du trigger pour les nouveaux holerites (VERSION CORRIGÉE)
-- À exécuter dans Supabase Dashboard

-- 1. Supprimer les anciens triggers
DROP TRIGGER IF EXISTS trigger_extract_holerite_data ON public.holerites;
DROP TRIGGER IF EXISTS trigger_extract_holerite_data_robust ON public.holerites;
DROP TRIGGER IF EXISTS trigger_extract_holerite_data_definitive ON public.holerites;
DROP FUNCTION IF EXISTS extract_holerite_data_robust();
DROP FUNCTION IF EXISTS extract_holerite_data_definitive();
DROP FUNCTION IF EXISTS extract_period_from_structured_data();

-- 2. Créer d'abord la fonction d'extraction séparée
CREATE OR REPLACE FUNCTION extract_numeric_from_json_standalone(json_data jsonb, field_name text) 
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

-- 3. Créer la fonction principale du trigger
CREATE OR REPLACE FUNCTION extract_holerite_data_definitive()
RETURNS TRIGGER AS $$
DECLARE
  extracted_value text;
BEGIN
  -- Extraire les données si structured_data est présent
  IF NEW.structured_data IS NOT NULL THEN
    -- Extraire salario_bruto
    extracted_value := extract_numeric_from_json_standalone(NEW.structured_data, 'salario_bruto');
    IF extracted_value IS NOT NULL AND extracted_value != '0.00' THEN
      NEW.salario_bruto := extracted_value;
    END IF;
    
    -- Extraire salario_liquido
    extracted_value := extract_numeric_from_json_standalone(NEW.structured_data, 'salario_liquido');
    IF extracted_value IS NOT NULL AND extracted_value != '0.00' THEN
      NEW.salario_liquido := extracted_value;
    END IF;
    
    -- Extraire period
    NEW.period := COALESCE(
      NEW.structured_data->'final_data'->>'period',
      NEW.structured_data->>'period',
      to_char(NEW.created_at, 'MM/YYYY')
    );
    
    -- Extraire nome (employee_name)
    NEW.nome := COALESCE(
      NEW.structured_data->'final_data'->>'employee_name',
      NEW.structured_data->>'employee_name',
      NEW.structured_data->'final_data'->>'nome',
      NEW.structured_data->>'nome'
    );
    
    -- Extraire empresa (company_name)
    NEW.empresa := COALESCE(
      NEW.structured_data->'final_data'->>'company_name',
      NEW.structured_data->>'company_name',
      NEW.structured_data->'final_data'->>'empresa',
      NEW.structured_data->>'empresa'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer le trigger
CREATE TRIGGER trigger_extract_holerite_data_definitive
  BEFORE INSERT OR UPDATE ON public.holerites
  FOR EACH ROW
  EXECUTE FUNCTION extract_holerite_data_definitive();

-- 5. Tester le trigger avec un holerite de test
INSERT INTO public.holerites (
  user_id,
  structured_data,
  created_at
) VALUES (
  (SELECT user_id FROM public.holerites ORDER BY created_at DESC LIMIT 1),
  '{
    "final_data": {
      "salario_bruto": "15000",
      "salario_liquido": "12000",
      "descontos": "3000",
      "employee_name": "Test Employee",
      "company_name": "Test Company",
      "period": "12/2024"
    },
    "analysis_result": {
      "recommendations": {
        "recommendations": [
          {
            "description": "Test recommendation"
          }
        ],
        "score_optimisation": 85
      }
    }
  }'::jsonb,
  NOW()
) RETURNING id, salario_bruto, salario_liquido, period, nome, empresa;

-- 6. Vérifier que le trigger a fonctionné
SELECT 
  'TEST TRIGGER' as info,
  id,
  salario_bruto,
  salario_liquido,
  period,
  nome,
  empresa,
  CASE 
    WHEN salario_bruto = '15000' THEN 'TRIGGER_OK'
    ELSE 'TRIGGER_FAILED'
  END as trigger_status
FROM public.holerites 
WHERE id = (SELECT id FROM public.holerites ORDER BY created_at DESC LIMIT 1);

-- 7. Nettoyer le test
DELETE FROM public.holerites 
WHERE id = (SELECT id FROM public.holerites ORDER BY created_at DESC LIMIT 1); 