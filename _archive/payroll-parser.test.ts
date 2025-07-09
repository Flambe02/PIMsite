import { parsePayslip } from './payroll-parser';
import { google } from '@google-cloud/documentai/build/protos/protos';

// Données de test (mock) basées sur le bulletin de paie qui causait le bug.
const mockDocument: google.cloud.documentai.v1.IDocument = {
  entities: [
    { type: 'net_pay', mentionText: '644,78' },
    { type: 'gross_pay', mentionText: '1.344,23' },
    {
      type: 'deduction_item',
      properties: [
        { type: 'deduction_type', mentionText: 'I.N.S.S.' },
        { type: 'deduction_amount', mentionText: '101,45' }
      ]
    },
    {
      type: 'deduction_item',
      properties: [
        { type: 'deduction_type', mentionText: 'DESC.ADIANT.SALARIAL' },
        { type: 'deduction_amount', mentionText: '520,00' }
      ]
    },
     {
      type: 'deduction_item',
      properties: [
        { type: 'deduction_type', mentionText: 'VALE TRANSPORTE' },
        { type: 'deduction_amount', mentionText: '78,00' }
      ]
    },
    {
      type: 'earning_item',
      properties: [
        { type: 'earning_type', mentionText: 'DIAS NORMAIS' },
        { type: 'earning_amount', mentionText: '1.300,00' }
      ]
    },
    {
      type: 'earning_item',
      properties: [
        { type: 'earning_type', mentionText: 'HORAS EXTRAS 60%' },
        { type: 'earning_amount', mentionText: '38,52' }
      ]
    }
  ]
};

describe('Payroll Parser', () => {

  it('devrait parser correctement les données d\'un bulletin de paie brésilien', () => {
    const result = parsePayslip(mockDocument);

    // Vérifier les montants principaux
    expect(result.netSalary).toBe(644.78);
    expect(result.grossSalary).toBe(1344.23);

    // Vérifier le nombre de lignes de gains et de déductions
    expect(result.earnings).toHaveLength(2);
    expect(result.deductions).toHaveLength(3);

    // Vérifier une ligne de déduction spécifique
    expect(result.deductions).toContainEqual({
      description: 'I.N.S.S.',
      amount: 101.45
    });
    
    // Vérifier une ligne de gain spécifique
     expect(result.earnings).toContainEqual({
      description: 'DIAS NORMAIS',
      amount: 1300.00
    });
  });
}); 