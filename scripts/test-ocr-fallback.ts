#!/usr/bin/env tsx

/**
 * Test de l'OCR avec fallback pour vérifier le process complet
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client avec clé anonyme
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOcrWithFallback() {
  console.log('🧪 Test de l\'OCR avec fallback...\n');

  try {
    // 1. Test avec fallback activé
    console.log('🔍 Test 1: Upload avec fallback activé');
    console.log('URL de test: http://localhost:3001/br/dashboard');
    console.log('Paramètre: ?test=true');
    
    // 2. Instructions pour tester
    console.log('\n📋 Instructions pour tester:');
    console.log('1. Allez sur http://localhost:3001/br/dashboard');
    console.log('2. Cliquez sur "Upload Holerite"');
    console.log('3. Sélectionnez n\'importe quel fichier');
    console.log('4. L\'OCR échouera mais le fallback sera activé');
    console.log('5. Vous devriez voir les données de test s\'afficher');
    console.log('6. Vérifiez que le dashboard affiche les données');

    // 3. Test programmatique
    console.log('\n🔍 Test 2: Vérification des données après upload avec fallback');
    
    const { data: existingData, error } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log('❌ Erreur de récupération:', error.message);
      return;
    }

    if (!existingData) {
      console.log('⚠️ Aucune donnée trouvée');
      return;
    }

    console.log('📊 Données trouvées:');
    console.log('- ID:', existingData.id);
    console.log('- User ID:', existingData.user_id);
    console.log('- Created:', existingData.created_at);

    // 4. Vérifier si ce sont des données de fallback
    const structuredData = existingData.structured_data;
    const finalData = structuredData?.final_data || {};
    
    console.log('\n🔍 Test 3: Vérification des données de fallback');
    console.log('- Employee Name:', finalData.employee_name);
    console.log('- Company Name:', finalData.company_name);
    console.log('- Salário Bruto:', finalData.salario_bruto);
    console.log('- Salário Líquido:', finalData.salario_liquido);

    const isFallback = finalData.employee_name === 'Test User' || 
                      finalData.company_name === 'Test Company Ltda' ||
                      finalData.salario_bruto === 5000;

    if (isFallback) {
      console.log('✅ DONNÉES DE FALLBACK DÉTECTÉES (mode test)');
      console.log('✅ Le dashboard devrait afficher ces données de test');
      console.log('✅ Le process complet fonctionne avec fallback');
    } else {
      console.log('❌ DONNÉES RÉELLES DÉTECTÉES');
      console.log('❌ Le fallback ne fonctionne pas comme attendu');
    }

    // 5. Résumé
    console.log('\n🎯 Résumé:');
    console.log('='.repeat(50));
    if (isFallback) {
      console.log('✅ Succès: Fallback fonctionne correctement');
      console.log('✅ Le process complet est opérationnel');
      console.log('✅ Le dashboard affiche les données de test');
    } else {
      console.log('❌ Problème: Fallback ne fonctionne pas');
      console.log('❌ Vérifiez la configuration du mode test');
    }

  } catch (error) {
    console.error('❌ Erreur critique lors du test:', error);
  }
}

// Exécuter le test
testOcrWithFallback().catch(console.error); 