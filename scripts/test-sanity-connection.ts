#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@sanity/client';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔧 Test de Connexion Sanity');
console.log('==========================\n');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;

console.log('📋 Configuration:');
console.log(`   Project ID: ${projectId}`);
console.log(`   Token: ${token ? '✅ Présent' : '❌ Manquant'}`);
console.log('');

if (!projectId || !token) {
  console.log('❌ Configuration incomplète');
  process.exit(1);
}

// Créer le client Sanity
const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-07-29',
  token,
  useCdn: false,
});

console.log('🧪 Test de lecture...');
client.fetch('*[_type == "post"][0...1]')
  .then((result: any) => {
    console.log('✅ Lecture réussie !');
    console.log(`   Articles existants: ${result?.length || 0}`);
    console.log('');
    
    // Test de création
    console.log('🧪 Test de création...');
    const testPost = {
      _type: 'post',
      title: 'Test Article',
      slug: {
        _type: 'slug',
        current: 'test-article-' + Date.now()
      },
      excerpt: 'Test excerpt',
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Test content'
            }
          ]
        }
      ],
      publishedAt: new Date().toISOString()
    };

    return client.create(testPost);
  })
  .then((result: any) => {
    console.log('✅ Création réussie !');
    console.log(`   ID: ${result._id}`);
    console.log('');
    
    // Nettoyer le test
    console.log('🧹 Nettoyage du test...');
    return client.delete(result._id);
  })
  .then(() => {
    console.log('✅ Nettoyage réussi !');
    console.log('');
    console.log('🎯 Toutes les permissions sont correctes !');
    console.log('Vous pouvez maintenant insérer les articles:');
    console.log('   pnpm tsx scripts/seedPosts.ts');
  })
  .catch((error: any) => {
    console.log('❌ Erreur:');
    console.log(`   ${error.message}`);
    console.log('');
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('🔧 SOLUTION:');
      console.log('1. Allez sur https://www.sanity.io/manage');
      console.log('2. Sélectionnez votre projet');
      console.log('3. Allez dans "Settings" > "API"');
      console.log('4. Trouvez votre token et cliquez "Edit"');
      console.log('5. Sélectionnez "Editor" permissions');
      console.log('6. Sauvegardez');
      console.log('');
      console.log('🔄 Puis relancez: pnpm tsx scripts/seedPosts.ts');
    } else if (error.message.includes('Project not found')) {
      console.log('🔧 SOLUTION:');
      console.log('Vérifiez que le Project ID est correct');
    } else if (error.message.includes('Dataset not found')) {
      console.log('🔧 SOLUTION:');
      console.log('Le dataset "production" n\'existe pas');
      console.log('Créez-le dans Sanity Studio');
    }
  }); 