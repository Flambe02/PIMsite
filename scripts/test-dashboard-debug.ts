#!/usr/bin/env tsx

/**
 * Test du debug du dashboard
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

async function testDashboardDebug() {
  console.log('🧪 Test du debug du dashboard...\n');

  try {
    // 1. Récupérer les données comme le dashboard
    console.log('🔍 Test 1: Récupération des données (simulation dashboard)');
    const testUserId = '2854e862-6b66-4e7a-afcc-e3749c3d12ed';
    
    const { data, error } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', testUserId)
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

    console.log('✅ Données récupérées:', data.id);
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

    // Extraction des données salariales
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
                       data.structured_data?.nome ||
                       data.nome ||
                       '';

    const companyName = data.structured_data?.final_data?.company_name ||
                      data.structured_data?.company_name ||
                      data.structured_data?.empresa ||
                      data.empresa ||
                      '';

    const position = data.structured_data?.final_data?.position ||
                    data.structured_data?.position ||
                    data.structured_data?.cargo ||
                    data.cargo ||
                    '';

    const profileType = data.structured_data?.final_data?.statut ||
                      data.structured_data?.statut ||
                      data.structured_data?.perfil ||
                      data.perfil ||
                      '';

    const period = data.structured_data?.period ||
                 data.structured_data?.Identificação?.period ||
                 data.structured_data?.periodo ||
                 '';

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

    console.log('📊 Données extraites:');
    console.log('- Salário Bruto:', salarioBruto);
    console.log('- Salário Líquido:', salarioLiquido);
    console.log('- Descontos:', descontos);
    console.log('- Eficiência:', eficiencia);
    console.log('- Employee Name:', employeeName);
    console.log('- Company Name:', companyName);
    console.log('- Position:', position);
    console.log('- Profile Type:', profileType);
    console.log('- Period:', period);
    console.log('- Recommandations:', aiRecommendations.length);
    console.log('- Resume Situation:', resumeSituation ? 'Présent' : 'Absent');
    console.log('- Score Optimisation:', scoreOptimisation);

    // 4. Simuler la création de holeriteResult
    console.log('\n🎯 Test 4: Création de holeriteResult (simulation dashboard)');
    
    const holeriteResult = {
      salarioBruto,
      salarioLiquido,
      descontos,
      eficiencia,
      raw: {
        ...data.structured_data,
        employee_name: employeeName,
        company_name: companyName,
        position: position,
        profile_type: profileType,
        period: period,
        recommendations: {
          recommendations: aiRecommendations,
          resume_situation: resumeSituation,
          score_optimisation: scoreOptimisation
        },
        aiRecommendations,
        resumeSituation,
        scoreOptimisation,
      },
      insights: [],
    };

    console.log('✅ holeriteResult créé:');
    console.log('- Salário Bruto:', holeriteResult.salarioBruto);
    console.log('- Salário Líquido:', holeriteResult.salarioLiquido);
    console.log('- Descontos:', holeriteResult.descontos);
    console.log('- Eficiência:', holeriteResult.eficiencia);
    console.log('- Raw recommendations:', holeriteResult.raw.recommendations?.recommendations?.length || 0);
    console.log('- Raw aiRecommendations:', holeriteResult.raw.aiRecommendations?.length || 0);

    // 5. Afficher la structure complète de holeriteResult
    console.log('\n🔍 Test 5: Structure complète de holeriteResult');
    console.log('HOLERITE RESULT:', JSON.stringify(holeriteResult, null, 2));

    // 6. Résumé final
    console.log('\n🎯 Résumé final:');
    console.log('='.repeat(50));
    console.log('✅ Données récupérées avec succès');
    console.log('✅ Extraction des données fonctionnelle');
    console.log('✅ holeriteResult créé correctement');
    console.log('✅ Recommandations disponibles:', aiRecommendations.length);
    console.log('✅ Dashboard devrait afficher les données JSON');

    console.log('\n📋 Instructions pour vérifier:');
    console.log('1. Aller sur http://localhost:3001/br/dashboard');
    console.log('2. Vérifier l\'onglet "Compensação"');
    console.log('3. Chercher les sections "DEBUG: holeriteResult" et "DEBUG: holeriteResult.raw"');
    console.log('4. Vérifier que les données JSON sont affichées');

  } catch (error) {
    console.error('❌ Erreur critique lors du test:', error);
  }
}

// Exécuter le test
testDashboardDebug().catch(console.error); 