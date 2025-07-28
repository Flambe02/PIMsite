#!/usr/bin/env tsx

import { PayslipAnalysisService } from '../lib/ia/payslipAnalysisService';
import { OCRLearningServiceClient } from '../lib/learning/ocrLearningServiceClient';

/**
 * Script de test pour le processus de scan optimisé
 */
async function testOptimizedProcess() {
  console.log('🧪 Test du processus de scan optimisé...\n');

  try {
    // 1. Test du service d'analyse IA
    console.log('1️⃣ Test du service d\'analyse IA...');
    const analysisService = new PayslipAnalysisService();
    
    const testOCRText = `
    EMPREGADOR
    Recibo de Pagamento de Salário
    Nome: João Silva
    Referente ao Mês: Janeiro/2022
    Função: Desenvolvedor
    
    Salário Bruto: R$ 7.089,84
    Descontos: R$ 1.980,93
    Salário Líquido: R$ 5.108,91
    
    Benefícios: R$ 0,00
    Seguros: R$ 300,00
    `;

    const analysisResult = await analysisService.analyzePayslip(testOCRText, 'br');
    console.log('✅ Analyse IA réussie:', {
      extraction: analysisResult.extraction,
      validation: analysisResult.validation,
      recommendations: analysisResult.recommendations
    });

    // 2. Test du service d'apprentissage
    console.log('\n2️⃣ Test du service d\'apprentissage...');
    
    const learningData = {
      user_id: 'test-user-id',
      country: 'br',
      statut: 'CLT',
      raw_ocr_text: testOCRText,
      extracted_data: analysisResult.finalData,
      validation_result: analysisResult.validation,
      confidence_score: analysisResult.validation.confidence,
      validated: analysisResult.validation.isValid
    };

    try {
      const learningId = await OCRLearningServiceClient.storeLearningData(learningData);
      console.log('✅ Stockage d\'apprentissage réussi:', learningId);
    } catch (learningError) {
      console.log('⚠️ Erreur d\'apprentissage (non bloquant):', learningError);
    }

    // 3. Test de génération d'insights
    console.log('\n3️⃣ Test de génération d\'insights...');
    try {
      const insights = await OCRLearningServiceClient.generateLearningInsights('br', 'CLT');
      console.log('✅ Insights générés:', insights);
    } catch (insightsError) {
      console.log('⚠️ Erreur d\'insights (non bloquant):', insightsError);
    }

    // 4. Test de statistiques d'apprentissage
    console.log('\n4️⃣ Test de statistiques d\'apprentissage...');
    try {
      const stats = await OCRLearningServiceClient.getLearningStats();
      console.log('✅ Statistiques récupérées:', stats);
    } catch (statsError) {
      console.log('⚠️ Erreur de statistiques (non bloquant):', statsError);
    }

    console.log('\n🎉 Tous les tests du processus optimisé sont terminés !');

  } catch (error) {
    console.error('❌ Erreur dans le test du processus optimisé:', error);
  }
}

// Exécution du test
if (require.main === module) {
  testOptimizedProcess();
}

export { testOptimizedProcess }; 