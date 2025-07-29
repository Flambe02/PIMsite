#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🔧 Correction du Champ Country des Articles');
console.log('==========================================\n');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function fixArticlesCountry() {
  try {
    console.log('📋 Récupération de tous les articles...');
    const allArticles = await client.fetch('*[_type == "post"]');
    console.log(`📄 Articles trouvés: ${allArticles?.length || 0}`);
    
    if (!allArticles || allArticles.length === 0) {
      console.log('❌ Aucun article trouvé');
      return;
    }
    
    console.log('');
    console.log('🔧 Correction des articles...');
    
    for (let i = 0; i < allArticles.length; i++) {
      const article = allArticles[i];
      console.log(`   ${i + 1}. ${article.title}`);
      
      // Vérifier si le champ country existe et est correct
      const currentCountry = article.country;
      console.log(`      Country actuel: "${currentCountry}"`);
      
      // Si pas de country ou country incorrect, le corriger
      if (!currentCountry || currentCountry !== 'BR') {
        try {
          await client.patch(article._id).set({
            country: 'BR',
            language: 'pt-BR'
          }).commit();
          console.log(`      ✅ Corrigé: country="BR", language="pt-BR"`);
        } catch (error: any) {
          console.log(`      ❌ Erreur: ${error.message}`);
        }
      } else {
        console.log(`      ✅ Déjà correct`);
      }
    }
    
    console.log('');
    console.log('🧪 Vérification après correction...');
    const correctedArticles = await client.fetch(`
      *[_type == "post" && country == "BR"]
    `);
    console.log(`🇧🇷 Articles BR après correction: ${correctedArticles?.length || 0}`);
    
    if (correctedArticles && correctedArticles.length > 0) {
      console.log('');
      console.log('📋 Articles BR corrigés:');
      correctedArticles.forEach((article: any, index: number) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      URL: https://pi-msite.vercel.app/br/blog/${article.slug?.current}`);
      });
    }
    
  } catch (error: any) {
    console.log('❌ Erreur:', error.message);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('   Le token Sanity n\'a pas les permissions d\'écriture');
      console.log('   Allez sur sanity.io/manage et créez un token "Editor"');
    }
  }
}

fixArticlesCountry(); 