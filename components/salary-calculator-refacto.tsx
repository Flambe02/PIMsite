"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { analyzeSalary } from "@/lib/diagnostics/analyzeSalary"
import { brazilConfig } from "@/config/brazil"
import { UserSalaryInput, SalaryInsightResult } from "@/lib/diagnostics/types"

export function SalaryCalculatorRefacto() {
  // Form state
  const [grossSalary, setGrossSalary] = useState<string>("")
  const [dependents, setDependents] = useState<string>("0")
  const [dependentsUnder14, setDependentsUnder14] = useState<string>("0")
  const [otherDeductions, setOtherDeductions] = useState<string>("")
  const [benefits, setBenefits] = useState<string>("")
  const [hasDependentsUnder14, setHasDependentsUnder14] = useState(false)
  const [hasOvertime, setHasOvertime] = useState(false)
  const [overtimeHours, setOvertimeHours] = useState<string>("0")
  const [employmentType, setEmploymentType] = useState<string>("CLT")

  // Upload state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Results state - now using the new SalaryInsightResult type
  const [results, setResults] = useState<SalaryInsightResult | null>(null)
  const [calculated, setCalculated] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)

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

    // Create input object for the new analyzeSalary function
    const salaryInput: UserSalaryInput = {
      grossSalary: gross,
      dependents: deps,
      dependentsUnder14: under14Count,
      benefits: benefitsValue,
      overtimeHours: overtime,
      overtimeRate: 1.5,
      otherDeductions: deductions,
      employmentType: employmentType
    }

    // Use the new analyzeSalary function with brazilConfig
    const analysisResult = analyzeSalary(salaryInput, brazilConfig)

    // Update results
    setResults(analysisResult)
    setCalculated(true)
    setShowRecommendations(true)
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
            // Mock results using the new analyzeSalary function
            const mockInput: UserSalaryInput = {
              grossSalary: employmentType === "CLT" ? 4000 : 5000,
              dependents: 0,
              dependentsUnder14: 0,
              benefits: 500,
              overtimeHours: 0,
              otherDeductions: 0,
              employmentType: employmentType
            }
            const mockResult = analyzeSalary(mockInput, brazilConfig)
            setResults(mockResult)
            setCalculated(true)
            setShowRecommendations(true)
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
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Employment Type Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Tipo de Contrato</Label>
                <RadioGroup value={employmentType} onValueChange={setEmploymentType} className="grid grid-cols-2 gap-4">
                  {brazilConfig.contractTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Basic Salary Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="grossSalary">Salário Bruto (R$)</Label>
                  <Input
                    id="grossSalary"
                    type="text"
                    placeholder="0,00"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefícios (R$)</Label>
                  <Input
                    id="benefits"
                    type="text"
                    placeholder="0,00"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                  />
                </div>
              </div>

              {/* Dependents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dependents">Número de Dependentes</Label>
                  <Input
                    id="dependents"
                    type="number"
                    min="0"
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasDependentsUnder14"
                      checked={hasDependentsUnder14}
                      onCheckedChange={(checked) => setHasDependentsUnder14(checked as boolean)}
                    />
                    <Label htmlFor="hasDependentsUnder14">Dependentes menores de 14 anos</Label>
                  </div>
                  {hasDependentsUnder14 && (
                    <Input
                      type="number"
                      min="0"
                      placeholder="Quantidade"
                      value={dependentsUnder14}
                      onChange={(e) => setDependentsUnder14(e.target.value)}
                    />
                  )}
                </div>
              </div>

              {/* Overtime */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasOvertime"
                    checked={hasOvertime}
                    onCheckedChange={(checked) => setHasOvertime(checked as boolean)}
                  />
                  <Label htmlFor="hasOvertime">Horas Extras</Label>
                </div>
                {hasOvertime && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="overtimeHours">Quantidade de Horas</Label>
                      <Input
                        id="overtimeHours"
                        type="number"
                        min="0"
                        value={overtimeHours}
                        onChange={(e) => setOvertimeHours(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Other Deductions */}
              <div className="space-y-2">
                <Label htmlFor="otherDeductions">Outros Descontos (R$)</Label>
                <Input
                  id="otherDeductions"
                  type="text"
                  placeholder="0,00"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Calcular Salário Líquido
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button onClick={handleFileSelect} variant="outline" className="mb-4">
                  Selecionar Arquivo
                </Button>
                <p className="text-sm text-gray-600">
                  Suporte para PDF, JPG, PNG (máximo 10MB)
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processando...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {fileName && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{fileName}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Results Section */}
        {calculated && results && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Resultado do Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Salário Bruto</p>
                    <p className="text-xl font-bold text-blue-900">
                      {formatCurrency(results.grossSalary)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Descontos</p>
                    <p className="text-xl font-bold text-red-900">
                      {formatCurrency(results.totalDeductions)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-900">
                      {formatCurrency(results.netSalary)}
                    </p>
                    <p className="text-sm text-gray-600">Salário Líquido</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Detalhamento</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Ganhos Totais:</span>
                        <span>{formatCurrency(results.totalEarnings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>INSS ({Math.round(results.inssRate * 100)}%):</span>
                        <span>{formatCurrency(results.inssContribution)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IRRF ({Math.round(results.irrfRate * 100)}%):</span>
                        <span>{formatCurrency(results.irrf)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outros Descontos:</span>
                        <span>{formatCurrency(results.otherDeductions)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Métricas</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Relação Líquido/Bruto:</span>
                        <span>{Math.round(results.netToGrossRatio * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {showRecommendations && results.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-500" />
                    Recomendações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Optimization Opportunities */}
            {showRecommendations && results.optimizationOpportunities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Oportunidades de Otimização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.optimizationOpportunities.map((opportunity, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-orange-900">{opportunity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                        <p className="text-sm font-medium text-green-600 mt-2">
                          Economia Potencial: {formatCurrency(opportunity.potentialSavings)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </Card>
    </div>
  )
} 