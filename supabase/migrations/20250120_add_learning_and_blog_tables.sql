-- Migration pour ajouter les tables d'apprentissage et de blog
-- Date: 2025-01-20

-- Table pour stocker les données d'apprentissage OCR
CREATE TABLE IF NOT EXISTS ocr_learnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL CHECK (country IN ('br', 'fr', 'es', 'autre')),
  statut TEXT NOT NULL CHECK (statut IN ('CLT', 'PJ', 'Estagiario', 'CDI', 'CDD', 'Autre')),
  raw_ocr_text TEXT NOT NULL,
  extracted_data JSONB NOT NULL,
  validation_result JSONB,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  validated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes d'apprentissage
CREATE INDEX IF NOT EXISTS idx_ocr_learnings_country_statut ON ocr_learnings(country, statut);
CREATE INDEX IF NOT EXISTS idx_ocr_learnings_user_id ON ocr_learnings(user_id);
CREATE INDEX IF NOT EXISTS idx_ocr_learnings_created_at ON ocr_learnings(created_at);
CREATE INDEX IF NOT EXISTS idx_ocr_learnings_validated ON ocr_learnings(validated);

-- Table pour les articles de blog
CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL CHECK (country IN ('br', 'fr', 'es', 'autre')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_markdown TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author TEXT DEFAULT 'PIM Team',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes de blog
CREATE INDEX IF NOT EXISTS idx_blog_articles_country ON blog_articles(country);
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_at ON blog_articles(published_at);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_ocr_learnings_updated_at 
  BEFORE UPDATE ON ocr_learnings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_articles_updated_at 
  BEFORE UPDATE ON blog_articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) pour ocr_learnings
ALTER TABLE ocr_learnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning data" ON ocr_learnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning data" ON ocr_learnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning data" ON ocr_learnings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS pour blog_articles (lecture publique)
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog articles are publicly readable" ON blog_articles
  FOR SELECT USING (true);

-- Politique temporaire pour les modifications (à ajuster selon vos besoins)
CREATE POLICY "Allow all modifications for now" ON blog_articles
  FOR ALL USING (true); 