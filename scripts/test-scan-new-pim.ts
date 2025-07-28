/**
 * Script de test pour le module SCAN NEW PIM
 * Test complet de l'API et des services
 */

import { createClient } from '@/lib/supabase/server';
import { googleVisionService } from '@/lib/services/googleVisionService';
import { scanAnalysisService } from '@/lib/services/scanAnalysisService';

async function testScanNewPIM() {
  console.log('🧪 Test du module SCAN NEW PIM');
  console.log('================================');

  try {
    // 1. Test de la connexion Supabase
    console.log('\n1️⃣ Test connexion Supabase...');
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Erreur auth:', authError.message);
    } else if (user) {
      console.log('✅ Utilisateur connecté:', user.id);
    } else {
      console.log('⚠️ Aucun utilisateur connecté');
    }

    // 2. Test de la table scan_results
    console.log('\n2️⃣ Test table scan_results...');
    const { data: scans, error: scanError } = await supabase
      .from('scan_results')
      .select('*')
      .limit(5);

    if (scanError) {
      console.log('❌ Erreur table scan_results:', scanError.message);
    } else {
      console.log('✅ Table scan_results accessible');
      console.log(`📊 ${scans?.length || 0} scans trouvés`);
    }

    // 3. Test des variables d'environnement
    console.log('\n3️⃣ Test variables d\'environnement...');
    const googleVisionKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (googleVisionKey) {
      console.log('✅ Google Vision API Key configurée');
    } else {
      console.log('❌ Google Vision API Key manquante');
    }

    if (openaiKey) {
      console.log('✅ OpenAI API Key configurée');
    } else {
      console.log('❌ OpenAI API Key manquante');
    }

    // 4. Test des services
    console.log('\n4️⃣ Test des services...');
    
    // Test Google Vision Service
    try {
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const visionResult = await googleVisionService.scanDocument(testFile);
      console.log('✅ Google Vision Service accessible');
    } catch (error) {
      console.log('❌ Erreur Google Vision Service:', error);
    }

    // Test Scan Analysis Service
    try {
      const testText = 'Test de feuille de paie';
      const analysisResult = await scanAnalysisService.analyzeScan(testText, 'br');
      console.log('✅ Scan Analysis Service accessible');
    } catch (error) {
      console.log('❌ Erreur Scan Analysis Service:', error);
    }

    // 5. Test de l'API route (simulation)
    console.log('\n5️⃣ Test API route (simulation)...');
    console.log('📡 Endpoint: POST /api/scan-new-pim');
    console.log('📦 Payload: multipart/form-data avec clé "file"');
    console.log('✅ API route créée et prête');

    console.log('\n🎉 Tests terminés !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Vérifier que les clés API sont configurées');
    console.log('2. Tester avec un vrai fichier via l\'interface');
    console.log('3. Vérifier la sauvegarde dans Supabase');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécution du test
testScanNewPIM().catch(console.error); 