#!/usr/bin/env tsx

/**
 * Script pour tester l'intégration complète du blog
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

async function testBlogIntegration() {
  console.log('🔍 Test de l\'intégration complète du blog...');

  try {
    // Test 1: Récupération des articles par pays
    console.log('\n📋 Test 1: Récupération des articles pour le Brésil');
    const { data: articlesBR, error: errorBR } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('country', 'br')
      .order('published_at', { ascending: false });

    if (errorBR) {
      console.error('❌ Erreur lors de la récupération des articles BR:', errorBR);
    } else {
      console.log(`✅ ${articlesBR?.length || 0} articles trouvés pour le Brésil`);
      articlesBR?.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title}`);
      });
    }

    // Test 2: Récupération d'un article spécifique
    console.log('\n📋 Test 2: Récupération d\'un article spécifique');
    const { data: article, error: errorArticle } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', 'entenda-seu-holerite-guia-completo-funcionarios-clt')
      .single();

    if (errorArticle) {
      console.error('❌ Erreur lors de la récupération de l\'article:', errorArticle);
    } else {
      console.log(`✅ Article trouvé: ${article.title}`);
      console.log(`   Contenu: ${article.content_markdown?.substring(0, 100)}...`);
    }

    // Test 3: Vérification de la structure des données
    console.log('\n📋 Test 3: Vérification de la structure des données');
    if (articlesBR && articlesBR.length > 0) {
      const sampleArticle = articlesBR[0];
      const requiredFields = ['id', 'title', 'slug', 'content_markdown', 'excerpt', 'country', 'published_at'];
      const missingFields = requiredFields.filter(field => !sampleArticle[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ Tous les champs requis sont présents');
      } else {
        console.log(`❌ Champs manquants: ${missingFields.join(', ')}`);
      }
    }

    // Test 4: Test de l'URL de l'application
    console.log('\n📋 Test 4: Test de l\'URL de l\'application');
    try {
      const response = await fetch('http://localhost:3000/br/blog');
      if (response.ok) {
        console.log('✅ L\'application répond correctement');
        const html = await response.text();
        if (html.includes('Blog PIM')) {
          console.log('✅ La page du blog se charge correctement');
        } else {
          console.log('⚠️ La page se charge mais le contenu semble différent');
        }
      } else {
        console.log(`❌ L'application retourne un code d'erreur: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Impossible de contacter l\'application:', error);
    }

    console.log('\n🎉 Tests d\'intégration terminés!');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  testBlogIntegration();
} 