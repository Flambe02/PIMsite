-- Migration: Amélioration de la table holerites pour l'historique
-- Date: 2025-01-31
-- Description: Ajoute les colonnes manquantes et améliore la structure pour l'affichage de l'historique

-- Vérifier et ajouter la colonne period si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'holerites' 
    AND column_name = 'period'
  ) THEN
    ALTER TABLE public.holerites ADD COLUMN period text;
    COMMENT ON COLUMN public.holerites.period IS 'Période du holerite (ex: 01/2024)';
  END IF;
END $$;

-- Vérifier et ajouter la colonne nome si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'holerites' 
    AND column_name = 'nome'
  ) THEN
    ALTER TABLE public.holerites ADD COLUMN nome text;
    COMMENT ON COLUMN public.holerites.nome IS 'Nom de l''employé';
  END IF;
END $$;

-- Vérifier et ajouter la colonne empresa si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'holerites' 
    AND column_name = 'empresa'
  ) THEN
    ALTER TABLE public.holerites ADD COLUMN empresa text;
    COMMENT ON COLUMN public.holerites.empresa IS 'Nom de l''entreprise';
  END IF;
END $$;

-- Vérifier et ajouter la colonne salario_bruto si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'holerites' 
    AND column_name = 'salario_bruto'
  ) THEN
    ALTER TABLE public.holerites ADD COLUMN salario_bruto decimal(10,2);
    COMMENT ON COLUMN public.holerites.salario_bruto IS 'Salaire brut';
  END IF;
END $$;

-- Vérifier et ajouter la colonne salario_liquido si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'holerites' 
    AND column_name = 'salario_liquido'
  ) THEN
    ALTER TABLE public.holerites ADD COLUMN salario_liquido decimal(10,2);
    COMMENT ON COLUMN public.holerites.salario_liquido IS 'Salaire net';
  END IF;
END $$;

-- Vérifier et ajouter la colonne user_id si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'holerites' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.holerites ADD COLUMN user_id uuid REFERENCES auth.users(id);
    COMMENT ON COLUMN public.holerites.user_id IS 'ID de l''utilisateur propriétaire';
  END IF;
END $$;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_holerites_user_id ON public.holerites(user_id);
CREATE INDEX IF NOT EXISTS idx_holerites_created_at ON public.holerites(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_holerites_period ON public.holerites(period);

-- Ajouter des contraintes pour la cohérence des données
ALTER TABLE public.holerites 
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN salario_bruto SET DEFAULT 0,
  ALTER COLUMN salario_liquido SET DEFAULT 0;

-- Fonction pour extraire automatiquement la période depuis structured_data
CREATE OR REPLACE FUNCTION extract_period_from_structured_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Essayer d'extraire la période depuis structured_data
  IF NEW.structured_data IS NOT NULL THEN
    NEW.period := COALESCE(
      NEW.structured_data->>'period',
      NEW.structured_data->>'periodo',
      NEW.structured_data->>'mes_referencia',
      NEW.structured_data->>'month_reference'
    );
  END IF;
  
  -- Essayer d'extraire le nom depuis structured_data
  IF NEW.structured_data IS NOT NULL AND NEW.nome IS NULL THEN
    NEW.nome := COALESCE(
      NEW.structured_data->>'employee_name',
      NEW.structured_data->>'nome_empregado',
      NEW.structured_data->>'nome'
    );
  END IF;
  
  -- Essayer d'extraire l'entreprise depuis structured_data
  IF NEW.structured_data IS NOT NULL AND NEW.empresa IS NULL THEN
    NEW.empresa := COALESCE(
      NEW.structured_data->>'company_name',
      NEW.structured_data->>'nome_empresa',
      NEW.structured_data->>'empresa'
    );
  END IF;
  
  -- Essayer d'extraire le salaire brut depuis structured_data
  IF NEW.structured_data IS NOT NULL AND NEW.salario_bruto = 0 THEN
    NEW.salario_bruto := COALESCE(
      (NEW.structured_data->>'salario_bruto')::decimal,
      (NEW.structured_data->>'gross_salary')::decimal,
      (NEW.structured_data->>'salario_bruto_total')::decimal
    );
  END IF;
  
  -- Essayer d'extraire le salaire liquide depuis structured_data
  IF NEW.structured_data IS NOT NULL AND NEW.salario_liquido = 0 THEN
    NEW.salario_liquido := COALESCE(
      (NEW.structured_data->>'salario_liquido')::decimal,
      (NEW.structured_data->>'net_salary')::decimal,
      (NEW.structured_data->>'salario_liquido_total')::decimal
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour extraire automatiquement les données
DROP TRIGGER IF EXISTS trigger_extract_period_from_structured_data ON public.holerites;
CREATE TRIGGER trigger_extract_period_from_structured_data
  BEFORE INSERT OR UPDATE ON public.holerites
  FOR EACH ROW
  EXECUTE FUNCTION extract_period_from_structured_data();

-- Mettre à jour les enregistrements existants
UPDATE public.holerites 
SET period = COALESCE(
  structured_data->>'period',
  structured_data->>'periodo',
  structured_data->>'mes_referencia',
  structured_data->>'month_reference'
)
WHERE period IS NULL AND structured_data IS NOT NULL;

UPDATE public.holerites 
SET nome = COALESCE(
  structured_data->>'employee_name',
  structured_data->>'nome_empregado',
  structured_data->>'nome'
)
WHERE nome IS NULL AND structured_data IS NOT NULL;

UPDATE public.holerites 
SET empresa = COALESCE(
  structured_data->>'company_name',
  structured_data->>'nome_empresa',
  structured_data->>'empresa'
)
WHERE empresa IS NULL AND structured_data IS NOT NULL;

UPDATE public.holerites 
SET salario_bruto = COALESCE(
  (structured_data->>'salario_bruto')::decimal,
  (structured_data->>'gross_salary')::decimal,
  (structured_data->>'salario_bruto_total')::decimal
)
WHERE salario_bruto = 0 AND structured_data IS NOT NULL;

UPDATE public.holerites 
SET salario_liquido = COALESCE(
  (structured_data->>'salario_liquido')::decimal,
  (structured_data->>'net_salary')::decimal,
  (structured_data->>'salario_liquido_total')::decimal
)
WHERE salario_liquido = 0 AND structured_data IS NOT NULL; 