/**
 * Test des variables d'environnement
 */

import 'dotenv/config';

console.log('🔍 Vérification des variables d\'environnement');
console.log('==============================================');

const requiredVars = [
  'GOOGLE_CLOUD_VISION_API_KEY',
  'OPENAI_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('\n📋 Variables requises :');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: MANQUANTE`);
  }
});

console.log('\n🔍 Toutes les variables GOOGLE :');
Object.keys(process.env)
  .filter(key => key.includes('GOOGLE'))
  .forEach(key => {
    const value = process.env[key];
    console.log(`${key}: ${value ? value.substring(0, 10) + '...' : 'MANQUANTE'}`);
  });

console.log('\n🔍 Toutes les variables OPENAI :');
Object.keys(process.env)
  .filter(key => key.includes('OPENAI'))
  .forEach(key => {
    const value = process.env[key];
    console.log(`${key}: ${value ? value.substring(0, 10) + '...' : 'MANQUANTE'}`);
  }); 