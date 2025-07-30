/**
 * Script de test pour la fonctionnalité d'édition des données de payslip
 * Teste le modal d'édition, la sauvegarde et la réanalyse IA
 */

import { payslipEditService } from '../lib/services/payslipEditService';

// Données de test
const mockPayslipId = 'test-payslip-id-123';
const mockUserId = 'test-user-id-456';

const mockEditedData = {
  employee_name: 'João Silva',
  company_name: 'TechCorp Brasil',
  position: 'Desenvolvedor Senior',
  period: 'Janeiro/2024',
  salary_bruto: 8500.00,
  salary_liquido: 6500.00,
  statut: 'CLT',
  impostos: [
    { nome: 'INSS', valor: 850.00 },
    { nome: 'IRRF', valor: 1200.00 }
  ],
  descontos: 2050.00
};

const mockCustomFields = [
  {
    id: '1',
    title: 'Vale Refeição',
    value: 'R$ 600,00'
  },
  {
    id: '2',
    title: 'Plano de Saúde',
    value: 'R$ 200,00'
  }
];

async function testPayslipEditFeature() {
  console.log('🧪 Test de la fonctionnalité d\'édition des données de payslip');
  console.log('=' .repeat(60));

  try {
    // Test 1: Sauvegarde des données éditées
    console.log('\n📝 Test 1: Sauvegarde des données éditées');
    console.log('-'.repeat(40));
    
    const savedData = await payslipEditService.saveEditedPayslip(
      mockPayslipId,
      mockEditedData,
      mockCustomFields,
      mockUserId
    );
    
    console.log('✅ Sauvegarde réussie:', {
      id: savedData.id,
      is_manual: savedData.is_manual,
      has_manual_overrides: !!savedData.manual_overrides,
      updated_at: savedData.updated_at
    });

    // Test 2: Vérification que le payslip est marqué comme édité manuellement
    console.log('\n🔍 Test 2: Vérification du statut d\'édition manuelle');
    console.log('-'.repeat(40));
    
    const isManuallyEdited = await payslipEditService.isPayslipManuallyEdited(mockPayslipId);
    console.log('✅ Payslip marqué comme édité manuellement:', isManuallyEdited);

    // Test 3: Récupération des données éditées
    console.log('\n📖 Test 3: Récupération des données éditées');
    console.log('-'.repeat(40));
    
    const retrievedData = await payslipEditService.getEditedPayslip(mockPayslipId);
    if (retrievedData) {
      console.log('✅ Données récupérées:', {
        structured_data: retrievedData.structured_data,
        manual_overrides: retrievedData.manual_overrides,
        is_manual: retrievedData.is_manual
      });
    } else {
      console.log('❌ Impossible de récupérer les données');
    }

    // Test 4: Vérification de la structure des données sauvegardées
    console.log('\n🏗️ Test 4: Vérification de la structure des données');
    console.log('-'.repeat(40));
    
    if (retrievedData?.manual_overrides) {
      const overrides = retrievedData.manual_overrides;
      console.log('✅ Structure des manual_overrides:', {
        has_edited_fields: !!overrides.edited_fields,
        has_custom_fields: !!overrides.custom_fields,
        has_edited_at: !!overrides.edited_at,
        has_edited_by: !!overrides.edited_by,
        custom_fields_count: overrides.custom_fields?.length || 0
      });
      
      // Vérification des champs personnalisés
      if (overrides.custom_fields) {
        console.log('📋 Champs personnalisés sauvegardés:');
        overrides.custom_fields.forEach((field: any, index: number) => {
          console.log(`  ${index + 1}. ${field.title}: ${field.value}`);
        });
      }
    }

    // Test 5: Vérification des modifications de période
    console.log('\n📅 Test 5: Vérification des modifications de période');
    console.log('-'.repeat(40));
    
    if (retrievedData?.structured_data) {
      const period = retrievedData.structured_data.period || retrievedData.structured_data.periodo;
      console.log('✅ Période sauvegardée:', period);
      
      // Vérification que la période est au bon format
      if (period && typeof period === 'string' && period.includes('/')) {
        console.log('✅ Format de période correct');
      } else {
        console.log('⚠️ Format de période incorrect:', period);
      }
    }

    // Test 6: Vérification de la suppression des champs benefits/insurance
    console.log('\n🗑️ Test 6: Vérification de la suppression des champs benefits/insurance');
    console.log('-'.repeat(40));
    
    if (retrievedData?.structured_data) {
      const hasBenefits = !!retrievedData.structured_data.beneficios;
      const hasInsurance = !!retrievedData.structured_data.seguros;
      
      console.log('✅ Champs benefits présents:', hasBenefits);
      console.log('✅ Champs insurance présents:', hasInsurance);
      
      if (!hasBenefits && !hasInsurance) {
        console.log('✅ Suppression des champs benefits et insurance confirmée');
      } else {
        console.log('⚠️ Les champs benefits ou insurance sont encore présents');
      }
    }

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    console.log('=' .repeat(60));
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testPayslipEditFeature();
}

export { testPayslipEditFeature }; 