-- Script pour corriger les périodes manquantes
-- À exécuter dans Supabase Dashboard

-- 1. Voir les holerites sans période
SELECT 
  id,
  created_at,
  period,
  structured_data->>'period' as period_from_data,
  structured_data->>'periodo' as periodo_from_data,
  structured_data->>'mes_referencia' as mes_ref_from_data,
  structured_data->>'month_reference' as month_ref_from_data
FROM public.holerites 
WHERE period IS NULL 
ORDER BY created_at DESC;

-- 2. Essayer d'extraire la période depuis d'autres sources
UPDATE public.holerites 
SET period = COALESCE(
  structured_data->>'period',
  structured_data->>'periodo',
  structured_data->>'mes_referencia',
  structured_data->>'month_reference',
  -- Essayer d'extraire depuis created_at si pas de période
  TO_CHAR(created_at, 'MM/YYYY')
)
WHERE period IS NULL AND structured_data IS NOT NULL;

-- 3. Pour les holerites sans structured_data, utiliser la date de création
UPDATE public.holerites 
SET period = TO_CHAR(created_at, 'MM/YYYY')
WHERE period IS NULL;

-- 4. Vérification finale
SELECT 
  'Périodes corrigées' as status,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN period IS NOT NULL THEN 1 END) as holerites_with_period,
  COUNT(CASE WHEN period IS NULL THEN 1 END) as holerites_without_period
FROM public.holerites;

-- 5. Afficher quelques exemples de périodes
SELECT 
  id,
  created_at,
  period,
  nome,
  empresa
FROM public.holerites 
ORDER BY created_at DESC 
LIMIT 10; 