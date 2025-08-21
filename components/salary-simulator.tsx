"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Calculator, Upload, ChevronDown, ChevronUp, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast";

export function SalarySimulator() {
  // Form state
  const [grossSalary, setGrossSalary] = useState<string>("")
  const [taxWithholding, setTaxWithholding] = useState<string>("")
  const [benefits, setBenefits] = useState<string>("")
  const [otherDeductions, setOtherDeductions] = useState<string>("")

  // UI state
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)

  // Results state
  const [results, setResults] = useState<{
    netSalary: number
    potentialSavings: number
    optimizationScore: number
    calculated: boolean
  }>({
    netSalary: 0,
    potentialSavings: 0,
    optimizationScore: 0,
    calculated: false,
  })

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  // Handlers
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    // Parse input values
    const gross = Number.parseFloat(grossSalary.replace(/\./g, "").replace(",", ".")) || 0
    const tax = Number.parseFloat(taxWithholding) / 100 || 0
    const benefitsValue = Number.parseFloat(benefits.replace(/\./g, "").replace(",", ".")) || 0
    const deductions = Number.parseFloat(otherDeductions.replace(/\./g, "").replace(",", ".")) || 0

    // Calculate net salary
    const taxAmount = gross * tax
    const netSalary = gross - taxAmount - deductions

    // Mock potential savings (in a real app, this would be calculated based on more factors)
    const potentialSavings = gross * 0.05 + benefitsValue * 0.1

    // Mock optimization score (in a real app, this would be calculated based on more factors)
    const optimizationScore = Math.min(Math.round((1 - potentialSavings / gross) * 100), 95)

    // Update results
    setResults({
      netSalary,
      potentialSavings,
      optimizationScore,
      calculated: true,
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-emerald-500")
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-emerald-500")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-emerald-500")
    }

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    // Check file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png"]
    if (!validTypes.includes(file.type)) {
      toast({ title: "Arquivo inválido", description: "Formato de arquivo inválido. Por favor, envie um PDF, JPG ou PNG.", variant: "destructive" });
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "O tamanho máximo é 10MB.", variant: "destructive" });
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
              netSalary: 3245.67,
              potentialSavings: 420.5,
              optimizationScore: 82,
              calculated: true,
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
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const { toast } = useToast();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {/* Manual Simulation Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Simulação de Salário</CardTitle>
              <CardDescription>Preencha os campos abaixo para calcular seu salário líquido</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grossSalary">Salário Bruto</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Valor total antes das deduções</p>
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
                      className="pl-10"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="taxWithholding">Retenção de Imposto (%)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Percentual de imposto retido na fonte</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Input
                      id="taxWithholding"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={taxWithholding}
                      onChange={(e) => setTaxWithholding(e.target.value)}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="benefits">Benefícios (VR/VA)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Valor total de vale refeição e vale alimentação</p>
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
                      className="pl-10"
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="otherDeductions">Outras Deduções (opcional)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Outros descontos como plano de saúde, empréstimos, etc.</p>
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
                      className="pl-10"
                      value={otherDeductions}
                      onChange={(e) => setOtherDeductions(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calcular Salário Líquido
                </Button>
              </form>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(!isUploadOpen)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                >
                  Ou importe seu holerite (PDF, JPG)
                  {isUploadOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                </button>

                <Collapsible open={isUploadOpen} className="mt-2">
                  <CollapsibleContent>
                    <div
                      ref={dropAreaRef}
                      className="border-2 border-dashed rounded-lg p-6 transition-colors"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {isUploading ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{fileName}</span>
                            <span className="text-sm font-medium">{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                            <Upload className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Arraste e solte seu holerite aqui</p>
                            <p className="text-xs text-gray-500">Suporte para PDF, JPG, PNG. Tamanho máximo 10MB.</p>
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={handleFileSelect}>
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
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Widget */}
        <div className="space-y-6">
          {results.calculated && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Resultado da Simulação</CardTitle>
                <CardDescription>Análise baseada nos dados fornecidos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Salário Líquido Estimado</span>
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(results.netSalary)}</span>
                    </div>
                    <Progress value={100} className="h-2 bg-emerald-100" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Economia Potencial</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {formatCurrency(results.potentialSavings)}
                      </span>
                    </div>
                    <Progress value={70} className="h-2 bg-emerald-100" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pontuação de Otimização</span>
                      <span className="text-lg font-bold">{results.optimizationScore}%</span>
                    </div>
                    <Progress value={results.optimizationScore} className="h-2" />
                  </div>
                </div>

                <Collapsible className="space-y-4">
                  <CollapsibleTrigger className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Ver Detalhes
                  </CollapsibleTrigger>

                  <CollapsibleContent className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                            Salário Bruto
                          </span>
                          <span>{grossSalary ? `R$ ${grossSalary}` : formatCurrency(4000)}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                            Imposto de Renda
                          </span>
                          <span className="text-red-500">-{taxWithholding ? `${taxWithholding}%` : "11%"}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                            INSS
                          </span>
                          <span className="text-red-500">-7.5%</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                            Outras Deduções
                          </span>
                          <span className="text-red-500">-{otherDeductions ? `R$ ${otherDeductions}` : "R$ 0,00"}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                            Benefícios (VR/VA)
                          </span>
                          <span className="text-emerald-500">+{benefits ? `R$ ${benefits}` : "R$ 800,00"}</span>
                        </div>

                        <div className="pt-2 border-t flex items-center justify-between font-medium">
                          <span>Salário Líquido</span>
                          <span>{formatCurrency(results.netSalary)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-emerald-50">
                      <h4 className="font-medium mb-3">Recomendações de Otimização</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs text-emerald-600">1</span>
                          </div>
                          <span>Ajuste sua retenção de IR para evitar restituição excessiva</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs text-emerald-600">2</span>
                          </div>
                          <span>Considere aderir ao plano de previdência privada com benefício fiscal</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs text-emerald-600">3</span>
                          </div>
                          <span>Avalie a portabilidade entre VR e VA para melhor utilização</span>
                        </li>
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Receber Análise Completa</Button>
              </CardContent>
            </Card>
          )}

          {!results.calculated && (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <Calculator className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Simule seu Salário</h3>
                    <p className="text-gray-500">
                      Preencha o formulário ou envie seu holerite para visualizar os resultados da simulação.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
