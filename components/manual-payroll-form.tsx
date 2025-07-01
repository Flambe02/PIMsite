"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronsUpDown, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define tipos de contratação no Brasil
const employmentTypes = [
  { label: "CLT", value: "clt" },
  { label: "PJ", value: "pj" },
  { label: "Contrato Temporário", value: "temporary" },
  { label: "Estágio", value: "internship" },
  { label: "Jovem Aprendiz", value: "apprentice" },
]

// Define esquema do formulário
const formSchema = z.object({
  employmentType: z.string().optional(),
  grossSalary: z.string().optional(),
  netSalary: z.string().optional(),
  basicSalary: z.string().optional(),
  transportAllowance: z.string().optional(),
  mealAllowance: z.string().optional(),
  healthInsurance: z.string().optional(),
  dentalInsurance: z.string().optional(),
  otherAllowances: z.string().optional(),
  inssContribution: z.string().optional(),
  irpfTax: z.string().optional(),
  fgts: z.string().optional(),
  otherDeductions: z.string().optional(),
})

type ManualPayrollFormProps = { onSubmit: (data: z.infer<typeof formSchema>) => void; };

export function ManualPayrollForm({ onSubmit }: ManualPayrollFormProps) {
  const router = useRouter()

  // Inicializa formulário
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employmentType: "",
      grossSalary: "",
      netSalary: "",
      basicSalary: "",
      transportAllowance: "",
      mealAllowance: "",
      healthInsurance: "",
      dentalInsurance: "",
      otherAllowances: "",
      inssContribution: "",
      irpfTax: "",
      fgts: "",
      otherDeductions: "",
    },
  })

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    // Processa os dados do formulário
    console.log("Dados do formulário:", data)

    // Chama a função onSubmit passada do componente pai
    onSubmit(data)

    // Navega para a página de análise
    setTimeout(() => {
      router.push("/dashboard/analysis")
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações de Contratação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Tipo de Contratação</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de contratação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <h3 className="text-lg font-medium">Informações Salariais</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Salário bruto inclui todos os elementos antes das deduções. Salário líquido é o que você recebe após
                    as deduções. Salário base é o valor base sem adicionais.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="grossSalary"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Salário Bruto (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0,00" {...field} />
                  </FormControl>
                  <FormDescription>Renda total antes das deduções</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="netSalary"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Salário Líquido (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0,00" {...field} />
                  </FormControl>
                  <FormDescription>Valor recebido após deduções</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basicSalary"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Salário Base (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0,00" {...field} />
                  </FormControl>
                  <FormDescription>Valor base sem adicionais</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Benefícios e Adicionais</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="transportAllowance"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Vale Transporte (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0,00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="mealAllowance"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Vale Refeição (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0,00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="healthInsurance"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Plano de Saúde (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0,00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dentalInsurance"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Plano Odontológico (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0,00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="otherAllowances"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Outros Adicionais (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0,00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Collapsible className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" type="button" className="flex items-center justify-between w-full">
              <span>Deduções (Opcional)</span>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inssContribution"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Contribuição INSS (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0,00" {...field} />
                    </FormControl>
                    <FormDescription>Contribuição para Previdência Social</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="irpfTax"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Imposto de Renda (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0,00" {...field} />
                    </FormControl>
                    <FormDescription>IRRF retido na fonte</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fgts"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>FGTS (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0,00" {...field} />
                    </FormControl>
                    <FormDescription>Fundo de Garantia por Tempo de Serviço</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otherDeductions"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Outras Deduções (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0,00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Card className="bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-emerald-600" />
              <p className="text-sm text-emerald-800">
                Seus dados são processados com segurança e nunca compartilhados com terceiros. Toda análise é realizada
                localmente.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
            Analisar Meus Benefícios
          </Button>
        </div>
      </form>
    </Form>
  )
}
