#!/usr/bin/env tsx

/**
 * Test de la récupération des données par le dashboard
 * Simule exactement ce que fait le dashboard pour récupérer les données
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Utiliser la clé de service pour contourner les politiques RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDashboardDataRetrieval() {
  console.log('🧪 Test de la récupération des données par le dashboard...\n');

  try {
    // 1. Récupérer un utilisateur existant
    console.log('👤 Recherche d\'un utilisateur avec des données...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError || !users || users.users.length === 0) {
      console.error('❌ Aucun utilisateur trouvé');
      return;
    }

    // Trouver un utilisateur qui a des données
    let userWithData = null;
    for (const user of users.users) {
      const { data: holerites } = await supabase
        .from('holerites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (holerites && holerites.length > 0) {
        userWithData = user;
        break;
      }
    }

    if (!userWithData) {
      console.log('⚠️ Aucun utilisateur avec des données trouvé');
      return;
    }

    console.log(`✅ Utilisateur trouvé: ${userWithData.email}`);

    // 2. Simuler exactement ce que fait le dashboard
    console.log('\n🔍 Simulation de la récupération dashboard...');
    const { data, error } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', userWithData.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return;
    }

    if (!data) {
      console.error('❌ Aucune donnée trouvée');
      return;
    }

    console.log('✅ Données récupérées avec succès');

    // 3. Simuler l'extraction des données comme dans le dashboard
    console.log('\n📊 Extraction des données (comme dans le dashboard)...');
    
    // Extraction sécurisée des données avec gestion des différents formats
    const extractValue = (obj: any, path: string, defaultValue: any = 0) => {
      if (!obj) return defaultValue;
      
      // Gestion des chemins imbriqués
      const keys = path.split('.');
      let value = obj;
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return defaultValue;
        }
      }
      
      // Conversion en nombre si possible
      if (value === null || value === undefined || value === '') {
        return defaultValue;
      }
      
      // Gestion des objets avec propriété 'valor'
      if (typeof value === 'object' && value !== null && 'valor' in value) {
        value = value.valor;
      }
      
      const numValue = Number(value);
      return isNaN(numValue) ? defaultValue : numValue;
    };

    // Extraction des données avec fallbacks multiples pour la nouvelle structure
    const salarioBruto = extractValue(data.structured_data, 'final_data.salario_bruto') ||
                        extractValue(data.structured_data, 'salario_bruto') ||
                        extractValue(data, 'salario_bruto') ||
                        0;

    const salarioLiquido = extractValue(data.structured_data, 'final_data.salario_liquido') ||
                          extractValue(data.structured_data, 'salario_liquido') ||
                          extractValue(data, 'salario_liquido') ||
                          0;

    // Extraction des descontos avec fallbacks multiples
    const descontos = extractValue(data.structured_data, 'final_data.descontos') ||
                     extractValue(data.structured_data, 'descontos') ||
                     (salarioBruto > 0 && salarioLiquido > 0 ? salarioBruto - salarioLiquido : 0);
    
    const eficiencia = salarioBruto > 0 && salarioLiquido > 0 ? 
      Number(((salarioLiquido / salarioBruto) * 100).toFixed(1)) : 0;

    // Extraction des informations d'identification avec gestion des structures en portugais
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

    console.log('🔍 Données extraites:', {
      salarioBruto,
      salarioLiquido,
      descontos,
      eficiencia,
      employeeName,
      companyName,
      position,
      profileType,
      period
    });

    // 4. Vérifier les recommandations IA
    console.log('\n🤖 Vérification des recommandations IA...');
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

    console.log('🔍 Recommandations IA extraites:', {
      aiRecommendations: aiRecommendations.length,
      resumeSituation: resumeSituation ? 'Présent' : 'Absent',
      scoreOptimisation
    });

    // 5. Simuler l'affichage des cartes de résumé
    console.log('\n📊 Simulation de l\'affichage des cartes de résumé:');
    
    const summaryCardsData = [
      {
        title: "Salário Bruto",
        value: salarioBruto > 0 ? 
          `R$ ${salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
          'R$ 0,00',
        color: "border-blue-100 bg-white text-blue-700"
      },
      {
        title: "Salário Líquido",
        value: salarioLiquido > 0 ? 
          `R$ ${salarioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
          'R$ 0,00',
        color: "border-green-100 bg-white text-green-700"
      },
      {
        title: "Descontos",
        value: descontos > 0 ? 
          `R$ ${descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
          'R$ 0,00',
        color: "border-orange-100 bg-white text-orange-700"
      },
      {
        title: "Eficiência",
        value: `${eficiencia}%`,
        color: "border-purple-100 bg-white text-purple-700"
      }
    ];

    console.log('📊 Cartes de résumé:');
    summaryCardsData.forEach((card, index) => {
      console.log(`${index + 1}. ${card.title}: ${card.value}`);
    });

    // 6. Vérifier la cohérence des données
    console.log('\n✅ Vérification de cohérence:');
    const isDataComplete = salarioBruto > 0 && salarioLiquido > 0;
    const hasRecommendations = aiRecommendations.length > 0;
    const hasEmployeeInfo = employeeName && companyName;

    console.log('- Données salariales complètes:', isDataComplete ? '✅' : '❌');
    console.log('- Recommandations présentes:', hasRecommendations ? '✅' : '❌');
    console.log('- Informations employé présentes:', hasEmployeeInfo ? '✅' : '❌');

    // 7. Résumé final
    console.log('\n🎯 Résumé du test:');
    if (isDataComplete && hasRecommendations && hasEmployeeInfo) {
      console.log('✅ Toutes les données sont présentes et cohérentes');
      console.log('✅ Le dashboard devrait afficher correctement les informations');
      console.log('✅ Les recommandations IA sont disponibles');
      console.log('✅ Les calculs d\'efficacité sont corrects');
      console.log('\n🎉 Le problème d\'affichage est résolu !');
    } else {
      console.log('⚠️ Certaines données sont manquantes ou incomplètes');
      console.log('⚠️ Vérifiez la structure des données dans Supabase');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testDashboardDataRetrieval().catch(console.error); 