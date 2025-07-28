import 'dotenv/config';
import { scanAnalysisService } from '../lib/services/scanAnalysisService';

async function testIncompleteOCRReal() {
  console.log('🔍 TEST OCR INCOMPLET RÉEL');
  console.log('============================');

  // Simuler l'OCR incomplet que vous recevez réellement
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
    
    Salário Base: 15.345,00
    Sal. Contr. INSS: 5.531,31
    Base Cálc. FGTS: 15.345,00
    FGTS do Mês: 1.227,60
    Base Cálc. IRRF: 12.867,79
    Faixa IRRF: 05
  `;

  console.log('📝 Texte OCR incomplet (simulation du problème réel):');
  console.log(incompleteOCRText);
  console.log();

  console.log('🔍 Informations manquantes dans l\'OCR:');
  console.log('❌ "Nome do Funcionário: Marcos" - MANQUANT');
  console.log('❌ "Empresa: Aprender Excel Ltda." - MANQUANT');
  console.log('✅ "PENSAO ALIMENTICIA 1.300,00" - PRÉSENT');
  console.log();

  // Test de l'analyse IA avec extraction flexible
  console.log('🤖 Test analyse IA avec extraction flexible...');
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
      
      // Analyser pourquoi les noms ne sont pas trouvés
      console.log('\n🔍 Analyse du texte pour les noms:');
      const textLower = incompleteOCRText.toLowerCase();
      
      // Chercher des noms potentiels
      const potentialNames = ['marcos', 'joão', 'maria', 'pedro', 'ana'];
      const foundNames = potentialNames.filter(name => textLower.includes(name));
      console.log('Noms potentiels trouvés:', foundNames);
      
      // Chercher des entreprises potentielles
      const potentialCompanies = ['aprender excel', 'excel', 'ltda', 's.a.'];
      const foundCompanies = potentialCompanies.filter(company => textLower.includes(company));
      console.log('Entreprises potentielles trouvées:', foundCompanies);
      
    } else {
      console.log('❌ Échec analyse:', result.error);
    }
  } catch (error) {
    console.log('❌ Erreur analyse:', error);
  }

  console.log('\n✅ Test terminé');
}

testIncompleteOCRReal().catch(console.error); 