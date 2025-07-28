#!/usr/bin/env tsx

/**
 * Test avec un vrai holerite (petite taille pour éviter timeout)
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client avec clé anonyme
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealHolerite() {
  console.log('🧪 Test avec un vrai holerite...\n');

  try {
    // 1. Vérifier qu'il n'y a pas de données de fallback
    console.log('🔍 Test 1: Vérification des données existantes');
    
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

    console.log('📊 Données existantes:');
    console.log('- ID:', existingData.id);
    console.log('- User ID:', existingData.user_id);
    console.log('- Created:', existingData.created_at);

    // 2. Vérifier si ce sont des données de fallback
    const structuredData = existingData.structured_data;
    const finalData = structuredData?.final_data || {};
    
    console.log('\n🔍 Test 2: Vérification des données de fallback');
    console.log('- Employee Name:', finalData.employee_name);
    console.log('- Company Name:', finalData.company_name);
    console.log('- Salário Bruto:', finalData.salario_bruto);
    console.log('- Salário Líquido:', finalData.salario_liquido);

    const isFallback = finalData.employee_name === 'Test User' || 
                      finalData.company_name === 'Test Company Ltda' ||
                      finalData.salario_bruto === 5000;

    if (isFallback) {
      console.log('❌ DONNÉES DE FALLBACK DÉTECTÉES');
      console.log('❌ Le dashboard ne devrait PAS afficher ces données');
      console.log('❌ Upload un vrai holerite pour voir les vraies données');
    } else {
      console.log('✅ DONNÉES RÉELLES DÉTECTÉES');
      console.log('✅ Le dashboard devrait afficher ces vraies données');
    }

    // 3. Instructions pour tester
    console.log('\n📋 Instructions pour tester avec un vrai holerite:');
    console.log('1. Préparez un vrai holerite (PDF/JPG, < 1MB pour éviter timeout)');
    console.log('2. Allez sur http://localhost:3002/br/dashboard');
    console.log('3. Cliquez sur "Upload Holerite"');
    console.log('4. Sélectionnez votre vrai holerite');
    console.log('5. Vérifiez que:');
    console.log('   - L\'OCR fonctionne (pas d\'erreur timeout)');
    console.log('   - Les vraies données s\'affichent (pas "Test User")');
    console.log('   - Les recommandations IA sont générées');
    console.log('6. Si OCR échoue, vous devriez voir un message d\'erreur clair');

    // 4. Résumé
    console.log('\n🎯 Résumé:');
    console.log('='.repeat(50));
    if (isFallback) {
      console.log('❌ Problème: Données de fallback détectées');
      console.log('❌ Solution: Upload un vrai holerite pour tester');
    } else {
      console.log('✅ OK: Données réelles détectées');
      console.log('✅ Le dashboard devrait fonctionner correctement');
    }

  } catch (error) {
    console.error('❌ Erreur critique lors du test:', error);
  }
}

// Exécuter le test
testRealHolerite().catch(console.error); 