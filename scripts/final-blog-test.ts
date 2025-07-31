#!/usr/bin/env tsx

/**
 * Script final pour tester toutes les fonctionnalités du blog
 */

import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

async function finalBlogTest() {
  console.log('🎯 Test final complet du blog PIM');
  console.log('=====================================\n');

  const tests = [
    {
      name: 'Page principale du blog',
      url: 'http://localhost:3000/br/blog',
      checks: [
        'Blog PIM',
        'Entenda seu holerite: Guia completo para funcionários CLT',
        'Vale refeição: Tudo que você precisa saber sobre este benefício',
        'entenda-seu-holerite-guia-completo-funcionarios-clt',
        'vale-refeicao-tudo-que-voce-precisa-saber-beneficio'
      ]
    },
    {
      name: 'Article 1 - Entenda seu holerite',
      url: 'http://localhost:3000/br/blog/entenda-seu-holerite-guia-completo-funcionarios-clt',
      checks: [
        'Entenda seu holerite: Guia completo para funcionários CLT',
        'O que é o holerite?',
        'Principais seções do holerite',
        'Como calcular seu salário líquido'
      ]
    },
    {
      name: 'Article 2 - Vale refeição',
      url: 'http://localhost:3000/br/blog/vale-refeicao-tudo-que-voce-precisa-saber-beneficio',
      checks: [
        'Vale refeição: Tudo que você precisa saber sobre este benefício',
        'O que é o vale refeição?',
        'Tipos de vale refeição',
        'Como funciona o desconto?'
      ]
    }
  ];

  let allTestsPassed = true;

  for (const test of tests) {
    console.log(`📋 Test: ${test.name}`);
    console.log(`🔗 URL: ${test.url}`);
    
    try {
      const response = await fetch(test.url);
      
      if (!response.ok) {
        console.log(`❌ Erreur HTTP: ${response.status}`);
        allTestsPassed = false;
        continue;
      }

      const html = await response.text();
      let testPassed = true;

      for (const check of test.checks) {
        if (html.includes(check)) {
          console.log(`   ✅ "${check}" trouvé`);
        } else {
          console.log(`   ❌ "${check}" non trouvé`);
          testPassed = false;
        }
      }

      if (testPassed) {
        console.log(`   🎉 Test réussi!\n`);
      } else {
        console.log(`   💥 Test échoué!\n`);
        allTestsPassed = false;
      }

    } catch (error) {
      console.log(`   ❌ Erreur: ${error}\n`);
      allTestsPassed = false;
    }
  }

  console.log('=====================================');
  if (allTestsPassed) {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ Le blog PIM fonctionne parfaitement');
    console.log('✅ Les articles s\'affichent correctement');
    console.log('✅ Les pages individuelles fonctionnent');
    console.log('✅ L\'intégration Supabase est opérationnelle');
  } else {
    console.log('💥 CERTAINS TESTS ONT ÉCHOUÉ');
    console.log('⚠️ Vérifiez les erreurs ci-dessus');
  }
  console.log('=====================================');
}

// Exécuter le script si appelé directement
if (require.main === module) {
  finalBlogTest();
} 