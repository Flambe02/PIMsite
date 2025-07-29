#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🔍 Diagnostic Articles BR');
console.log('==========================\n');

const publicClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  useCdn: true,
});

async function debugBRArticles() {
  try {
    console.log('🧪 Test 1: Tous les articles BR (sans filtre publishedAt)...');
    const brArticles = await publicClient.fetch(`
      *[_type == "post" && country == "BR"]
    `);
    console.log(`🇧🇷 Articles BR trouvés: ${brArticles?.length || 0}`);
    
    if (brArticles && brArticles.length > 0) {
      console.log('');
      console.log('📋 Détails des articles BR:');
      brArticles.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Slug: ${article.slug?.current}`);
        console.log(`      PublishedAt: ${article.publishedAt || 'NULL'}`);
        console.log(`      Country: ${article.country}`);
        console.log(`      Language: ${article.language}`);
        console.log('');
      });
    }
    
    console.log('🧪 Test 2: Articles BR avec publishedAt...');
    const brPublishedArticles = await publicClient.fetch(`
      *[_type == "post" && country == "BR" && publishedAt != null]
    `);
    console.log(`🇧🇷 Articles BR publiés: ${brPublishedArticles?.length || 0}`);
    
    console.log('🧪 Test 3: Articles BR sans publishedAt...');
    const brUnpublishedArticles = await publicClient.fetch(`
      *[_type == "post" && country == "BR" && !publishedAt]
    `);
    console.log(`🇧🇷 Articles BR non publiés: ${brUnpublishedArticles?.length || 0}`);
    
    console.log('');
    console.log('🌐 URLs de test:');
    if (brArticles && brArticles.length > 0) {
      brArticles.forEach((article: any) => {
        console.log(`   - ${article.title}: https://pi-msite.vercel.app/br/blog/${article.slug?.current}`);
      });
    }
    
  } catch (error: any) {
    console.log('❌ Erreur:', error.message);
  }
}

debugBRArticles(); 