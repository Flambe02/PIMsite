import 'dotenv/config';
import { googleVisionService } from '../lib/services/googleVisionService';

async function testOCRDebug() {
  console.log('🔍 DEBUG PROCESSUS OCR COMPLET');
  console.log('===============================');

  // Simuler le texte OCR que vous recevez réellement
  const realOCRText = `
    Aprender Excel
    Recibo de Pagamento de Salário
    janeiro/2017
    
    CNPJ: 00.000.000/0000-00
    Empresa: Aprender Excel Ltda.
    
    Código: 587
    Nome do Funcionário: Marcos
    Admissão: 21/12/1930
    
    CBO: 351410 Escrivão judicial
    Emp. Local Depto. Setor Seção Fl. Dependentes: 3
    
    Cód. Descrição Referência Vencimentos Descontos
    101 SALARIO 220 horas 15.345,00
    102 I.N.S.S. 11% 608,44
    103 IMPOSTO DE RENDA 28% 2.669,28
    105 PENSAO ALIMENTICIA 1.300,00
    
    Total de Vencimentos: 15.345,00
    Total de Descontos: 4.577,72
    Valor Líquido: 10.767,28
  `;

  console.log('📝 Texte OCR reçu:');
  console.log(realOCRText);
  console.log();

  // Test de validation du document
  console.log('🔍 Validation du document...');
  try {
    const validation = await googleVisionService.validateDocument(realOCRText);
    console.log('✅ Validation:', validation);
  } catch (error) {
    console.log('❌ Erreur validation:', error);
  }

  // Test de traitement des pages dupliquées
  console.log('\n📄 Test pages dupliquées...');
  try {
    const duplicateResult = (googleVisionService as any).handleDuplicatePages(realOCRText);
    console.log('✅ Résultat dupliquées:', duplicateResult);
  } catch (error) {
    console.log('❌ Erreur dupliquées:', error);
  }

  // Test de calcul de confiance
  console.log('\n🎯 Test calcul confiance...');
  try {
    const confidenceScore = (googleVisionService as any).calculateConfidenceScore(realOCRText);
    console.log('✅ Score confiance:', confidenceScore);
  } catch (error) {
    console.log('❌ Erreur confiance:', error);
  }

  console.log('\n✅ Debug terminé');
}

testOCRDebug().catch(console.error); 