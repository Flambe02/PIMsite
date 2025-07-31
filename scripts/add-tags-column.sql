-- Script pour ajouter la colonne tags à la table blog_articles
-- À exécuter directement dans Supabase

-- Ajouter la colonne tags
ALTER TABLE blog_articles 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Index pour optimiser les recherches par tags
CREATE INDEX IF NOT EXISTS idx_blog_articles_tags ON blog_articles USING GIN (tags);

-- Mettre à jour les articles existants avec des tags par défaut
UPDATE blog_articles 
SET tags = ARRAY['blog', 'folha de pagamento', 'holerite', 'benefícios']
WHERE tags IS NULL OR array_length(tags, 1) IS NULL; 