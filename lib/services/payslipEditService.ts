import { createClient } from '@/lib/supabase/client';

export interface PayslipEditData {
  id: string;
  structured_data: any;
  manual_overrides: any;
  is_manual: boolean;
  updated_at: string;
}

export interface CustomField {
  id: string;
  title: string;
  value: string | number;
}

export class PayslipEditService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Sauvegarde les données éditées et déclenche une nouvelle analyse IA
   */
  async saveEditedPayslip(
    payslipId: string,
    editedData: any,
    customFields: CustomField[],
    userId: string
  ): Promise<PayslipEditData> {
    try {
      console.log('💾 Début sauvegarde des données éditées...', {
        payslipId,
        editedDataKeys: Object.keys(editedData),
        customFieldsCount: customFields.length,
        userId
      });

      // Fusionner les données éditées avec les champs personnalisés
      const mergedData = {
        ...editedData,
        // Ajouter les champs personnalisés
        custom_fields: customFields.reduce((acc, field) => {
          acc[field.title] = field.value;
          return acc;
        }, {} as any)
      };

      // Utiliser la nouvelle route API pour la mise à jour complète
      const response = await fetch('/api/scan-new-pim/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanId: payslipId,
          editedData: mergedData,
          userId: userId,
          country: 'br' // Par défaut pour le Brésil
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      console.log('✅ Sauvegarde réussie:', {
        reanalysisTriggered: result.data?.reanalysisTriggered,
        hasNewRecommendations: !!result.data?.newRecommendations
      });

      // Retourner les données mises à jour
      return {
        id: payslipId,
        structured_data: result.data?.updatedScan?.structured_data || mergedData,
        manual_overrides: {
          edited_fields: mergedData,
          custom_fields: customFields,
          edited_at: new Date().toISOString(),
          edited_by: userId,
          reanalysis_performed: result.data?.reanalysisTriggered || false
        },
        is_manual: true,
        updated_at: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des données éditées:', error);
      throw new Error(`Erreur lors de la sauvegarde des données éditées: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }



  /**
   * Récupère les données éditées d'un payslip
   */
  async getEditedPayslip(payslipId: string): Promise<PayslipEditData | null> {
    const supabase = await this.getSupabase();

    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('id', payslipId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des données éditées:', error);
      return null;
    }

    return data;
  }

  /**
   * Vérifie si un payslip a été édité manuellement
   */
  async isPayslipManuallyEdited(payslipId: string): Promise<boolean> {
    const payslip = await this.getEditedPayslip(payslipId);
    return payslip?.is_manual || false;
  }

  /**
   * Récupère l'historique des modifications
   */
  async getEditHistory(payslipId: string): Promise<any[]> {
    const payslip = await this.getEditedPayslip(payslipId);
    
    if (!payslip?.manual_overrides) {
      return [];
    }

    return [
      {
        edited_at: payslip.manual_overrides.edited_at,
        edited_by: payslip.manual_overrides.edited_by,
        edited_fields: Object.keys(payslip.manual_overrides.edited_fields || {}),
        custom_fields: payslip.manual_overrides.custom_fields || []
      }
    ];
  }

  /**
   * Restaure les données originales (supprime les modifications manuelles)
   */
  async restoreOriginalData(payslipId: string): Promise<void> {
    const supabase = await this.getSupabase();

    const { error } = await supabase
      .from('scan_results')
      .update({
        is_manual: false,
        manual_overrides: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', payslipId);

    if (error) {
      console.error('Erreur lors de la restauration des données originales:', error);
      throw new Error('Erreur lors de la restauration des données originales');
    }
  }
}

export const payslipEditService = new PayslipEditService(); 