#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🧪 Test de la Requête Corrigée');
console.log('==============================\n');

const publicClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  useCdn: true,
});

async function testFixedQuery() {
  try {
    console.log('🧪 Test 1: Ancienne requête (country == "BR")...');
    const oldQuery = await publicClient.fetch(`
      *[_type == "post" && publishedAt != null && country == "BR"]
    `);
    console.log(`🇧🇷 Articles avec ancienne requête: ${oldQuery?.length || 0}`);
    
    console.log('');
    console.log('🧪 Test 2: Nouvelle requête (country == "BR" || country == "br")...');
    const newQuery = await publicClient.fetch(`
      *[_type == "post" && publishedAt != null && (country == "BR" || country == "br")]
    `);
    console.log(`🇧🇷 Articles avec nouvelle requête: ${newQuery?.length || 0}`);
    
    if (newQuery && newQuery.length > 0) {
      console.log('');
      console.log('📋 Articles trouvés avec la nouvelle requête:');
      newQuery.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Slug: ${article.slug?.current}`);
        console.log(`      Country: ${article.country}`);
        console.log(`      URL: https://pi-msite.vercel.app/br/blog/${article.slug?.current}`);
      });
    }
    
    console.log('');
    console.log('🧪 Test 3: Test avec paramètre (comme dans l\'app)...');
    const paramQuery = await publicClient.fetch(`
      *[_type == "post" && publishedAt != null && (country == $country || country == lower($country))]
    `, { country: 'BR' });
    console.log(`🇧🇷 Articles avec paramètre "BR": ${paramQuery?.length || 0}`);
    
    console.log('');
    console.log('🎯 RÉSULTAT:');
    if (newQuery && newQuery.length > 0) {
      console.log('✅ La nouvelle requête fonctionne !');
      console.log('✅ Les articles seront maintenant visibles sur le blog');
      console.log('');
      console.log('🌐 Testez maintenant sur Vercel:');
      console.log('   https://pi-msite.vercel.app/br/blog');
    } else {
      console.log('❌ La nouvelle requête ne fonctionne toujours pas');
    }
    
  } catch (error: any) {
    console.log('❌ Erreur:', error.message);
  }
}

testFixedQuery(); 