import 'dotenv/config';
import { scanAnalysisService } from '../lib/services/scanAnalysisService';

async function testPensionComplete() {
  console.log('🧪 Test avec texte complet incluant pension alimentaire');
  console.log('=====================================================');

  // Texte complet avec pension alimentaire
  const completePayslipText = `
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
    
    Salário Base: 15.345,00
    Sal. Contr. INSS: 5.531,31
    Base Cálc. FGTS: 15.345,00
    FGTS do Mês: 1.227,60
    Base Cálc. IRRF: 12.867,79
    Faixa IRRF: 05
  `;

  console.log('📄 Texte complet:');
  console.log(completePayslipText);
  console.log();

  console.log('🤖 Début analyse IA...');
  const result = await scanAnalysisService.analyzeScan(completePayslipText, 'br');

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

    // Vérifier les déductions détaillées
    const impostos = result.structuredData.impostos || [];
    const outros = result.structuredData.outros || [];
    
    console.log('💰 Déductions détaillées:');
    console.log(`- Impostos: ${impostos.length}`);
    impostos.forEach((imposto: any) => {
      console.log(`  * ${imposto.nome}: R$ ${imposto.valor}`);
    });
    
    console.log(`- Outros: ${outros.length}`);
    outros.forEach((outro: any) => {
      console.log(`  * ${outro.nome}: R$ ${outro.valor}`);
    });

    // Vérifier spécifiquement la pension alimentaire
    const pensionAlimentaire = outros.find((item: any) => 
      item.nome && item.nome.toLowerCase().includes('pensão alimentícia')
    );

    if (pensionAlimentaire) {
      console.log('✅ Pension alimentaire détectée:');
      console.log(`   - Nom: ${pensionAlimentaire.nome}`);
      console.log(`   - Valeur: R$ ${pensionAlimentaire.valor}`);
      
      if (pensionAlimentaire.valor > 0) {
        console.log('✅ Valeur correcte extraite !');
      } else {
        console.log('⚠️ Valeur manquante ou incorrecte');
      }
    } else {
      console.log('❌ Pension alimentaire non détectée');
    }

  } else {
    console.log('❌ Échec de l\'analyse:', result.error);
  }

  console.log('✅ Test terminé');
}

testPensionComplete().catch(console.error); 