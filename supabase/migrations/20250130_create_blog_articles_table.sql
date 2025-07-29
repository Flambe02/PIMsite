-- Migration: Création de la table blog_articles pour le blog SEO-ready
-- Date: 2025-01-30
-- Description: Table pour stocker les articles de blog avec support multi-pays et SEO

-- Création de la table blog_articles
CREATE TABLE IF NOT EXISTS blog_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    country TEXT NOT NULL CHECK (country IN ('br', 'fr', 'pt', 'en')),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_blog_articles_country ON blog_articles(country);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_at ON blog_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_blog_articles_updated_at 
    BEFORE UPDATE ON blog_articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer automatiquement le slug à partir du titre
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Politique: Lecture publique pour tous les articles publiés
CREATE POLICY "Public read access to published articles" ON blog_articles
    FOR SELECT
    USING (published_at IS NOT NULL);

-- Politique: Écriture réservée aux utilisateurs authentifiés avec rôle admin
CREATE POLICY "Admin write access" ON blog_articles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Commentaires pour la documentation
COMMENT ON TABLE blog_articles IS 'Table pour stocker les articles de blog avec support multi-pays et SEO';
COMMENT ON COLUMN blog_articles.slug IS 'URL-friendly slug généré automatiquement à partir du titre';
COMMENT ON COLUMN blog_articles.excerpt IS 'Extrait de 150-200 caractères pour les meta descriptions SEO';
COMMENT ON COLUMN blog_articles.country IS 'Code pays pour filtrer les articles par région (br, fr, pt, en)';
COMMENT ON COLUMN blog_articles.published_at IS 'Date de publication, NULL si brouillon'; 