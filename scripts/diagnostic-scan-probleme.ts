/**
 * Script de diagnostic pour identifier le problème de scan et affichage dashboard
 * Teste le processus complet : scan → sauvegarde → récupération → affichage
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const supabaseUrl = 'https://arevqehvhkcqivwyojou.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnosticScanProbleme() {
  console.log('🔍 DIAGNOSTIC COMPLET DU PROCESSUS SCAN → DASHBOARD');
  console.log('=' .repeat(60));

  try {
    // 1. Vérifier la connexion Supabase
    console.log('\n1️⃣ Vérification de la connexion Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('holerites')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur connexion Supabase:', testError);
      return;
    }
    console.log('✅ Connexion Supabase OK');

    // 2. Récupérer tous les utilisateurs avec des holerites
    console.log('\n2️⃣ Récupération des utilisateurs avec holerites...');
    const { data: usersWithHolerites, error: usersError } = await supabase
      .from('holerites')
      .select('user_id, created_at, nome, empresa, salario_bruto, salario_liquido')
      .order('created_at', { ascending: false })
      .limit(10);

    if (usersError) {
      console.error('❌ Erreur récupération utilisateurs:', usersError);
      return;
    }

    if (!usersWithHolerites || usersWithHolerites.length === 0) {
      console.log('⚠️ Aucun holerite trouvé dans la base de données');
      return;
    }

    console.log(`✅ ${usersWithHolerites.length} holerites trouvés`);
    
    // Afficher les 3 derniers holerites
    console.log('\n📊 3 derniers holerites:');
    usersWithHolerites.slice(0, 3).forEach((holerite, index) => {
      console.log(`  ${index + 1}. User: ${holerite.user_id?.substring(0, 8)}... | ${holerite.nome} | ${holerite.empresa} | Bruto: R$ ${holerite.salario_bruto} | Líquido: R$ ${holerite.salario_liquido} | Date: ${holerite.created_at}`);
    });

    // 3. Analyser un utilisateur spécifique
    const testUserId = usersWithHolerites[0].user_id;
    console.log(`\n3️⃣ Analyse détaillée pour l'utilisateur: ${testUserId.substring(0, 8)}...`);

    // Récupérer les données complètes de cet utilisateur
    const { data: userHolerites, error: userError } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (userError) {
      console.error('❌ Erreur récupération données utilisateur:', userError);
      return;
    }

    console.log('✅ Données utilisateur récupérées');
    console.log('\n📋 STRUCTURE DES DONNÉES:');
    console.log('  - ID:', userHolerites.id);
    console.log('  - User ID:', userHolerites.user_id);
    console.log('  - Nom:', userHolerites.nome);
    console.log('  - Empresa:', userHolerites.empresa);
    console.log('  - Salário Bruto:', userHolerites.salario_bruto);
    console.log('  - Salário Líquido:', userHolerites.salario_liquido);
    console.log('  - Created At:', userHolerites.created_at);

    // 4. Analyser la structure structured_data
    console.log('\n4️⃣ Analyse de structured_data...');
    if (userHolerites.structured_data) {
      console.log('✅ structured_data présent');
      
      // Vérifier les différents chemins possibles
      const paths = [
        'final_data.salario_bruto',
        'final_data.salario_liquido',
        'gross_salary',
        'net_salary',
        'salario_bruto',
        'salario_liquido'
      ];

      console.log('\n🔍 Vérification des chemins de données:');
      paths.forEach(path => {
        const keys = path.split('.');
        let value = userHolerites.structured_data;
        
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            value = null;
            break;
          }
        }
        
        console.log(`  ${path}: ${value !== null ? value : '❌ Non trouvé'}`);
      });

      // Vérifier les recommandations
      console.log('\n🔍 Vérification des recommandations:');
      const recommendations = userHolerites.structured_data.recommendations;
      if (recommendations) {
        console.log('  - Recommendations présent:', !!recommendations);
        console.log('  - Score optimisation:', recommendations.score_optimisation || 'Non trouvé');
        console.log('  - Nombre de recommandations:', Array.isArray(recommendations.recommendations) ? recommendations.recommendations.length : 'Non trouvé');
      } else {
        console.log('  - Recommendations: ❌ Non trouvé');
      }

    } else {
      console.log('❌ structured_data absent');
    }

    // 5. Vérifier les scan_results correspondants
    console.log('\n5️⃣ Vérification des scan_results...');
    const { data: scanResults, error: scanError } = await supabase
      .from('scan_results')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (scanError) {
      console.error('❌ Erreur récupération scan_results:', scanError);
    } else {
      console.log('✅ scan_results trouvé');
      console.log('  - Scan ID:', scanResults.id);
      console.log('  - File name:', scanResults.file_name);
      console.log('  - Confidence score:', scanResults.confidence_score);
      console.log('  - Scan version:', scanResults.scan_version);
    }

    // 6. Test de simulation du dashboard
    console.log('\n6️⃣ Simulation du processus dashboard...');
    
    // Simuler l'extraction des données comme dans le dashboard
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
      
      if (typeof value === 'object' && value !== null && 'valor' in value) {
        value = value.valor;
      }
      
      const numValue = Number(value);
      return isNaN(numValue) ? defaultValue : numValue;
    };

    // Extraction comme dans le dashboard
    const salarioBruto = extractValue(userHolerites.structured_data, 'final_data.salario_bruto') ||
                        extractValue(userHolerites.structured_data, 'gross_salary') ||
                        extractValue(userHolerites.structured_data, 'salario_bruto') ||
                        extractValue(userHolerites, 'salario_bruto') ||
                        extractValue(userHolerites, 'gross_salary') ||
                        0;

    const salarioLiquido = extractValue(userHolerites.structured_data, 'final_data.salario_liquido') ||
                          extractValue(userHolerites.structured_data, 'net_salary') ||
                          extractValue(userHolerites.structured_data, 'salario_liquido') ||
                          extractValue(userHolerites, 'salario_liquido') ||
                          extractValue(userHolerites, 'net_salary') ||
                          0;

    console.log('\n📊 RÉSULTATS DE L\'EXTRACTION DASHBOARD:');
    console.log('  - Salário Bruto extrait:', salarioBruto);
    console.log('  - Salário Líquido extrait:', salarioLiquido);
    console.log('  - Valeurs > 0?', salarioBruto > 0 && salarioLiquido > 0 ? '✅ OUI' : '❌ NON');

    // 7. Vérifier les filtres du dashboard
    console.log('\n7️⃣ Vérification des filtres dashboard...');
    const employeeName = userHolerites.structured_data?.final_data?.employee_name ||
                        userHolerites.structured_data?.employee_name ||
                        userHolerites.nome ||
                        '';

    const companyName = userHolerites.structured_data?.final_data?.company_name ||
                       userHolerites.structured_data?.company_name ||
                       userHolerites.empresa ||
                       '';

    console.log('  - Employee Name:', employeeName);
    console.log('  - Company Name:', companyName);
    console.log('  - Est-ce des données de test?', 
      employeeName === 'Test User' || companyName === 'Test Company Ltda' || salarioBruto === 5000 ? '⚠️ OUI' : '✅ NON');

    // 8. Recommandations finales
    console.log('\n8️⃣ DIAGNOSTIC FINAL:');
    
    if (salarioBruto > 0 && salarioLiquido > 0) {
      console.log('✅ Les données sont présentes et valides');
      
      if (employeeName === 'Test User' || companyName === 'Test Company Ltda') {
        console.log('⚠️ PROBLÈME: Les données sont filtrées par le dashboard (données de test détectées)');
        console.log('💡 SOLUTION: Modifier les filtres dans dashboard/page.tsx ou utiliser des données réelles');
      } else {
        console.log('✅ Les données devraient s\'afficher dans le dashboard');
        console.log('💡 VÉRIFIER: Les logs du navigateur pour d\'autres erreurs');
      }
    } else {
      console.log('❌ PROBLÈME: Les données ne sont pas correctement extraites');
      console.log('💡 CAUSE POSSIBLE: Structure de données incorrecte dans structured_data');
      console.log('💡 SOLUTION: Vérifier la structure dans l\'API scan-new-pim/route.ts');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le diagnostic
diagnosticScanProbleme().then(() => {
  console.log('\n🏁 Diagnostic terminé');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 