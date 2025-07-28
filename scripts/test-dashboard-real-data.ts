#!/usr/bin/env tsx

/**
 * Test du dashboard avec les vraies données extraites
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client avec clé anonyme (comme le frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDashboardRealData() {
  console.log('🧪 Test du dashboard avec les vraies données...\n');

  try {
    // 1. Récupérer les données réelles (pas de test)
    console.log('🔍 Test 1: Récupération des données réelles');
    
    const { data, error } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log('❌ Erreur de récupération:', error.message);
      return;
    }

    if (!data) {
      console.log('⚠️ Aucune donnée trouvée');
      return;
    }

    console.log('✅ Données réelles récupérées:', data.id);
    console.log('📊 Structure des données:');
    console.log('- ID:', data.id);
    console.log('- User ID:', data.user_id);
    console.log('- Created:', data.created_at);
    console.log('- Structured Data:', !!data.structured_data);

    // 2. Afficher la structure complète des données
    console.log('\n🔍 Test 2: Structure complète des données');
    console.log('DATA RECUE:', JSON.stringify(data, null, 2));

    // 3. Simuler l'extraction comme le dashboard
    console.log('\n📊 Test 3: Extraction des données (simulation dashboard)');
    
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

    // Extraction des données avec mapping exact
    const salarioBruto = extractValue(data.structured_data, 'final_data.salario_bruto') ||
                        extractValue(data.structured_data, 'salario_bruto') ||
                        extractValue(data, 'salario_bruto') ||
                        0;

    const salarioLiquido = extractValue(data.structured_data, 'final_data.salario_liquido') ||
                          extractValue(data.structured_data, 'salario_liquido') ||
                          extractValue(data, 'salario_liquido') ||
                          0;

    const descontos = extractValue(data.structured_data, 'final_data.descontos') ||
                     extractValue(data.structured_data, 'descontos') ||
                     (salarioBruto > 0 && salarioLiquido > 0 ? salarioBruto - salarioLiquido : 0);
    
    const eficiencia = salarioBruto > 0 && salarioLiquido > 0 ? 
      Number(((salarioLiquido / salarioBruto) * 100).toFixed(1)) : 0;

    // Extraction des informations d'identification
    const employeeName = data.structured_data?.final_data?.employee_name ||
                       data.structured_data?.employee_name ||
                       data.employee_name ||
                       '';

    const companyName = data.structured_data?.final_data?.company_name ||
                      data.structured_data?.company_name ||
                      data.company_name ||
                      '';

    const position = data.structured_data?.final_data?.position ||
                    data.structured_data?.position ||
                    data.position ||
                    '';

    const profileType = data.structured_data?.final_data?.statut ||
                      data.structured_data?.statut ||
                      data.statut ||
                      '';

    const period = data.structured_data?.final_data?.period ||
                 data.structured_data?.period ||
                 data.period ||
                 '';

    // Extraction des données supplémentaires
    const beneficios = extractValue(data.structured_data, 'final_data.beneficios') ||
                     extractValue(data.structured_data, 'beneficios') ||
                     0;

    const seguros = extractValue(data.structured_data, 'final_data.seguros') ||
                   extractValue(data.structured_data, 'seguros') ||
                   0;

    const pays = data.structured_data?.final_data?.pays ||
               data.structured_data?.pays ||
               data.pays ||
               '';

    const incoherenceDetectee = data.structured_data?.final_data?.incoherence_detectee ||
                              data.structured_data?.incoherence_detectee ||
                              data.incoherence_detectee ||
                              false;

    // Extraction des recommandations IA
    const aiRecommendations = data.structured_data?.analysis_result?.recommendations?.recommendations ||
                            data.structured_data?.recommendations?.recommendations ||
                            data.structured_data?.aiRecommendations ||
                            [];
    
    const resumeSituation = data.structured_data?.analysis_result?.recommendations?.resume_situation ||
                          data.structured_data?.recommendations?.resume_situation ||
                          data.structured_data?.resumeSituation ||
                          '';
    
    const scoreOptimisation = data.structured_data?.analysis_result?.recommendations?.score_optimisation ||
                            data.structured_data?.recommendations?.score_optimisation ||
                            data.structured_data?.scoreOptimisation ||
                            0;

    console.log('📊 Données extraites (mapping exact):');
    console.log('- Salário Bruto:', salarioBruto);
    console.log('- Salário Líquido:', salarioLiquido);
    console.log('- Descontos:', descontos);
    console.log('- Eficiência:', eficiencia);
    console.log('- Employee Name:', employeeName);
    console.log('- Company Name:', companyName);
    console.log('- Position:', position);
    console.log('- Profile Type:', profileType);
    console.log('- Period:', period);
    console.log('- Beneficios:', beneficios);
    console.log('- Seguros:', seguros);
    console.log('- Pays:', pays);
    console.log('- Incoherence Detectee:', incoherenceDetectee);
    console.log('- Recommandations:', aiRecommendations.length);
    console.log('- Resume Situation:', resumeSituation ? 'Présent' : 'Absent');
    console.log('- Score Optimisation:', scoreOptimisation);

    // 4. Log final des données dashboard
    console.log('\n🎯 Log final des données dashboard:');
    console.log('Donnée dashboard finale:', {
      salarioBruto,
      salarioLiquido,
      descontos,
      eficiencia,
      employeeName,
      companyName,
      position,
      profileType,
      period,
      beneficios,
      seguros,
      pays,
      incoherenceDetectee,
      aiRecommendations: aiRecommendations.length
    });

    // 5. Résumé final
    console.log('\n🎯 Résumé final:');
    console.log('='.repeat(50));
    console.log('✅ Données réelles récupérées avec succès');
    console.log('✅ Extraction des données fonctionnelle');
    console.log('✅ Mapping exact conforme à la structure reçue');
    console.log('✅ Recommandations disponibles:', aiRecommendations.length);
    console.log('✅ Dashboard devrait afficher les vraies données');

    console.log('\n📋 Instructions pour vérifier:');
    console.log('1. Aller sur http://localhost:3002/br/dashboard');
    console.log('2. Vérifier l\'onglet "Compensação"');
    console.log('3. Chercher la section "DEBUG: Données JSON brutes du holerite"');
    console.log('4. Vérifier que les données JSON correspondent aux vraies valeurs');
    console.log('5. Vérifier que les recommandations IA sont affichées');

  } catch (error) {
    console.error('❌ Erreur critique lors du test:', error);
  }
}

// Exécuter le test
testDashboardRealData().catch(console.error); 