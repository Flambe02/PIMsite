import 'dotenv/config';
import { scanAnalysisService } from '../lib/services/scanAnalysisService';

async function testIncompleteOCR() {
  console.log('🔍 TEST OCR INCOMPLET');
  console.log('=====================');

  // Simuler le texte OCR incomplet que vous recevez réellement
  const incompleteOCRText = `
    Recibo de Pagamento de Salário
    janeiro/2017
    
    CNPJ: 00.000.000/0000-00
    
    Código: 587
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

  console.log('📝 Texte OCR incomplet (simulation):');
  console.log(incompleteOCRText);
  console.log();

  console.log('🔍 Analyse du texte incomplet...');
  console.log('❌ Manquant: "Nome do Funcionário" et "Empresa"');
  console.log();

  // Test de l'analyse IA
  console.log('🤖 Test analyse IA avec texte incomplet...');
  try {
    const result = await scanAnalysisService.analyzeScan(incompleteOCRText, 'br');
    
    if (result.success) {
      console.log('✅ Analyse réussie');
      console.log('📊 Données structurées:');
      console.log(JSON.stringify(result.structuredData, null, 2));
      
      // Vérifier les noms
      console.log('\n🔍 Vérification des noms:');
      console.log(`- Nom employé: "${result.structuredData.employee_name}"`);
      console.log(`- Nom entreprise: "${result.structuredData.company_name}"`);
      console.log(`- Cargo: "${result.structuredData.position}"`);
      
      // Vérifier si les noms sont "Não identificado"
      const expectedForIncomplete = {
        employee_name: 'Não identificado',
        company_name: 'Não identificado',
        position: 'Escrivão judicial' // Celui-ci devrait être trouvé
      };
      
      console.log('\n✅ Comparaison avec attendu (texte incomplet):');
      Object.entries(expectedForIncomplete).forEach(([key, expected]) => {
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

  console.log('\n✅ Test terminé');
}

testIncompleteOCR().catch(console.error); 