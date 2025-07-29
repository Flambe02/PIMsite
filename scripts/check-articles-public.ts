#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('📖 Vérification des Articles (Lecture Publique)');
console.log('===============================================\n');

// Client sans token (lecture publique)
const publicClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  useCdn: true, // Utilise le CDN pour de meilleures performances
});

console.log('📋 Configuration:');
console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
console.log(`   Dataset: production`);
console.log(`   Token: Aucun (lecture publique)`);
console.log('');

async function checkArticles() {
  try {
    console.log('🧪 Test de lecture publique des articles...');
    
    // Test 1: Tous les articles
    const allArticles = await publicClient.fetch('*[_type == "post"]');
    console.log(`📄 Total articles dans Sanity: ${allArticles?.length || 0}`);
    
    if (allArticles && allArticles.length > 0) {
      console.log('');
      console.log('📋 Articles disponibles:');
      allArticles.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Slug: ${article.slug?.current}`);
        console.log(`      Pays: ${article.country}`);
        console.log(`      Langue: ${article.language}`);
        console.log(`      Publié: ${article.publishedAt ? 'Oui' : 'Non'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ Aucun article trouvé dans Sanity !');
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('   Vous devez d\'abord insérer les articles.');
      console.log('   Lancez: npx tsx scripts/insert-all-articles.ts');
    }
    
    console.log('');
    console.log('🧪 Test spécifique pour le blog BR...');
    
    // Test 2: Articles pour le Brésil
    const brArticles = await publicClient.fetch(`
      *[_type == "post" && country == "BR" && publishedAt != null] | order(publishedAt desc)
    `);
    console.log(`🇧🇷 Articles pour le Brésil: ${brArticles?.length || 0}`);
    
    if (brArticles && brArticles.length > 0) {
      console.log('');
      console.log('🇧🇷 Articles BR disponibles:');
      brArticles.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      URL: https://pi-msite.vercel.app/br/blog/${article.slug?.current}`);
      });
    }
    
    console.log('');
    console.log('🧪 Test spécifique pour le blog FR...');
    
    // Test 3: Articles pour la France
    const frArticles = await publicClient.fetch(`
      *[_type == "post" && country == "FR" && publishedAt != null] | order(publishedAt desc)
    `);
    console.log(`🇫🇷 Articles pour la France: ${frArticles?.length || 0}`);
    
    console.log('');
    console.log('🌐 URLs de test:');
    console.log('   Blog BR: https://pi-msite.vercel.app/br/blog');
    console.log('   Blog FR: https://pi-msite.vercel.app/fr/blog');
    
    if (brArticles && brArticles.length > 0) {
      console.log('');
      console.log('📄 Articles individuels BR:');
      brArticles.slice(0, 3).forEach((article: any) => {
        console.log(`   - ${article.title}: https://pi-msite.vercel.app/br/blog/${article.slug?.current}`);
      });
    }
    
  } catch (error: any) {
    console.log('❌ Erreur lors de la lecture:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('Project not found')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('   Vérifiez que le Project ID est correct');
    } else if (error.message.includes('Dataset not found')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('   Le dataset "production" n\'existe pas');
      console.log('   Créez-le dans Sanity Studio');
    }
  }
}

checkArticles(); 