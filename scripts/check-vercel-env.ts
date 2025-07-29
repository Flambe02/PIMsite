#!/usr/bin/env tsx

import 'dotenv/config';

console.log('🔍 Vérification des Variables d\'Environnement Vercel');
console.log('====================================================\n');

// Variables requises pour Sanity
const requiredVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN'
];

console.log('📋 Variables d\'environnement actuelles:');
console.log('========================================');

let missingVars = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('TOKEN') ? '***PRÉSENT***' : value}`);
  } else {
    console.log(`❌ ${varName}: MANQUANT`);
    missingVars.push(varName);
  }
});

console.log('');

if (missingVars.length > 0) {
  console.log('❌ Variables manquantes détectées !');
  console.log('');
  console.log('🔧 SOLUTION:');
  console.log('1. Allez sur https://vercel.com/dashboard');
  console.log('2. Sélectionnez votre projet');
  console.log('3. Allez dans "Settings" > "Environment Variables"');
  console.log('4. Ajoutez les variables manquantes:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('');
  console.log('📝 Valeurs à ajouter:');
  console.log(`   NEXT_PUBLIC_SANITY_PROJECT_ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'y5sty7n2'}`);
  console.log(`   NEXT_PUBLIC_SANITY_DATASET: production`);
  console.log(`   SANITY_API_TOKEN: [votre_token_sanity]`);
  console.log('');
  console.log('🔄 Après ajout, redéployez votre application');
} else {
  console.log('✅ Toutes les variables sont présentes !');
  console.log('');
  console.log('🔍 Vérification supplémentaire...');
  
  // Test de connexion Sanity
  try {
    const { createClient } = require('@sanity/client');
    
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-07-29',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    });

    client.fetch('*[_type == "post"][0...3]').then((result: any) => {
      console.log(`✅ Connexion Sanity OK - ${result?.length || 0} articles trouvés`);
      
      if (result && result.length > 0) {
        console.log('');
        console.log('📄 Articles disponibles:');
        result.forEach((article: any, index: number) => {
          console.log(`   ${index + 1}. ${article.title}`);
          console.log(`      Slug: ${article.slug?.current}`);
          console.log(`      Pays: ${article.country}`);
          console.log(`      Langue: ${article.language}`);
        });
      } else {
        console.log('⚠️ Aucun article trouvé dans Sanity');
        console.log('   Vérifiez que les articles ont été insérés correctement');
      }
    }).catch((error: any) => {
      console.log('❌ Erreur de connexion Sanity:');
      console.log(`   ${error.message}`);
    });
  } catch (error: any) {
    console.log('❌ Erreur de configuration Sanity:');
    console.log(`   ${error.message}`);
  }
}

console.log('');
console.log('🌐 URLs de test:');
console.log('   Production: https://votre-app.vercel.app/br/blog');
console.log('   Local: http://localhost:3001/br/blog'); 