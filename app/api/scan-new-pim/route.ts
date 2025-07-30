/**
 * API Route pour le module SCAN NEW PIM
 * Traitement complet : upload → OCR → IA → sauvegarde
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleVisionService } from '@/lib/services/googleVisionService';
import { scanAnalysisService } from '@/lib/services/scanAnalysisService';
import { createClient } from '@/lib/supabase/server';

// Types pour la réponse API
export interface ScanNewPIMResponse {
  success: boolean;
  data?: {
    ocr: {
      text: string;
      confidence: number;
      processingTime: number;
      duplicateInfo?: string;
    };
    analysis: {
      structuredData: any;
      recommendations: any;
      confidence: number;
    };
    scanId: string;
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
export async function POST(request: NextRequest): Promise<NextResponse<ScanNewPIMResponse>> {
  try {
    console.log('🚀 Début traitement SCAN NEW PIM...');

    // 1. Récupération du fichier depuis FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    console.log('📁 Fichier reçu:', file.name, file.size, file.type);

    // 2. Validation du fichier
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 2. Détection du pays (par défaut: Brésil)
    const country = request.headers.get('x-country') || 'br';
    console.log('🌍 Pays détecté:', country);

    // 3. Récupération de l'utilisateur connecté (optionnel pour le mode démo)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    let userId = null;
    if (user) {
      userId = user.id;
      console.log('👤 Utilisateur connecté:', userId);
    } else {
      console.log('👤 Mode démo - utilisateur non connecté');
    }

    // 4. Scan OCR avec Google Vision
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
    console.log('📄 Texte extrait (premiers 500 caractères):', ocrResult.text.substring(0, 500));
    
    // Afficher l'information sur les pages dupliquées si présente
    if (ocrResult.duplicateInfo) {
      console.log('🔄', ocrResult.duplicateInfo);
    }

    // 5. Validation du document (feuille de paie)
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

    // 6. Analyse IA
    console.log('🤖 Début analyse IA...');
    const analysisResult = await scanAnalysisService.analyzeScan(ocrResult.text, country);

    if (!analysisResult.success) {
      console.error('❌ Échec analyse IA:', analysisResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erreur lors de l\'analyse IA. Veuillez réessayer.' 
        },
        { status: 500 }
      );
    }

    console.log('✅ Analyse IA réussie');

    // 7. Sauvegarde dans Supabase (optionnel en mode démo)
    let scanId = 'demo-' + Date.now();
    if (userId) {
      console.log('💾 Sauvegarde dans Supabase...');
      
      // Sauvegarde dans scan_results
      const { data: insertData, error: insertError } = await supabase
        .from('scan_results')
        .insert({
          user_id: userId,
          country: country,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          ocr_text: ocrResult.text,
          structured_data: analysisResult.structuredData,
          recommendations: analysisResult.recommendations,
          confidence_score: analysisResult.confidence,
          scan_version: 1
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
      const structuredData = analysisResult.structuredData;
      const recommendations = analysisResult.recommendations;
      
      // DEBUG: Afficher la structure exacte des données reçues
      console.log('🔍 DEBUG - Structure exacte des données reçues:', {
        structuredData: structuredData,
        structuredDataKeys: Object.keys(structuredData || {}),
        gross_salary: structuredData?.gross_salary,
        net_salary: structuredData?.net_salary,
        Salarios: structuredData?.Salários,
        Identificacao: structuredData?.Identificação
      });
      
      // Créer la structure unifiée pour holerites
      const holeriteData = {
        user_id: userId,
        structured_data: {
          // Structure unifiée compatible avec le dashboard
          final_data: {
            employee_name: structuredData.employee_name || structuredData.Identificação?.employee_name,
            company_name: structuredData.company_name || structuredData.Identificação?.company_name,
            position: structuredData.position || structuredData.Identificação?.position,
            statut: structuredData.profile_type || structuredData.Identificação?.profile_type,
            salario_bruto: structuredData.gross_salary || structuredData.Salários?.gross_salary || structuredData.salario_bruto || structuredData.salarioBruto || 0,
            salario_liquido: structuredData.net_salary || structuredData.Salários?.net_salary || structuredData.salario_liquido || structuredData.salarioLiquido || 0,
            descontos: structuredData.total_deductions || structuredData.descontos || 0,
            period: structuredData.period || ''
          },
          recommendations: recommendations || {
            recommendations: [],
            resume_situation: '',
            score_optimisation: 0
          },
          analysis_result: {
            finalData: {
              employee_name: structuredData.employee_name || structuredData.Identificação?.employee_name,
              company_name: structuredData.company_name || structuredData.Identificação?.company_name,
              position: structuredData.position || structuredData.Identificação?.position,
              statut: structuredData.profile_type || structuredData.Identificação?.profile_type,
              salario_bruto: structuredData.gross_salary || structuredData.Salários?.gross_salary || structuredData.salario_bruto || structuredData.salarioBruto || 0,
              salario_liquido: structuredData.net_salary || structuredData.Salários?.net_salary || structuredData.salario_liquido || structuredData.salarioLiquido || 0,
              descontos: structuredData.total_deductions || structuredData.descontos || 0,
              period: structuredData.period || ''
            },
            validation: {
              confidence: analysisResult.confidence || 0.8,
              warnings: []
            }
          },
          // Données originales pour compatibilité - AJOUTER LES ANCIENS NOMS
          employee_name: structuredData.employee_name || structuredData.Identificação?.employee_name,
          company_name: structuredData.company_name || structuredData.Identificação?.company_name,
          position: structuredData.position || structuredData.Identificação?.position,
          profile_type: structuredData.profile_type || structuredData.Identificação?.profile_type,
          gross_salary: structuredData.gross_salary || structuredData.Salários?.gross_salary || structuredData.salario_bruto || structuredData.salarioBruto || 0,
          net_salary: structuredData.net_salary || structuredData.Salários?.net_salary || structuredData.salario_liquido || structuredData.salarioLiquido || 0,
          salario_bruto: structuredData.gross_salary || structuredData.Salários?.gross_salary || structuredData.salario_bruto || structuredData.salarioBruto || 0,
          salario_liquido: structuredData.net_salary || structuredData.Salários?.net_salary || structuredData.salario_liquido || structuredData.salarioLiquido || 0,
          period: structuredData.period || ''
        },
        nome: structuredData.employee_name || structuredData.Identificação?.employee_name || '',
        empresa: structuredData.company_name || structuredData.Identificação?.company_name || '',
        perfil: structuredData.profile_type || structuredData.Identificação?.profile_type || '',
        salario_bruto: structuredData.gross_salary || structuredData.Salários?.gross_salary || structuredData.salario_bruto || structuredData.salarioBruto || 0,
        salario_liquido: structuredData.net_salary || structuredData.Salários?.net_salary || structuredData.salario_liquido || structuredData.salarioLiquido || 0,
        created_at: new Date().toISOString(),
      };

      // DEBUG: Afficher la structure des données avant sauvegarde
      console.log('🔍 Structure des données holeriteData:', {
        user_id: holeriteData.user_id,
        nome: holeriteData.nome,
        empresa: holeriteData.empresa,
        salario_bruto: holeriteData.salario_bruto,
        salario_liquido: holeriteData.salario_liquido,
        structured_data_keys: Object.keys(holeriteData.structured_data || {})
      });
      
      const { data: holeriteInsert, error: holeriteError } = await supabase
        .from('holerites')
        .insert(holeriteData)
        .select('id')
        .single();
      
      if (holeriteError) {
        console.error('❌ Erreur sauvegarde holerites:', holeriteError);
        // Retourner une erreur si la sauvegarde holerites échoue
        return NextResponse.json(
          { 
            success: false, 
            error: `Erreur de sauvegarde: ${holeriteError.message}` 
          },
          { status: 500 }
        );
      } else {
        console.log('✅ Sauvegarde holerites réussie, holerite ID:', holeriteInsert.id);
      }
    } else {
      console.log('💾 Mode démo - pas de sauvegarde');
    }

    // 8. Réponse de succès
    const response: ScanNewPIMResponse = {
      success: true,
      data: {
        ocr: {
          text: ocrResult.text,
          confidence: ocrResult.confidence,
          processingTime: ocrResult.processingTime,
          duplicateInfo: ocrResult.duplicateInfo
        },
        analysis: {
          structuredData: analysisResult.structuredData,
          recommendations: analysisResult.recommendations,
          confidence: analysisResult.confidence
        },
        scanId: scanId,
        timestamp: Date.now()
      }
    };

    console.log('🎉 Traitement SCAN NEW PIM terminé avec succès');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Erreur générale SCAN NEW PIM:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur. Veuillez réessayer.' 
      },
      { status: 500 }
    );
  }
}

// Exemple d'appel fetch pour tester :
/*
const testScanNewPIM = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/scan-new-pim', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Scan réussi:', result.data);
      // Afficher les résultats dans l'UI
    } else {
      console.error('❌ Erreur scan:', result.error);
      // Afficher l'erreur à l'utilisateur
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
  }
};
*/ 