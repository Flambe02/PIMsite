import { describe, it, expect } from 'vitest';
import { parsePayslipOcr } from './ocrPayslipParser';

// --- OCR samples (problematic and regular) ---
const samples = [
  {
    name: 'Regular payslip',
    ocr: `SALARIO BASE 5000,00\nADICIONAL DE PERICULOSIDADE 1500,00\nINSS 828,39\nIRRF 852,54\nLíquido a Receber 6261,45\nTotal de Vencimentos 7089,84\nTotal de Descontos 1680,93`,
    expected: {
      earnings: [
        { description: 'SALARIO BASE', value: 5000.00 },
        { description: 'ADICIONAL DE PERICULOSIDADE', value: 1500.00 }
      ],
      deductions: [
        { description: 'INSS', value: 828.39 },
        { description: 'IRRF', value: 852.54 }
      ],
      net_salary: 6261.45,
      total_earnings: 7089.84,
      total_deductions: 1680.93,
      warnings: []
    }
  },
  {
    name: 'Split label/value (next line)',
    ocr: `SALARIO BASE\n5000 00\nINSS\n828 39\nLíquido a Receber\n6261 45\nTotal de Vencimentos\n7089 84\nTotal de Descontos\n1680 93`,
    expected: {
      earnings: [
        { description: 'SALARIO BASE', value: 5000.00 }
      ],
      deductions: [
        { description: 'INSS', value: 828.39 }
      ],
      net_salary: 6261.45,
      total_earnings: 7089.84,
      total_deductions: 1680.93,
      warnings: [
        /trouvée sur la ligne suivante/i
      ]
    }
  },
  {
    name: 'Weird number format',
    ocr: `SALARIO BASE 5.000 00\nINSS 8.28 39\nLíquido a Receber 6.261 45\nTotal de Vencimentos 7.089 84\nTotal de Descontos 1.680 93`,
    expected: {
      earnings: [
        { description: 'SALARIO BASE', value: 5000.00 }
      ],
      deductions: [
        { description: 'INSS', value: 828.39 }
      ],
      net_salary: 6261.45,
      total_earnings: 7089.84,
      total_deductions: 1680.93,
      warnings: []
    }
  },
  {
    name: 'Ambiguous/duplicate labels',
    ocr: `SALARIO BASE 5000,00\nSALARIO BASE 5100,00\nINSS 828,39\nINSS 900,00\nLíquido a Receber 6261,45\nTotal de Vencimentos 7089,84\nTotal de Descontos 1680,93`,
    expected: {
      earnings: [
        { description: 'SALARIO BASE', value: 5000.00 },
        { description: 'SALARIO BASE', value: 5100.00 }
      ],
      deductions: [
        { description: 'INSS', value: 828.39 },
        { description: 'INSS', value: 900.00 }
      ],
      net_salary: 6261.45,
      total_earnings: 7089.84,
      total_deductions: 1680.93,
      warnings: []
    }
  },
  {
    name: 'Missing net label, fallback',
    ocr: `SALARIO BASE 5000,00\nINSS 828,39\nTotal de Vencimentos 7089,84\nTotal de Descontos 1680,93`,
    expected: {
      earnings: [
        { description: 'SALARIO BASE', value: 5000.00 }
      ],
      deductions: [
        { description: 'INSS', value: 828.39 }
      ],
      net_salary: null,
      total_earnings: 7089.84,
      total_deductions: 1680.93,
      warnings: [ /aucun label explicite/i ]
    }
  }
];

function extractSimple(arr: any[]) {
  return arr.map((e: any) => ({ description: e.description, value: e.amount.value }));
}

describe('OCR Payslip Parser - Robust Extraction', () => {
  for (const sample of samples) {
    it(`parses: ${sample.name}`, () => {
      const result = parsePayslipOcr(sample.ocr);
      // Earnings
      expect(extractSimple(result.earnings)).toEqual(sample.expected.earnings);
      // Deductions
      expect(extractSimple(result.deductions)).toEqual(sample.expected.deductions);
      // Net salary
      expect(result.net_salary.value).toBeCloseTo(sample.expected.net_salary ?? 0, 2);
      // Totals
      expect(result.total_earnings.value).toBeCloseTo(sample.expected.total_earnings ?? 0, 2);
      expect(result.total_deductions.value).toBeCloseTo(sample.expected.total_deductions ?? 0, 2);
      // Validation messages
      for (const warn of sample.expected.warnings) {
        if (warn instanceof RegExp) {
          expect(result.validation.messages.join('\n')).toMatch(warn);
        } else {
          expect(result.validation.messages).toContain(warn);
        }
      }
      // Print summary
      console.log(`\n[${sample.name}]`);
      console.log(`Earnings: ${result.earnings.length}, Deductions: ${result.deductions.length}`);
      console.log('Validation:', result.validation.messages);
    });
  }
});

// This test suite ensures the OCR parser is robust against real-world and edge-case payslip OCR outputs. 