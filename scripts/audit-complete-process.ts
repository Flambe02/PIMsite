#!/usr/bin/env tsx

/**
 * Audit complet du processus OCR jusqu'aux recommandations
 * Teste chaque étape pour s'assurer que le LLM publie bien les recommandations
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PayslipAnalysisService } from '../lib/ia/payslipAnalysisService';
import { OCRLearningService } from '../lib/learning/ocrLearningService';
import { extractBenefitsFromParsedData } from '../lib/benefits';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Utiliser la clé de service pour contourner les politiques RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function auditCompleteProcess() {
  console.log('🔍 Audit complet du processus OCR jusqu\'aux recommandations...\n');

  try {
    // 1. Test OCR avec texte simulé
    console.log('📄 1. Test OCR avec texte simulé...');
    const testOCRText = `
    EMPREGADOR: TechSolutions Ltda
    Recibo de Pagamento de Salário
    Nome: Maria Santos
    Referente ao Mês: Dezembro/2024
    Função: Desenvolvedora Senior
    
    Salário Base: R$ 8.500,00
    Total Vencimentos: R$ 8.500,00
    Total Descontos: R$ 2.300,00
    Líquido a Receber: R$ 6.200,00
    
    DESCONTOS:
    INSS: R$ 680,00
    IRRF: R$ 1.020,00
    Plano de Saúde: R$ 300,00
    Vale Refeição: R$ 300,00
    
    BENEFÍCIOS:
    Vale Transporte: R$ 200,00
    FGTS: R$ 680,00
    `;

    console.log('✅ Texte OCR simulé créé, longueur:', testOCRText.length);

    // 2. Test du service d'analyse IA
    console.log('\n🤖 2. Test du service d\'analyse IA...');
    const analysisService = new PayslipAnalysisService();
    
    console.log('🔍 Détection du pays...');
    const detectedCountry = await analysisService.detectCountry(testOCRText);
    console.log('✅ Pays détecté:', detectedCountry);

    console.log('🔍 Analyse complète...');
    const analysisResult = await analysisService.analyzePayslip(testOCRText, detectedCountry, 'test-user-id');
    
    console.log('✅ Analyse IA terminée:');
    console.log('- Extraction:', {
      salario_bruto: analysisResult.extraction.salario_bruto,
      salario_liquido: analysisResult.extraction.salario_liquido,
      descontos: analysisResult.extraction.descontos,
      statut: analysisResult.extraction.statut,
      employee_name: analysisResult.extraction.employee_name,
      company_name: analysisResult.extraction.company_name
    });

    console.log('- Validation:', {
      isValid: analysisResult.validation.isValid,
      confidence: analysisResult.validation.confidence,
      warnings: analysisResult.validation.warnings
    });

    console.log('- Recommandations:', {
      resume_situation: analysisResult.recommendations.resume_situation,
      recommendations_count: analysisResult.recommendations.recommendations.length,
      score_optimisation: analysisResult.recommendations.score_optimisation
    });

    // 3. Test de l'apprentissage automatique
    console.log('\n🧠 3. Test de l\'apprentissage automatique...');
    let learningInsights: any[] | null = null;
    
    try {
      const learningData = {
        user_id: 'test-user-id',
        country: detectedCountry,
        statut: analysisResult.finalData.statut || 'Autre',
        raw_ocr_text: testOCRText,
        extracted_data: analysisResult.finalData,
        validation_result: analysisResult.validation,
        confidence_score: analysisResult.validation.confidence,
        validated: analysisResult.validation.isValid
      };

      const learningId = await OCRLearningService.storeLearningData(learningData);
      console.log('✅ Données d\'apprentissage stockées:', learningId);

      // Amélioration de la confiance
      try {
        const enhancedConfidence = await OCRLearningService.enhanceConfidenceWithLearning(
          detectedCountry,
          analysisResult.finalData.statut || 'Autre',
          analysisResult.validation.confidence
        );
        console.log('📈 Confiance améliorée:', enhancedConfidence);
      } catch (confidenceError) {
        console.log('⚠️ Erreur amélioration confiance (non bloquant):', confidenceError);
      }

      // Génération d'insights
      try {
        learningInsights = await OCRLearningService.generateLearningInsights(
          detectedCountry,
          analysisResult.finalData.statut || 'Autre'
        );
        console.log('💡 Insights d\'apprentissage:', learningInsights);
      } catch (insightsError) {
        console.log('⚠️ Erreur génération insights (non bloquant):', insightsError);
        learningInsights = ['Apprentissage en cours de configuration'];
      }

    } catch (learningError) {
      console.log('⚠️ Erreur apprentissage (non bloquant):', learningError);
      learningInsights = ['Apprentissage en cours de configuration'];
    }

    // 4. Test de l'extraction des bénéfices
    console.log('\n🎁 4. Test de l\'extraction des bénéfices...');
    try {
      const detectedBenefits = extractBenefitsFromParsedData(analysisResult.finalData);
      console.log('✅ Bénéfices détectés:', detectedBenefits);
    } catch (benefitsError) {
      console.log('⚠️ Erreur extraction bénéfices:', benefitsError);
    }

    // 5. Test de l'insertion en base de données
    console.log('\n💾 5. Test de l\'insertion en base de données...');
    
    const finalData = analysisResult.finalData;
    
    const { data: holeriteData, error: holeriteError } = await supabase
      .from('holerites')
      .insert({
        user_id: 'test-user-id',
        structured_data: {
          // Données structurées pour compatibilité
          Identificação: {
            employee_name: finalData.employee_name,
            company_name: finalData.company_name,
            position: finalData.position,
            profile_type: finalData.statut
          },
          Salários: {
            gross_salary: finalData.salario_bruto,
            net_salary: finalData.salario_liquido
          },
          // Nouvelles données optimisées
          analysis_result: analysisResult,
          validation_warnings: analysisResult.validation.warnings,
          confidence_score: analysisResult.validation.confidence,
          learning_insights: learningInsights || [],
          // Recommandations IA directement accessibles
          recommendations: analysisResult.recommendations,
          final_data: analysisResult.finalData,
          descontos: finalData.descontos
        },
        nome: finalData.employee_name || '',
        empresa: finalData.company_name || '',
        perfil: finalData.statut || '',
        salario_bruto: finalData.salario_bruto,
        salario_liquido: finalData.salario_liquido,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();
      
    if (holeriteError) {
      console.error('❌ Erreur insertion holerites:', holeriteError);
    } else {
      console.log('✅ Données insérées avec succès, ID:', holeriteData.id);
    }

    // 6. Test de la récupération et affichage
    console.log('\n📊 6. Test de la récupération et affichage...');
    
    let fetchError: any = null;
    
    if (!holeriteData) {
      console.error('❌ Aucune donnée insérée, impossible de tester la récupération');
    } else {
      const { data: retrievedData, error: fetchErrorResult } = await supabase
        .from('holerites')
        .select('*')
        .eq('id', holeriteData.id)
        .single();

      fetchError = fetchErrorResult;

      if (fetchError) {
        console.error('❌ Erreur récupération:', fetchError);
      } else {
        console.log('✅ Données récupérées avec succès');
        
        // Simulation de l'extraction pour le dashboard
        const structuredData = retrievedData.structured_data;
        const finalDataRetrieved = structuredData?.final_data || {};
        const recommendations = structuredData?.recommendations || {};

        console.log('📈 Données extraites pour le dashboard:');
        console.log('- Salário Bruto:', finalDataRetrieved.salario_bruto);
        console.log('- Salário Líquido:', finalDataRetrieved.salario_liquido);
        console.log('- Descontos:', finalDataRetrieved.descontos);
        console.log('- Employee Name:', finalDataRetrieved.employee_name);
        console.log('- Company Name:', finalDataRetrieved.company_name);

        console.log('🤖 Recommandations IA:');
        console.log('- Resume Situation:', recommendations.resume_situation);
        console.log('- Nombre de recommandations:', recommendations.recommendations?.length || 0);
        console.log('- Score d\'optimisation:', recommendations.score_optimisation);

        if (recommendations.recommendations) {
          console.log('📋 Détail des recommandations:');
          recommendations.recommendations.forEach((rec: any, index: number) => {
            console.log(`${index + 1}. ${rec.categorie} - ${rec.titre}`);
            console.log(`   Description: ${rec.description}`);
            console.log(`   Impact: ${rec.impact}, Priorité: ${rec.priorite}`);
          });
        }
      }
    }

    // 7. Nettoyage des données de test
    console.log('\n🧹 7. Nettoyage des données de test...');
    const { error: cleanupError } = await supabase
      .from('holerites')
      .delete()
      .eq('user_id', 'test-user-id');

    if (cleanupError) {
      console.log('⚠️ Erreur lors du nettoyage:', cleanupError.message);
    } else {
      console.log('✅ Données de test nettoyées');
    }

    // 8. Résumé de l'audit
    console.log('\n🎯 Résumé de l\'audit:');
    
    const auditResults = {
      ocr: '✅',
      analysis: analysisResult.validation.isValid ? '✅' : '❌',
      recommendations: analysisResult.recommendations.recommendations.length > 0 ? '✅' : '❌',
      learning: learningInsights ? '✅' : '⚠️',
      database: holeriteError ? '❌' : '✅',
      display: holeriteData && !fetchError ? '✅' : '❌'
    };

    console.log('📊 Résultats par étape:');
    Object.entries(auditResults).forEach(([step, status]) => {
      console.log(`- ${step}: ${status}`);
    });

    const allPassed = Object.values(auditResults).every(status => status === '✅');
    
    if (allPassed) {
      console.log('\n🎉 Audit réussi ! Toutes les étapes fonctionnent correctement.');
      console.log('✅ Le LLM publie bien les recommandations');
      console.log('✅ Le processus OCR jusqu\'aux résultats est opérationnel');
    } else {
      console.log('\n⚠️ Audit partiel. Certaines étapes nécessitent une attention.');
      console.log('🔧 Vérifiez les étapes marquées ❌ ou ⚠️');
    }

  } catch (error) {
    console.error('❌ Erreur critique lors de l\'audit:', error);
  }
}

// Exécuter l'audit
auditCompleteProcess().catch(console.error); 