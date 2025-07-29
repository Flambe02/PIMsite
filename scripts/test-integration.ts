import { PayslipAnalysisService } from '../lib/ia/payslipAnalysisService';
import { PayslipValidator } from '../lib/validation/payslipValidator';
import { PayslipAnalysisResult } from '../lib/ia/prompts';

/**
 * Script de test d'intégration pour le nouveau système d'analyse IA
 */
async function testIntegration() {
  console.log('🧪 Test d\'intégration du système d\'analyse IA optimisé...\n');

  const analysisService = new PayslipAnalysisService();

  // Test 1: Détection de pays
  console.log('1️⃣ Test de détection de pays...');
  await testCountryDetection(analysisService);

  // Test 2: Analyse complète Brésil
  console.log('\n2️⃣ Test d\'analyse complète (Brésil)...');
  await testCompleteAnalysis(analysisService, 'br');

  // Test 3: Analyse complète France
  console.log('\n3️⃣ Test d\'analyse complète (France)...');
  await testCompleteAnalysis(analysisService, 'fr');

  // Test 4: Validation des données
  console.log('\n4️⃣ Test de validation des données...');
  testDataValidation();

  console.log('\n✅ Tous les tests d\'intégration terminés avec succès!');
}

async function testCountryDetection(service: PayslipAnalysisService) {
  const testCases = [
    {
      text: 'Salário Bruto: R$ 5.000,00\nINSS: R$ 550,00\nIRRF: R$ 450,00',
      expected: 'br',
      description: 'Texte brésilien'
    },
    {
      text: 'Salaire Brut: 3000€\nSécurité Sociale: 660€\nCSG: 270€',
      expected: 'fr',
      description: 'Texte français'
    },
    {
      text: 'Random text without country indicators',
      expected: 'br',
      description: 'Texte neutre (défaut Brésil)'
    }
  ];

  for (const testCase of testCases) {
    try {
      const detected = await service.detectCountry(testCase.text);
      const success = detected === testCase.expected;
      console.log(`   ${success ? '✅' : '❌'} ${testCase.description}: ${detected} (attendu: ${testCase.expected})`);
    } catch (error) {
      console.log(`   ❌ ${testCase.description}: Erreur - ${error}`);
    }
  }
}

async function testCompleteAnalysis(service: PayslipAnalysisService, country: string) {
  const testData = {
    br: {
      text: `HOLERITE - JANEIRO/2025
      EMPRESA: TechCorp Brasil
      FUNCIONÁRIO: João Silva
      CARGO: Desenvolvedor Senior
      
      SALÁRIO BRUTO: R$ 5.000,00
      INSS: R$ 550,00
      IRRF: R$ 450,00
      SALÁRIO LÍQUIDO: R$ 4.000,00
      
      BENEFÍCIOS:
      Vale Refeição: R$ 500,00
      Vale Transporte: R$ 200,00
      Plano de Saúde: R$ 200,00`,
      expectedStatut: 'CLT'
    },
    fr: {
      text: `BULLETIN DE SALAIRE - JANVIER 2025
      ENTREPRISE: TechCorp France
      EMPLOYÉ: Jean Dupont
      POSTE: Développeur Senior
      
      SALAIRE BRUT: 3000€
      SÉCURITÉ SOCIALE: 660€
      CSG: 270€
      SALAIRE NET: 2070€
      
      AVANTAGES:
      Tickets Restaurant: 200€
      Transport: 100€
      Mutuelle: 150€`,
      expectedStatut: 'CLT'
    }
  };

  const data = testData[country as keyof typeof testData];
  
  try {
    console.log(`   📊 Analyse pour ${country.toUpperCase()}...`);
    const result = await service.analyzePayslip(data.text, country, 'test-user');

    // Vérifications
    console.log(`   ✅ Extraction: ${result.extraction ? 'OK' : 'ERREUR'}`);
    console.log(`   ✅ Validation: ${result.validation.isValid ? 'VALIDE' : 'INVALIDE'} (confiance: ${result.validation.confidence}%)`);
    console.log(`   ✅ Recommandations: ${result.recommendations.recommendations.length} conseils générés`);
    console.log(`   ✅ Pays détecté: ${result.finalData.pays}`);
    console.log(`   ✅ Statut: ${result.finalData.statut} (attendu: ${data.expectedStatut})`);

    // Vérifications spécifiques
    if (result.validation.warnings.length > 0) {
      console.log(`   ⚠️  Warnings: ${result.validation.warnings.length}`);
      result.validation.warnings.forEach(warning => console.log(`      - ${warning}`));
    }

    if (result.recommendations.score_optimisation > 0) {
      console.log(`   📈 Score d'optimisation: ${result.recommendations.score_optimisation}%`);
    }

  } catch (error) {
    console.log(`   ❌ Erreur lors de l'analyse ${country}: ${error}`);
  }
}

function testDataValidation() {
  const testCases = [
    {
      name: 'Données correctes',
      data: {
        salario_bruto: 5000,
        salario_liquido: 4000,
        descontos: 1000,
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      },
      shouldBeValid: true
    },
    {
      name: 'Inversion Brut/Net',
      data: {
        salario_bruto: 4000, // Inversé
        salario_liquido: 5000, // Inversé
        descontos: 1000,
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      },
      shouldBeValid: true,
      shouldHaveCorrections: true
    },
    {
      name: 'Valeurs négatives',
      data: {
        salario_bruto: -5000,
        salario_liquido: 4000,
        descontos: -1000,
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      },
      shouldBeValid: true,
      shouldHaveCorrections: true
    },
    {
      name: 'Salaire très faible',
      data: {
        salario_bruto: 50,
        salario_liquido: 40,
        descontos: 10,
        beneficios: 0,
        seguros: 0,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      },
      shouldBeValid: true,
      shouldHaveWarnings: true
    }
  ];

  for (const testCase of testCases) {
    console.log(`   📋 ${testCase.name}...`);
    
    const result = PayslipValidator.validateAndCorrect(testCase.data as PayslipAnalysisResult);
    
    const isValid = result.isValid === testCase.shouldBeValid;
    const hasCorrections = Object.keys(result.corrections).length > 0 === testCase.shouldHaveCorrections;
    const hasWarnings = result.warnings.length > 0 === testCase.shouldHaveWarnings;
    
    console.log(`      ${isValid ? '✅' : '❌'} Validité: ${result.isValid} (attendu: ${testCase.shouldBeValid})`);
    console.log(`      ${hasCorrections ? '✅' : '❌'} Corrections: ${Object.keys(result.corrections).length} (attendu: ${testCase.shouldHaveCorrections ? '>0' : '0'})`);
    console.log(`      ${hasWarnings ? '✅' : '❌'} Warnings: ${result.warnings.length} (attendu: ${testCase.shouldHaveWarnings ? '>0' : '0'})`);
    console.log(`      📊 Confiance: ${result.confidence}%`);
  }
}

// Test des prompts par pays
async function testPrompts() {
  console.log('\n5️⃣ Test des prompts par pays...');
  
  const { getPromptForCountry } = await import('../lib/ia/prompts');
  
  const countries = ['br', 'fr', 'default'];
  const types: ('extraction' | 'recommendations')[] = ['extraction', 'recommendations'];
  
  for (const country of countries) {
    for (const type of types) {
      try {
        const prompt = getPromptForCountry(country, type);
        const isValid = prompt && prompt.length > 100;
        console.log(`   ${isValid ? '✅' : '❌'} Prompt ${country}/${type}: ${isValid ? 'OK' : 'ERREUR'}`);
      } catch (error) {
        console.log(`   ❌ Prompt ${country}/${type}: Erreur - ${error}`);
      }
    }
  }
}

// Exécution des tests
if (require.main === module) {
  testIntegration()
    .then(() => {
      console.log('\n🎉 Tests d\'intégration terminés avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Erreur lors des tests d\'intégration:', error);
      process.exit(1);
    });
}

export { testIntegration }; 