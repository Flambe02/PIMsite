import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PayslipAnalysisService } from '@/lib/ia/payslipAnalysisService';
import { OCRLearningService } from '@/lib/learning/ocrLearningService';
import { extractBenefitsFromParsedData } from '@/lib/benefits';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validation du fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Type de fichier non supporté. Utilisez JPEG, PNG ou PDF.' 
      }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json({ 
        error: 'Fichier trop volumineux. Taille maximale: 10MB.' 
      }, { status: 400 });
    }

    console.log('📁 Fichier reçu:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // 1. OCR - Extraction du texte
    console.log('🔍 Début OCR...');
    
    // Mode test optionnel (seulement en dev)
    const enableTestMode = process.env.NODE_ENV === 'development' && 
                          req.nextUrl.searchParams.get('test') === 'true';
    
    const { parseWithOCRSpaceEnhanced } = await import('@/lib/ocr');
    const ocrResult = await parseWithOCRSpaceEnhanced(file, enableTestMode);
    
    // VÉRIFICATION CRITIQUE : Si OCR échoue, arrêter le process
    if (!ocrResult || !ocrResult.ParsedText || ocrResult.ParsedText.trim().length === 0) {
      console.log('❌ OCR échoué - Aucun texte extrait');
      return NextResponse.json({ 
        error: 'OCR_FAILED', 
        message: 'Impossible d\'extraire le texte du document. Veuillez réessayer avec une image plus claire.' 
      }, { status: 400 });
    }

    const ocrText = ocrResult.ParsedText;

    // Vérifier si c'est du texte de fallback (mode dev uniquement)
    const isFallbackText = ocrText.includes('FALLBACK_TEXT') || ocrText.includes('Test User');
    if (isFallbackText) {
      console.log('❌ OCR échoué - Utilisation du texte de fallback détectée');
      return NextResponse.json({ 
        error: 'OCR_FAILED', 
        message: 'Le service OCR est temporairement indisponible. Veuillez réessayer plus tard.' 
      }, { status: 503 });
    }

    console.log('✅ OCR terminé, longueur du texte:', ocrText.length);
    
    if (!ocrText || ocrText.trim().length < 20) {
      return NextResponse.json({ 
        error: "L'OCR n'a pas pu extraire suffisamment de texte. Le fichier pourrait être illisible ou protégé.", 
        details: ocrText 
      }, { status: 400 });
    }

    // 2. Analyse IA optimisée avec le nouveau service
    console.log('🤖 Début de l\'analyse IA optimisée...');
    const analysisService = new PayslipAnalysisService();
    
    // Détection automatique du pays
    const detectedCountry = await analysisService.detectCountry(ocrText);
    console.log('🌍 Pays détecté:', detectedCountry);
    
    // Analyse complète avec validation et recommandations
    const analysisResult = await analysisService.analyzePayslip(ocrText, detectedCountry, session.user.id);
    
    console.log('✅ Analyse IA terminée:', {
      confidence: analysisResult.validation.confidence,
      warnings: analysisResult.validation.warnings.length,
      recommendations: analysisResult.recommendations.recommendations.length
    });

    // 3. Apprentissage automatique - Stockage des données
    console.log('🧠 Stockage des données d\'apprentissage...');
    let learningInsights: any[] | null = null;
    try {
      const learningData = {
        user_id: session.user.id,
        country: detectedCountry,
        statut: analysisResult.finalData.statut || 'Autre',
        raw_ocr_text: ocrText,
        extracted_data: analysisResult.finalData,
        validation_result: analysisResult.validation,
        confidence_score: analysisResult.validation.confidence,
        validated: analysisResult.validation.isValid
      };

      const learningId = await OCRLearningService.storeLearningData(learningData);
      console.log('✅ Données d\'apprentissage stockées:', learningId);

      // Amélioration de la confiance basée sur l'apprentissage
      try {
        const enhancedConfidence = await OCRLearningService.enhanceConfidenceWithLearning(
          detectedCountry,
          analysisResult.finalData.statut || 'Autre',
          analysisResult.validation.confidence
        );

        if (enhancedConfidence > analysisResult.validation.confidence) {
          console.log(`📈 Confiance améliorée: ${analysisResult.validation.confidence} → ${enhancedConfidence}`);
          analysisResult.validation.confidence = enhancedConfidence;
        }
      } catch (confidenceError) {
        console.error('⚠️ Erreur lors de l\'amélioration de confiance (non bloquant):', confidenceError);
      }

      // Génération d'insights d'apprentissage
      try {
        learningInsights = await OCRLearningService.generateLearningInsights(
          detectedCountry,
          analysisResult.finalData.statut || 'Autre'
        );
        console.log('💡 Insights d\'apprentissage:', learningInsights);
      } catch (insightsError) {
        console.error('⚠️ Erreur lors de la génération d\'insights (non bloquant):', insightsError);
        learningInsights = ['Apprentissage en cours de configuration'];
      }

    } catch (learningError) {
      console.error('⚠️ Erreur lors du stockage d\'apprentissage (non bloquant):', learningError);
      learningInsights = ['Apprentissage temporairement indisponible'];
      // L'erreur d'apprentissage ne bloque pas le processus principal
    }

    // 4. Sauvegarde dans Supabase avec les nouvelles données
    console.log('💾 Sauvegarde dans Supabase...');
    
    // Enregistrement dans la table analyses (historique)
    const { data: analysisRecord, error } = await supabase
      .from('analyses')
      .insert({ 
        user_id: session.user.id, 
        file_name: file.name, 
        raw_text: ocrText, 
        model_used: 'gpt-4o-optimized', 
        data: {
          extraction: analysisResult.extraction,
          validation: analysisResult.validation,
          recommendations: analysisResult.recommendations,
          final_data: analysisResult.finalData,
          learning_insights: learningInsights || []
        },
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('❌ Erreur Supabase analyses:', error);
      throw error;
    }

    // Enregistrement dans la table holerites (pour dashboard)
    const finalData = analysisResult.finalData;
    const { data: holeriteData, error: holeriteError } = await supabase
      .from('holerites')
      .insert({
        user_id: session.user.id,
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
    }

    // 5. Traitement des bénéfices détectés
    try {
      const detectedBenefits = extractBenefitsFromParsedData(analysisResult.finalData);
      if (detectedBenefits.length > 0) {
        const rows = detectedBenefits.map((b) => ({
          user_id: session.user.id,
          tipo: b.tipo,
          ativo: true,
          origem: 'holerite',
        }));
        await supabase.from('beneficios_usuario').upsert(rows, { onConflict: 'user_id,tipo,origem' });
      }
    } catch (err) {
      console.error('Erro ao processar benefícios:', err);
    }

    // 6. Insertion des résultats OCR dans la table ocr_results
    if (holeriteData?.id) {
      const { error: ocrError } = await supabase
        .from('ocr_results')
        .insert({
          holerite_id: holeriteData.id,
          provider: 'ocrspace',
          raw_text: ocrText,
          confidence: null, // OCR.Space ne fournit pas de score de confiance
          duration_ms: null, // Pas de mesure de durée disponible
        });
      
      if (ocrError) {
        console.error('❌ Erreur insertion ocr_results:', ocrError);
      } else {
        console.log('✅ Résultats OCR sauvegardés avec succès');
      }
    }
    
    console.log('✅ Analyse complète avec succès, ID:', analysisRecord.id);
    
    // 7. Réponse optimisée avec toutes les données
    return NextResponse.json({ 
      success: true, 
      analysisId: analysisRecord.id,
      data: {
        extraction: analysisResult.extraction,
        validation: {
          isValid: analysisResult.validation.isValid,
          confidence: analysisResult.validation.confidence,
          warnings: analysisResult.validation.warnings
        },
        recommendations: analysisResult.recommendations,
        finalData: analysisResult.finalData,
        learningInsights: learningInsights || []
      },
      country: detectedCountry
    });
    
  } catch (error) {
    console.error('❌ Erreur détaillée dans /api/process-payslip:', error);
    
    let errorMessage = 'Erreur interne du serveur.';
    if (error instanceof Error) {
      if (error.message.includes('E101')) {
        errorMessage = 'Le service OCR a mis trop de temps à répondre. Essayez avec un fichier plus simple ou plus petit.';
      } else if (error.message.toLowerCase().includes('ocr')) {
        errorMessage = 'Erreur lors de l\'extraction du texte du holerite. Vérifiez que le fichier est lisible et non protégé.';
      } else if (error.message.includes('LLM') || error.message.includes('IA')) {
        errorMessage = 'Erreur lors de l\'analyse IA. Réessayez dans quelques instants.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        details: error && typeof error === 'object' ? JSON.stringify(error) : String(error)
      },
      { status: 500 }
    );
  }
} 