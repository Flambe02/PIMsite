#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🔧 Test du Token Sanity après Correction');
console.log('========================================\n');

// Configuration Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

console.log('📋 Configuration:');
console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
console.log(`   Token: ${process.env.SANITY_API_TOKEN ? '✅ Présent' : '❌ Manquant'}`);
console.log('');

async function testToken() {
  try {
    console.log('🧪 Test de lecture des articles...');
    
    // Test 1: Lecture des articles
    const articles = await client.fetch('*[_type == "post"][0...3]');
    console.log(`✅ Lecture réussie - ${articles?.length || 0} articles trouvés`);
    
    if (articles && articles.length > 0) {
      console.log('');
      console.log('📄 Articles disponibles:');
      articles.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Slug: ${article.slug?.current}`);
        console.log(`      Pays: ${article.country}`);
        console.log(`      Langue: ${article.language}`);
      });
    }
    
    console.log('');
    console.log('🧪 Test de création d\'un article de test...');
    
    // Test 2: Création d'un article de test
    const testArticle = {
      _type: 'post',
      title: 'Test Token - Article Temporaire',
      slug: {
        _type: 'slug',
        current: 'test-token-' + Date.now()
      },
      excerpt: 'Article de test pour vérifier les permissions du token.',
      country: 'BR',
      language: 'pt-BR',
      publishedAt: new Date().toISOString(),
      metaTitle: 'Test Token',
      metaDescription: 'Test des permissions',
      tags: ['test', 'token'],
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Ceci est un test des permissions du token Sanity.'
            }
          ]
        }
      ]
    };
    
    const createdArticle = await client.create(testArticle);
    console.log(`✅ Création réussie - ID: ${createdArticle._id}`);
    
    console.log('');
    console.log('🧹 Nettoyage de l\'article de test...');
    
    // Test 3: Suppression de l'article de test
    await client.delete(createdArticle._id);
    console.log('✅ Suppression réussie');
    
    console.log('');
    console.log('🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('✅ Le token a les bonnes permissions');
    console.log('✅ Vous pouvez maintenant insérer les articles');
    console.log('');
    console.log('🚀 Lancez: npx tsx scripts/insert-all-articles.ts');
    
  } catch (error: any) {
    console.log('❌ Erreur lors du test:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('Unauthorized')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('1. Allez sur https://www.sanity.io/manage');
      console.log('2. Sélectionnez votre projet');
      console.log('3. Settings > API > Tokens');
      console.log('4. Modifiez votre token pour "Editor" permissions');
      console.log('5. Ou créez un nouveau token avec "Editor" permissions');
    } else if (error.message.includes('Insufficient permissions')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('Le token n\'a pas les permissions "Editor"');
      console.log('Modifiez les permissions dans Sanity Dashboard');
    }
  }
}

testToken(); 