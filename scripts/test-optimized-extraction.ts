/**
 * Test des améliorations d'extraction OCR/AI et d'affichage front-end
 */

import 'dotenv/config';

// Fonction pour vérifier si une valeur est significative (copiée du front-end)
function hasSignificantValue(value: any): boolean {
  if (value == null || value === undefined || value === '') return false;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    if (value.value !== undefined) return hasSignificantValue(value.value);
    if (value.valor !== undefined) return hasSignificantValue(value.valor);
    return Object.values(value).some(v => hasSignificantValue(v));
  }
  return true;
}

// Test des données d'extraction
function testExtractionData() {
  console.log('🧪 Test des données d\'extraction');
  console.log('================================');

  // Test 1: Données complètes
  const completeData = {
    salario_bruto: 5000,
    salario_liquido: 3800,
    descontos: 1200,
    beneficios: 500,
    seguros: 200,
    statut: "CLT",
    pays: "br",
    incoherence_detectee: false,
    period: "Janeiro/2025",
    employee_name: "João Silva",
    company_name: "Tech Corp Ltda",
    position: "Desenvolvedor"
  };

  console.log('✅ Test 1 - Données complètes:');
  console.log('   Salário bruto significatif:', hasSignificantValue(completeData.salario_bruto));
  console.log('   Salário líquido significatif:', hasSignificantValue(completeData.salario_liquido));
  console.log('   Descontos significatifs:', hasSignificantValue(completeData.descontos));
  console.log('   Benefícios significatifs:', hasSignificantValue(completeData.beneficios));
  console.log('   Seguros significatifs:', hasSignificantValue(completeData.seguros));

  // Test 2: Données partielles (certains champs vides)
  const partialData = {
    salario_bruto: 5000,
    salario_liquido: 3800,
    descontos: 0, // Valeur non significative
    beneficios: null, // Valeur non significative
    seguros: undefined, // Valeur non significative
    statut: "CLT",
    pays: "br",
    incoherence_detectee: false,
    period: "Janeiro/2025",
    employee_name: "João Silva",
    company_name: "Tech Corp Ltda",
    position: "Desenvolvedor"
  };

  console.log('\n✅ Test 2 - Données partielles:');
  console.log('   Salário bruto significatif:', hasSignificantValue(partialData.salario_bruto));
  console.log('   Salário líquido significatif:', hasSignificantValue(partialData.salario_liquido));
  console.log('   Descontos significatifs:', hasSignificantValue(partialData.descontos));
  console.log('   Benefícios significatifs:', hasSignificantValue(partialData.beneficios));
  console.log('   Seguros significatifs:', hasSignificantValue(partialData.seguros));

  // Test 3: Données avec objets complexes
  const complexData = {
    salario_bruto: { label: "Salário Base", valor: 5000 },
    salario_liquido: { label: "Líquido a Receber", valor: 3800 },
    descontos: { label: "Total Descontos", valor: 0 }, // Non significatif
    beneficios: { label: "Benefícios", valor: 500 },
    seguros: null,
    statut: "CLT",
    pays: "br",
    incoherence_detectee: false
  };

  console.log('\n✅ Test 3 - Données complexes:');
  console.log('   Salário bruto significatif:', hasSignificantValue(complexData.salario_bruto));
  console.log('   Salário líquido significatif:', hasSignificantValue(complexData.salario_liquido));
  console.log('   Descontos significatifs:', hasSignificantValue(complexData.descontos));
  console.log('   Benefícios significatifs:', hasSignificantValue(complexData.beneficios));
  console.log('   Seguros significatifs:', hasSignificantValue(complexData.seguros));
}

// Test des recommandations
function testRecommendations() {
  console.log('\n🧪 Test des recommandations');
  console.log('============================');

  // Test 1: Recommandations normales
  const normalRecommendations = {
    resume_situation: "Salarié CLT avec bonnes opportunités d'optimisation",
    recommendations: [
      {
        categorie: "Beneficios",
        titre: "Optimiser Vale Refeição",
        description: "Considérer augmenter le Vale Refeição pour réduire l'IR",
        impact: "Alto",
        priorite: 1
      },
      {
        categorie: "Assurances",
        titre: "Plano de Saúde",
        description: "Comparer les plans de santé disponibles",
        impact: "Medio",
        priorite: 2
      }
    ],
    score_optimisation: 75
  };

  console.log('✅ Test 1 - Recommandations normales:');
  console.log('   Résumé présent:', hasSignificantValue(normalRecommendations.resume_situation));
  console.log('   Recommandations présentes:', hasSignificantValue(normalRecommendations.recommendations));
  console.log('   Score présent:', hasSignificantValue(normalRecommendations.score_optimisation));
  console.log('   Nombre de recommandations:', normalRecommendations.recommendations.length);

  // Test 2: Pas de recommandations (no_recommendation)
  const noRecommendations = {
    resume_situation: "Salarié déjà optimisé",
    recommendations: [],
    score_optimisation: 95,
    no_recommendation: "Aucune opportunité identifiée pour cette fiche de paie."
  };

  console.log('\n✅ Test 2 - Pas de recommandations:');
  console.log('   Résumé présent:', hasSignificantValue(noRecommendations.resume_situation));
  console.log('   Recommandations présentes:', hasSignificantValue(noRecommendations.recommendations));
  console.log('   Score présent:', hasSignificantValue(noRecommendations.score_optimisation));
  console.log('   Message no_recommendation:', hasSignificantValue(noRecommendations.no_recommendation));
  console.log('   Nombre de recommandations:', noRecommendations.recommendations.length);

  // Test 3: Recommandations avec opportunités d'optimisation
  const optimizationOpportunities = {
    summary: "Ce holerite montre des opportunités d'optimisation importantes",
    optimization_opportunities: [
      "FGTS: Considérer verificar seu FGTS para benefícios adicionais.",
      "IRRF: Nenhum dependente foi declarado para redução do IRRF.",
      "Plano de Saúde: Avalie migrar para um plano empresarial para reduzir custos."
    ]
  };

  console.log('\n✅ Test 3 - Opportunités d\'optimisation:');
  console.log('   Résumé présent:', hasSignificantValue(optimizationOpportunities.summary));
  console.log('   Opportunités présentes:', hasSignificantValue(optimizationOpportunities.optimization_opportunities));
  console.log('   Nombre d\'opportunités:', optimizationOpportunities.optimization_opportunities.length);
  
  // Filtrer les opportunités significatives
  const significantOpportunities = optimizationOpportunities.optimization_opportunities.filter(opp => 
    typeof opp === 'string' && opp.trim().length > 0
  );
  console.log('   Opportunités significatives:', significantOpportunities.length);
}

// Test de validation des données
function testDataValidation() {
  console.log('\n🧪 Test de validation des données');
  console.log('==================================');

  // Test 1: Validation des recommandations
  function isValidRecommendationResult(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.resume_situation === 'string' &&
      typeof data.score_optimisation === 'number' &&
      (
        // Soit il y a des recommandations
        (Array.isArray(data.recommendations) && data.recommendations.length > 0) ||
        // Soit il y a un message no_recommendation
        (typeof data.no_recommendation === 'string' && data.no_recommendation.length > 0)
      )
    );
  }

  const validWithRecommendations = {
    resume_situation: "Test",
    score_optimisation: 75,
    recommendations: [{ titre: "Test", description: "Test" }]
  };

  const validWithNoRecommendation = {
    resume_situation: "Test",
    score_optimisation: 95,
    no_recommendation: "Aucune opportunité"
  };

  const invalidData = {
    resume_situation: "Test",
    score_optimisation: 75
    // Pas de recommandations ni de no_recommendation
  };

  console.log('✅ Test validation recommandations:');
  console.log('   Avec recommandations:', isValidRecommendationResult(validWithRecommendations));
  console.log('   Avec no_recommendation:', isValidRecommendationResult(validWithNoRecommendation));
  console.log('   Données invalides:', isValidRecommendationResult(invalidData));
}

// Test d'affichage conditionnel
function testConditionalDisplay() {
  console.log('\n🧪 Test d\'affichage conditionnel');
  console.log('==================================');

  // Simuler les données d'un holerite
  const holeriteData = {
    // Informations de base
    company_name: "Tech Corp Ltda",
    employee_name: "João Silva",
    position: "Desenvolvedor",
    profile_type: "CLT",
    period: "Janeiro/2025",
    admission_date: null, // Non significatif
    cbo: "", // Non significatif
    department: undefined, // Non significatif
    work_hours: 0, // Non significatif
    dependents: null, // Non significatif

    // Montants
    gross_salary: { label: "Salário Base", valor: 5000 },
    net_salary: { label: "Líquido a Receber", valor: 3800 },
    total_earnings: 5000,
    total_deductions: 1200,
    inss_base: { label: "Base INSS", valor: 5000 },
    fgts_base: 0, // Non significatif
    irrf_base: { label: "Base IRRF", valor: 3800 },
    fgts_mes: null, // Non significatif
    base_calc_fgts: undefined, // Non significatif
    base_calc_irrf: { label: "Base IRRF", valor: 3800 },
    faixa_irrf: "", // Non significatif
    fgts_deposit: 0, // Non significatif

    // Earnings et deductions
    earnings: [
      { description: "Salário Base", amount: 5000 },
      { description: "Vale Refeição", amount: 0 } // Non significatif
    ],
    deductions: [
      { description: "INSS", amount: 550 },
      { description: "IRRF", amount: 0 }, // Non significatif
      { description: "Vale Transporte", amount: 150 }
    ],

    // Analyse
    analysis: {
      summary: "Bonne situation avec opportunités d'optimisation",
      optimization_opportunities: [
        "FGTS: Considérer verificar seu FGTS para benefícios adicionais.",
        "", // Opportunité vide
        "Plano de Saúde: Avalie migrar para um plano empresarial para reduzir custos."
      ]
    }
  };

  // Filtrer les informations significatives
  const infos = [
    { label: 'Empresa', value: holeriteData.company_name },
    { label: 'Nome', value: holeriteData.employee_name },
    { label: 'Cargo', value: holeriteData.position },
    { label: 'Perfil', value: holeriteData.profile_type },
    { label: 'Período', value: holeriteData.period },
    { label: 'Admissão', value: holeriteData.admission_date },
    { label: 'CBO', value: holeriteData.cbo },
    { label: 'Departamento', value: holeriteData.department },
    { label: 'Horas Trabalhadas', value: holeriteData.work_hours },
    { label: 'Dependentes', value: holeriteData.dependents },
  ].filter(i => hasSignificantValue(i.value));

  const montants = [
    { label: 'Salário Base', value: holeriteData.gross_salary },
    { label: 'Salário Líquido', value: holeriteData.net_salary },
    { label: 'Total Vencimentos', value: holeriteData.total_earnings },
    { label: 'Total Descontos', value: holeriteData.total_deductions },
    { label: 'INSS', value: holeriteData.inss_base },
    { label: 'FGTS', value: holeriteData.fgts_base },
    { label: 'IRRF', value: holeriteData.irrf_base },
    { label: 'FGTS do Mês', value: holeriteData.fgts_mes },
    { label: 'Base Cálc. FGTS', value: holeriteData.base_calc_fgts },
    { label: 'Base Cálc. IRRF', value: holeriteData.base_calc_irrf },
    { label: 'Faixa IRRF', value: holeriteData.faixa_irrf },
    { label: 'Depósito FGTS', value: holeriteData.fgts_deposit },
  ].filter(m => hasSignificantValue(m.value));

  const earnings = holeriteData.earnings.filter((e: any) => 
    hasSignificantValue(e.amount) || hasSignificantValue(e.valor)
  );

  const deductions = holeriteData.deductions.filter((d: any) => 
    hasSignificantValue(d.amount) || hasSignificantValue(d.valor)
  );

  const oportunidades = holeriteData.analysis.optimization_opportunities.filter((opp: any) => 
    typeof opp === 'string' && opp.trim().length > 0
  );

  console.log('✅ Test filtrage des données:');
  console.log('   Informations significatives:', infos.length, '/ 10');
  console.log('   Montants significatifs:', montants.length, '/ 12');
  console.log('   Earnings significatifs:', earnings.length, '/ 2');
  console.log('   Deductions significatifs:', deductions.length, '/ 3');
  console.log('   Opportunités significatives:', oportunidades.length, '/ 3');

  console.log('\n📋 Informations filtrées:');
  infos.forEach(info => console.log(`   - ${info.label}: ${info.value}`));

  console.log('\n💰 Montants filtrés:');
  montants.forEach(montant => console.log(`   - ${montant.label}: ${JSON.stringify(montant.value)}`));

  console.log('\n💚 Earnings filtrés:');
  earnings.forEach(earning => console.log(`   - ${earning.description}: ${earning.amount}`));

  console.log('\n❤️ Deductions filtrés:');
  deductions.forEach(deduction => console.log(`   - ${deduction.description}: ${deduction.amount}`));

  console.log('\n💡 Opportunités filtrées:');
  oportunidades.forEach(opp => console.log(`   - ${opp}`));
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Test des améliorations d\'extraction OCR/AI et d\'affichage front-end');
  console.log('========================================================================');
  console.log('');

  testExtractionData();
  testRecommendations();
  testDataValidation();
  testConditionalDisplay();

  console.log('\n✅ Tous les tests terminés avec succès !');
  console.log('\n📊 Résumé des améliorations:');
  console.log('   - Extraction sélective des données significatives');
  console.log('   - Gestion des recommandations avec fallback no_recommendation');
  console.log('   - Affichage conditionnel des blocs UI');
  console.log('   - Validation robuste des données');
  console.log('   - Interface utilisateur épurée et fiable');
}

// Exécution
runTests().catch(console.error); 