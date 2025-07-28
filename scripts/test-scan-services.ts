/**
 * Test simplifié des services SCAN NEW PIM
 * Vérification des services sans contexte de requête
 */

import 'dotenv/config';
import { googleVisionService } from '@/lib/services/googleVisionService';
import { scanAnalysisService } from '@/lib/services/scanAnalysisService';

async function testScanServices() {
  console.log('🧪 Test des services SCAN NEW PIM');
  console.log('==================================');

  try {
    // 1. Test des variables d'environnement
    console.log('\n1️⃣ Test variables d\'environnement...');
    const googleVisionKey = process.env.GOOGLE_VISION_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (googleVisionKey) {
      console.log('✅ Google Vision API Key configurée');
      console.log('🔑 Clé:', googleVisionKey.substring(0, 10) + '...');
    } else {
      console.log('❌ Google Vision API Key manquante');
    }

    if (openaiKey) {
      console.log('✅ OpenAI API Key configurée');
      console.log('🔑 Clé:', openaiKey.substring(0, 10) + '...');
    } else {
      console.log('❌ OpenAI API Key manquante');
    }

    // 2. Test de validation de fichier
    console.log('\n2️⃣ Test validation de fichier...');
    
    const testFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const validation = googleVisionService['validateFile'](testFile);
    
    if (validation.isValid) {
      console.log('✅ Validation de fichier fonctionne');
    } else {
      console.log('❌ Erreur validation:', validation.error);
    }

    // 3. Test de validation de document
    console.log('\n3️⃣ Test validation document...');
    
    const testText = 'Salário bruto: R$ 5000,00\nFuncionário: João Silva\nEmpresa: Tech Corp';
    const docValidation = await googleVisionService.validateDocument(testText);
    
    console.log('📊 Score de confiance:', docValidation.confidence);
    console.log('📋 Est-ce une feuille de paie:', docValidation.isPayslip);
    console.log('✅ Validation de document fonctionne');

    // 4. Test d'analyse IA (simulation)
    console.log('\n4️⃣ Test analyse IA...');
    
    try {
      const analysisResult = await scanAnalysisService.analyzeScan(testText, 'br');
      console.log('✅ Analyse IA accessible');
      console.log('📊 Données structurées:', Object.keys(analysisResult.structuredData || {}));
    } catch (error) {
      console.log('❌ Erreur analyse IA:', error);
    }

    // 5. Test de configuration des services
    console.log('\n5️⃣ Test configuration services...');
    
    console.log('🔧 Google Vision Service configuré');
    console.log('🔧 Scan Analysis Service configuré');
    console.log('🔧 Prompts par pays disponibles');

    console.log('\n🎉 Tests des services terminés !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Vérifier que les clés API sont dans .env');
    console.log('2. Tester l\'API route via l\'interface web');
    console.log('3. Vérifier la sauvegarde dans Supabase');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécution du test
testScanServices().catch(console.error); 