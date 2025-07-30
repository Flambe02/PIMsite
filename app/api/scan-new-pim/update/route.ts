/**
 * API Route pour mettre à jour les données éditées
 * PUT /api/scan-new-pim/update
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { scanAnalysisService } from '@/lib/services/scanAnalysisService';

// Types pour la requête
export interface UpdatePayslipRequest {
  scanId: string;
  editedData: any;
  userId: string;
  country?: string;
}

// Types pour la réponse
export interface UpdatePayslipResponse {
  success: boolean;
  data?: {
    updatedScan: any;
    updatedHolerite: any;
    reanalysisTriggered: boolean;
    newRecommendations?: any;
  };
  error?: string;
}

// Fonction pour détecter si une réanalyse IA est nécessaire
function needsReanalysis(originalData: any, editedData: any): boolean {
  const numericFields = [
    'gross_salary', 'net_salary', 'salario_bruto', 'salario_liquido',
    'total_deductions', 'descontos', 'total_earnings'
  ];

  // Vérifier si des champs numériques ont été modifiés
  for (const field of numericFields) {
    const originalValue = originalData[field];
    const editedValue = editedData[field];
    
    if (originalValue !== editedValue && 
        (typeof originalValue === 'number' || typeof editedValue === 'number')) {
      console.log(`🔍 Réanalyse IA nécessaire: champ ${field} modifié`);
      return true;
    }
  }

  // Vérifier les impôts
  if (editedData.impostos && Array.isArray(editedData.impostos)) {
    const originalImpostos = originalData.impostos || [];
    if (originalImpostos.length !== editedData.impostos.length) {
      console.log('🔍 Réanalyse IA nécessaire: nombre d\'impôts modifié');
      return true;
    }

    for (let i = 0; i < editedData.impostos.length; i++) {
      const originalValor = originalImpostos[i]?.valor || originalImpostos[i]?.value || 0;
      const editedValor = editedData.impostos[i]?.valor || editedData.impostos[i]?.value || 0;
      
      if (originalValor !== editedValor) {
        console.log(`🔍 Réanalyse IA nécessaire: impôt ${i} modifié`);
        return true;
      }
    }
  }

  console.log('✅ Aucune réanalyse IA nécessaire (champs textuels uniquement)');
  return false;
}

// Fonction pour créer la structure unifiée pour holerites
function createHoleriteData(editedData: any, userId: string, recommendations?: any) {
  return {
    user_id: userId,
    structured_data: {
      // Structure unifiée compatible avec le dashboard
      final_data: {
        employee_name: editedData.employee_name || editedData.Identificação?.employee_name,
        company_name: editedData.company_name || editedData.Identificação?.company_name,
        position: editedData.position || editedData.Identificação?.position,
        statut: editedData.profile_type || editedData.Identificação?.profile_type,
        salario_bruto: editedData.gross_salary || editedData.Salários?.gross_salary,
        salario_liquido: editedData.net_salary || editedData.Salários?.net_salary,
        descontos: editedData.total_deductions || 0,
        period: editedData.period || ''
      },
      recommendations: recommendations || {
        recommendations: [],
        resume_situation: '',
        score_optimisation: 0
      },
      analysis_result: {
        finalData: {
          employee_name: editedData.employee_name || editedData.Identificação?.employee_name,
          company_name: editedData.company_name || editedData.Identificação?.company_name,
          position: editedData.position || editedData.Identificação?.position,
          statut: editedData.profile_type || editedData.Identificação?.profile_type,
          salario_bruto: editedData.gross_salary || editedData.Salários?.gross_salary,
          salario_liquido: editedData.net_salary || editedData.Salários?.net_salary,
          descontos: editedData.total_deductions || 0,
          period: editedData.period || ''
        },
        validation: {
          confidence: 0.9, // Confiance élevée pour données manuelles
          warnings: []
        }
      },
      // Données originales pour compatibilité
      employee_name: editedData.employee_name || editedData.Identificação?.employee_name,
      company_name: editedData.company_name || editedData.Identificação?.company_name,
      position: editedData.position || editedData.Identificação?.position,
      profile_type: editedData.profile_type || editedData.Identificação?.profile_type,
      gross_salary: editedData.gross_salary || editedData.Salários?.gross_salary,
      net_salary: editedData.net_salary || editedData.Salários?.net_salary,
      salario_bruto: editedData.gross_salary || editedData.Salários?.gross_salary,
      salario_liquido: editedData.net_salary || editedData.Salários?.net_salary,
      period: editedData.period || ''
    },
    nome: editedData.employee_name || editedData.Identificação?.employee_name || '',
    empresa: editedData.company_name || editedData.Identificação?.company_name || '',
    perfil: editedData.profile_type || editedData.Identificação?.profile_type || '',
    salario_bruto: editedData.gross_salary || editedData.Salários?.gross_salary || 0,
    salario_liquido: editedData.net_salary || editedData.Salários?.net_salary || 0,
    updated_at: new Date().toISOString(),
  };
}

// Fonction principale PUT
export async function PUT(request: NextRequest): Promise<NextResponse<UpdatePayslipResponse>> {
  try {
    console.log('🚀 Début mise à jour des données éditées...');

    // 1. Récupération des données de la requête
    const body: UpdatePayslipRequest = await request.json();
    const { scanId, editedData, userId, country = 'br' } = body;

    if (!scanId || !editedData || !userId) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    console.log('📊 Données reçues:', { scanId, userId, editedDataKeys: Object.keys(editedData) });

    // 2. Connexion à Supabase
    const supabase = await createClient();

    // 3. Récupération des données originales
    const { data: originalScan, error: scanError } = await supabase
      .from('scan_results')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError || !originalScan) {
      console.error('❌ Erreur récupération scan original:', scanError);
      return NextResponse.json(
        { success: false, error: 'Scan original non trouvé' },
        { status: 404 }
      );
    }

    console.log('📄 Données originales récupérées');

    // 4. Vérification si une réanalyse IA est nécessaire
    const shouldReanalyze = needsReanalysis(originalScan.structured_data, editedData);
    let newRecommendations = null;

    // 5. Réanalyse IA si nécessaire
    if (shouldReanalyze) {
      console.log('🤖 Déclenchement réanalyse IA...');
      
      try {
        // Créer un texte synthétique pour l'analyse IA
        const syntheticText = createSyntheticText(editedData);
        
        const analysisResult = await scanAnalysisService.analyzeScan(syntheticText, country);
        
        if (analysisResult.success) {
          newRecommendations = analysisResult.recommendations;
          console.log('✅ Réanalyse IA réussie');
        } else {
          console.warn('⚠️ Réanalyse IA échouée, utilisation des recommandations existantes');
        }
      } catch (error) {
        console.error('❌ Erreur réanalyse IA:', error);
      }
    }

    // 6. Mise à jour scan_results
    console.log('💾 Mise à jour scan_results...');
    
    const updatedScanData = {
      structured_data: {
        ...originalScan.structured_data,
        ...editedData,
        // Fusionner les recommandations si réanalyse effectuée
        ...(newRecommendations && { recommendations: newRecommendations })
      },
      manual_overrides: {
        edited_fields: editedData,
        edited_at: new Date().toISOString(),
        edited_by: userId,
        reanalysis_performed: shouldReanalyze
      },
      is_manual: true,
      updated_at: new Date().toISOString()
    };

    const { data: updatedScan, error: updateScanError } = await supabase
      .from('scan_results')
      .update(updatedScanData)
      .eq('id', scanId)
      .select()
      .single();

    if (updateScanError) {
      console.error('❌ Erreur mise à jour scan_results:', updateScanError);
      return NextResponse.json(
        { success: false, error: 'Erreur mise à jour scan_results' },
        { status: 500 }
      );
    }

    console.log('✅ scan_results mis à jour');

    // 7. Mise à jour ou création dans holerites
    console.log('💾 Mise à jour holerites...');
    
    const holeriteData = createHoleriteData(
      editedData, 
      userId, 
      newRecommendations || originalScan.recommendations
    );

    // Vérifier si un holerite existe déjà pour ce scan
    const { data: existingHolerite } = await supabase
      .from('holerites')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let updatedHolerite;
    if (existingHolerite) {
      // Mettre à jour l'holerite existant
      const { data: holeriteUpdate, error: holeriteError } = await supabase
        .from('holerites')
        .update(holeriteData)
        .eq('id', existingHolerite.id)
        .select()
        .single();

      if (holeriteError) {
        console.error('❌ Erreur mise à jour holerites:', holeriteError);
      } else {
        updatedHolerite = holeriteUpdate;
        console.log('✅ holerites mis à jour');
      }
    } else {
      // Créer un nouveau holerite
      const { data: newHolerite, error: holeriteError } = await supabase
        .from('holerites')
        .insert(holeriteData)
        .select()
        .single();

      if (holeriteError) {
        console.error('❌ Erreur création holerites:', holeriteError);
      } else {
        updatedHolerite = newHolerite;
        console.log('✅ Nouveau holerite créé');
      }
    }

    // 8. Réponse de succès
    const response: UpdatePayslipResponse = {
      success: true,
      data: {
        updatedScan,
        updatedHolerite,
        reanalysisTriggered: shouldReanalyze,
        newRecommendations
      }
    };

    console.log('🎉 Mise à jour terminée avec succès');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Erreur générale mise à jour:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur. Veuillez réessayer.' 
      },
      { status: 500 }
    );
  }
}

// Fonction pour créer un texte synthétique pour l'analyse IA
function createSyntheticText(editedData: any): string {
  const lines = [];
  
  if (editedData.employee_name) {
    lines.push(`Funcionário: ${editedData.employee_name}`);
  }
  
  if (editedData.company_name) {
    lines.push(`Empresa: ${editedData.company_name}`);
  }
  
  if (editedData.position) {
    lines.push(`Cargo: ${editedData.position}`);
  }
  
  if (editedData.gross_salary || editedData.salario_bruto) {
    lines.push(`Salário Bruto: R$ ${editedData.gross_salary || editedData.salario_bruto}`);
  }
  
  if (editedData.net_salary || editedData.salario_liquido) {
    lines.push(`Salário Líquido: R$ ${editedData.net_salary || editedData.salario_liquido}`);
  }
  
  if (editedData.total_deductions || editedData.descontos) {
    lines.push(`Descontos: R$ ${editedData.total_deductions || editedData.descontos}`);
  }
  
  if (editedData.impostos && Array.isArray(editedData.impostos)) {
    lines.push('Impostos:');
    editedData.impostos.forEach((imposto: any) => {
      const nome = imposto.nome || imposto.label || 'Imposto';
      const valor = imposto.valor || imposto.value || 0;
      lines.push(`  - ${nome}: R$ ${valor}`);
    });
  }
  
  if (editedData.period) {
    lines.push(`Período: ${editedData.period}`);
  }
  
  return lines.join('\n');
} 