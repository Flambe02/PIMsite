import 'dotenv/config';
import { scanAnalysisService } from '../lib/services/scanAnalysisService';

async function testRealOCR() {
  console.log('🧪 Test avec texte OCR réel');
  console.log('============================');

  // Texte OCR réel extrait de l'image
  const realOCRText = `
    Recibo de Pagamento de Salário
    janeiro/2017
    351410 Escrivão judicial
    Emo.
    Local Deoto. Setor Secão Fl. Dependentes
    Descrição
    Referência
    220 horas
    11%
    28%
    Vencimentos
    15.345,00
    15.345,00
    Valor Líquido
    Total de Vencimentos
    Total de Descontos
    4.577,72
    10.767,28
    Sal. Contr. INSS
    5.531,31
    Base Cálc. FGTS
    15.345,00
    FGTS do Mês
    1.227,60
    Base Cálc. IRRF
    12.867,79
    Faixa IRRF
  `;

  console.log('📄 Texte OCR réel:');
  console.log(realOCRText);
  console.log();

  console.log('🤖 Début analyse IA...');
  const result = await scanAnalysisService.analyzeScan(realOCRText, 'br');

  if (result.success) {
    console.log('✅ Analyse réussie');
    console.log('📊 Données structurées:');
    console.log(JSON.stringify(result.structuredData, null, 2));
    console.log();

    // Vérifier l'extraction des noms
    console.log('🔍 Vérification des noms:');
    console.log(`- Nom employé: "${result.structuredData.employee_name}"`);
    console.log(`- Nom entreprise: "${result.structuredData.company_name}"`);
    console.log(`- Cargo: "${result.structuredData.position}"`);
    console.log(`- Période: "${result.structuredData.period}"`);
    console.log();

    // Analyser le texte pour trouver des indices
    console.log('🔍 Analyse du texte OCR:');
    const textLower = realOCRText.toLowerCase();
    
    // Chercher des noms propres
    const possibleNames = realOCRText.match(/[A-Z][a-z]+/g);
    console.log('Noms possibles trouvés:', possibleNames);
    
    // Chercher des entreprises
    const possibleCompanies = realOCRText.match(/[A-Z][a-z]+ [A-Z][a-z]+/g);
    console.log('Entreprises possibles trouvées:', possibleCompanies);
    
    // Chercher des cargos
    const possibleJobs = realOCRText.match(/[A-Z][a-z]+ [a-z]+/g);
    console.log('Cargos possibles trouvés:', possibleJobs);

  } else {
    console.log('❌ Échec de l\'analyse:', result.error);
  }

  console.log('✅ Test terminé');
}

testRealOCR().catch(console.error); 