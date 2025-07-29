#!/usr/bin/env tsx

/**
 * Test des recommandations IA avec calcul de valeur faciale
 * Vérifie que les recommandations incluent l'analyse automatique du vale refeição
 */

import { scanAnalysisService } from '../lib/services/scanAnalysisService';
import { analisarValeRefeicao, valorFacialNacional } from '../lib/data/valorFacial';

async function testValorFacialRecommendations() {
  console.log('🧪 Test des recommandations avec calcul de valeur faciale...\n');

  // Données de test avec vale refeição
  const testStructuredData = {
    nome_funcionario: "Daniel do Nascimento Lima",
    company_name: "INSTITUTO EDUCACIONAL MONTE-VERDE",
    position: "Motorista",
    period: "março/2011",
    statut: "CLT",
    salary_bruto: 1400,
    salary_liquido: 980,
    descontos: 420,
    impostos: [
      {
        nome: "INSS",
        valor: 126
      },
      {
        nome: "IRFF",
        valor: 0
      }
    ],
    beneficios: [
      {
        nome: "Convênio Saúde",
        valor: 70
      },
      {
        nome: "Convênio Vale-refeição",
        valor: 140
      },
      {
        nome: "Vale-transporte",
        valor: 84
      }
    ],
    seguros: [],
    credito: [],
    outros: []
  };

  console.log('📊 Données de test:');
  console.log(JSON.stringify(testStructuredData, null, 2));

  // Test de l'analyse automatique du vale refeição
  console.log('\n🔍 Test de l\'analyse automatique du vale refeição:');
  const valeRefeicao = testStructuredData.beneficios.find(b => 
    b.nome && b.nome.toLowerCase().includes('refeição')
  );
  
  if (valeRefeicao) {
    const analysis = analisarValeRefeicao(valeRefeicao.valor);
    console.log(`✅ Vale refeição trouvé: R$ ${valeRefeicao.valor}`);
    console.log(`📈 Valor facial diário: R$ ${analysis.valorDiario.toFixed(2)}`);
    console.log(`📊 Média nationale: R$ ${valorFacialNacional}/jour`);
    console.log(`💰 Différence: R$ ${analysis.diferenca.toFixed(2)}`);
    console.log(`✅ Status: ${analysis.adequado ? 'ADEQUADO' : 'ABAIXO DA MÉDIA'}`);
    console.log(`💡 Recommandation: ${analysis.recomendacao}`);
  }

  // Test de génération des recommandations IA
  console.log('\n🤖 Génération des recommandations IA...');
  try {
    const recommendations = await scanAnalysisService['generateAIRecommendations'](testStructuredData, 'br');
    
    console.log('✅ Recommandations générées:');
    console.log(JSON.stringify(recommendations, null, 2));

    // Vérifications
    console.log('\n🔍 Vérifications:');
    
    // 1. Vérifier qu'il y a exactement 5 recommandations
    if (recommendations.recommendations && recommendations.recommendations.length === 5) {
      console.log('✅ Nombre de recommandations: 5 (EXACT)');
    } else {
      console.log(`❌ Nombre de recommandations: ${recommendations.recommendations?.length || 0} (DOIT ÊTRE 5)`);
    }

    // 2. Vérifier que la recommandation sur les bénéfices mentionne le vale refeição
    const beneficioRec = recommendations.recommendations?.find((rec: any) => 
      rec.categorie === 'Benefícios'
    );
    
    if (beneficioRec) {
      console.log('✅ Recommandation Benefícios trouvée');
      console.log(`📝 Titre: ${beneficioRec.titre}`);
      console.log(`📝 Description: ${beneficioRec.description}`);
      
      // Vérifier si la description mentionne des calculs de valeur faciale
      const hasValorFacial = beneficioRec.description.includes('valor facial') || 
                            beneficioRec.description.includes('diário') ||
                            beneficioRec.description.includes('R$');
      
      if (hasValorFacial) {
        console.log('✅ La recommandation inclut des calculs de valeur faciale');
      } else {
        console.log('⚠️ La recommandation ne mentionne pas explicitement la valeur faciale');
      }
    } else {
      console.log('❌ Recommandation Benefícios non trouvée');
    }

    // 3. Vérifier les catégories
    const categories = recommendations.recommendations?.map((rec: any) => rec.categorie);
    const expectedCategories = ['Salário', 'Benefícios', 'Plano de Saúde e Previdência', 'Investimentos', 'Outros'];
    
    console.log('✅ Catégories trouvées:', categories);
    
    const missingCategories = expectedCategories.filter(cat => !categories?.includes(cat));
    if (missingCategories.length === 0) {
      console.log('✅ Toutes les catégories requises sont présentes');
    } else {
      console.log('❌ Catégories manquantes:', missingCategories);
    }

    // 4. Vérifier le score d'optimisation
    if (recommendations.score_optimisation && recommendations.score_optimisation > 0) {
      console.log(`✅ Score d'optimisation: ${recommendations.score_optimisation}%`);
    } else {
      console.log('❌ Score d\'optimisation manquant ou invalide');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la génération des recommandations:', error);
  }

  console.log('\n🎉 Test terminé!');
}

// Test avec différentes valeurs de vale refeição
async function testDifferentValeRefeicaoValues() {
  console.log('\n🧪 Test avec différentes valeurs de vale refeição...\n');

  const testValues = [
    { valor: 100, description: 'Valeur basse (R$ 100)' },
    { valor: 140, description: 'Valeur moyenne (R$ 140)' },
    { valor: 200, description: 'Valeur haute (R$ 200)' }
  ];

  for (const test of testValues) {
    console.log(`\n📊 Test: ${test.description}`);
    const analysis = analisarValeRefeicao(test.valor);
    
    console.log(`💰 Valeur reçue: R$ ${test.valor}`);
    console.log(`📈 Valor facial diário: R$ ${analysis.valorDiario.toFixed(2)}`);
    console.log(`📊 Média nationale: R$ ${valorFacialNacional}/jour`);
    console.log(`💡 Status: ${analysis.adequado ? '✅ ADEQUADO' : '❌ ABAIXO DA MÉDIA'}`);
    console.log(`🎯 Recommandation: ${analysis.recomendacao}`);
  }
}

// Exécution des tests
async function runAllTests() {
  await testValorFacialRecommendations();
  await testDifferentValeRefeicaoValues();
}

runAllTests().catch(console.error); 