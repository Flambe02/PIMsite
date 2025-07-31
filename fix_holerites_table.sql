-- Script pour corriger la table holerites
-- À exécuter directement dans Supabase Dashboard

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
    ALTER TABLE public.holerites ADD COLUMN salario_bruto decimal(10,2) DEFAULT 0;
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
    ALTER TABLE public.holerites ADD COLUMN salario_liquido decimal(10,2) DEFAULT 0;
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

-- Mettre à jour les enregistrements existants avec les données depuis structured_data
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
WHERE (salario_bruto = '0' OR salario_bruto IS NULL OR salario_bruto = '') AND structured_data IS NOT NULL;

UPDATE public.holerites 
SET salario_liquido = COALESCE(
  (structured_data->>'salario_liquido')::decimal,
  (structured_data->>'net_salary')::decimal,
  (structured_data->>'salario_liquido_total')::decimal
)
WHERE (salario_liquido = '0' OR salario_liquido IS NULL OR salario_liquido = '') AND structured_data IS NOT NULL;

-- Vérifier les politiques RLS
DO $$
BEGIN
  -- Activer RLS si pas déjà fait
  ALTER TABLE public.holerites ENABLE ROW LEVEL SECURITY;
  
  -- Créer les politiques si elles n'existent pas
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'holerites' 
    AND policyname = 'Users can view their own holerites'
  ) THEN
    CREATE POLICY "Users can view their own holerites" ON public.holerites
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'holerites' 
    AND policyname = 'Users can insert their own holerites'
  ) THEN
    CREATE POLICY "Users can insert their own holerites" ON public.holerites
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'holerites' 
    AND policyname = 'Users can update their own holerites'
  ) THEN
    CREATE POLICY "Users can update their own holerites" ON public.holerites
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'holerites' 
    AND policyname = 'Users can delete their own holerites'
  ) THEN
    CREATE POLICY "Users can delete their own holerites" ON public.holerites
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$; 