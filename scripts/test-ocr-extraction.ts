/**
 * Test d'extraction OCR pour diagnostiquer le problème de validation
 */

import 'dotenv/config';
import { googleVisionService } from '../lib/services/googleVisionService';

async function testOCRExtraction() {
  console.log('🧪 Test d\'extraction OCR');
  console.log('==========================');

  // Test avec un vrai holerite brésilien
  const payslipText = `
    COMPROVANTE DE PAGAMENTO DE SALÁRIO
    Empresa: Tech Corp Ltda
    Funcionário: João Silva
    Cargo: Desenvolvedor
    Período: Janeiro 2024

    SALÁRIO BRUTO: R$ 5.000,00
    SALÁRIO LÍQUIDO: R$ 3.800,00
    DESCONTOS: R$ 1.200,00

    BENEFÍCIOS:
    - Vale Refeição
    - Vale Transporte
    - Plano de Saúde

    Status: CLT
  `;

  console.log('📁 Test avec holerite brésilien');
  console.log('📄 Contenu:');
  console.log(payslipText);
  console.log();

  console.log('🔍 Test validation document...');
  const validationResult = await googleVisionService.validateDocument(payslipText);
  
  console.log('📊 Score de confiance:', validationResult.confidence);
  console.log('📋 Est-ce une feuille de paie:', validationResult.isPayslip);
  console.log('📋 Pays détecté:', validationResult.detectedCountry);
  console.log('📋 Mots-clés trouvés:', validationResult.missingFields.length, 'manquants');
  console.log('📋 Suggestions:', validationResult.suggestions);
  console.log();

  // Test avec une feuille de paie française
  const frenchPayslipText = `
    BULLETIN DE PAIE
    M EMPLOYE Jean
    Emploi: Préparateur
    Contrat: CDI
    Période du 01/01/2024 au 31/01/2024
    
    GAINS:
    Salaire de base: 1820,04
    
    RETENUES:
    Sécurité sociale maladie: 127,40
    CSG non déductible: 43,94
    CRDS non déductible: 9,15
    Assurance chômage: 73,71
    
    NET À PAYER: 1355,12
  `;

  console.log('📁 Test avec feuille de paie française');
  console.log('📄 Contenu:');
  console.log(frenchPayslipText);
  console.log();

  console.log('🔍 Test validation document...');
  const validationResult2 = await googleVisionService.validateDocument(frenchPayslipText);
  
  console.log('📊 Score de confiance:', validationResult2.confidence);
  console.log('📋 Est-ce une feuille de paie:', validationResult2.isPayslip);
  console.log('📋 Pays détecté:', validationResult2.detectedCountry);
  console.log('📋 Mots-clés trouvés:', validationResult2.missingFields.length, 'manquants');
  console.log('📋 Suggestions:', validationResult2.suggestions);
  console.log();

  // Test avec un document non-holerite
  const nonPayslipText = `
    CONTRATO DE TRABALHO
    Este documento estabelece as condições de trabalho
    entre as partes contratantes.
    
    Cláusulas:
    1. Jornada de trabalho
    2. Local de trabalho
    3. Responsabilidades
    
    Assinado em: 15/01/2024
  `;

  console.log('📁 Test avec document non-holerite');
  console.log('📄 Contenu:');
  console.log(nonPayslipText);
  console.log();

  console.log('🔍 Test validation document...');
  const validationResult3 = await googleVisionService.validateDocument(nonPayslipText);
  
  console.log('📊 Score de confiance:', validationResult3.confidence);
  console.log('📋 Est-ce une feuille de paie:', validationResult3.isPayslip);
  console.log('📋 Pays détecté:', validationResult3.detectedCountry);
  console.log('📋 Mots-clés trouvés:', validationResult3.missingFields.length, 'manquants');
  console.log('📋 Suggestions:', validationResult3.suggestions);
  console.log();

  // Test avec des pages dupliquées
  const duplicatePayslipText = `
    Recibo de Pagamento de Salário
    Empresa: Tech Corp Ltda
    Funcionário: João Silva
    Cargo: Desenvolvedor
    Período: Janeiro 2024
    SALÁRIO BRUTO: R$ 5.000,00
    SALÁRIO LÍQUIDO: R$ 3.800,00
    DESCONTOS: R$ 1.200,00
    
    Recibo de Pagamento de Salário
    Empresa: Tech Corp Ltda
    Funcionário: Maria Santos
    Cargo: Analista
    Período: Janeiro 2024
    SALÁRIO BRUTO: R$ 4.000,00
    SALÁRIO LÍQUIDO: R$ 3.200,00
    DESCONTOS: R$ 800,00
  `;

  console.log('📁 Test avec pages dupliquées');
  console.log('📄 Contenu:');
  console.log(duplicatePayslipText);
  console.log();

  console.log('🔍 Test validation document...');
  const validationResult4 = await googleVisionService.validateDocument(duplicatePayslipText);
  
  console.log('📊 Score de confiance:', validationResult4.confidence);
  console.log('📋 Est-ce une feuille de paie:', validationResult4.isPayslip);
  console.log('📋 Pays détecté:', validationResult4.detectedCountry);
  console.log('📋 Mots-clés trouvés:', validationResult4.missingFields.length, 'manquants');
  console.log('📋 Suggestions:', validationResult4.suggestions);
  console.log();

  console.log('✅ Test terminé');
}

testOCRExtraction().catch(console.error); 