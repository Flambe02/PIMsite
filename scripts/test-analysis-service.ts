/**
 * Test du service d'analyse IA
 */

import 'dotenv/config';
import { scanAnalysisService } from '@/lib/services/scanAnalysisService';

async function testAnalysisService() {
  console.log('🧪 Test du service d\'analyse IA');
  console.log('==================================');

  try {
    // Texte de test (feuille de paie brésilienne)
    const testText = `
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

    console.log('📄 Texte de test:', testText.length, 'caractères');
    console.log('🌍 Pays: br (Brésil)');

    // Test de l'analyse
    console.log('\n🤖 Début analyse IA...');
    const result = await scanAnalysisService.analyzeScan(testText, 'br');

    console.log('\n✅ Résultat de l\'analyse:');
    console.log('📊 Success:', result.success);
    console.log('📊 Confidence:', result.confidence);
    console.log('📊 Processing Time:', result.processingTime);

    console.log('\n📋 Données structurées:');
    console.log(JSON.stringify(result.structuredData, null, 2));

    console.log('\n💡 Recommandations:');
    console.log(JSON.stringify(result.recommendations, null, 2));

    // Vérification des données
    const hasEmployeeName = result.structuredData.employee_name;
    const hasCompanyName = result.structuredData.company_name;
    const hasSalary = result.structuredData.salary_bruto || result.structuredData.salary_liquido;
    const hasRecommendations = result.recommendations && result.recommendations.recommendations && result.recommendations.recommendations.length > 0;

    console.log('\n🔍 Vérifications:');
    console.log('✅ Nom employé:', hasEmployeeName ? 'OUI' : 'NON');
    console.log('✅ Nom entreprise:', hasCompanyName ? 'OUI' : 'NON');
    console.log('✅ Salaire:', hasSalary ? 'OUI' : 'NON');
    console.log('✅ Recommandations:', hasRecommendations ? 'OUI' : 'NON');

    if (!hasEmployeeName || !hasCompanyName || !hasSalary) {
      console.log('\n⚠️ ATTENTION: Données manquantes détectées');
      console.log('Le service d\'analyse IA ne fonctionne peut-être pas correctement');
    } else {
      console.log('\n🎉 Toutes les données sont extraites correctement !');
    }

  } catch (error) {
    console.error('❌ Erreur test analyse IA:', error);
  }
}

testAnalysisService().catch(console.error); 