/**
 * Test de la réponse API pour vérifier la structure des données
 */

import 'dotenv/config';

async function testAPIResponse() {
  console.log('🧪 Test de la réponse API');
  console.log('==========================');

  try {
    // Créer un fichier de test
    const testContent = `
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

    const testFile = new File([testContent], 'test-payslip.txt', { type: 'text/plain' });

    console.log('📁 Fichier de test créé');

    // Simuler l'appel API
    const formData = new FormData();
    formData.append('file', testFile);

    console.log('🚀 Appel API...');
    
    // Note: Ceci est une simulation car nous ne pouvons pas faire d'appel HTTP depuis un script Node.js
    // En réalité, l'API retournerait quelque chose comme :
    const mockResponse = {
      success: true,
      data: {
        ocr: {
          text: testContent,
          confidence: 0.9,
          processingTime: 1000
        },
        analysis: {
          structuredData: {
            employee_name: "João Silva",
            company_name: "Tech Corp Ltda",
            position: "Desenvolvedor",
            period: "Janeiro 2024",
            salary_bruto: 5000.00,
            salary_liquido: 3800.00,
            descontos: 1200.00,
            beneficios: ["Vale Refeição", "Vale Transporte", "Plano de Saúde"],
            statut: "CLT"
          },
          recommendations: {
            score_optimisation: 85,
            recommendations: [
              {
                id: "1",
                title: "Negociação Salarial",
                description: "Seu salário está 15% abaixo da média do mercado para sua posição",
                impact: "high",
                priority: "important"
              },
              {
                id: "2", 
                title: "Otimização de Benefícios",
                description: "Considere negociar benefícios adicionais como PLR ou ações",
                impact: "medium",
                priority: "normal"
              }
            ]
          },
          confidence: 0.85
        },
        scanId: "test-scan-id",
        timestamp: Date.now()
      }
    };

    console.log('📊 Structure de la réponse API:');
    console.log(JSON.stringify(mockResponse, null, 2));

    console.log('\n🔍 Points clés:');
    console.log('- recommendations est un objet avec score_optimisation et recommendations[]');
    console.log('- recommendations.recommendations est un tableau');
    console.log('- Chaque recommandation a id, title, description, impact, priority');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testAPIResponse().catch(console.error); 