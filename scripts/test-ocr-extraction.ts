/**
 * Test d'extraction OCR pour diagnostiquer le problème de validation
 */

import 'dotenv/config';
import { googleVisionService } from '../lib/services/googleVisionService';

async function testOCRExtraction() {
  console.log('🧪 Test d\'extraction OCR');
  console.log('==========================');

  // Test avec un vrai holerite
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

  console.log('📁 Test avec holerite valide');
  console.log('📄 Contenu:');
  console.log(payslipText);
  console.log();

  console.log('🔍 Test validation document...');
  const validationResult = await googleVisionService.validateDocument(payslipText);
  
  console.log('📊 Score de confiance:', validationResult.confidence);
  console.log('📋 Est-ce une feuille de paie:', validationResult.isPayslip);
  console.log('📋 Mots-clés trouvés:', validationResult.missingFields.length, 'manquants');
  console.log('📋 Suggestions:', validationResult.suggestions);
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
  const validationResult2 = await googleVisionService.validateDocument(nonPayslipText);
  
  console.log('📊 Score de confiance:', validationResult2.confidence);
  console.log('📋 Est-ce une feuille de paie:', validationResult2.isPayslip);
  console.log('📋 Mots-clés trouvés:', validationResult2.missingFields.length, 'manquants');
  console.log('📋 Suggestions:', validationResult2.suggestions);
  console.log();

  console.log('✅ Test terminé');
}

testOCRExtraction().catch(console.error); 