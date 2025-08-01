-- Migration: Ajout des colonnes pour l'analyse enhanced
-- Date: 2025-01-31
-- Description: Ajoute le support pour les rapports d'explication et de recommandations séparés

-- Ajouter les colonnes pour l'analyse enhanced dans scan_results
ALTER TABLE public.scan_results 
ADD COLUMN IF NOT EXISTS analysis_version jsonb,
ADD COLUMN IF NOT EXISTS explanation_report jsonb,
ADD COLUMN IF NOT EXISTS recommendations_report jsonb;

-- Ajouter les colonnes pour l'analyse enhanced dans holerites
ALTER TABLE public.holerites 
ADD COLUMN IF NOT EXISTS analysis_version jsonb,
ADD COLUMN IF NOT EXISTS explanation_report jsonb,
ADD COLUMN IF NOT EXISTS recommendations_report jsonb;

-- Ajouter des index pour les nouvelles colonnes JSONB
CREATE INDEX IF NOT EXISTS idx_scan_results_analysis_version ON public.scan_results USING gin (analysis_version);
CREATE INDEX IF NOT EXISTS idx_scan_results_explanation_report ON public.scan_results USING gin (explanation_report);
CREATE INDEX IF NOT EXISTS idx_scan_results_recommendations_report ON public.scan_results USING gin (recommendations_report);

CREATE INDEX IF NOT EXISTS idx_holerites_analysis_version ON public.holerites USING gin (analysis_version);
CREATE INDEX IF NOT EXISTS idx_holerites_explanation_report ON public.holerites USING gin (explanation_report);
CREATE INDEX IF NOT EXISTS idx_holerites_recommendations_report ON public.holerites USING gin (recommendations_report);

-- Commentaires sur les nouvelles colonnes
COMMENT ON COLUMN public.scan_results.analysis_version IS 'Version de l''analyse (legacy/enhanced) avec métadonnées';
COMMENT ON COLUMN public.scan_results.explanation_report IS 'Rapport d''explication détaillé du holerite';
COMMENT ON COLUMN public.scan_results.recommendations_report IS 'Rapport de recommandations personnalisées';

COMMENT ON COLUMN public.holerites.analysis_version IS 'Version de l''analyse (legacy/enhanced) avec métadonnées';
COMMENT ON COLUMN public.holerites.explanation_report IS 'Rapport d''explication détaillé du holerite';
COMMENT ON COLUMN public.holerites.recommendations_report IS 'Rapport de recommandations personnalisées';

-- Fonction pour extraire automatiquement les données depuis structured_data
CREATE OR REPLACE FUNCTION extract_enhanced_data_from_structured()
RETURNS TRIGGER AS $$
BEGIN
  -- Extraire l'analysis_version depuis structured_data si disponible
  IF NEW.structured_data IS NOT NULL AND NEW.structured_data ? 'analysis_version' THEN
    NEW.analysis_version = NEW.structured_data->'analysis_version';
  END IF;
  
  -- Extraire l'explanation_report depuis structured_data si disponible
  IF NEW.structured_data IS NOT NULL AND NEW.structured_data ? 'explanation' THEN
    NEW.explanation_report = NEW.structured_data->'explanation';
  END IF;
  
  -- Extraire le recommendations_report depuis structured_data si disponible
  IF NEW.structured_data IS NOT NULL AND NEW.structured_data ? 'recommendations' THEN
    NEW.recommendations_report = NEW.structured_data->'recommendations';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour holerites
DROP TRIGGER IF EXISTS trigger_extract_enhanced_data_holerites ON public.holerites;
CREATE TRIGGER trigger_extract_enhanced_data_holerites
  BEFORE INSERT OR UPDATE ON public.holerites
  FOR EACH ROW
  EXECUTE FUNCTION extract_enhanced_data_from_structured();

-- Créer le trigger pour scan_results
DROP TRIGGER IF EXISTS trigger_extract_enhanced_data_scan_results ON public.scan_results;
CREATE TRIGGER trigger_extract_enhanced_data_scan_results
  BEFORE INSERT OR UPDATE ON public.scan_results
  FOR EACH ROW
  EXECUTE FUNCTION extract_enhanced_data_from_structured();

-- Mettre à jour les données existantes si nécessaire
UPDATE public.holerites 
SET 
  analysis_version = structured_data->'analysis_version',
  explanation_report = structured_data->'explanation',
  recommendations_report = structured_data->'recommendations'
WHERE 
  structured_data IS NOT NULL 
  AND (
    structured_data ? 'analysis_version' 
    OR structured_data ? 'explanation' 
    OR structured_data ? 'recommendations'
  );

UPDATE public.scan_results 
SET 
  analysis_version = structured_data->'analysis_version',
  explanation_report = structured_data->'explanation',
  recommendations_report = structured_data->'recommendations'
WHERE 
  structured_data IS NOT NULL 
  AND (
    structured_data ? 'analysis_version' 
    OR structured_data ? 'explanation' 
    OR structured_data ? 'recommendations'
  ); 