#!/usr/bin/env tsx

import 'dotenv/config';

console.log('🧪 Test Rapide de Configuration');
console.log('================================\n');

// Vérifier les variables d'environnement
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;

console.log('📋 Variables d\'environnement:');
console.log(`   NEXT_PUBLIC_SANITY_PROJECT_ID: ${projectId || '❌ Manquant'}`);
console.log(`   SANITY_API_TOKEN: ${token ? '✅ Présent' : '❌ Manquant'}`);
console.log('');

if (!projectId || !token) {
  console.log('❌ Configuration incomplète !');
  console.log('Vérifiez votre fichier .env.local');
  process.exit(1);
}

console.log('✅ Configuration OK !');
console.log('');
console.log('🎯 Vous pouvez maintenant lancer:');
console.log('   npx tsx scripts/insert-all-articles.ts');
console.log('');
console.log('📚 Ou tester un seul article:');
console.log('   npx tsx scripts/test-single-article.ts'); 