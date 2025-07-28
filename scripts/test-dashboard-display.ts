#!/usr/bin/env tsx

/**
 * Test de l'affichage des données dans le dashboard
 * Vérifie que les données extraites par l'API sont correctement affichées
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Utiliser la clé de service pour contourner RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDashboardDisplay() {
  console.log('🧪 Test de l\'affichage des données dans le dashboard...\n');

  try {
    // 1. Récupérer l'utilisateur de test
    const testUserId = '2854e862-6b66-4e7a-afcc-e3749c3d12ed';
    
    console.log('👤 Vérification de l\'utilisateur de test...');
    const { data: user, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('id', testUserId)
      .single();

    if (userError) {
      console.log('⚠️ Utilisateur de test non trouvé, utilisation directe de l\'ID');
    } else {
      console.log('✅ Utilisateur de test trouvé:', user.email);
    }

    // 2. Récupérer les données de holerites pour l'utilisateur de test
    console.log('\n📊 Récupération des holerites pour l\'utilisateur de test...');
    const { data: holerites, error: holeritesError } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (holeritesError) {
      console.error('❌ Erreur lors de la récupération des holerites:', holeritesError);
      return;
    }

    if (!holerites || holerites.length === 0) {
      console.log('⚠️ Aucun holerite trouvé pour l\'utilisateur de test');
      console.log('💡 Vérifiez que les données de test ont été insérées');
      return;
    }

    console.log(`✅ ${holerites.length} holerites trouvés pour l'utilisateur de test`);

    // 3. Analyser le dernier holerite
    const latestHolerite = holerites[0];
    console.log('\n📊 Dernier holerite trouvé:', {
      id: latestHolerite.id,
      created_at: latestHolerite.created_at,
      user_id: latestHolerite.user_id
    });

    // 4. Analyser la structure des données
    const structuredData = latestHolerite.structured_data;
    console.log('\n🔍 Structure des données:');
    console.log('structured_data:', JSON.stringify(structuredData, null, 2));

    // 5. Extraire les données principales
    const finalData = structuredData?.final_data || {};
    const recommendations = structuredData?.recommendations || {};

    console.log('\n📈 Données extraites:');
    console.log('- Salário Bruto:', finalData.salario_bruto);
    console.log('- Salário Líquido:', finalData.salario_liquido);
    console.log('- Descontos:', finalData.descontos);
    console.log('- Statut:', finalData.statut);
    console.log('- Pays:', finalData.pays);
    console.log('- Employee Name:', finalData.employee_name);
    console.log('- Company Name:', finalData.company_name);
    console.log('- Position:', finalData.position);

    // 6. Calculer l'efficacité
    const salarioBruto = Number(finalData.salario_bruto) || 0;
    const salarioLiquido = Number(finalData.salario_liquido) || 0;
    const eficiencia = salarioBruto > 0 ? ((salarioLiquido / salarioBruto) * 100).toFixed(1) : '0.0';
    
    console.log('\n📊 Calculs:');
    console.log('- Eficiência calculée:', `${eficiencia}%`);
    console.log('- Descontos calculés:', salarioBruto - salarioLiquido);

    // 7. Vérifier les recommandations
    console.log('\n🤖 Recommandations IA:');
    console.log('- Resume Situation:', recommendations.resume_situation || 'Non disponible');
    console.log('- Nombre de recommandations:', recommendations.recommendations?.length || 0);
    console.log('- Score d\'optimisation:', recommendations.score_optimisation || 0);

    if (recommendations.recommendations) {
      console.log('\n📋 Détail des recommandations:');
      recommendations.recommendations.forEach((rec: any, index: number) => {
        console.log(`${index + 1}. ${rec.categorie} - ${rec.titre}`);
        console.log(`   Impact: ${rec.impact}, Priorité: ${rec.priorite}`);
        console.log(`   Description: ${rec.description}`);
      });
    }

    // 8. Vérifier la cohérence des données
    console.log('\n✅ Vérification de cohérence:');
    const isDataComplete = salarioBruto > 0 && salarioLiquido > 0;
    const hasRecommendations = recommendations.recommendations && recommendations.recommendations.length > 0;
    const hasEmployeeInfo = finalData.employee_name && finalData.company_name;

    console.log('- Données salariales complètes:', isDataComplete ? '✅' : '❌');
    console.log('- Recommandations présentes:', hasRecommendations ? '✅' : '❌');
    console.log('- Informations employé présentes:', hasEmployeeInfo ? '✅' : '❌');

    // 9. Résumé
    console.log('\n🎯 Résumé du test:');
    if (isDataComplete && hasRecommendations && hasEmployeeInfo) {
      console.log('✅ Toutes les données sont présentes et cohérentes');
      console.log('✅ Le dashboard devrait afficher correctement les informations');
    } else {
      console.log('⚠️ Certaines données sont manquantes ou incomplètes');
      console.log('⚠️ Vérifiez la structure des données dans Supabase');
    }

    // 10. Test d'accès frontend
    console.log('\n🌐 Test d\'accès frontend (avec clé anonyme):');
    const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    
    const { data: frontendData, error: frontendError } = await supabaseAnon
      .from('holerites')
      .select('*')
      .eq('user_id', testUserId)
      .limit(1);

    if (frontendError) {
      console.log('❌ Erreur d\'accès frontend:', frontendError.message);
      console.log('💡 Problème de RLS - vérifiez les politiques de sécurité');
    } else if (!frontendData || frontendData.length === 0) {
      console.log('⚠️ Aucune donnée accessible depuis le frontend');
      console.log('💡 Les politiques RLS bloquent l\'accès');
    } else {
      console.log('✅ Données accessibles depuis le frontend');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testDashboardDisplay().catch(console.error); 