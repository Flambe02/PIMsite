#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🔍 Diagnostic Avancé du Token Sanity');
console.log('=====================================\n');

// Afficher les premiers caractères du token pour vérification
const token = process.env.SANITY_API_TOKEN;
const tokenPreview = token ? `${token.substring(0, 10)}...${token.substring(token.length - 4)}` : 'MANQUANT';

console.log('📋 Configuration détaillée:');
console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
console.log(`   Token: ${tokenPreview}`);
console.log(`   Token length: ${token?.length || 0} caractères`);
console.log('');

// Test avec différents clients
async function testDifferentClients() {
  console.log('🧪 Test 1: Client sans token (lecture publique)...');
  
  try {
    const publicClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: 'production',
      apiVersion: '2024-07-29',
      useCdn: true, // Utilise le CDN pour la lecture publique
    });

    const publicArticles = await publicClient.fetch('*[_type == "post"][0...1]');
    console.log(`✅ Lecture publique OK - ${publicArticles?.length || 0} articles`);
  } catch (error: any) {
    console.log(`❌ Lecture publique échouée: ${error.message}`);
  }

  console.log('');
  console.log('🧪 Test 2: Client avec token (lecture privée)...');
  
  try {
    const privateClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: 'production',
      apiVersion: '2024-07-29',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    });

    const privateArticles = await privateClient.fetch('*[_type == "post"][0...1]');
    console.log(`✅ Lecture privée OK - ${privateArticles?.length || 0} articles`);
  } catch (error: any) {
    console.log(`❌ Lecture privée échouée: ${error.message}`);
  }

  console.log('');
  console.log('🧪 Test 3: Test de création (permissions d\'écriture)...');
  
  try {
    const writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: 'production',
      apiVersion: '2024-07-29',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    });

    const testDoc = {
      _type: 'post',
      title: 'Test Permissions - ' + Date.now(),
      slug: {
        _type: 'slug',
        current: 'test-permissions-' + Date.now()
      },
      excerpt: 'Test des permissions',
      country: 'BR',
      language: 'pt-BR',
      publishedAt: new Date().toISOString(),
      body: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Test' }]
        }
      ]
    };

    const created = await writeClient.create(testDoc);
    console.log(`✅ Création OK - ID: ${created._id}`);
    
    // Nettoyer
    await writeClient.delete(created._id);
    console.log('✅ Suppression OK');
    
  } catch (error: any) {
    console.log(`❌ Création échouée: ${error.message}`);
    
    if (error.message.includes('Unauthorized')) {
      console.log('');
      console.log('🔧 DIAGNOSTIC: Token sans permissions de lecture/écriture');
      console.log('   Le token existe mais n\'a pas les bonnes permissions');
    } else if (error.message.includes('Insufficient permissions')) {
      console.log('');
      console.log('🔧 DIAGNOSTIC: Token avec permissions insuffisantes');
      console.log('   Le token a des permissions de lecture mais pas d\'écriture');
    }
  }
}

// Test de la structure du token
function analyzeToken() {
  console.log('🔍 Analyse du token:');
  
  if (!token) {
    console.log('❌ Token manquant');
    return;
  }

  if (!token.startsWith('sk')) {
    console.log('❌ Token invalide - doit commencer par "sk"');
    return;
  }

  if (token.length < 50) {
    console.log('❌ Token trop court - probablement invalide');
    return;
  }

  console.log('✅ Format du token semble correct');
  console.log(`   Préfixe: ${token.substring(0, 2)}`);
  console.log(`   Longueur: ${token.length} caractères`);
}

analyzeToken();
console.log('');
testDifferentClients().then(() => {
  console.log('');
  console.log('📋 RÉSUMÉ DU DIAGNOSTIC:');
  console.log('========================');
  console.log('');
  console.log('🔧 SOLUTIONS POSSIBLES:');
  console.log('');
  console.log('1. 🔑 Créer un nouveau token Sanity:');
  console.log('   - Allez sur https://www.sanity.io/manage');
  console.log('   - Settings > API > Tokens');
  console.log('   - "Add API token"');
  console.log('   - Permissions: "Editor"');
  console.log('');
  console.log('2. 🔄 Mettre à jour le token sur Vercel:');
  console.log('   - Allez sur https://vercel.com/dashboard');
  console.log('   - Settings > Environment Variables');
  console.log('   - Modifiez SANITY_API_TOKEN');
  console.log('   - Redéployez');
  console.log('');
  console.log('3. 🌐 Vérifier CORS Sanity:');
  console.log('   - Sanity Dashboard > API > CORS Origins');
  console.log('   - Ajoutez votre domaine Vercel');
  console.log('');
  console.log('4. 🧪 Tester en local d\'abord:');
  console.log('   - Mettez à jour .env.local');
  console.log('   - Testez: npx tsx scripts/test-token-fix.ts');
}); 