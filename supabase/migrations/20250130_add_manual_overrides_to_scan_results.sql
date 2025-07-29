-- Migration: Ajout des champs pour l'édition manuelle des données de payslip
-- Date: 2025-01-30
-- Description: Ajoute les champs manual_overrides et is_manual à la table scan_results

-- Ajout des colonnes pour l'édition manuelle
ALTER TABLE scan_results 
ADD COLUMN IF NOT EXISTS manual_overrides JSONB,
ADD COLUMN IF NOT EXISTS is_manual BOOLEAN DEFAULT FALSE;

-- Index pour optimiser les requêtes sur les données éditées manuellement
CREATE INDEX IF NOT EXISTS idx_scan_results_is_manual ON scan_results(is_manual);
CREATE INDEX IF NOT EXISTS idx_scan_results_manual_overrides ON scan_results USING GIN (manual_overrides);

-- Commentaires pour documentation
COMMENT ON COLUMN scan_results.manual_overrides IS 'Données des modifications manuelles (champs édités, champs personnalisés, historique)';
COMMENT ON COLUMN scan_results.is_manual IS 'Indique si les données ont été modifiées manuellement par l''utilisateur';

-- Fonction pour logger les modifications manuelles
CREATE OR REPLACE FUNCTION log_manual_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- Si is_manual est true, s'assurer que manual_overrides contient les métadonnées
  IF NEW.is_manual = TRUE AND (OLD.is_manual = FALSE OR OLD.is_manual IS NULL) THEN
    IF NEW.manual_overrides IS NULL THEN
      NEW.manual_overrides = jsonb_build_object(
        'edited_at', NOW(),
        'edited_by', auth.uid(),
        'edited_fields', '[]'::jsonb,
        'custom_fields', '[]'::jsonb
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour logger automatiquement les modifications manuelles
DROP TRIGGER IF EXISTS trigger_log_manual_edit ON scan_results;
CREATE TRIGGER trigger_log_manual_edit
  BEFORE UPDATE ON scan_results
  FOR EACH ROW
  EXECUTE FUNCTION log_manual_edit(); 