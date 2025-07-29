#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🌐 Test Connexion Sanity depuis Vercel');
console.log('=====================================\n');

// Test avec les mêmes variables que Vercel
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  useCdn: true,
});

console.log('📋 Configuration:');
console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
console.log(`   Dataset: production`);
console.log(`   Token: Aucun (lecture publique)`);
console.log('');

async function testVercelConnection() {
  try {
    console.log('🧪 Test 1: Connexion de base...');
    const testArticle = await client.fetch('*[_type == "post"][0]');
    
    if (testArticle) {
      console.log('✅ Connexion réussie !');
      console.log(`   Article trouvé: ${testArticle.title}`);
      console.log(`   Slug: ${testArticle.slug?.current}`);
      console.log(`   Country: ${testArticle.country}`);
    } else {
      console.log('⚠️ Connexion OK mais aucun article trouvé');
    }
    
    console.log('');
    console.log('🧪 Test 2: Articles BR spécifiques...');
    const brArticles = await client.fetch(`
      *[_type == "post" && country == "BR"]
    `);
    console.log(`🇧🇷 Articles BR: ${brArticles?.length || 0}`);
    
    if (brArticles && brArticles.length > 0) {
      console.log('');
      console.log('📋 Articles BR disponibles:');
      brArticles.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Slug: ${article.slug?.current}`);
        console.log(`      URL: https://pi-msite.vercel.app/br/blog/${article.slug?.current}`);
      });
    }
    
    console.log('');
    console.log('🧪 Test 3: Test d\'un article spécifique...');
    const specificArticle = await client.fetch(`
      *[_type == "post" && slug.current == "o-que-e-inss-e-como-ele-impacta-seu-salario-liquido"][0]
    `);
    
    if (specificArticle) {
      console.log('✅ Article spécifique trouvé !');
      console.log(`   Titre: ${specificArticle.title}`);
      console.log(`   Slug: ${specificArticle.slug?.current}`);
      console.log(`   Country: ${specificArticle.country}`);
      console.log(`   PublishedAt: ${specificArticle.publishedAt || 'NULL'}`);
    } else {
      console.log('❌ Article spécifique NON trouvé');
      console.log('   Vérifiez le slug dans Sanity Studio');
    }
    
  } catch (error: any) {
    console.log('❌ Erreur de connexion:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('Project not found')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('   Le Project ID est incorrect sur Vercel');
      console.log('   Vérifiez NEXT_PUBLIC_SANITY_PROJECT_ID');
    } else if (error.message.includes('Dataset not found')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('   Le dataset "production" n\'existe pas');
      console.log('   Créez-le dans Sanity Studio');
    }
  }
}

testVercelConnection(); 