import { describe, it, expect } from 'vitest'
import { calculateSalary, type SalaryInput, type TaxBracket } from './payroll-calculator'

// Test brackets with correct TaxBracket format
const testInssBrackets: TaxBracket[] = [
  { id: '1', country_id: 'brazil', tax_type: 'inss', min_amount: 0, max_amount: 1518.0, rate: 0.075, year: 2025, is_active: true },
  { id: '2', country_id: 'brazil', tax_type: 'inss', min_amount: 1518.01, max_amount: 2793.88, rate: 0.09, year: 2025, is_active: true },
  { id: '3', country_id: 'brazil', tax_type: 'inss', min_amount: 2793.89, max_amount: 4190.83, rate: 0.12, year: 2025, is_active: true },
  { id: '4', country_id: 'brazil', tax_type: 'inss', min_amount: 4190.84, max_amount: 8157.41, rate: 0.14, year: 2025, is_active: true },
]

const testIrrfBrackets: TaxBracket[] = [
  { id: '1', country_id: 'brazil', tax_type: 'irrf', min_amount: 0, max_amount: 2259.2, rate: 0, deduction: 0, year: 2025, is_active: true },
  { id: '2', country_id: 'brazil', tax_type: 'irrf', min_amount: 2259.21, max_amount: 2826.65, rate: 0.075, deduction: 169.44, year: 2025, is_active: true },
  { id: '3', country_id: 'brazil', tax_type: 'irrf', min_amount: 2826.66, max_amount: 3751.05, rate: 0.15, deduction: 381.44, year: 2025, is_active: true },
  { id: '4', country_id: 'brazil', tax_type: 'irrf', min_amount: 3751.06, max_amount: 4664.68, rate: 0.225, deduction: 662.77, year: 2025, is_active: true },
  { id: '5', country_id: 'brazil', tax_type: 'irrf', min_amount: 4664.69, max_amount: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 896.0, year: 2025, is_active: true },
]

describe('calculateSalary', () => {
  it('should calculate net salary for a simple CLT case in Brazil', () => {
    const input: SalaryInput = {
      grossSalary: 3000,
      dependents: 0,
      dependentsUnder14: 0,
      benefits: 0,
      overtimeHours: 0,
      otherDeductions: 0,
    }

    const result = calculateSalary(input, testInssBrackets, testIrrfBrackets)

    // Correct values based on progressive INSS calculation:
    // INSS: (1518 * 0.075) + ((2793.88 - 1518) * 0.09) + ((3000 - 2793.88) * 0.12) = 253.41
    // IRRF Base: 3000 - 253.41 = 2746.59
    // IRRF: 2746.59 * 0.075 - 169.44 = 36.55
    // Net: 3000 - 253.41 - 36.55 = 2710.04
    expect(result.inssContribution).toBeCloseTo(253.41, 1)
    expect(result.irrf).toBeCloseTo(36.55, 1)
    expect(result.netSalary).toBeCloseTo(2710.04, 1)
  })
}) 