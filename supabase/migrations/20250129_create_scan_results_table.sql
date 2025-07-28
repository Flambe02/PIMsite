-- Migration: Création de la table scan_results pour le module SCAN NEW PIM
-- Date: 2025-01-29
-- Description: Table pour stocker les résultats de scan OCR avec Google Vision

-- Création de la table scan_results
CREATE TABLE scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  country VARCHAR(2) DEFAULT 'br' NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(10) NOT NULL,
  ocr_text TEXT,
  structured_data JSONB,
  recommendations JSONB,
  confidence_score DECIMAL(3,2),
  scan_version INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances
CREATE INDEX idx_scan_results_user_id ON scan_results(user_id);
CREATE INDEX idx_scan_results_created_at ON scan_results(created_at DESC);
CREATE INDEX idx_scan_results_country ON scan_results(country);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scan_results_updated_at 
  BEFORE UPDATE ON scan_results 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Activation de Row Level Security
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Politique pour SELECT : les utilisateurs ne peuvent voir que leurs propres scans
CREATE POLICY "Users can view own scan results" ON scan_results
  FOR SELECT USING (auth.uid() = user_id);

-- Politique pour INSERT : les utilisateurs ne peuvent insérer que leurs propres scans
CREATE POLICY "Users can insert own scan results" ON scan_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour UPDATE : les utilisateurs ne peuvent modifier que leurs propres scans
CREATE POLICY "Users can update own scan results" ON scan_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Commentaires pour documentation
COMMENT ON TABLE scan_results IS 'Table pour stocker les résultats de scan OCR avec Google Vision pour le module SCAN NEW PIM';
COMMENT ON COLUMN scan_results.id IS 'Identifiant unique du scan';
COMMENT ON COLUMN scan_results.user_id IS 'Référence vers l''utilisateur propriétaire';
COMMENT ON COLUMN scan_results.country IS 'Code pays du document (br, fr, pt)';
COMMENT ON COLUMN scan_results.file_name IS 'Nom original du fichier uploadé';
COMMENT ON COLUMN scan_results.file_size IS 'Taille du fichier en bytes';
COMMENT ON COLUMN scan_results.file_type IS 'Type MIME du fichier (jpg, png, pdf)';
COMMENT ON COLUMN scan_results.ocr_text IS 'Texte brut extrait par Google Vision OCR';
COMMENT ON COLUMN scan_results.structured_data IS 'Données structurées extraites par l''IA';
COMMENT ON COLUMN scan_results.recommendations IS 'Recommandations générées par l''IA';
COMMENT ON COLUMN scan_results.confidence_score IS 'Score de confiance de l''extraction (0.00-1.00)';
COMMENT ON COLUMN scan_results.scan_version IS 'Version du scan (pour versioning)';
COMMENT ON COLUMN scan_results.created_at IS 'Date de création du scan';
COMMENT ON COLUMN scan_results.updated_at IS 'Date de dernière modification'; 