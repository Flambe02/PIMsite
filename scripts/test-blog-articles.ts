#!/usr/bin/env tsx

/**
 * Script pour tester la récupération des articles de blog
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBlogArticles() {
  console.log('🔍 Test de récupération des articles de blog...');

  try {
    // Récupérer tous les articles
    const { data: articles, error } = await supabase
      .from('blog_articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return;
    }

    console.log(`✅ ${articles?.length || 0} articles trouvés`);

    if (articles && articles.length > 0) {
      articles.forEach((article, index) => {
        console.log(`\n📄 Article ${index + 1}:`);
        console.log(`   Titre: ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Pays: ${article.country}`);
        console.log(`   Publié: ${article.published_at}`);
        console.log(`   Extrait: ${article.excerpt?.substring(0, 100)}...`);
      });
    } else {
      console.log('📝 Aucun article trouvé dans la base de données');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  testBlogArticles();
} 