/**
 * Script de test pour vérifier la génération de recommandations IA
 */

import { scanAnalysisService } from '../lib/services/scanAnalysisService';

async function testRecommendationsGeneration() {
  console.log('🧪 Test de génération de recommandations IA...\n');

  // Données de test basées sur l'exemple réel
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

  try {
    console.log('📊 Données de test:');
    console.log(JSON.stringify(testStructuredData, null, 2));
    console.log('\n');

    // Test de génération de recommandations
    console.log('🤖 Génération des recommandations IA...');
    const recommendations = await scanAnalysisService['generateAIRecommendations'](testStructuredData, 'br');

    console.log('✅ Recommandations générées:');
    console.log(JSON.stringify(recommendations, null, 2));
    console.log('\n');

    // Vérifications
    console.log('🔍 Vérifications:');
    
    // 1. Vérifier que les recommandations existent
    if (recommendations && recommendations.recommendations) {
      console.log('✅ Structure recommendations: OK');
    } else {
      console.log('❌ Structure recommendations: MANQUANTE');
    }

    // 2. Vérifier qu'il y a exactement 5 recommandations
    if (recommendations.recommendations && recommendations.recommendations.length === 5) {
      console.log(`✅ Nombre de recommandations: ${recommendations.recommendations.length} (EXACT)`);
    } else {
      console.log(`❌ Nombre de recommandations: ${recommendations.recommendations?.length || 0} (DOIT ÊTRE 5)`);
    }

    // 3. Vérifier la structure de chaque recommandation
    if (recommendations.recommendations && recommendations.recommendations.length > 0) {
      const firstRec = recommendations.recommendations[0];
      console.log('✅ Structure première recommandation:');
      console.log(`  - Catégorie: ${firstRec.categorie ? 'OK' : 'MANQUANTE'}`);
      console.log(`  - Titre: ${firstRec.titre ? 'OK' : 'MANQUANTE'}`);
      console.log(`  - Description: ${firstRec.description ? 'OK' : 'MANQUANTE'}`);
      console.log(`  - Impact: ${firstRec.impact ? 'OK' : 'MANQUANTE'}`);
      console.log(`  - Priorité: ${firstRec.priorite ? 'OK' : 'MANQUANTE'}`);
    }

    // 4. Vérifier le score d'optimisation
    if (recommendations.score_optimisation && typeof recommendations.score_optimisation === 'number') {
      console.log(`✅ Score d'optimisation: ${recommendations.score_optimisation}%`);
    } else {
      console.log('❌ Score d\'optimisation: MANQUANT');
    }

    // 5. Vérifier le résumé de situation
    if (recommendations.resume_situation && recommendations.resume_situation.length > 0) {
      console.log('✅ Résumé de situation: OK');
    } else {
      console.log('❌ Résumé de situation: MANQUANT');
    }

    // 6. Vérifier que les 5 catégories sont présentes
    if (recommendations.recommendations && recommendations.recommendations.length === 5) {
      const categories = recommendations.recommendations.map((rec: any) => rec.categorie);
      const expectedCategories = ['Salário', 'Benefícios', 'Plano de Saúde e Previdência', 'Investimentos', 'Outros'];
      
      console.log('✅ Catégories trouvées:', categories);
      
      const missingCategories = expectedCategories.filter(cat => !categories.includes(cat));
      if (missingCategories.length === 0) {
        console.log('✅ Toutes les catégories requises sont présentes');
      } else {
        console.log('❌ Catégories manquantes:', missingCategories);
      }
    }

    console.log('\n🎉 Test terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécution du test
testRecommendationsGeneration().catch(console.error); 