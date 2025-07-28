import 'dotenv/config';
import { scanAnalysisService } from '../lib/services/scanAnalysisService';

async function testRealImageOCR() {
  console.log('🔍 TEST OCR AVEC TEXTE RÉEL DE L\'IMAGE');
  console.log('==========================================');

  // Texte OCR exact basé sur l'image fournie
  const realImageOCRText = `
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
    
    Salário Base: 15.345,00
    Sal. Contr. INSS: 5.531,31
    Base Cálc. FGTS: 15.345,00
    FGTS do Mês: 1.227,60
    Base Cálc. IRRF: 12.867,79
    Faixa IRRF: 05
  `;

  console.log('📝 Texte OCR exact de l\'image:');
  console.log(realImageOCRText);
  console.log();

  console.log('🔍 Informations attendues:');
  console.log('- Nom employé: "Marcos"');
  console.log('- Nom entreprise: "Aprender Excel Ltda."');
  console.log('- Pension alimentaire: R$ 1.300,00');
  console.log();

  // Test de l'analyse IA
  console.log('🤖 Test analyse IA avec texte exact...');
  try {
    const result = await scanAnalysisService.analyzeScan(realImageOCRText, 'br');
    
    if (result.success) {
      console.log('✅ Analyse réussie');
      console.log('📊 Données structurées:');
      console.log(JSON.stringify(result.structuredData, null, 2));
      
      // Vérifier les noms
      console.log('\n🔍 Vérification des noms:');
      console.log(`- Nom employé: "${result.structuredData.employee_name}"`);
      console.log(`- Nom entreprise: "${result.structuredData.company_name}"`);
      console.log(`- Cargo: "${result.structuredData.position}"`);
      
      // Vérifier la pension alimentaire
      const outros = result.structuredData.outros || [];
      const pensionAlimentaire = outros.find((item: any) => 
        item.nome && item.nome.toLowerCase().includes('pensão alimentícia')
      );
      
      console.log('\n💰 Vérification pension alimentaire:');
      if (pensionAlimentaire) {
        console.log(`- Trouvée: ${pensionAlimentaire.nome}`);
        console.log(`- Valeur: R$ ${pensionAlimentaire.valor}`);
      } else {
        console.log('❌ Pension alimentaire non trouvée');
      }
      
      // Vérifier si les noms sont corrects
      const expectedNames = {
        employee_name: 'Marcos',
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

  console.log('\n✅ Test terminé');
}

testRealImageOCR().catch(console.error); 