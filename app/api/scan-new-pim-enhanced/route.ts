/**
 * API Route pour le module SCAN NEW PIM ENHANCED
 * Supporte les analyses legacy et enhanced avec sélection de version
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleVisionService } from '@/lib/services/googleVisionService';
import { EnhancedPayslipAnalysisService, EnhancedAnalysisResult } from '@/lib/ia/enhancedPayslipAnalysisService';
import { createClient } from '@/lib/supabase/server';

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

    // 3. Détection du pays (par défaut: Brésil)
    const country = request.headers.get('x-country') || 'br';
    console.log('🌍 Pays détecté:', country);

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
    const enhancedAnalysisService = new EnhancedPayslipAnalysisService();
          const analysisResult = await enhancedAnalysisService.analyzePayslip(
        ocrResult.text, 
        analysisType, 
        country, 
        userId || undefined
      );

    console.log('✅ Analyse IA réussie, version:', analysisResult.version);

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
          country: country,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          ocr_text: ocrResult.text,
          structured_data: analysisResult.finalData,
          recommendations: analysisResult.recommendations,
          confidence_score: analysisResult.validation.confidence,
          scan_version: analysisType === 'enhanced' ? 2 : 1,
          analysis_version: analysisResult.version,
          explanation_report: analysisResult.explanation
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erreur sauvegarde scan_results:', insertError);
      } else {
        scanId = insertData.id;
        console.log('✅ Sauvegarde scan_results réussie, scan ID:', scanId);
      }
      
      // SAUVEGARDE CRITIQUE : Insérer aussi dans holerites pour le dashboard
      console.log('💾 Sauvegarde dans holerites pour le dashboard...');
      
      // Extraire les données principales
      const finalData = analysisResult.finalData;
      const recommendations = analysisResult.recommendations;
      const explanation = analysisResult.explanation;
      
      // Créer la structure unifiée pour holerites avec support des nouvelles données
      const holeriteInsertData = {
        user_id: userId,
        structured_data: {
          // Structure unifiée compatible avec le dashboard
          final_data: {
            employee_name: finalData.employee_name,
            company_name: finalData.company_name,
            position: finalData.position,
            statut: finalData.statut,
            salario_bruto: finalData.salario_bruto || 0,
            salario_liquido: finalData.salario_liquido || 0,
            descontos: finalData.descontos || 0,
            period: finalData.period || ''
          },
          recommendations: recommendations || {
            recommendations: [],
            resume_situation: '',
            score_optimisation: 0
          },
          explanation: explanation || null,
          analysis_version: analysisResult.version,
          analysis_result: {
            finalData: {
              employee_name: finalData.employee_name,
              company_name: finalData.company_name,
              position: finalData.position,
              statut: finalData.statut,
              salario_bruto: finalData.salario_bruto || 0,
              salario_liquido: finalData.salario_liquido || 0,
              descontos: finalData.descontos || 0,
              period: finalData.period || ''
            },
            validation: {
              confidence: analysisResult.validation.confidence || 0.8,
              warnings: analysisResult.validation.warnings || []
            }
          },
          // Données originales pour compatibilité
          employee_name: finalData.employee_name,
          company_name: finalData.company_name,
          position: finalData.position,
          profile_type: finalData.statut,
          gross_salary: finalData.salario_bruto || 0,
          net_salary: finalData.salario_liquido || 0,
          salario_bruto: finalData.salario_bruto || 0,
          salario_liquido: finalData.salario_liquido || 0,
          period: finalData.period || ''
        },
        nome: finalData.employee_name || '',
        empresa: finalData.company_name || '',
        perfil: finalData.statut || '',
        salario_bruto: finalData.salario_bruto || 0,
        salario_liquido: finalData.salario_liquido || 0,
        created_at: new Date().toISOString(),
      };

      const { data: holeriteData, error: holeriteError } = await supabase
        .from('holerites')
        .insert(holeriteInsertData)
        .select('id')
        .single();
      
      if (holeriteError) {
        console.error('❌ Erreur sauvegarde holerites:', holeriteError);
        return NextResponse.json(
          { 
            success: false, 
            error: `Erreur de sauvegarde: ${holeriteError.message}` 
          },
          { status: 500 }
        );
      } else {
        holeriteInsert = holeriteData;
        console.log('✅ Sauvegarde holerites réussie, holerite ID:', holeriteInsert?.id);
      }
    } else {
      console.log('💾 Mode démo - pas de sauvegarde');
    }

    // 9. Réponse de succès
    const response: ScanNewPIMEnhancedResponse = {
      success: true,
      data: {
        ocr: {
          text: ocrResult.text,
          confidence: ocrResult.confidence,
          processingTime: ocrResult.processingTime,
          duplicateInfo: ocrResult.duplicateInfo
        },
        analysis: analysisResult,
        scanId: scanId,
        holeriteId: holeriteInsert?.id,
        timestamp: Date.now()
      }
    };

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