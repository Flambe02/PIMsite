#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🔍 Diagnostic Complet des Articles');
console.log('==================================\n');

const publicClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  useCdn: true,
});

async function debugAllArticles() {
  try {
    console.log('🧪 Test 1: Tous les articles (sans filtre)...');
    const allArticles = await publicClient.fetch('*[_type == "post"]');
    console.log(`📄 Total articles: ${allArticles?.length || 0}`);
    
    if (allArticles && allArticles.length > 0) {
      console.log('');
      console.log('📋 Détails complets de tous les articles:');
      allArticles.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Slug: ${article.slug?.current}`);
        console.log(`      Country: "${article.country}" (type: ${typeof article.country})`);
        console.log(`      Language: "${article.language}" (type: ${typeof article.language})`);
        console.log(`      PublishedAt: ${article.publishedAt || 'NULL'}`);
        console.log(`      _id: ${article._id}`);
        console.log('');
      });
    }
    
    console.log('🧪 Test 2: Articles avec country = "BR"...');
    const brArticles = await publicClient.fetch(`
      *[_type == "post" && country == "BR"]
    `);
    console.log(`🇧🇷 Articles avec country="BR": ${brArticles?.length || 0}`);
    
    console.log('🧪 Test 3: Articles avec country = "br"...');
    const brLowerArticles = await publicClient.fetch(`
      *[_type == "post" && country == "br"]
    `);
    console.log(`🇧🇷 Articles avec country="br": ${brLowerArticles?.length || 0}`);
    
    console.log('🧪 Test 4: Articles avec country = "Brazil"...');
    const brazilArticles = await publicClient.fetch(`
      *[_type == "post" && country == "Brazil"]
    `);
    console.log(`🇧🇷 Articles avec country="Brazil": ${brazilArticles?.length || 0}`);
    
    console.log('🧪 Test 5: Articles avec country = "Brasil"...');
    const brasilArticles = await publicClient.fetch(`
      *[_type == "post" && country == "Brasil"]
    `);
    console.log(`🇧🇷 Articles avec country="Brasil": ${brasilArticles?.length || 0}`);
    
    console.log('🧪 Test 6: Tous les pays uniques...');
    const uniqueCountries = await publicClient.fetch(`
      array::distinct(*[_type == "post"].country)
    `);
    console.log(`🌍 Pays uniques trouvés: ${JSON.stringify(uniqueCountries)}`);
    
    console.log('');
    console.log('🧪 Test 7: Articles sans country...');
    const noCountryArticles = await publicClient.fetch(`
      *[_type == "post" && !country]
    `);
    console.log(`📄 Articles sans country: ${noCountryArticles?.length || 0}`);
    
    if (noCountryArticles && noCountryArticles.length > 0) {
      console.log('');
      console.log('📋 Articles sans country:');
      noCountryArticles.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Slug: ${article.slug?.current}`);
      });
    }
    
  } catch (error: any) {
    console.log('❌ Erreur:', error.message);
  }
}

debugAllArticles(); 