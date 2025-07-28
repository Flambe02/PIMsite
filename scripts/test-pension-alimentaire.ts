import 'dotenv/config';
import { scanAnalysisService } from '../lib/services/scanAnalysisService';

async function testPensionAlimentaire() {
  console.log('🧪 Test de détection de pension alimentaire');
  console.log('============================================');

  // Texte de la holerite avec pension alimentaire
  const payslipText = `
    Recibo de Pagamento de Salário
    janeiro/2017
    351410 Escrivão judicial
    Nome do Funcionário: Marcos
    Empresa: Aprender Excel
    
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

  console.log('📄 Texte de la holerite:');
  console.log(payslipText);
  console.log();

  console.log('🤖 Début analyse IA...');
  const result = await scanAnalysisService.analyzeScan(payslipText, 'br');

  if (result.success) {
    console.log('✅ Analyse réussie');
    console.log('📊 Données structurées:');
    console.log(JSON.stringify(result.structuredData, null, 2));
    console.log();

    // Vérifier la pension alimentaire
    const outros = result.structuredData.outros || [];
    const pensionAlimentaire = outros.find((item: any) => 
      item.nome && item.nome.toLowerCase().includes('pensão alimentícia')
    );

    if (pensionAlimentaire) {
      console.log('✅ Pension alimentaire détectée:');
      console.log(`   - Nom: ${pensionAlimentaire.nome}`);
      console.log(`   - Valeur: R$ ${pensionAlimentaire.valor}`);
    } else {
      console.log('❌ Pension alimentaire non détectée');
    }

    // Vérifier les impôts
    const impostos = result.structuredData.impostos || [];
    console.log('💰 Impostos détectés:', impostos.length);
    impostos.forEach((imposto: any) => {
      console.log(`   - ${imposto.nome}: R$ ${imposto.valor}`);
    });

  } else {
    console.log('❌ Échec de l\'analyse:', result.error);
  }

  console.log('✅ Test terminé');
}

testPensionAlimentaire().catch(console.error); 