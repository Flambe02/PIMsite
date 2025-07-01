"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckCircle2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  calculateSalary,
  formatCurrency,
  type SalaryInput,
  type SalaryOutput,
  type TaxBracket,
  INSS_BRACKETS,
  IRRF_BRACKETS,
  DEPENDENT_DEDUCTION,
} from "@/lib/payroll-calculator"

interface SalaryCalculatorEnhancedProps {
  inssBrackets?: TaxBracket[]
  irrfBrackets?: TaxBracket[]
  dependentDeduction?: number
}

export function SalaryCalculatorEnhanced({ 
  inssBrackets = [], 
  irrfBrackets = [], 
  dependentDeduction = DEPENDENT_DEDUCTION 
}: SalaryCalculatorEnhancedProps) {
  // Form state
  const [grossSalary, setGrossSalary] = useState<string>("")
  const [dependents, setDependents] = useState<string>("0")
  const [dependentsUnder14, setDependentsUnder14] = useState<string>("0")
  const [hasDependentsUnder14, setHasDependentsUnder14] = useState(false)
  const [benefits, setBenefits] = useState<string>("")
  const [hasOvertime, setHasOvertime] = useState(false)
  const [overtimeHours, setOvertimeHours] = useState<string>("0")
  const [otherDeductions, setOtherDeductions] = useState<string>("")
  const [employmentType, setEmploymentType] = useState<string>("clt")

  // Results state
  const [results, setResults] = useState<SalaryOutput | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Parse currency input
  const parseCurrency = (value: string): number => {
    return Number.parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0
  }

  // Handle calculation
  const handleCalculate = () => {
    const input: SalaryInput = {
      grossSalary: parseCurrency(grossSalary),
      dependents: Number.parseInt(dependents) || 0,
      dependentsUnder14: hasDependentsUnder14 ? Number.parseInt(dependentsUnder14) || 0 : 0,
      benefits: parseCurrency(benefits),
      overtimeHours: hasOvertime ? Number.parseInt(overtimeHours) || 0 : 0,
      otherDeductions: parseCurrency(otherDeductions),
    }

    // Use dynamic brackets if available, otherwise fall back to defaults
    const effectiveInssBrackets = inssBrackets.length > 0 ? inssBrackets : INSS_BRACKETS.map((bracket, index) => ({
      id: `default-inss-${index}`,
      country_id: 'default',
      tax_type: 'inss' as const,
      min_amount: index === 0 ? 0 : INSS_BRACKETS[index - 1].limit,
      max_amount: bracket.limit,
      rate: bracket.rate,
      year: 2025,
      is_active: true
    }))

    const effectiveIrrfBrackets = irrfBrackets.length > 0 ? irrfBrackets : IRRF_BRACKETS.map((bracket, index) => ({
      id: `default-irrf-${index}`,
      country_id: 'default',
      tax_type: 'irrf' as const,
      min_amount: index === 0 ? 0 : IRRF_BRACKETS[index - 1].limit,
      max_amount: bracket.limit,
      rate: bracket.rate,
      deduction: bracket.deduction,
      year: 2025,
      is_active: true
    }))

    const calculationResults = calculateSalary(input, effectiveInssBrackets, effectiveIrrfBrackets, dependentDeduction)
    setResults(calculationResults)

    setShowResults(true)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="p-6 border rounded-lg shadow-sm">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Tipo de Contratação</h3>
            <RadioGroup
              defaultValue="clt"
              value={employmentType}
              onValueChange={setEmploymentType}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="clt" id="clt" />
                <Label htmlFor="clt">CLT (Carteira Assinada)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pj" id="pj" />
                <Label htmlFor="pj">PJ (Pessoa Jurídica)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="grossSalary" className="text-base font-medium text-blue-900">
                    {employmentType === "clt" ? "Salário Bruto" : "Faturamento Bruto"}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {employmentType === "clt"
                            ? "Valor total antes das deduções"
                            : "Valor total faturado pela empresa"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    id="grossSalary"
                    type="text"
                    placeholder="0,00"
                    className="pl-10 h-12 text-lg border-gray-300"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="otherDeductions" className="text-base font-medium text-blue-900">
                    {employmentType === "clt" ? "Outros descontos" : "Despesas operacionais"}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {employmentType === "clt"
                            ? "Outros descontos como plano de saúde, empréstimos, etc."
                            : "Despesas relacionadas à atividade da empresa"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    id="otherDeductions"
                    type="text"
                    placeholder="0,00"
                    className="pl-10 h-12 text-lg border-gray-300"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {employmentType === "clt" ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="dependents" className="text-base font-medium text-blue-900">
                        Número de dependentes
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-blue-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Dependentes declarados no Imposto de Renda</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={dependents} onValueChange={setDependents}>
                      <SelectTrigger className="h-12 text-lg border-gray-300">
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="benefits" className="text-base font-medium text-blue-900">
                        Benefícios
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-blue-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Valor total de benefícios como VR, VA, etc.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                      <Input
                        id="benefits"
                        type="text"
                        placeholder="0,00"
                        className="pl-10 h-12 text-lg border-gray-300"
                        value={benefits}
                        onChange={(e) => setBenefits(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="proLabore" className="text-base font-medium text-blue-900">
                        Pró-labore (%)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-blue-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Percentual do faturamento destinado ao pró-labore</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="h-12 text-lg border-gray-300">
                        <SelectValue placeholder="30%" />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 28, 30, 40, 50].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="taxRegime" className="text-base font-medium text-blue-900">
                        Regime Tributário
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-blue-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Regime tributário da empresa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select defaultValue="simples">
                      <SelectTrigger className="h-12 text-lg border-gray-300">
                        <SelectValue placeholder="Simples Nacional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples">Simples Nacional</SelectItem>
                        <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                        <SelectItem value="lucro_real">Lucro Real</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>

          {employmentType === "clt" && (
            <div className="border-t border-b py-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dependentsUnder14"
                  checked={hasDependentsUnder14}
                  onCheckedChange={(checked) => setHasDependentsUnder14(checked === true)}
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="dependentsUnder14" className="text-base font-medium text-blue-900">
                    Dependentes menores de 14 anos
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Dependentes com menos de 14 anos têm dedução adicional</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {hasDependentsUnder14 && (
                  <div className="flex items-center ml-auto">
                    <Label htmlFor="dependentsUnder14Count" className="mr-2 text-sm text-gray-500">
                      Quantidade:
                    </Label>
                    <Select value={dependentsUnder14} onValueChange={setDependentsUnder14}>
                      <SelectTrigger className="w-20 h-10 border-gray-300">
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overtime"
                  checked={hasOvertime}
                  onCheckedChange={(checked) => setHasOvertime(checked === true)}
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="overtime" className="text-base font-medium text-blue-900">
                    Horas extras
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Horas extras trabalhadas no mês</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {hasOvertime && (
                  <div className="flex items-center ml-auto">
                    <Label htmlFor="overtimeHours" className="mr-2 text-sm text-gray-500">
                      Quantidade de horas:
                    </Label>
                    <Input
                      id="overtimeHours"
                      type="number"
                      min="0"
                      className="w-20 h-10 border-gray-300"
                      value={overtimeHours}
                      onChange={(e) => setOvertimeHours(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Image src="/images/pimentao-logo.png" alt="Logo" width={32} height={32} className="h-8 w-auto mr-2" />
              <span className="text-sm text-gray-500">Calculadora</span>
            </div>
            <Button
              type="button"
              onClick={handleCalculate}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-8 py-3 text-lg rounded-md"
            >
              Calcular
            </Button>
          </div>

          {showResults && (
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-bold text-blue-900">
                Análise {employmentType === "clt" ? "do Salário" : "do Faturamento"}
              </h2>
              <p className="text-gray-700">
                {employmentType === "clt"
                  ? "Analisamos seu salário e identificamos as seguintes oportunidades de otimização:"
                  : "Analisamos seu faturamento PJ e identificamos as seguintes oportunidades de otimização:"}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">
                    {employmentType === "clt" ? "Detalhamento do Salário" : "Detalhamento do Faturamento"}
                  </h3>

                  {employmentType === "clt" ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Salário Bruto:</span>
                        <span className="font-medium">{formatCurrency(results?.grossSalary || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>INSS ({(results?.inssRate || 0) * 100}%):</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(results?.inssContribution || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>IRRF ({(results?.irrfRate || 0) * 100}%):</span>
                        <span className="font-medium text-red-600">-{formatCurrency(results?.irrf || 0)}</span>
                      </div>
                      {(results?.otherDeductions || 0) > 0 && (
                        <div className="flex justify-between items-center">
                          <span>Outros Descontos:</span>
                          <span className="font-medium text-red-600">
                            -{formatCurrency(results?.otherDeductions || 0)}
                          </span>
                        </div>
                      )}
                      {(results?.totalEarnings || 0) - (results?.grossSalary || 0) > 0 && (
                        <div className="flex justify-between items-center">
                          <span>Adicionais:</span>
                          <span className="font-medium text-green-600">
                            +{formatCurrency((results?.totalEarnings || 0) - (results?.grossSalary || 0))}
                          </span>
                        </div>
                      )}
                      <div className="pt-3 border-t flex justify-between items-center">
                        <span className="font-medium">Valor Líquido:</span>
                        <span className="font-bold">{formatCurrency(results?.netSalary || 0)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Faturamento Bruto:</span>
                        <span className="font-medium">{formatCurrency(parseCurrency(grossSalary))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span title="Alíquota efetiva do Simples Nacional para serviços">Simples Nacional (6%):</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(parseCurrency(grossSalary) * 0.06)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span title="Imposto Sobre Serviços">ISS (2%):</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(parseCurrency(grossSalary) * 0.02)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span title="Remuneração do sócio pelos serviços prestados à empresa">Pró-labore:</span>
                        <span className="font-medium">{formatCurrency(parseCurrency(grossSalary) * 0.3)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span title="Contribuição Previdenciária sobre o pró-labore">INSS sobre pró-labore (11%):</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(parseCurrency(grossSalary) * 0.3 * 0.11)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span title="Despesas dedutíveis da operação da empresa">Despesas operacionais:</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(parseCurrency(otherDeductions))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 border-t border-dashed pt-2">
                        <span title="Valor disponível para distribuição aos sócios">Lucro disponível:</span>
                        <span>
                          {formatCurrency(
                            parseCurrency(grossSalary) -
                              parseCurrency(grossSalary) * 0.06 -
                              parseCurrency(grossSalary) * 0.02 -
                              parseCurrency(grossSalary) * 0.3 -
                              parseCurrency(otherDeductions),
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span title="Imposto de Renda retido na fonte sobre distribuição de lucros">
                          IRRF sobre dividendos (isento):
                        </span>
                        <span>R$ 0,00</span>
                      </div>
                      <div className="pt-3 border-t flex justify-between items-center">
                        <span className="font-medium">Valor Líquido Total:</span>
                        <span className="font-bold">
                          {formatCurrency(
                            parseCurrency(grossSalary) -
                              parseCurrency(grossSalary) * 0.06 -
                              parseCurrency(grossSalary) * 0.02 -
                              parseCurrency(grossSalary) * 0.3 * 0.11 -
                              parseCurrency(otherDeductions),
                          )}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2">
                        <p>* Cálculo baseado no regime do Simples Nacional para serviços</p>
                        <p>* Dividendos são isentos de IR conforme legislação atual</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="text-lg font-medium text-green-800 mb-4">Oportunidades Identificadas</h3>

                  <div className="space-y-6">
                    {employmentType === "clt" ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800">Previdência Privada</h4>
                              <p className="text-sm text-green-700">
                                Contribuir para previdência privada pode reduzir a base de cálculo do IR.
                              </p>
                              <p className="text-sm font-medium text-green-600 mt-1">
                                Economia potencial: até {formatCurrency((results?.irrf || 0) * 0.3)}/mês
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800">Benefícios Flexíveis</h4>
                              <p className="text-sm text-green-700">
                                Verifique se sua empresa oferece benefícios flexíveis que podem ser mais vantajosos que
                                salário.
                              </p>
                              <p className="text-sm font-medium text-green-600 mt-1">
                                Economia potencial: até {formatCurrency((results?.grossSalary || 0) * 0.05)}/mês
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800">Declaração Completa IR</h4>
                              <p className="text-sm text-green-700">
                                Com seu nível salarial, a declaração completa de IR pode ser mais vantajosa.
                              </p>
                              <p className="text-sm font-medium text-green-600 mt-1">
                                Economia potencial: até {formatCurrency((results?.irrf || 0) * 0.15 * 12)}/ano
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800">Otimização do Pró-labore</h4>
                              <p className="text-sm text-green-700">
                                Seu pró-labore está em 30% do faturamento. Considere ajustar para o mínimo legal (1
                                salário mínimo) para reduzir a tributação.
                              </p>
                              <p className="text-sm font-medium text-green-600 mt-1">
                                Economia potencial: {formatCurrency(parseCurrency(grossSalary) * 0.3 * 0.11 * 0.5)}/mês
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800">Despesas Dedutíveis</h4>
                              <p className="text-sm text-green-700">
                                Identifique mais despesas relacionadas à sua atividade para deduzir do faturamento.
                              </p>
                              <p className="text-sm font-medium text-green-600 mt-1">
                                Economia potencial: até {formatCurrency(parseCurrency(grossSalary) * 0.04)}/mês
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800">Revisão do Enquadramento Tributário</h4>
                              <p className="text-sm text-green-700">
                                Com seu faturamento atual de {formatCurrency(parseCurrency(grossSalary))}/mês (
                                {formatCurrency(parseCurrency(grossSalary) * 12)}/ano), vale a pena verificar se o
                                Simples Nacional é a melhor opção comparado ao Lucro Presumido.
                              </p>
                              <p className="text-sm font-medium text-green-600 mt-1">
                                Economia potencial: até {formatCurrency(parseCurrency(grossSalary) * 0.03)}/mês
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800">Planejamento Tributário Anual</h4>
                              <p className="text-sm text-green-700">
                                Realize um planejamento tributário anual considerando as obrigações fiscais como ECF
                                (entrega até julho) e as antecipações mensais de impostos para evitar surpresas.
                              </p>
                              <p className="text-sm font-medium text-green-600 mt-1">
                                Economia potencial: até {formatCurrency(parseCurrency(grossSalary) * 0.02)}/mês
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Agendar consultoria personalizada</Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
