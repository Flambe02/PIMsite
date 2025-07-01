/**
 * Brazilian Payroll Calculator
 * Contains all parameters and functions for calculating net salary in Brazil (2025)
 */

// Types
export interface SalaryInput {
  grossSalary: number
  dependents: number
  dependentsUnder14: number
  benefits: number
  overtimeHours: number
  overtimeRate?: number // Default is 1.5
  otherDeductions: number
}

export interface SalaryOutput {
  grossSalary: number
  totalEarnings: number
  inssContribution: number
  inssRate: number
  irrf: number
  irrfRate: number
  otherDeductions: number
  totalDeductions: number
  netSalary: number
  netToGrossRatio: number
}

export interface TaxBracket {
  id: string
  country_id: string
  tax_type: 'inss' | 'irrf'
  min_amount: number
  max_amount: number
  rate: number
  deduction?: number
  year: number
  is_active: boolean
}

// Default brackets for backward compatibility (2025)
export const INSS_BRACKETS = [
  { limit: 1518.0, rate: 0.075 },
  { limit: 2793.88, rate: 0.09 },
  { limit: 4190.83, rate: 0.12 },
  { limit: 8157.41, rate: 0.14 },
]

export const IRRF_BRACKETS = [
  { limit: 2259.2, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 896.0 },
]

// Dependent deduction amount (2025)
export const DEPENDENT_DEDUCTION = 189.59

/**
 * Convert database TaxBracket to internal format
 */
function convertTaxBrackets(brackets: TaxBracket[]): Array<{ limit: number; rate: number; deduction?: number }> {
  return brackets
    .sort((a, b) => a.min_amount - b.min_amount)
    .map(bracket => ({
      limit: bracket.max_amount,
      rate: bracket.rate,
      deduction: bracket.deduction
    }))
}

/**
 * Calculate INSS contribution based on gross salary
 * @param grossSalary Gross salary amount
 * @param inssBrackets INSS tax brackets
 * @returns Object containing INSS contribution amount and rate
 */
export function calculateINSS(grossSalary: number, inssBrackets: TaxBracket[]): { contribution: number; rate: number } {
  const brackets = convertTaxBrackets(inssBrackets)
  let contribution = 0
  let lastLimit = 0

  for (const bracket of brackets) {
    if (grossSalary > lastLimit) {
      const taxableAmount = Math.min(grossSalary, bracket.limit) - lastLimit
      contribution += taxableAmount * bracket.rate
      lastLimit = bracket.limit
    } else {
      break
    }
  }

  // The official contribution is capped. For 2025, let's assume a cap of 908.85
  const INSS_CAP = 908.85
  if (contribution > INSS_CAP) {
    contribution = INSS_CAP
  }

  const effectiveRate = grossSalary > 0 ? contribution / grossSalary : 0

  return { contribution, rate: effectiveRate }
}

/**
 * Calculate IRRF (income tax) withholding
 * @param grossSalary Gross salary amount
 * @param inssContribution INSS contribution amount
 * @param dependents Number of dependents
 * @param irrfBrackets IRRF tax brackets
 * @param dependentDeduction Amount per dependent
 * @returns Object containing IRRF withholding amount and rate
 */
export function calculateIRRF(
  grossSalary: number,
  inssContribution: number,
  dependents: number,
  irrfBrackets: TaxBracket[],
  dependentDeduction: number = DEPENDENT_DEDUCTION
): { tax: number; rate: number } {
  const brackets = convertTaxBrackets(irrfBrackets)
  
  // Calculate IRRF base
  const dependentDeductionTotal = dependents * dependentDeduction
  const irrfBase = grossSalary - inssContribution - dependentDeductionTotal

  // If base is negative or zero, no tax
  if (irrfBase <= 0) {
    return { tax: 0, rate: 0 }
  }

  let tax = 0
  let rate = 0

  // Find applicable bracket
  for (const bracket of brackets) {
    if (irrfBase <= bracket.limit) {
      tax = irrfBase * bracket.rate - (bracket.deduction || 0)
      rate = bracket.rate
      break
    }
  }

  // Ensure tax is not negative
  tax = Math.max(0, tax)

  return { tax, rate }
}

/**
 * Calculate overtime pay
 * @param grossSalary Gross salary amount
 * @param hours Overtime hours
 * @param rate Overtime rate (default: 1.5)
 * @returns Overtime pay amount
 */
export function calculateOvertime(grossSalary: number, hours: number, rate = 1.5): number {
  // Assuming 220 hours per month as standard
  const hourlyRate = grossSalary / 220
  return hourlyRate * hours * rate
}

/**
 * Calculate family allowance for dependents under 14
 * @param dependentsUnder14 Number of dependents under 14 years
 * @returns Family allowance amount
 */
export function calculateFamilyAllowance(dependentsUnder14: number): number {
  // Simplified calculation - in reality this depends on income brackets
  const allowancePerChild = 59.82 // Example value
  return dependentsUnder14 * allowancePerChild
}

/**
 * Calculate complete salary breakdown
 * @param input Salary input parameters
 * @param inssBrackets INSS tax brackets
 * @param irrfBrackets IRRF tax brackets
 * @param dependentDeduction Amount per dependent
 * @returns Complete salary calculation output
 */
export function calculateSalary(
  input: SalaryInput, 
  inssBrackets: TaxBracket[], 
  irrfBrackets: TaxBracket[],
  dependentDeduction: number = DEPENDENT_DEDUCTION
): SalaryOutput {
  // Calculate overtime
  const overtimeRate = input.overtimeRate || 1.5
  const overtimePay = calculateOvertime(input.grossSalary, input.overtimeHours, overtimeRate)

  // Calculate family allowance
  const familyAllowance = calculateFamilyAllowance(input.dependentsUnder14)

  // Calculate total earnings
  const totalEarnings = input.grossSalary + input.benefits + overtimePay + familyAllowance

  // Calculate INSS
  const inssResult = calculateINSS(input.grossSalary, inssBrackets)

  // Calculate IRRF
  const irrfResult = calculateIRRF(input.grossSalary, inssResult.contribution, input.dependents, irrfBrackets, dependentDeduction)

  // Calculate total deductions
  const totalDeductions = inssResult.contribution + irrfResult.tax + input.otherDeductions

  // Calculate net salary
  const netSalary = totalEarnings - totalDeductions

  // Calculate net-to-gross ratio
  const netToGrossRatio = netSalary / input.grossSalary

  return {
    grossSalary: input.grossSalary,
    totalEarnings,
    inssContribution: inssResult.contribution,
    inssRate: inssResult.rate,
    irrf: irrfResult.tax,
    irrfRate: irrfResult.rate,
    otherDeductions: input.otherDeductions,
    totalDeductions,
    netSalary,
    netToGrossRatio,
  }
}

/**
 * Calculate 13th salary (Christmas bonus)
 * @param grossSalary Gross salary amount
 * @param dependents Number of dependents
 * @param inssBrackets INSS tax brackets
 * @param irrfBrackets IRRF tax brackets
 * @param dependentDeduction Amount per dependent
 * @returns Net 13th salary amount
 */
export function calculate13thSalary(
  grossSalary: number, 
  dependents: number, 
  inssBrackets: TaxBracket[], 
  irrfBrackets: TaxBracket[],
  dependentDeduction: number = DEPENDENT_DEDUCTION
): number {
  const inssResult = calculateINSS(grossSalary, inssBrackets)
  const irrfResult = calculateIRRF(grossSalary, inssResult.contribution, dependents, irrfBrackets, dependentDeduction)

  return grossSalary - inssResult.contribution - irrfResult.tax
}

/**
 * Calculate annual salary totals
 * @param monthlySalary Monthly salary calculation output
 * @param include13th Whether to include 13th salary
 * @param dependents Number of dependents
 * @param inssBrackets INSS tax brackets
 * @param irrfBrackets IRRF tax brackets
 * @param dependentDeduction Amount per dependent
 * @returns Annual salary totals
 */
export function calculateAnnualSalary(
  monthlySalary: SalaryOutput,
  include13th = true,
  dependents = 0,
  inssBrackets: TaxBracket[] = [],
  irrfBrackets: TaxBracket[] = [],
  dependentDeduction: number = DEPENDENT_DEDUCTION,
): { annualGross: number; annualNet: number } {
  const annualGross = monthlySalary.grossSalary * 12
  const annualNet = monthlySalary.netSalary * 12

  if (include13th) {
    const thirteenthSalary = calculate13thSalary(monthlySalary.grossSalary, dependents, inssBrackets, irrfBrackets, dependentDeduction)
    return {
      annualGross: annualGross + monthlySalary.grossSalary,
      annualNet: annualNet + thirteenthSalary,
    }
  }

  return { annualGross, annualNet }
}

/**
 * Format currency value to Brazilian Real format
 * @param value Numeric value
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
