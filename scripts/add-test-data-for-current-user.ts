#!/usr/bin/env tsx

/**
 * Script pour ajouter des données de test pour l'utilisateur actuellement connecté
 * Cela permettra de tester l'affichage des données dans le dashboard
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

async function addTestDataForCurrentUser() {
  console.log('🧪 Ajout de données de test pour l\'utilisateur actuel...\n');

  try {
    // 1. Récupérer tous les utilisateurs depuis auth.users
    console.log('👤 Recherche des utilisateurs existants...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', usersError);
      return;
    }

    if (!users || users.users.length === 0) {
      console.log('⚠️ Aucun utilisateur trouvé');
      return;
    }

    console.log(`✅ ${users.users.length} utilisateurs trouvés:`);
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.id})`);
    });

    // 2. Utiliser le premier utilisateur ou demander à l'utilisateur de choisir
    const selectedUser = users.users[0];
    console.log(`\n🎯 Utilisation de l'utilisateur: ${selectedUser.email}`);

    // 3. Nettoyer les données existantes pour cet utilisateur
    console.log('🧹 Nettoyage des données existantes...');
    const { error: deleteError } = await supabase
      .from('holerites')
      .delete()
      .eq('user_id', selectedUser.id);

    if (deleteError) {
      console.log('⚠️ Erreur lors du nettoyage (normal si pas de données):', deleteError.message);
    }

    // 4. Données de test réalistes
    const testHoleriteData = {
      user_id: selectedUser.id,
      nome: 'Maria Santos',
      empresa: 'TechSolutions Ltda',
      perfil: 'CLT',
      salario_bruto: 8500.00,
      salario_liquido: 6200.00,
      structured_data: {
        Identificação: {
          employee_name: 'Maria Santos',
          company_name: 'TechSolutions Ltda',
          position: 'Desenvolvedora Senior',
          profile_type: 'CLT',
          period: 'Dezembro 2024'
        },
        Salários: {
          gross_salary: 8500.00,
          net_salary: 6200.00
        },
        analysis_result: {
          validation: {
            isValid: true,
            confidence: 0.98,
            warnings: []
          },
          recommendations: {
            resume_situation: 'Salário acima da média para a região, com boa estrutura de benefícios',
            recommendations: [
              {
                categorie: 'Benefícios',
                titre: 'Plano de Saúde Premium',
                description: 'Considere um plano de saúde mais abrangente',
                impact: 'Alto',
                priorite: 'Alta'
              },
              {
                categorie: 'Investimentos',
                titre: 'Previdência Privada',
                description: 'Diversifique sua aposentadoria com PGBL',
                impact: 'Médio',
                priorite: 'Média'
              },
              {
                categorie: 'Impostos',
                titre: 'Otimização Fiscal',
                description: 'Considere deduções para reduzir IRRF',
                impact: 'Alto',
                priorite: 'Alta'
              }
            ],
            score_optimisation: 92
          },
          finalData: {
            salario_bruto: 8500.00,
            salario_liquido: 6200.00,
            descontos: 2300.00,
            statut: 'CLT',
            pays: 'br',
            employee_name: 'Maria Santos',
            company_name: 'TechSolutions Ltda',
            position: 'Desenvolvedora Senior',
            profile_type: 'CLT',
            period: 'Dezembro 2024'
          }
        },
        recommendations: {
          resume_situation: 'Salário acima da média para a região, com boa estrutura de benefícios',
          recommendations: [
            {
              categorie: 'Benefícios',
              titre: 'Plano de Saúde Premium',
              description: 'Considere um plano de saúde mais abrangente',
              impact: 'Alto',
              priorite: 'Alta'
            },
            {
              categorie: 'Investimentos',
              titre: 'Previdência Privada',
              description: 'Diversifique sua aposentadoria com PGBL',
              impact: 'Médio',
              priorite: 'Média'
            },
            {
              categorie: 'Impostos',
              titre: 'Otimização Fiscal',
              description: 'Considere deduções para reduzir IRRF',
              impact: 'Alto',
              priorite: 'Alta'
            }
          ],
          score_optimisation: 92
        },
        final_data: {
          salario_bruto: 8500.00,
          salario_liquido: 6200.00,
          descontos: 2300.00,
          statut: 'CLT',
          pays: 'br',
          employee_name: 'Maria Santos',
          company_name: 'TechSolutions Ltda',
          position: 'Desenvolvedora Senior',
          profile_type: 'CLT',
          period: 'Dezembro 2024'
        },
        descontos: 2300.00
      },
      created_at: new Date().toISOString()
    };

    // 5. Insérer les données de test
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

    // 6. Vérifier que les données sont bien enregistrées
    console.log('\n🔍 Vérification des données enregistrées...');
    const { data: holerites, error: fetchError } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', selectedUser.id)
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

    // 7. Afficher un résumé des données
    console.log('\n📊 Résumé des données ajoutées:');
    console.log('- Utilisateur:', selectedUser.email);
    console.log('- Nom:', latestHolerite.nome);
    console.log('- Empresa:', latestHolerite.empresa);
    console.log('- Salário Bruto: R$', latestHolerite.salario_bruto);
    console.log('- Salário Líquido: R$', latestHolerite.salario_liquido);
    console.log('- Eficiência:', ((latestHolerite.salario_liquido / latestHolerite.salario_bruto) * 100).toFixed(1) + '%');

    // 8. Instructions pour tester
    console.log('\n🎯 Instructions pour tester:');
    console.log('1. Connectez-vous avec l\'utilisateur:', selectedUser.email);
    console.log('2. Allez sur le dashboard');
    console.log('3. Vous devriez voir les données affichées correctement');
    console.log('4. Les cartes de résumé devraient montrer:');
    console.log('   - Salário Bruto: R$ 8.500,00');
    console.log('   - Salário Líquido: R$ 6.200,00');
    console.log('   - Descontos: R$ 2.300,00');
    console.log('   - Eficiência: 72.9%');

    console.log('\n✅ Données de test ajoutées avec succès !');
    console.log('🔄 Rafraîchissez le dashboard pour voir les changements.');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données:', error);
  }
}

// Exécuter le script
addTestDataForCurrentUser().catch(console.error); 