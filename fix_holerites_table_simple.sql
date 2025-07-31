-- Script simple pour corriger la table holerites
-- À exécuter directement dans Supabase Dashboard

-- 1. Ajouter les colonnes manquantes (si elles n'existent pas)
DO $$
BEGIN
  -- Ajouter period
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerites' AND column_name = 'period') THEN
    ALTER TABLE public.holerites ADD COLUMN period text;
  END IF;
  
  -- Ajouter nome
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerites' AND column_name = 'nome') THEN
    ALTER TABLE public.holerites ADD COLUMN nome text;
  END IF;
  
  -- Ajouter empresa
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerites' AND column_name = 'empresa') THEN
    ALTER TABLE public.holerites ADD COLUMN empresa text;
  END IF;
  
  -- Ajouter user_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerites' AND column_name = 'user_id') THEN
    ALTER TABLE public.holerites ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- 2. Créer les index
CREATE INDEX IF NOT EXISTS idx_holerites_user_id ON public.holerites(user_id);
CREATE INDEX IF NOT EXISTS idx_holerites_created_at ON public.holerites(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_holerites_period ON public.holerites(period);

-- 3. Mettre à jour les données depuis structured_data (version sécurisée)
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

-- 4. Configurer les politiques RLS
DO $$
BEGIN
  -- Activer RLS
  ALTER TABLE public.holerites ENABLE ROW LEVEL SECURITY;
  
  -- Politique SELECT
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'holerites' AND policyname = 'Users can view their own holerites') THEN
    CREATE POLICY "Users can view their own holerites" ON public.holerites
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  -- Politique INSERT
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'holerites' AND policyname = 'Users can insert their own holerites') THEN
    CREATE POLICY "Users can insert their own holerites" ON public.holerites
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  -- Politique UPDATE
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'holerites' AND policyname = 'Users can update their own holerites') THEN
    CREATE POLICY "Users can update their own holerites" ON public.holerites
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  -- Politique DELETE
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'holerites' AND policyname = 'Users can delete their own holerites') THEN
    CREATE POLICY "Users can delete their own holerites" ON public.holerites
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Vérification finale
SELECT 
  'Structure mise à jour' as status,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as holerites_with_user_id,
  COUNT(CASE WHEN period IS NOT NULL THEN 1 END) as holerites_with_period,
  COUNT(CASE WHEN nome IS NOT NULL THEN 1 END) as holerites_with_nome,
  COUNT(CASE WHEN empresa IS NOT NULL THEN 1 END) as holerites_with_empresa
FROM public.holerites; 