"use client"

import { useState, useRef } from "react"
import { Calculator, CheckCircle2, HelpCircle, Upload, FileText, Info } from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"
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

interface UnifiedSalaryCalculatorProps {
  mode?: 'basic' | 'enhanced'
  inssBrackets?: TaxBracket[]
  irrfBrackets?: TaxBracket[]
  dependentDeduction?: number
}

export function UnifiedSalaryCalculator({ 
  mode = 'basic',
  inssBrackets = [], 
  irrfBrackets = [], 
  dependentDeduction = DEPENDENT_DEDUCTION 
}: UnifiedSalaryCalculatorProps) {
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

  // Upload state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Results state
  const [results, setResults] = useState<SalaryOutput | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)

  const { toast } = useToast()

  // Handle form submission
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    // Parse input values
    const gross = Number.parseFloat(grossSalary.replace(/\./g, "").replace(",", ".")) || 0
    const deps = Number.parseInt(dependents) || 0
    const depsUnder14 = hasDependentsUnder14 ? (Number.parseInt(dependentsUnder14) || 0) : 0
    const benefitsValue = Number.parseFloat(benefits.replace(/\./g, "").replace(",", ".")) || 0
    const overtimeHrs = hasOvertime ? (Number.parseFloat(overtimeHours) || 0) : 0
    const otherDeds = Number.parseFloat(otherDeductions.replace(/\./g, "").replace(",", ".")) || 0

    // Validate required fields
    if (gross <= 0) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um salário bruto válido.",
        variant: "destructive",
      })
      return
    }

    // Prepare calculation input
    const input: SalaryInput = {
      grossSalary: gross,
      dependents: deps,
      dependentsUnder14: depsUnder14,
      benefits: benefitsValue,
      overtimeHours: overtimeHrs,
      otherDeductions: otherDeds,
    }

    // Calculate salary
    const calculationResult = calculateSalary(input, inssBrackets, irrfBrackets, dependentDeduction)
    
    setResults(calculationResult)
    setShowResults(true)
    
    if (mode === 'enhanced') {
      setShowRecommendations(true)
    }

    toast({
      title: "Cálculo realizado!",
      description: "Seu salário líquido foi calculado com sucesso.",
    })
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setFileName(file.name)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('analysisType', 'salary')

      const response = await fetch('/api/scan-new-pim', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Falha no upload do arquivo')
      }

      const result = await response.json()
      
      setUploadProgress(100)
      
      // Auto-fill form with extracted data if available
      if (result.data?.salario_bruto) {
        setGrossSalary(result.data.salario_bruto.toString())
      }
      
      toast({
        title: "Upload realizado!",
        description: "Dados extraídos e preenchidos automaticamente.",
      })

    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        title: "Erro no upload",
        description: "Não foi possível processar o arquivo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setTimeout(() => {
        setUploadProgress(0)
        setFileName(null)
      }, 2000)
    }
  }

  // Format currency for display
  const formatDisplayCurrency = (value: string) => {
    const number = value.replace(/\D/g, "")
    const formatted = Number.parseFloat(number).toLocaleString("pt-BR")
    return number ? `R$ ${formatted}` : ""
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {mode === 'enhanced' ? 'Calculadora Avançada' : 'Simulador de Salário'}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {mode === 'enhanced' 
              ? 'Calcule seu salário líquido com análise detalhada e recomendações personalizadas'
              : 'Calcule rapidamente seu salário líquido no Brasil com base nas regras de 2025'
            }
          </p>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Cálculo Manual</TabsTrigger>
            <TabsTrigger value="upload">Upload de Holerite</TabsTrigger>
          </TabsList>

          {/* Manual Calculation Tab */}
          <TabsContent value="manual" className="space-y-6">
            <form onSubmit={handleCalculate} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5" />
                    <span>Informações Básicas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Employment Type */}
                  <div className="space-y-2">
                    <Label>Tipo de Contrato</Label>
                    <RadioGroup
                      value={employmentType}
                      onValueChange={setEmploymentType}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="clt" id="clt" />
                        <Label htmlFor="clt">CLT</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pj" id="pj" />
                        <Label htmlFor="pj">PJ</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Gross Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="grossSalary" className="flex items-center space-x-2">
                      <span>Salário Bruto *</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Valor total antes dos descontos (INSS, IRRF, etc.)</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="grossSalary"
                      type="text"
                      placeholder="R$ 5.000,00"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      className="text-lg"
                      required
                    />
                  </div>

                  {/* Dependents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dependents">Dependentes</Label>
                      <Input
                        id="dependents"
                        type="number"
                        min="0"
                        value={dependents}
                        onChange={(e) => setDependents(e.target.value)}
                      />
                    </div>
                    
                    {mode === 'enhanced' && (
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
                            value={dependentsUnder14}
                            onChange={(e) => setDependentsUnder14(e.target.value)}
                            placeholder="Quantidade"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Additional fields for enhanced mode */}
                  {mode === 'enhanced' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="benefits">Benefícios (R$)</Label>
                          <Input
                            id="benefits"
                            type="text"
                            value={benefits}
                            onChange={(e) => setBenefits(e.target.value)}
                            placeholder="R$ 0,00"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="otherDeductions">Outros Descontos (R$)</Label>
                          <Input
                            id="otherDeductions"
                            type="text"
                            value={otherDeductions}
                            onChange={(e) => setOtherDeductions(e.target.value)}
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>

                      {/* Overtime */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasOvertime"
                            checked={hasOvertime}
                            onCheckedChange={(checked) => setHasOvertime(checked as boolean)}
                          />
                          <Label htmlFor="hasOvertime">Horas Extras</Label>
                        </div>
                        {hasOvertime && (
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={overtimeHours}
                            onChange={(e) => setOvertimeHours(e.target.value)}
                            placeholder="Horas extras por mês"
                          />
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full">
                <Calculator className="mr-2 h-5 w-5" />
                Calcular Salário Líquido
              </Button>
            </form>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload de Holerite</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Clique aqui para enviar seu holerite
                    </p>
                    <p className="text-xs text-gray-500">
                      Formatos aceitos: PDF, JPG, PNG
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                    className="hidden"
                  />

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processando {fileName}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results */}
        {showResults && results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Resultado do Cálculo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main result */}
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Salário Líquido</p>
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(results.netSalary)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {(results.netToGrossRatio * 100).toFixed(1)}% do salário bruto
                </p>
              </div>

              {/* Detailed breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">Valores Recebidos</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Salário Bruto:</span>
                      <span className="font-medium">{formatCurrency(results.grossSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de Ganhos:</span>
                      <span className="font-medium">{formatCurrency(results.totalEarnings)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600">Descontos</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>INSS ({(results.inssRate * 100).toFixed(2)}%):</span>
                      <span className="font-medium">{formatCurrency(results.inssContribution)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IRRF ({(results.irrfRate * 100).toFixed(2)}%):</span>
                      <span className="font-medium">{formatCurrency(results.irrf)}</span>
                    </div>
                    {results.otherDeductions > 0 && (
                      <div className="flex justify-between">
                        <span>Outros Descontos:</span>
                        <span className="font-medium">{formatCurrency(results.otherDeductions)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Total de Descontos:</span>
                      <span className="font-semibold">{formatCurrency(results.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced recommendations */}
              {mode === 'enhanced' && showRecommendations && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Recomendações de Otimização</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>• Considere aumentar dependentes se aplicável para reduzir IRRF</p>
                    <p>• Avalie benefícios não tributáveis oferecidos pela empresa</p>
                    <p>• Consulte sobre planos de previdência privada (PGBL/VGBL)</p>
                    {results.netToGrossRatio < 0.7 && (
                      <p>• Seu desconto está alto - considere revisar deduções fiscais</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
