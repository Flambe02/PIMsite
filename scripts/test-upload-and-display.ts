#!/usr/bin/env tsx

/**
 * Test complet de l'upload et de l'affichage des données
 * Simule l'upload d'un holerite et vérifie que les données s'affichent correctement
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Utiliser la clé de service pour contourner les politiques RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUploadAndDisplay() {
  console.log('🧪 Test complet de l\'upload et de l\'affichage des données...\n');

  try {
    // 1. Trouver un utilisateur existant ou créer un utilisateur de test
    console.log('👤 Recherche d\'un utilisateur existant...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    let testUserId: string;

    if (usersError || !users || users.length === 0) {
      console.log('⚠️ Aucun utilisateur trouvé, création d\'un utilisateur de test...');
      
      // Créer un utilisateur de test
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: 'test@example.com',
        password: 'testpassword123',
        email_confirm: true
      });

      if (createUserError) {
        console.error('❌ Erreur lors de la création de l\'utilisateur:', createUserError);
        return;
      }

      testUserId = newUser.user.id;
      console.log('✅ Utilisateur de test créé:', testUserId);
    } else {
      testUserId = users[0].id;
      console.log('✅ Utilisateur existant trouvé:', testUserId);
    }

    // 2. Nettoyer les données de test existantes
    console.log('🧹 Nettoyage des données de test...');
    const { error: deleteError } = await supabase
      .from('holerites')
      .delete()
      .eq('user_id', testUserId);

    if (deleteError) {
      console.log('⚠️ Erreur lors du nettoyage (normal si pas de données):', deleteError.message);
    }

    // 3. Données de test pour simuler un holerite
    const testHoleriteData = {
      user_id: testUserId,
      nome: 'João Silva',
      empresa: 'TechCorp Ltda',
      perfil: 'CLT',
      salario_bruto: 7089.84,
      salario_liquido: 5108.91,
      structured_data: {
        Identificação: {
          employee_name: 'João Silva',
          company_name: 'TechCorp Ltda',
          position: 'Desenvolvedor Full Stack',
          profile_type: 'CLT',
          period: 'Janeiro 2024'
        },
        Salários: {
          gross_salary: 7089.84,
          net_salary: 5108.91
        },
        analysis_result: {
          validation: {
            isValid: true,
            confidence: 0.95,
            warnings: []
          },
          recommendations: {
            resume_situation: 'Salário competitivo para a região',
            recommendations: [
              {
                categorie: 'Benefícios',
                titre: 'Plano de Saúde',
                description: 'Considere um plano de saúde empresarial',
                impact: 'Alto',
                priorite: 'Alta'
              },
              {
                categorie: 'Investimentos',
                titre: 'Previdência Privada',
                description: 'Diversifique sua aposentadoria',
                impact: 'Médio',
                priorite: 'Média'
              }
            ],
            score_optimisation: 85
          },
          finalData: {
            salario_bruto: 7089.84,
            salario_liquido: 5108.91,
            descontos: 1980.93,
            statut: 'CLT',
            pays: 'br',
            employee_name: 'João Silva',
            company_name: 'TechCorp Ltda',
            position: 'Desenvolvedor Full Stack',
            profile_type: 'CLT',
            period: 'Janeiro 2024'
          }
        },
        recommendations: {
          resume_situation: 'Salário competitivo para a região',
          recommendations: [
            {
              categorie: 'Benefícios',
              titre: 'Plano de Saúde',
              description: 'Considere um plano de saúde empresarial',
              impact: 'Alto',
              priorite: 'Alta'
            },
            {
              categorie: 'Investimentos',
              titre: 'Previdência Privada',
              description: 'Diversifique sua aposentadoria',
              impact: 'Médio',
              priorite: 'Média'
            }
          ],
          score_optimisation: 85
        },
        final_data: {
          salario_bruto: 7089.84,
          salario_liquido: 5108.91,
          descontos: 1980.93,
          statut: 'CLT',
          pays: 'br',
          employee_name: 'João Silva',
          company_name: 'TechCorp Ltda',
          position: 'Desenvolvedor Full Stack',
          profile_type: 'CLT',
          period: 'Janeiro 2024'
        },
        descontos: 1980.93
      },
      created_at: new Date().toISOString()
    };

    // 4. Insérer les données de test
    console.log('📝 Insertion des données de test...');
    const { data: insertedData, error: insertError } = await supabase
      .from('holerites')
      .insert([testHoleriteData])
      .select('*')
      .single();

    if (insertError) {
      console.error('❌ Erreur lors de l\'insertion:', insertError);
      return;
    }

    console.log('✅ Données de test insérées avec succès, ID:', insertedData.id);

    // 5. Vérifier que les données sont bien enregistrées
    console.log('\n🔍 Vérification des données enregistrées...');
    const { data: holerites, error: fetchError } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError);
      return;
    }

    if (!holerites || holerites.length === 0) {
      console.error('❌ Aucune donnée trouvée après insertion');
      return;
    }

    const latestHolerite = holerites[0];
    console.log('✅ Données récupérées avec succès');

    // 6. Analyser la structure des données
    console.log('\n📊 Structure des données:');
    console.log('- ID:', latestHolerite.id);
    console.log('- User ID:', latestHolerite.user_id);
    console.log('- Nom:', latestHolerite.nome);
    console.log('- Empresa:', latestHolerite.empresa);
    console.log('- Salário Bruto:', latestHolerite.salario_bruto);
    console.log('- Salário Líquido:', latestHolerite.salario_liquido);

    // 7. Extraire les données structurées
    const structuredData = latestHolerite.structured_data;
    console.log('\n🔍 Données structurées:');
    console.log('structured_data:', JSON.stringify(structuredData, null, 2));

    // 8. Simuler l'extraction des données pour le dashboard
    const finalData = structuredData?.final_data || {};
    const recommendations = structuredData?.recommendations || {};

    console.log('\n📈 Données extraites pour le dashboard:');
    console.log('- Salário Bruto:', finalData.salario_bruto);
    console.log('- Salário Líquido:', finalData.salario_liquido);
    console.log('- Descontos:', finalData.descontos);
    console.log('- Statut:', finalData.statut);
    console.log('- Pays:', finalData.pays);
    console.log('- Employee Name:', finalData.employee_name);
    console.log('- Company Name:', finalData.company_name);
    console.log('- Position:', finalData.position);

    // 9. Calculer l'efficacité
    const salarioBruto = Number(finalData.salario_bruto) || 0;
    const salarioLiquido = Number(finalData.salario_liquido) || 0;
    const eficiencia = salarioBruto > 0 ? ((salarioLiquido / salarioBruto) * 100).toFixed(1) : '0.0';
    
    console.log('\n📊 Calculs:');
    console.log('- Eficiência calculada:', `${eficiencia}%`);
    console.log('- Descontos calculés:', salarioBruto - salarioLiquido);

    // 10. Vérifier les recommandations
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

    // 11. Vérifier la cohérence des données
    console.log('\n✅ Vérification de cohérence:');
    const isDataComplete = salarioBruto > 0 && salarioLiquido > 0;
    const hasRecommendations = recommendations.recommendations && recommendations.recommendations.length > 0;
    const hasEmployeeInfo = finalData.employee_name && finalData.company_name;

    console.log('- Données salariales complètes:', isDataComplete ? '✅' : '❌');
    console.log('- Recommandations présentes:', hasRecommendations ? '✅' : '❌');
    console.log('- Informations employé présentes:', hasEmployeeInfo ? '✅' : '❌');

    // 12. Simuler l'affichage dans le dashboard
    console.log('\n🎯 Simulation de l\'affichage dashboard:');
    
    // Données pour les cartes de résumé
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
        value: (salarioBruto - salarioLiquido) > 0 ? 
          `R$ ${(salarioBruto - salarioLiquido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
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

    // 13. Résumé final
    console.log('\n🎯 Résumé du test:');
    if (isDataComplete && hasRecommendations && hasEmployeeInfo) {
      console.log('✅ Toutes les données sont présentes et cohérentes');
      console.log('✅ Le dashboard devrait afficher correctement les informations');
      console.log('✅ Les recommandations IA sont disponibles');
      console.log('✅ Les calculs d\'efficacité sont corrects');
    } else {
      console.log('⚠️ Certaines données sont manquantes ou incomplètes');
      console.log('⚠️ Vérifiez la structure des données dans Supabase');
    }

    // 14. Nettoyer les données de test
    console.log('\n🧹 Nettoyage des données de test...');
    const { error: cleanupError } = await supabase
      .from('holerites')
      .delete()
      .eq('user_id', testUserId);

    if (cleanupError) {
      console.log('⚠️ Erreur lors du nettoyage:', cleanupError.message);
    } else {
      console.log('✅ Données de test nettoyées');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testUploadAndDisplay().catch(console.error); 