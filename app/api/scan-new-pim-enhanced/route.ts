/**
 * API Route pour le module SCAN NEW PIM ENHANCED
 * Supporte les analyses legacy et enhanced avec sélection de version
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleVisionService } from '@/lib/services/googleVisionService';
import { EnhancedPayslipAnalysisService, EnhancedAnalysisResult } from '@/lib/ia/enhancedPayslipAnalysisService';
import { createClient } from '@/lib/supabase/server';
import { payslipExplanationService } from '@/lib/services/payslipExplanationService';

// Types pour la réponse API
export interface ScanNewPIMEnhancedResponse {
  success: boolean;
  data?: {
    ocr: {
      text: string;
      confidence: number;
      processingTime: number;
      duplicateInfo?: string;
    };
    analysis: EnhancedAnalysisResult;
    scanId: string;
    holeriteId?: string;
    timestamp: number;
    analysisTypeUsed: string;
  };
  error?: string;
}

// Validation du fichier
function validateFile(file: File): { isValid: boolean; error?: string } {
  // Vérification de la taille (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    return {
      isValid: false,
      error: 'Fichier trop volumineux (max 2MB)'
    };
  }

  // Vérification du type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format non supporté (JPG, PNG, PDF uniquement)'
    };
  }

  return { isValid: true };
}

// Fonction principale POST
export async function POST(request: NextRequest): Promise<NextResponse<ScanNewPIMEnhancedResponse>> {
  try {
    console.log('🚀 Début traitement SCAN NEW PIM ENHANCED...');

    // 1. Récupération du fichier et des paramètres depuis FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const analysisType = formData.get('analysisType') as 'legacy' | 'enhanced' || 'enhanced';
    const country = formData.get('country') as string || 'br';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    console.log('📁 Fichier reçu:', file.name, file.size, file.type);
    console.log('🔍 Type d\'analyse sélectionné:', analysisType);

    // 2. Validation du fichier
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 3. Détection du pays (depuis FormData ou headers)
    const countryFromHeaders = request.headers.get('x-country');
    const finalCountry = country || countryFromHeaders || 'br';
    console.log('🌍 Pays détecté:', finalCountry);

    // 4. Récupération de l'utilisateur connecté
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    let userId = null;
    if (user) {
      userId = user.id;
      console.log('👤 Utilisateur connecté:', userId);
    } else {
      console.log('👤 Mode démo - utilisateur non connecté');
    }

    // 5. Scan OCR avec Google Vision
    console.log('🔍 Début scan Google Vision...');
    const ocrResult = await googleVisionService.scanDocument(file);

    if (!ocrResult.success) {
      console.error('❌ Échec OCR:', ocrResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Le scan a échoué, veuillez réessayer avec un document plus net ou un format PDF natif.' 
        },
        { status: 400 }
      );
    }

    console.log('✅ OCR réussi, texte extrait:', ocrResult.text.length, 'caractères');
    
    // Afficher l'information sur les pages dupliquées si présente
    if (ocrResult.duplicateInfo) {
      console.log('🔄', ocrResult.duplicateInfo);
    }

    // 6. Validation du document (feuille de paie)
    const validationResult = await googleVisionService.validateDocument(ocrResult.text);
    
    if (!validationResult.isPayslip) {
      console.log('⚠️ Document non reconnu comme feuille de paie');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Le document fourni ne semble pas être une feuille de paie reconnue. Merci de vérifier le format ou d\'essayer un autre fichier.' 
        },
        { status: 400 }
      );
    }

    console.log('✅ Document validé comme feuille de paie');

    // 7. Analyse IA avec le service enhanced
    console.log(`🤖 Début analyse IA ${analysisType}...`);
    const startTime = Date.now();
    
    const enhancedAnalysisService = new EnhancedPayslipAnalysisService();
    const analysisResult = await enhancedAnalysisService.analyzePayslip(
      ocrResult.text, 
      analysisType, 
      finalCountry, 
      userId || undefined
    );

    const analysisTime = Date.now() - startTime;
    console.log(`✅ Analyse IA réussie en ${analysisTime}ms, version:`, analysisResult.version);

    // 9. Générer l'explication améliorée
    console.log('📝 Gerando explicação melhorada...');
    console.log('🔍 Debug - Données envoyées au service d\'explication:', JSON.stringify(analysisResult.finalData, null, 2));
    const enhancedExplanation = payslipExplanationService.generateExplanation(analysisResult.finalData);
    
    // 8. Sauvegarde dans Supabase (optionnel en mode démo)
    let scanId = 'demo-' + Date.now();
    let holeriteInsert: { id: string } | null = null;
    
    if (userId) {
      console.log('💾 Sauvegarde dans Supabase...');

      // Sauvegarde dans scan_results avec version
      const { data: insertData, error: insertError } = await supabase
        .from('scan_results')
        .insert({
          user_id: userId,
          country: finalCountry,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          ocr_text: ocrResult.text,
          analysis_version: {
            type: analysisType,
            schema_version: 2,
            enhanced_version: analysisResult.version.version
          },
          structured_data: analysisResult.finalData,
          recommendations: analysisResult.recommendations,
          // Limiter la confiance à 100% maximum
          confidence_score: Math.min(analysisResult.validation.confidence || 0.8, 1.0),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao salvar scan_results:', insertError);
        // Continuer même en cas d'erreur de sauvegarde
      } else {
        scanId = insertData.id;
        console.log('✅ scan_results salvo com ID:', scanId);
      }
      
      // Sauvegarde dans holerites (simplifiée - seulement structured_data)
      try {
        const { data: holeriteData, error: holeriteError } = await supabase
          .from('holerites')
          .insert({
            user_id: userId,
            scan_id: scanId,
            // Utiliser seulement les colonnes qui existent
            nome: analysisResult.finalData.employee_name || '',
            empresa: analysisResult.finalData.company_name || '',
            perfil: analysisResult.finalData.statut || 'CLT',
            salario_bruto: analysisResult.finalData.salario_bruto || 0,
            salario_liquido: analysisResult.finalData.salario_liquido || 0,
            // Stocker les données complètes dans structured_data
            structured_data: {
              ...analysisResult.finalData,
              enhancedExplanation: enhancedExplanation
            },
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (holeriteError) {
          console.error('❌ Erro ao salvar holerite:', holeriteError);
        } else {
          holeriteInsert = holeriteData;
          console.log('✅ Holerite salvo com ID:', holeriteData.id);
        }
      } catch (error) {
        console.error('❌ Erro ao tentar salvar holerite:', error);
      }
    }

    // 10. Préparer la réponse finale avec l'explication améliorée
    const finalData = {
      ...analysisResult.finalData,
      enhancedExplanation
    };

    // Debug: Vérifier que l'explication est bien générée
    console.log('🔍 Debug - enhancedExplanation générée:', JSON.stringify(enhancedExplanation, null, 2));
    console.log('🔍 Debug - finalData avec explication:', JSON.stringify(finalData, null, 2));

    const response: ScanNewPIMEnhancedResponse = {
      success: true,
      data: {
        ocr: {
          text: ocrResult.text,
          confidence: ocrResult.confidence,
          processingTime: ocrResult.processingTime,
          duplicateInfo: ocrResult.duplicateInfo
        },
        analysis: {
          version: analysisResult.version,
          extraction: analysisResult.extraction,
          validation: analysisResult.validation,
          explanation: analysisResult.explanation, // Garder l'explication IA originale
          recommendations: analysisResult.recommendations,
          finalData: finalData // Inclure l'explication améliorée ici
        },
        scanId: scanId,
        holeriteId: holeriteInsert?.id,
        timestamp: Date.now(),
        analysisTypeUsed: analysisType
      }
    };

    // Debug: Vérifier la réponse finale
    console.log('🔍 Debug - Réponse API finale:', JSON.stringify(response, null, 2));

    console.log('🎉 Traitement SCAN NEW PIM ENHANCED terminé avec succès');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Erreur générale SCAN NEW PIM ENHANCED:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur. Veuillez réessayer.' 
      },
      { status: 500 }
    );
  }
} 