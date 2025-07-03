import { UserSalaryInput, CountryConfig, SalaryInsightResult } from './types'

export function analyzeSalary(input: UserSalaryInput, config: CountryConfig): SalaryInsightResult {
  // Mock logic for now - this would be replaced with actual calculation logic
  const { grossSalary, dependents, benefits, overtimeHours, otherDeductions, employmentType } = input
  
  // Calculate INSS based on salary brackets
  let inssContribution = 0
  let inssRate = 0
  
  for (const bracket of config.salaryBrackets) {
    if (grossSalary >= bracket.min && grossSalary <= bracket.max) {
      inssRate = bracket.rate
      inssContribution = grossSalary * bracket.rate
      break
    }
  }
  
  // Calculate overtime
  const overtimeRate = input.overtimeRate || 1.5
  const hourlyRate = grossSalary / 220 // Assuming 220 hours per month
  const overtimePay = overtimeHours * hourlyRate * overtimeRate
  
  // Calculate total earnings
  const totalEarnings = grossSalary + benefits + overtimePay
  
  // Simplified IRRF calculation (mock)
  const dependentDeduction = dependents * 189.59
  const irrfBase = grossSalary - inssContribution - dependentDeduction
  let irrf = 0
  let irrfRate = 0
  
  if (irrfBase > 2259.2) {
    if (irrfBase <= 2826.65) {
      irrfRate = 0.075
      irrf = irrfBase * 0.075 - 169.44
    } else if (irrfBase <= 3751.05) {
      irrfRate = 0.15
      irrf = irrfBase * 0.15 - 381.44
    } else if (irrfBase <= 4664.68) {
      irrfRate = 0.225
      irrf = irrfBase * 0.225 - 662.77
    } else {
      irrfRate = 0.275
      irrf = irrfBase * 0.275 - 896.0
    }
  }
  
  irrf = Math.max(0, irrf)
  
  // Calculate totals
  const totalDeductions = inssContribution + irrf + otherDeductions
  const netSalary = totalEarnings - totalDeductions
  const netToGrossRatio = grossSalary > 0 ? netSalary / grossSalary : 0
  
  // Generate recommendations
  const recommendations: string[] = []
  if (netToGrossRatio < 0.7) {
    recommendations.push('Considere otimizar sua estrutura fiscal')
  }
  if (dependents > 0) {
    recommendations.push('Verifique se todos os dependentes estão declarados')
  }
  if (employmentType === 'CLT' && benefits < 500) {
    recommendations.push('Considere negociar benefícios adicionais')
  }
  
  // Generate optimization opportunities
  const optimizationOpportunities = [
    {
      title: 'Otimização de Benefícios',
      description: 'Negocie benefícios não tributáveis',
      potentialSavings: Math.round(grossSalary * 0.05)
    },
    {
      title: 'Planejamento Fiscal',
      description: 'Considere mudança para PJ se aplicável',
      potentialSavings: Math.round(grossSalary * 0.08)
    }
  ]
  
  return {
    grossSalary,
    totalEarnings,
    inssContribution,
    inssRate,
    irrf,
    irrfRate,
    otherDeductions,
    totalDeductions,
    netSalary,
    netToGrossRatio,
    recommendations,
    optimizationOpportunities
  }
} 