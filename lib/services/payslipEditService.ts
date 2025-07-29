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
    const supabase = await this.getSupabase();

    // Préparer les données à sauvegarder
    const manualOverrides = {
      edited_fields: editedData,
      custom_fields: customFields,
      edited_at: new Date().toISOString(),
      edited_by: userId
    };

    // Fusionner les données éditées avec les données originales
    const updatedStructuredData = {
      ...editedData,
      // Ajouter les champs personnalisés
      custom_fields: customFields.reduce((acc, field) => {
        acc[field.title] = field.value;
        return acc;
      }, {} as any)
    };

    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('scan_results')
      .update({
        structured_data: updatedStructuredData,
        manual_overrides: manualOverrides,
        is_manual: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', payslipId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la sauvegarde des données éditées:', error);
      throw new Error('Erreur lors de la sauvegarde des données éditées');
    }

    // Déclencher une nouvelle analyse IA avec les données éditées
    await this.triggerReanalysis(payslipId, updatedStructuredData);

    return data;
  }

  /**
   * Déclenche une nouvelle analyse IA avec les données éditées
   */
  private async triggerReanalysis(payslipId: string, editedData: any): Promise<void> {
    try {
      // Appeler l'API de réanalyse avec les données éditées
      const response = await fetch('/api/process-payslip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payslipId,
          editedData,
          isManualEdit: true
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réanalyse IA');
      }

      console.log('Réanalyse IA déclenchée avec succès');
    } catch (error) {
      console.error('Erreur lors de la réanalyse IA:', error);
      // Ne pas faire échouer la sauvegarde si la réanalyse échoue
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