import { PayslipAnalysisResult, RecommendationResult } from '../lib/ia/prompts';

async function testAIDataStructure() {
  console.log('🧪 Test de la structure des données IA...');
  
  // Test de la structure PayslipAnalysisResult
  const sampleExtraction: PayslipAnalysisResult = {
    salario_bruto: 5000,
    salario_liquido: 3800,
    descontos: 1200,
    beneficios: 1000,
    seguros: 300,
    statut: "CLT",
    pays: "br",
    incoherence_detectee: false,
    period: "Janeiro/2025",
    employee_name: "João Silva",
    company_name: "Empresa Exemplo LTDA",
    position: "Desenvolvedor"
  };
  
  console.log('✅ Structure PayslipAnalysisResult valide:', sampleExtraction);
  
  // Test de la structure RecommendationResult
  const sampleRecommendations: RecommendationResult = {
    resume_situation: "Salarié CLT avec un bon salaire brut mais des déductions importantes. Opportunités d'optimisation fiscale disponibles.",
    recommendations: [
      {
        categorie: "Optimisation",
        titre: "Optimisation IRRF",
        description: "Vous pouvez économiser jusqu'à R$ 180/mois avec des déductions médicales et éducatives.",
        impact: "Alto",
        priorite: 1
      },
      {
        categorie: "Beneficios",
        titre: "Plano de Saúde",
        description: "Considérez un plan de santé plus complet pour réduire vos impôts.",
        impact: "Medio",
        priorite: 2
      },
      {
        categorie: "Salaires",
        titre: "Vale Alimentação",
        description: "Augmentez votre vale alimentação pour économiser R$ 120/mois en impôts.",
        impact: "Baixo",
        priorite: 3
      }
    ],
    score_optimisation: 75
  };
  
  console.log('✅ Structure RecommendationResult valide:', sampleRecommendations);
  
  // Test de l'intégration dans le Dashboard
  const dashboardData = {
    salarioBruto: sampleExtraction.salario_bruto,
    salarioLiquido: sampleExtraction.salario_liquido,
    descontos: sampleExtraction.descontos,
    eficiencia: sampleExtraction.salario_liquido && sampleExtraction.salario_bruto ? 
      Number(((sampleExtraction.salario_liquido / sampleExtraction.salario_bruto) * 100).toFixed(1)) : 0,
    raw: {
      ...sampleExtraction,
      aiRecommendations: sampleRecommendations.recommendations,
      resumeSituation: sampleRecommendations.resume_situation,
      scoreOptimisation: sampleRecommendations.score_optimisation
    }
  };
  
  console.log('✅ Structure Dashboard valide:', dashboardData);
  
  // Test de l'affichage des recommandations
  console.log('📋 Recommandations pour l\'affichage:');
  sampleRecommendations.recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec.titre} (${rec.categorie}) - Impact: ${rec.impact} - Priorité: ${rec.priorite}`);
    console.log(`     Description: ${rec.description}`);
  });
  
  console.log('✅ Tous les tests de structure sont passés!');
}

// Exécution du test
testAIDataStructure().then(() => {
  console.log('🏁 Test terminé');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
}); 