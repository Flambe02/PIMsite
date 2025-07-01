"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { HelpCircle, Info, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function SalaryCalculator() {
  // Form state
  const [grossSalary, setGrossSalary] = useState<string>("")
  const [dependents, setDependents] = useState<string>("0")
  const [dependentsUnder14, setDependentsUnder14] = useState<string>("0")
  const [otherDeductions, setOtherDeductions] = useState<string>("")
  const [benefits, setBenefits] = useState<string>("")
  const [hasDependentsUnder14, setHasDependentsUnder14] = useState(false)
  const [hasOvertime, setHasOvertime] = useState(false)
  const [overtimeHours, setOvertimeHours] = useState<string>("0")
  const [employmentType, setEmploymentType] = useState<string>("clt")

  // Upload state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Results state
  const [results, setResults] = useState<{
    netSalary: number
    grossIncome: number
    totalDeductions: number
    calculated: boolean
    showRecommendations: boolean
  }>({
    netSalary: 0,
    grossIncome: 0,
    totalDeductions: 0,
    calculated: false,
    showRecommendations: false,
  })

  // Handlers
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    // Parse input values
    const gross = Number.parseFloat(grossSalary.replace(/\./g, "").replace(",", ".")) || 0
    const deductions = Number.parseFloat(otherDeductions.replace(/\./g, "").replace(",", ".")) || 0
    const benefitsValue = Number.parseFloat(benefits.replace(/\./g, "").replace(",", ".")) || 0
    const deps = Number.parseInt(dependents) || 0
    const overtime = hasOvertime ? Number.parseInt(overtimeHours) || 0 : 0
    const under14Count = hasDependentsUnder14 ? Number.parseInt(dependentsUnder14) || 0 : 0

    // Calculate based on employment type
    let inssRate = 0
    let inssDeduction = 0
    let irpfRate = 0
    let irpfDeduction = 0

    if (employmentType === "clt") {
      // CLT calculations
      inssRate = gross <= 1518 ? 0.075 : gross <= 2793.88 ? 0.09 : gross <= 4190.83 ? 0.12 : 0.14

      inssDeduction = gross * inssRate

      // Simplified IRRF calculation
      const dependentDeduction = deps * 189.59
      const irpfBase = gross - inssDeduction - dependentDeduction

      irpfRate =
        irpfBase <= 2259.2
          ? 0
          : irpfBase <= 2826.65
            ? 0.075
            : irpfBase <= 3751.05
              ? 0.15
              : irpfBase <= 4664.68
                ? 0.225
                : 0.275

      const irpfParcel =
        irpfBase <= 2259.2
          ? 0
          : irpfBase <= 2826.65
            ? 169.44
            : irpfBase <= 3751.05
              ? 381.44
              : irpfBase <= 4664.68
                ? 662.77
                : 896.0

      irpfDeduction = Math.max(0, irpfBase * irpfRate - irpfParcel)
    } else {
      // PJ calculations - simplified
      inssRate = 0.11 // Fixed rate for MEI/Simples Nacional on minimum wage
      inssDeduction = 1412 * inssRate // Based on minimum wage, not gross

      // Simplified tax calculation for PJ
      const simplifiedTaxRate = gross <= 6750 ? 0.06 : gross <= 15000 ? 0.112 : gross <= 30000 ? 0.135 : 0.16

      irpfRate = simplifiedTaxRate
      irpfDeduction = gross * simplifiedTaxRate
    }

    // Calculate additional benefits and deductions
    const overtimeValue = overtime > 0 && employmentType === "clt" ? (gross / 220) * overtime * 1.5 : 0
    const under14Benefit = under14Count > 0 && employmentType === "clt" ? under14Count * 59.82 : 0

    // Calculate total
    const totalDeductions = inssDeduction + irpfDeduction + deductions
    const grossIncome = gross + overtimeValue + (employmentType === "clt" ? benefitsValue : 0)
    const netSalary = grossIncome - totalDeductions + under14Benefit

    // Update results
    setResults({
      netSalary,
      grossIncome,
      totalDeductions,
      calculated: true,
      showRecommendations: true,
    })
  }

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    // Check file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png"]
    if (!validTypes.includes(file.type)) {
      alert("Formato de arquivo inválido. Por favor, envie um PDF, JPG ou PNG.")
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Arquivo muito grande. O tamanho máximo é 10MB.")
      return
    }

    setFileName(file.name)
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            // Mock results for demo purposes
            setResults({
              netSalary: employmentType === "clt" ? 3245.67 : 3635.0,
              grossIncome: employmentType === "clt" ? 4000 : 5000,
              totalDeductions: employmentType === "clt" ? 754.33 : 1365.0,
              calculated: true,
              showRecommendations: true,
            })
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Format currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "R$ ")
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="p-6 border rounded-lg shadow-sm">
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="manual">Entrada Manual</TabsTrigger>
            <TabsTrigger value="upload">Upload de Holerite</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            <div className="mb-6">
              <Label className="text-base font-medium text-blue-900 mb-2 block">Tipo de Contratação</Label>
              <RadioGroup value={employmentType} onValueChange={setEmploymentType} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="clt" id="clt" />
                  <Label htmlFor="clt" className="cursor-pointer">
                    CLT
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pj" id="pj" />
                  <Label htmlFor="pj" className="cursor-pointer">
                    PJ
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="grossSalary" className="text-base font-medium text-blue-900">
                      {employmentType === "clt" ? "Salário Bruto" : "Faturamento Mensal"}
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
                              : "Valor total faturado mensalmente como PJ"}
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
                      Outros descontos
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
                              : "Despesas dedutíveis, contador, etc."}
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
                      {employmentType === "clt" ? "Benefícios" : "Despesas Operacionais"}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-blue-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            {employmentType === "clt"
                              ? "Valor total de benefícios como VR, VA, etc."
                              : "Despesas relacionadas à atividade (aluguel, equipamentos, etc.)"}
                          </p>
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

            {results.calculated && (
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div></div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Seu resultado</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-600">Proventos:</span>
                      <span className="font-medium">{formatCurrency(results.grossIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-500">Descontos:</span>
                      <span className="font-medium">{formatCurrency(results.totalDeductions)}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between items-center">
                      <span className="font-medium">Salário Líquido:</span>
                      <span className="font-bold text-lg">{formatCurrency(results.netSalary)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {results.showRecommendations && (
              <div className="mt-8 border-t pt-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Análise e Recomendações</h3>
                  <p className="text-gray-600">
                    Com base nos dados fornecidos, preparamos uma análise detalhada e recomendações personalizadas para
                    otimizar sua situação financeira.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-100">
                    <CardHeader className="bg-blue-50 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Análise da Situação Atual</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">
                            Regime de Contratação: {employmentType === "clt" ? "CLT" : "PJ"}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {employmentType === "clt"
                              ? "Você está sob o regime CLT, que oferece maior proteção trabalhista, mas com maior carga tributária."
                              : "Você está sob o regime PJ, que oferece maior flexibilidade fiscal, mas menor proteção trabalhista."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Carga Tributária</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {employmentType === "clt"
                              ? `Sua carga tributária atual é de aproximadamente ${((results.totalDeductions / results.grossIncome) * 100).toFixed(1)}% do seu salário bruto.`
                              : `Sua carga tributária atual é de aproximadamente ${((results.totalDeductions / results.grossIncome) * 100).toFixed(1)}% do seu faturamento mensal.`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Relação Líquido/Bruto</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Você recebe aproximadamente {((results.netSalary / results.grossIncome) * 100).toFixed(1)}%
                            do valor bruto.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-100">
                    <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                      <CardTitle className="text-emerald-800">Recomendações Personalizadas</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      {employmentType === "clt" ? (
                        <>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Otimize seus Benefícios</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Verifique se sua empresa oferece benefícios flexíveis. Priorize benefícios não
                                tributáveis como vale-refeição e vale-alimentação.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Previdência Privada</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Considere contribuir para um plano PGBL, que permite deduzir até 12% da sua renda bruta
                                anual no Imposto de Renda.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Avalie a Relação CLT vs. PJ</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Com seu nível salarial, uma migração para PJ poderia resultar em economia fiscal de até
                                25%, mas avalie os benefícios que perderia.
                              </p>
                              <Button variant="link" className="text-blue-600 p-0 h-auto mt-1">
                                Simular como PJ <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Otimize seu Enquadramento Tributário</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Verifique se o Simples Nacional é a melhor opção para seu faturamento. Em alguns casos,
                                o Lucro Presumido pode ser mais vantajoso.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Maximize Despesas Dedutíveis</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Certifique-se de registrar todas as despesas relacionadas à sua atividade, como
                                equipamentos, software e espaço de trabalho.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Previdência e Proteção</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Como PJ, você não tem a mesma proteção que um CLT. Considere contratar um plano de
                                previdência privada e seguro de saúde.
                              </p>
                              <Button variant="link" className="text-blue-600 p-0 h-auto mt-1">
                                Saiba mais sobre proteção para PJ <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Próximos Passos Recomendados</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        1
                      </div>
                      <p className="text-gray-700">
                        {employmentType === "clt"
                          ? "Agende uma conversa com o RH para revisar seus benefícios e possibilidades de otimização."
                          : "Consulte um contador especializado em PJ para revisar sua estratégia fiscal."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        2
                      </div>
                      <p className="text-gray-700">
                        {employmentType === "clt"
                          ? "Considere aumentar suas contribuições para previdência privada para reduzir a base de cálculo do IR."
                          : "Avalie a possibilidade de constituir uma previdência privada para garantir sua aposentadoria."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        3
                      </div>
                      <p className="text-gray-700">
                        Agende uma consultoria personalizada com nossos especialistas para um plano detalhado de
                        otimização.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Agendar Consultoria Gratuita <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="mb-6">
              <Label className="text-base font-medium text-blue-900 mb-2 block">Tipo de Holerite</Label>
              <RadioGroup value={employmentType} onValueChange={setEmploymentType} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="clt" id="clt-upload" />
                  <Label htmlFor="clt-upload" className="cursor-pointer">
                    CLT
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pj" id="pj-upload" />
                  <Label htmlFor="pj-upload" className="cursor-pointer">
                    PJ
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              {isUploading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{fileName}</span>
                    <span className="text-sm font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Arraste e solte seu holerite aqui</h3>
                    <p className="text-gray-500">Suporte para PDF, JPG, PNG. Tamanho máximo 10MB.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={handleFileSelect}
                  >
                    Selecionar Arquivo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            {results.showRecommendations && (
              <div className="mt-8 border-t pt-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Análise do Holerite</h3>
                  <p className="text-gray-600">
                    Analisamos seu holerite {employmentType === "clt" ? "CLT" : "PJ"} e identificamos as seguintes
                    oportunidades de otimização:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-100">
                    <CardHeader className="bg-blue-50 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Detalhamento do Holerite</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {employmentType === "clt" ? (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Salário Base:</span>
                            <span className="font-medium">R$ 3.500,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">INSS (11%):</span>
                            <span className="font-medium text-red-600">-R$ 385,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">IRRF (7.5%):</span>
                            <span className="font-medium text-red-600">-R$ 142,50</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">FGTS (8%):</span>
                            <span className="font-medium text-green-600">R$ 280,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vale Refeição:</span>
                            <span className="font-medium text-green-600">R$ 550,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vale Transporte:</span>
                            <span className="font-medium text-red-600">-R$ 210,00</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-medium">Salário Líquido:</span>
                            <span className="font-bold">R$ 2.762,50</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Faturamento Bruto:</span>
                            <span className="font-medium">R$ 5.000,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Simples Nacional (6%):</span>
                            <span className="font-medium text-red-600">-R$ 300,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ISS (2%):</span>
                            <span className="font-medium text-red-600">-R$ 100,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pró-labore:</span>
                            <span className="font-medium">R$ 1.500,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">INSS sobre pró-labore (11%):</span>
                            <span className="font-medium text-red-600">-R$ 165,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Despesas operacionais:</span>
                            <span className="font-medium text-red-600">-R$ 800,00</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-medium">Valor Líquido:</span>
                            <span className="font-bold">R$ 3.635,00</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-100">
                    <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                      <CardTitle className="text-emerald-800">Oportunidades Identificadas</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      {employmentType === "clt" ? (
                        <>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Vale Transporte Otimizável</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Se você trabalha remotamente mais de 3 dias por semana, pode ser mais vantajoso não
                                optar pelo vale transporte.
                              </p>
                              <p className="text-sm font-medium text-emerald-600 mt-1">
                                Economia potencial: R$ 210,00/mês
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Declaração de Dependentes</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Não identificamos dependentes declarados. Cada dependente reduz sua base de cálculo do
                                IR em R$ 189,59.
                              </p>
                              <p className="text-sm font-medium text-emerald-600 mt-1">
                                Economia potencial: R$ 14,22/mês por dependente
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Previdência Privada</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Uma contribuição mensal para PGBL reduziria sua base de cálculo do IR.
                              </p>
                              <p className="text-sm font-medium text-emerald-600 mt-1">
                                Economia potencial: até R$ 31,50/mês
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Otimização do Pró-labore</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Seu pró-labore está em 30% do faturamento. Considere ajustar para o mínimo legal (1
                                salário mínimo) para reduzir a tributação.
                              </p>
                              <p className="text-sm font-medium text-emerald-600 mt-1">
                                Economia potencial: R$ 165,00/mês
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Despesas Dedutíveis</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Identifique mais despesas relacionadas à sua atividade para deduzir do faturamento.
                              </p>
                              <p className="text-sm font-medium text-emerald-600 mt-1">
                                Economia potencial: até R$ 200,00/mês
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium">Revisão do Enquadramento Tributário</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Com seu faturamento atual, vale a pena verificar se o Simples Nacional é a melhor opção.
                              </p>
                              <p className="text-sm font-medium text-emerald-600 mt-1">
                                Economia potencial: até R$ 150,00/mês
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Próximos Passos Recomendados</h3>
                  <div className="space-y-3">
                    {employmentType === "clt" ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            1
                          </div>
                          <p className="text-gray-700">
                            Agende uma conversa com o RH para revisar a opção de vale transporte e declaração de
                            dependentes.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            2
                          </div>
                          <p className="text-gray-700">
                            Consulte um especialista em previdência para avaliar a melhor opção de PGBL para seu perfil.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            3
                          </div>
                          <p className="text-gray-700">
                            Faça uma simulação completa de CLT vs. PJ para avaliar se uma mudança seria vantajosa.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            1
                          </div>
                          <p className="text-gray-700">
                            Consulte seu contador sobre a otimização do pró-labore e enquadramento tributário.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            2
                          </div>
                          <p className="text-gray-700">
                            Revise suas despesas operacionais para identificar itens dedutíveis adicionais.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            3
                          </div>
                          <p className="text-gray-700">
                            Considere contratar um seguro de saúde como pessoa jurídica para obter benefícios fiscais.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Agendar Consultoria Gratuita <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
