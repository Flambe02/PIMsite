#!/usr/bin/env tsx

/**
 * 🔧 Script de Correction des Permissions Sanity
 * 
 * Ce script vous guide pour résoudre l'erreur "Insufficient permissions"
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔧 Script de Correction des Permissions Sanity');
console.log('==============================================\n');

// Vérifier la configuration actuelle
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;

console.log('📋 Configuration actuelle:');
console.log(`   Project ID: ${projectId || '❌ Non défini'}`);
console.log(`   Token API: ${token ? '✅ Défini' : '❌ Non défini'}`);
console.log('');

if (!projectId) {
  console.log('❌ ERREUR: Project ID manquant');
  console.log('');
  console.log('🔧 Étapes pour corriger:');
  console.log('1. Allez sur https://www.sanity.io/manage');
  console.log('2. Sélectionnez votre projet');
  console.log('3. Copiez le Project ID');
  console.log('4. Ajoutez dans .env.local:');
  console.log('   NEXT_PUBLIC_SANITY_PROJECT_ID=votre_project_id');
  console.log('');
  process.exit(1);
}

if (!token) {
  console.log('❌ ERREUR: Token API manquant');
  console.log('');
  console.log('🔧 Étapes pour corriger:');
  console.log('1. Allez sur https://www.sanity.io/manage');
  console.log('2. Sélectionnez votre projet');
  console.log('3. Allez dans "API" > "Tokens"');
  console.log('4. Cliquez "Add API token"');
  console.log('5. Donnez un nom (ex: "Blog Posts")');
  console.log('6. Sélectionnez "Editor" permissions');
  console.log('7. Copiez le token (commence par "sk_")');
  console.log('8. Ajoutez dans .env.local:');
  console.log('   SANITY_API_TOKEN=sk_votre_token');
  console.log('');
  process.exit(1);
}

console.log('✅ Configuration de base OK');
console.log('');

// Vérifier les permissions du token
console.log('🔍 Vérification des permissions...');
console.log('');

console.log('📝 Étapes pour vérifier/corriger les permissions:');
console.log('');
console.log('1. 🌐 Allez sur https://www.sanity.io/manage');
console.log('2. 📁 Sélectionnez votre projet');
console.log('3. ⚙️  Allez dans "Settings" > "API"');
console.log('4. 🔑 Trouvez votre token dans la liste');
console.log('5. ✏️  Cliquez sur "Edit"');
console.log('6. ✅ Vérifiez que "Editor" est sélectionné');
console.log('7. 💾 Sauvegardez les changements');
console.log('');

console.log('🔗 URLs utiles:');
console.log(`   Sanity Studio: http://localhost:3001/studio`);
console.log(`   Gestion Sanity: https://www.sanity.io/manage`);
console.log(`   Project ID: ${projectId}`);
console.log('');

console.log('📋 Permissions requises:');
console.log('   ✅ Read (lecture)');
console.log('   ✅ Write (écriture)');
console.log('   ✅ Create (création)');
console.log('   ✅ Update (modification)');
console.log('   ✅ Delete (suppression)');
console.log('');

console.log('🔄 Après avoir corrigé les permissions:');
console.log('   1. Redémarrez votre serveur de développement');
console.log('   2. Relancez: pnpm tsx scripts/seedPosts.ts');
console.log('');

console.log('❓ Besoin d\'aide ?');
console.log('   - Documentation: https://www.sanity.io/docs/api-tokens');
console.log('   - Support: https://www.sanity.io/support');
console.log('');

// Test de connexion basique
console.log('🧪 Test de connexion...');
try {
  const { createClient } = require('@sanity/client');
  
  const client = createClient({
    projectId,
    dataset: 'production',
    apiVersion: '2024-07-29',
    token,
    useCdn: false,
  });

  // Test simple de lecture
  client.fetch('*[_type == "post"][0...1]').then((result: any) => {
    console.log('✅ Connexion réussie !');
    console.log(`   Articles existants: ${result?.length || 0}`);
    console.log('');
    console.log('🎯 Vous pouvez maintenant insérer les articles:');
    console.log('   pnpm tsx scripts/seedPosts.ts');
  }).catch((error: any) => {
    console.log('❌ Erreur de connexion:');
    console.log(`   ${error.message}`);
    console.log('');
    console.log('🔧 Vérifiez:');
    console.log('   1. Le Project ID est correct');
    console.log('   2. Le token a les bonnes permissions');
    console.log('   3. Le dataset "production" existe');
  });
} catch (error: any) {
  console.log('❌ Erreur de configuration:');
  console.log(`   ${error.message}`);
} 