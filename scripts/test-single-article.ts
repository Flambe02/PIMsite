#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🧪 Test d\'insertion d\'un article');
console.log('==================================\n');

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
console.log(`   Token: ${process.env.SANITY_API_TOKEN ? '✅ Présent' : '❌ Manquant'}`);
console.log('');

// Article de test simple
const testArticle = {
  _type: 'post',
  title: 'Test Article - Descontos na folha de pagamento',
  slug: {
    _type: 'slug',
    current: 'test-descontos-folha-pagamento'
  },
  excerpt: 'Article de test pour vérifier les permissions Sanity.',
  country: 'BR',
  language: 'pt-BR',
  publishedAt: new Date().toISOString(),
  metaTitle: 'Test Article',
  metaDescription: 'Article de test',
  tags: ['test', 'descontos'],
  body: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Ceci est un article de test pour vérifier les permissions Sanity.'
        }
      ]
    }
  ]
};

async function testInsert() {
  try {
    console.log('🧪 Tentative d\'insertion...');
    
    const result = await client.create(testArticle);
    
    console.log('✅ Article créé avec succès !');
    console.log(`   ID: ${result._id}`);
    console.log(`   Titre: ${result.title}`);
    console.log(`   Slug: ${result.slug.current}`);
    
    console.log('');
    console.log('🎯 Les permissions sont correctes !');
    console.log('Vous pouvez maintenant insérer tous les articles.');
    
  } catch (error: any) {
    console.log('❌ Erreur lors de l\'insertion:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('1. Allez sur https://www.sanity.io/manage');
      console.log('2. Sélectionnez votre projet');
      console.log('3. Allez dans "Settings" > "API"');
      console.log('4. Trouvez votre token et cliquez "Edit"');
      console.log('5. Sélectionnez "Editor" permissions');
      console.log('6. Sauvegardez');
    }
  }
}

testInsert(); 