export interface UserSalaryInput {
  grossSalary: number
  dependents: number
  dependentsUnder14: number
  benefits: number
  overtimeHours: number
  overtimeRate?: number
  otherDeductions: number
  employmentType: string
}

export interface CountryConfig {
  currency: string
  salaryBrackets: Array<{
    min: number
    max: number
    rate: number
  }>
  benefitProviders: string[]
  contractTypes: string[]
  dateFormat: string
}

export interface SalaryInsightResult {
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
  recommendations: string[]
  optimizationOpportunities: Array<{
    title: string
    description: string
    potentialSavings: number
  }>
} 