#!/usr/bin/env tsx

/**
 * Diagnostic de la connectivité OCR
 */

import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

async function testOcrConnectivity() {
  console.log('🔍 Diagnostic de la connectivité OCR...\n');

  try {
    // 1. Vérifier les clés OCR
    const paidKey = process.env.OCR_SPACE_PAID_KEY;
    const freeKey = process.env.NEXT_PUBLIC_OCR_SPACE_KEY;
    
    console.log('🔑 Vérification des clés OCR:');
    console.log('- Clé payante:', paidKey ? '✅ Configurée' : '❌ Non configurée');
    console.log('- Clé gratuite:', freeKey ? '✅ Configurée' : '❌ Non configurée');
    console.log('- Clé utilisée:', paidKey || freeKey || 'helloworld');

    // 2. Test de connectivité vers OCR.Space
    console.log('\n🌐 Test de connectivité vers OCR.Space...');
    
    try {
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: { 
          'apikey': paidKey || freeKey || 'helloworld',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'url': 'https://example.com/test.jpg',
          'language': 'por',
          'isTable': 'true',
          'scale': 'true',
          'OCREngine': '2'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Connectivité OK');
        console.log('- Status:', response.status);
        console.log('- Response:', JSON.stringify(result, null, 2));
      } else {
        console.log('❌ Erreur de connectivité');
        console.log('- Status:', response.status);
        console.log('- Status Text:', response.statusText);
      }
    } catch (error) {
      console.log('❌ Erreur de connexion:', error);
    }

    // 3. Recommandations
    console.log('\n💡 Recommandations:');
    console.log('1. Si OCR.Space est surchargé, utilisez une clé payante');
    console.log('2. Ajoutez OCR_SPACE_PAID_KEY dans .env.local');
    console.log('3. Ou augmentez le timeout dans lib/ocr.ts');
    console.log('4. Ou utilisez un service OCR alternatif');

    // 4. Test avec fallback
    console.log('\n🔄 Test avec fallback activé:');
    console.log('Le système utilise maintenant le fallback temporairement');
    console.log('Cela permet de tester le process complet même si OCR échoue');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  }
}

// Exécuter le diagnostic
testOcrConnectivity().catch(console.error); 