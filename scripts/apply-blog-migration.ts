#!/usr/bin/env tsx

/**
 * Script pour appliquer la migration de la table blog_articles
 * via l'API Supabase (alternative à supabase db push)
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyBlogMigration() {
  console.log('🚀 Application de la migration blog_articles');
  console.log('==========================================\n');

  try {
    // Vérifier si la table existe déjà
    console.log('📋 Vérification de l\'existence de la table...');
    
    const { data: existingTable, error: checkError } = await supabase
      .from('blog_articles')
      .select('id')
      .limit(1);

    if (existingTable !== null) {
      console.log('✅ Table blog_articles existe déjà');
      return;
    }

    console.log('⚠️  Table blog_articles non trouvée');
    console.log('\n📝 Instructions pour créer la table manuellement:');
    console.log('================================================');
    console.log('1. Allez sur https://supabase.com/dashboard');
    console.log('2. Sélectionnez votre projet PIM');
    console.log('3. Allez dans "SQL Editor"');
    console.log('4. Copiez et exécutez le script SQL suivant:\n');

    const migrationSQL = `
-- Migration: Création de la table blog_articles pour le blog SEO-ready
-- Date: 2025-01-30

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
                regexp_replace(title, '[^a-zA-Z0-9\\s-]', '', 'g'),
                '\\s+', '-', 'g'
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
`;

    console.log(migrationSQL);
    console.log('\n5. Cliquez sur "Run" pour exécuter le script');
    console.log('6. Vérifiez que la table a été créée dans "Table Editor"');
    console.log('\n✅ Une fois la table créée, vous pourrez insérer les articles.');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter la migration
applyBlogMigration().catch(console.error); 