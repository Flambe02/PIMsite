"use client"

import { ArrowRight, Download, Info, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PayslipAnalysis() {

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-blue-900">Análise de Holerite</CardTitle>
              <CardDescription>Abril/2025 - The Pimentão Rouge Company LTDA</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Imprimir</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Colaborador</p>
                <p className="font-medium">Florent Lambert</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Função</p>
                <p className="font-medium">Sócio Administrador</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Admissão</p>
                <p className="font-medium">21/02/2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium">232.139.288-60</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="summary">Resumo</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="summary" className="p-4 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Visão Geral</h3>
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <span>Pontuação de Otimização:</span>
                      <span className="font-bold">65%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Proventos</span>
                        <span className="text-sm font-medium text-green-600">R$ 1.518,00</span>
                      </div>
                      <Progress value={100} className="h-2 bg-green-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Descontos</span>
                        <span className="text-sm font-medium text-red-600">R$ 166,98</span>
                      </div>
                      <Progress value={11} className="h-2 bg-red-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Salário Líquido</span>
                        <span className="text-lg font-bold">R$ 1.351,02</span>
                      </div>
                      <Progress value={89} className="h-2 bg-blue-100" />
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Observação</h4>
                        <p className="text-sm text-yellow-700">
                          Este holerite refere-se a um pagamento de pró-labore para sócio, não um salário regular de
                          CLT.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Principais Pontos</h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Pró-labore Baixo</h4>
                          <p className="text-sm text-gray-600">
                            O valor de R$ 1.518,00 está próximo ao salário mínimo, o que é comum para sócios que também
                            recebem distribuição de lucros.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Apenas INSS</h4>
                          <p className="text-sm text-gray-600">
                            Há apenas desconto de INSS (11%) e nenhum desconto de IRRF, o que é estratégico para
                            minimizar a carga tributária.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Sem FGTS</h4>
                          <p className="text-sm text-gray-600">
                            Não há recolhimento de FGTS, o que é normal para pagamentos de pró-labore a sócios.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="p-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detalhamento do Holerite</h3>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Código</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Descrição</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Referência</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Proventos</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Descontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3 text-sm">01</td>
                        <td className="px-4 py-3 text-sm">Honorário pró-labore - Prop. ou sócio</td>
                        <td className="px-4 py-3 text-sm">35</td>
                        <td className="px-4 py-3 text-sm text-right text-green-600">R$ 1.518,00</td>
                        <td className="px-4 py-3 text-sm text-right">-</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 text-sm">91006</td>
                        <td className="px-4 py-3 text-sm">INSS pró-labore</td>
                        <td className="px-4 py-3 text-sm">11,00%</td>
                        <td className="px-4 py-3 text-sm text-right">-</td>
                        <td className="px-4 py-3 text-sm text-right text-red-600">R$ 166,98</td>
                      </tr>
                      <tr className="bg-gray-50 font-medium">
                        <td className="px-4 py-3 text-sm" colSpan={3}>
                          Totais
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-green-600">R$ 1.518,00</td>
                        <td className="px-4 py-3 text-sm text-right text-red-600">R$ 166,98</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Bases de Cálculo</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Salário base</span>
                        <span className="text-sm font-medium">R$ 1.518,00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Base INSS</span>
                        <span className="text-sm font-medium">R$ 1.518,00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Base FGTS</span>
                        <span className="text-sm font-medium">R$ 0,00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Valor FGTS</span>
                        <span className="text-sm font-medium">R$ 0,00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Base IRRF</span>
                        <span className="text-sm font-medium">R$ 953,20</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Informações Adicionais</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Empresa</span>
                        <span className="text-sm font-medium">The Pimentão Rouge Company LTDA</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">CNPJ</span>
                        <span className="text-sm font-medium">53.998.139/0001-32</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Endereço</span>
                        <span className="text-sm font-medium">Rua dos Pinheiros, 498</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">CEP</span>
                        <span className="text-sm font-medium">05422-902 São Paulo/SP</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Data de emissão</span>
                        <span className="text-sm font-medium">24/04/2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recomendações Personalizadas</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span>Economia potencial:</span>
                    <span className="font-bold text-green-600">R$ 3.600,00/ano</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">1</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900">Revisar Estrutura de Remuneração</h4>
                        <p className="text-sm text-blue-800">
                          Considere ajustar a proporção entre pró-labore e distribuição de lucros para otimizar a carga
                          tributária. O pró-labore atual está próximo ao mínimo legal.
                        </p>
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Saiba mais
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">2</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Contribuição Previdenciária Complementar</h4>
                        <p className="text-sm text-gray-600">
                          Com base apenas no pró-labore atual, sua aposentadoria pelo INSS será limitada. Considere uma
                          previdência privada complementar para garantir melhor renda futura.
                        </p>
                        <div className="pt-2">
                          <Button variant="outline" size="sm">
                            Simular previdência
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">3</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Planejamento Tributário Anual</h4>
                        <p className="text-sm text-gray-600">
                          Realize um planejamento tributário completo considerando todas as fontes de renda e possíveis
                          deduções na declaração anual de IR.
                        </p>
                        <div className="pt-2">
                          <Button variant="outline" size="sm">
                            Agendar consultoria
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
