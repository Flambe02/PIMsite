/**
 * Script de test simple pour vérifier le processus de scan
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://arevqehvhkcqivwyojou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZXZxZWh2aGtjcWl2d3lvam91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTM5MzM1NSwiZXhwIjoyMDY2OTY5MzU1fQ.0xlEvFGJeE-aBSYNU9O1fgADCPFHnk1rSnjmR4WQkr8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testScanProcess() {
  console.log('🔍 TEST DU PROCESSUS SCAN → DASHBOARD');
  console.log('=' .repeat(50));

  try {
    // 1. Vérifier la connexion
    console.log('\n1️⃣ Test de connexion Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('holerites')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur connexion:', testError);
      return;
    }
    console.log('✅ Connexion OK');

    // 2. Récupérer les derniers holerites
    console.log('\n2️⃣ Récupération des derniers holerites...');
    const { data: holerites, error: holeritesError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (holeritesError) {
      console.error('❌ Erreur récupération holerites:', holeritesError);
      return;
    }

    if (!holerites || holerites.length === 0) {
      console.log('⚠️ Aucun holerite trouvé');
      return;
    }

    console.log(`✅ ${holerites.length} holerites trouvés`);

    // 3. Analyser le premier holerite
    const latestHolerite = holerites[0];
    console.log('\n3️⃣ Analyse du dernier holerite:');
    console.log('  - ID:', latestHolerite.id);
    console.log('  - User ID:', latestHolerite.user_id?.substring(0, 8) + '...');
    console.log('  - Nom:', latestHolerite.nome);
    console.log('  - Empresa:', latestHolerite.empresa);
    console.log('  - Salário Bruto:', latestHolerite.salario_bruto);
    console.log('  - Salário Líquido:', latestHolerite.salario_liquido);
    console.log('  - Created At:', latestHolerite.created_at);

    // 4. Vérifier structured_data
    console.log('\n4️⃣ Vérification structured_data:');
    if (latestHolerite.structured_data) {
      console.log('✅ structured_data présent');
      
      const sd = latestHolerite.structured_data;
      console.log('  - final_data présent:', !!sd.final_data);
      console.log('  - recommendations présent:', !!sd.recommendations);
      console.log('  - analysis_result présent:', !!sd.analysis_result);
      
      if (sd.final_data) {
        console.log('  - final_data.salario_bruto:', sd.final_data.salario_bruto);
        console.log('  - final_data.salario_liquido:', sd.final_data.salario_liquido);
      }
    } else {
      console.log('❌ structured_data absent');
    }

    // 5. Vérifier scan_results correspondant
    console.log('\n5️⃣ Vérification scan_results:');
    const { data: scanResults, error: scanError } = await supabase
      .from('scan_results')
      .select('*')
      .eq('user_id', latestHolerite.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (scanError) {
      console.error('❌ Erreur scan_results:', scanError);
    } else {
      console.log('✅ scan_results trouvé');
      console.log('  - Scan ID:', scanResults.id);
      console.log('  - File name:', scanResults.file_name);
      console.log('  - Confidence score:', scanResults.confidence_score);
    }

    // 6. Test d'extraction comme dans le dashboard
    console.log('\n6️⃣ Test d\'extraction dashboard:');
    
    const extractValue = (obj: any, path: string, defaultValue: any = 0) => {
      if (!obj) return defaultValue;
      
      const keys = path.split('.');
      let value = obj;
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return defaultValue;
        }
      }
      
      if (value === null || value === undefined || value === '') {
        return defaultValue;
      }
      
      const numValue = Number(value);
      return isNaN(numValue) ? defaultValue : numValue;
    };

    const salarioBruto = extractValue(latestHolerite.structured_data, 'final_data.salario_bruto') ||
                        extractValue(latestHolerite.structured_data, 'gross_salary') ||
                        extractValue(latestHolerite.structured_data, 'salario_bruto') ||
                        extractValue(latestHolerite, 'salario_bruto') ||
                        0;

    const salarioLiquido = extractValue(latestHolerite.structured_data, 'final_data.salario_liquido') ||
                          extractValue(latestHolerite.structured_data, 'net_salary') ||
                          extractValue(latestHolerite.structured_data, 'salario_liquido') ||
                          extractValue(latestHolerite, 'salario_liquido') ||
                          0;

    console.log('  - Salário Bruto extrait:', salarioBruto);
    console.log('  - Salário Líquido extrait:', salarioLiquido);
    console.log('  - Valeurs > 0?', salarioBruto > 0 && salarioLiquido > 0 ? '✅ OUI' : '❌ NON');

    // 7. Diagnostic final
    console.log('\n7️⃣ DIAGNOSTIC FINAL:');
    
    if (salarioBruto > 0 && salarioLiquido > 0) {
      console.log('✅ Les données sont présentes et valides');
      console.log('💡 Le problème peut être dans les filtres du dashboard ou dans l\'affichage');
    } else {
      console.log('❌ Les données ne sont pas correctement extraites');
      console.log('💡 Le problème est dans la structure des données ou dans l\'API de scan');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le test
testScanProcess().then(() => {
  console.log('\n🏁 Test terminé');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 