import 'dotenv/config';
import { scanAnalysisService } from '../lib/services/scanAnalysisService';

async function debugOCRReal() {
  console.log('🔍 DEBUG OCR RÉEL');
  console.log('==================');

  // Test avec le texte OCR réel que vous obtenez
  console.log('📄 Test avec OCR réel...');
  
  // Simuler le texte OCR réel que vous obtenez
  const realOCRText = `
    Recibo de Pagamento de Salário
    janeiro/2017
    
    CNPJ: 00.000.000/0000-00
    Empresa: Aprender Excel Ltda.
    
    Código: 587
    Nome do Funcionário: Marcos Silva
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

  // Test de l'analyse IA
  console.log('🤖 Test analyse IA...');
  try {
    const result = await scanAnalysisService.analyzeScan(realOCRText, 'br');
    
    if (result.success) {
      console.log('✅ Analyse réussie');
      console.log('📊 Données structurées:');
      console.log(JSON.stringify(result.structuredData, null, 2));
      
      // Vérifier les noms
      console.log('\n🔍 Vérification des noms:');
      console.log(`- Nom employé: "${result.structuredData.employee_name}"`);
      console.log(`- Nom entreprise: "${result.structuredData.company_name}"`);
      console.log(`- Cargo: "${result.structuredData.position}"`);
      
      // Vérifier si les noms sont corrects
      const expectedNames = {
        employee_name: 'Marcos Silva',
        company_name: 'Aprender Excel Ltda.',
        position: 'Escrivão judicial'
      };
      
      console.log('\n✅ Comparaison avec attendu:');
      Object.entries(expectedNames).forEach(([key, expected]) => {
        const actual = result.structuredData[key];
        const isCorrect = actual === expected;
        console.log(`${isCorrect ? '✅' : '❌'} ${key}: "${actual}" (attendu: "${expected}")`);
      });
      
    } else {
      console.log('❌ Échec analyse:', result.error);
    }
  } catch (error) {
    console.log('❌ Erreur analyse:', error);
  }

  console.log('\n✅ Debug terminé');
}

debugOCRReal().catch(console.error); 