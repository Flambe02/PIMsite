"use client"

import { useState } from "react"
import { Search, ChevronDown, Globe, MapPin, FileText, Briefcase, Shield, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Country = { code: string; name: string }
type CountryExplorerProps = { countries: Country[] }

export function CountryExplorer({ countries }: CountryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-full max-w-6xl mx-auto">
      {!selectedCountry ? (
        <div className="space-y-8">
          <div className="text-center space-y-4 py-12">
            <h1 className="text-4xl font-bold tracking-tight text-blue-900">Country Guides</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seu guia para gerenciar equipes internacionais e entender requisitos locais de folha de pagamento,
              benefícios e conformidade
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar país (ex: Brasil, BR)"
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCountries.map((country) => (
              <div key={country.code} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold">{country.name}</h3>
                <p className="text-gray-500 text-sm">Code: {country.code}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="flex items-center space-x-2" onClick={() => setSelectedCountry(null)}>
                <ChevronDown className="rotate-90 h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-lg">🇧🇷</span>
                </div>
                <h2 className="text-xl font-bold">Brasil</h2>
              </div>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os produtos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os produtos</SelectItem>
                  <SelectItem value="payroll">Folha de pagamento</SelectItem>
                  <SelectItem value="benefits">Benefícios</SelectItem>
                  <SelectItem value="compliance">Conformidade</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Baixar guia</Button>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger value="payroll" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Folha de Pagamento</span>
              </TabsTrigger>
              <TabsTrigger value="benefits" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Benefícios</span>
              </TabsTrigger>
              <TabsTrigger value="taxes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Impostos</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Conformidade</span>
              </TabsTrigger>
              <TabsTrigger value="stock" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Stock Options</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Informações Gerais</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Capital</span>
                        <span>Brasília</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Moeda</span>
                        <span>Real (BRL)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">População</span>
                        <span>214 milhões</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Idioma</span>
                        <span>Português</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fuso horário</span>
                        <span>UTC-3</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Ambiente de Trabalho</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Semana de trabalho</span>
                        <span>44 horas</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Férias anuais</span>
                        <span>30 dias</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Aviso prévio</span>
                        <span>30 dias</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">13º salário</span>
                        <span>Obrigatório</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Período probatório</span>
                        <span>90 dias</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Tipos de Contratação</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">CLT</span>
                        <span>Comum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">PJ</span>
                        <span>Comum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Temporário</span>
                        <span>Disponível</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estágio</span>
                        <span>Disponível</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Terceirização</span>
                        <span>Regulamentada</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Visão Geral do Brasil</h3>
                <p className="mb-4">
                  O Brasil é a maior economia da América Latina e um importante centro de negócios na região. Com uma
                  força de trabalho diversificada e qualificada, o país oferece oportunidades significativas para
                  empresas internacionais, mas também apresenta um ambiente regulatório complexo.
                </p>
                <p>
                  A legislação trabalhista brasileira é abrangente e fortemente orientada à proteção do trabalhador, com
                  a Consolidação das Leis do Trabalho (CLT) como principal marco regulatório. Empresas que operam no
                  Brasil devem estar atentas às obrigações legais relacionadas a contratos de trabalho, benefícios
                  obrigatórios, impostos e contribuições sociais.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="payroll" className="mt-6 space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-medium mb-4">Folha de Pagamento no Brasil</h3>
                <p className="mb-4">
                  A gestão da folha de pagamento no Brasil é complexa devido às numerosas obrigações legais e encargos
                  trabalhistas. Empresas devem estar atentas aos seguintes aspectos:
                </p>

                <div className="space-y-4 mt-6">
                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Componentes do Salário</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Salário base (definido em contrato)</li>
                      <li>13º salário (obrigatório, pago em duas parcelas)</li>
                      <li>Férias remuneradas + 1/3 constitucional</li>
                      <li>Horas extras (mínimo +50% sobre hora normal)</li>
                      <li>Adicional noturno (mínimo +20% sobre hora normal)</li>
                      <li>Adicional de periculosidade/insalubridade (quando aplicável)</li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Encargos e Contribuições</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>INSS (7,5% a 14% para empregados, conforme faixa salarial)</li>
                      <li>FGTS (8% depositado pelo empregador)</li>
                      <li>IRRF (Imposto de Renda Retido na Fonte, conforme tabela progressiva)</li>
                      <li>Contribuição sindical (quando aplicável)</li>
                      <li>Contribuições para sistemas S (SESI, SENAI, etc.)</li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Prazos e Obrigações</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Pagamento de salários até o 5º dia útil do mês subsequente</li>
                      <li>Recolhimento do FGTS até o dia 7 do mês subsequente</li>
                      <li>Recolhimento do INSS até o dia 20 do mês subsequente</li>
                      <li>Envio de obrigações acessórias (eSocial, CAGED, RAIS, DIRF)</li>
                      <li>Primeira parcela do 13º salário até 30 de novembro</li>
                      <li>Segunda parcela do 13º salário até 20 de dezembro</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-2">Particularidades Regionais</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Pisos salariais podem variar por estado e categoria profissional</li>
                      <li>Convenções coletivas podem estabelecer condições específicas por setor</li>
                      <li>Alguns municípios possuem impostos adicionais</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Tabela INSS 2025</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border px-4 py-2 text-left">Faixa Salarial</th>
                            <th className="border px-4 py-2 text-left">Alíquota</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-4 py-2">Até R$ 1.518,00</td>
                            <td className="border px-4 py-2">7,5%</td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2">De R$ 1.518,01 até R$ 2.793,88</td>
                            <td className="border px-4 py-2">9%</td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2">De R$ 2.793,89 até R$ 4.190,83</td>
                            <td className="border px-4 py-2">12%</td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2">De R$ 4.190,84 até R$ 8.157,41</td>
                            <td className="border px-4 py-2">14%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Tabela IRRF 2025</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border px-4 py-2 text-left">Base de Cálculo</th>
                            <th className="border px-4 py-2 text-left">Alíquota</th>
                            <th className="border px-4 py-2 text-left">Dedução</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-4 py-2">Até R$ 2.259,20</td>
                            <td className="border px-4 py-2">Isento</td>
                            <td className="border px-4 py-2">-</td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2">De R$ 2.259,21 até R$ 2.826,65</td>
                            <td className="border px-4 py-2">7,5%</td>
                            <td className="border px-4 py-2">R$ 169,44</td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2">De R$ 2.826,66 até R$ 3.751,05</td>
                            <td className="border px-4 py-2">15%</td>
                            <td className="border px-4 py-2">R$ 381,44</td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2">De R$ 3.751,06 até R$ 4.664,68</td>
                            <td className="border px-4 py-2">22,5%</td>
                            <td className="border px-4 py-2">R$ 662,77</td>
                          </tr>
                          <tr>
                            <td className="border px-4 py-2">Acima de R$ 4.664,68</td>
                            <td className="border px-4 py-2">27,5%</td>
                            <td className="border px-4 py-2">R$ 896,00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6 space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-medium mb-4">Benefícios no Brasil</h3>
                <p className="mb-4">
                  O sistema de benefícios no Brasil inclui tanto benefícios obrigatórios por lei quanto benefícios
                  adicionais comumente oferecidos para atrair e reter talentos. Entender esta estrutura é essencial para
                  empresas que operam no país.
                </p>

                <div className="space-y-4 mt-6">
                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Benefícios Obrigatórios</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Vale-Transporte:</strong> Subsídio para transporte público, com desconto máximo de 6% do
                        salário do empregado
                      </li>
                      <li>
                        <strong>13º Salário:</strong> Pagamento adicional equivalente a um salário mensal, geralmente
                        pago em duas parcelas (novembro e dezembro)
                      </li>
                      <li>
                        <strong>Férias Remuneradas:</strong> 30 dias de férias após cada período de 12 meses
                        trabalhados, com adicional de 1/3 sobre o salário
                      </li>
                      <li>
                        <strong>FGTS:</strong> Depósito mensal de 8% do salário em conta vinculada do trabalhador
                      </li>
                      <li>
                        <strong>Licença-Maternidade:</strong> 120 dias (podendo ser estendida para 180 dias em alguns
                        casos)
                      </li>
                      <li>
                        <strong>Licença-Paternidade:</strong> 5 dias (podendo ser estendida para 20 dias em alguns
                        casos)
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Benefícios Comuns (Não Obrigatórios)</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Vale-Refeição/Alimentação:</strong> Subsídio para alimentação, geralmente fornecido
                        através de cartão específico
                      </li>
                      <li>
                        <strong>Plano de Saúde:</strong> Cobertura médica e hospitalar, frequentemente estendida a
                        dependentes
                      </li>
                      <li>
                        <strong>Plano Odontológico:</strong> Cobertura para tratamentos dentários
                      </li>
                      <li>
                        <strong>Seguro de Vida:</strong> Proteção financeira em caso de morte ou invalidez
                      </li>
                      <li>
                        <strong>Previdência Privada:</strong> Planos de aposentadoria complementar
                      </li>
                      <li>
                        <strong>Auxílio-Creche:</strong> Subsídio para despesas com creche ou babá
                      </li>
                      <li>
                        <strong>Participação nos Lucros e Resultados (PLR):</strong> Bônus baseado no desempenho da
                        empresa
                      </li>
                      <li>
                        <strong>Auxílio Home Office:</strong> Ajuda de custo para trabalho remoto
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-2">Tendências e Práticas Recomendadas</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Benefícios Flexíveis:</strong> Sistemas que permitem aos funcionários escolher os
                        benefícios que melhor atendem às suas necessidades
                      </li>
                      <li>
                        <strong>Bem-estar:</strong> Programas de saúde mental, física e financeira
                      </li>
                      <li>
                        <strong>Desenvolvimento Profissional:</strong> Subsídios para educação e treinamento
                      </li>
                      <li>
                        <strong>Equilíbrio Trabalho-Vida:</strong> Horários flexíveis, dias de folga adicionais
                      </li>
                      <li>
                        <strong>Benefícios Digitais:</strong> Assinaturas de plataformas de aprendizado, aplicativos de
                        bem-estar
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Principais Fornecedores de Benefícios</h3>
                    <div className="space-y-4">
                      <div className="border-b pb-2">
                        <h4 className="font-medium">Vale-Refeição/Alimentação</h4>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Pluxee (antiga Sodexo)</li>
                          <li>Alelo</li>
                          <li>VR Benefícios</li>
                          <li>Ticket</li>
                          <li>Flash</li>
                          <li>Caju</li>
                          <li>iFood Benefícios</li>
                        </ul>
                      </div>
                      <div className="border-b pb-2">
                        <h4 className="font-medium">Planos de Saúde</h4>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Amil</li>
                          <li>Bradesco Saúde</li>
                          <li>SulAmérica</li>
                          <li>Unimed</li>
                          <li>NotreDame Intermédica</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Previdência Privada</h4>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Bradesco Vida e Previdência</li>
                          <li>Itaú Vida e Previdência</li>
                          <li>Brasilprev</li>
                          <li>XP Vida e Previdência</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Aspectos Tributários dos Benefícios</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Benefícios com Vantagens Fiscais</h4>
                        <p className="text-sm mt-1">
                          Alguns benefícios podem ser deduzidos da base de cálculo de impostos ou ter tratamento
                          tributário favorecido quando oferecidos através de programas específicos:
                        </p>
                        <ul className="list-disc pl-5 text-sm mt-2">
                          <li>
                            <strong>PAT (Programa de Alimentação do Trabalhador):</strong> Permite dedução de até 4% do
                            IR devido para empresas tributadas pelo lucro real
                          </li>
                          <li>
                            <strong>Vale-Transporte:</strong> Não constitui base para encargos trabalhistas e
                            previdenciários
                          </li>
                          <li>
                            <strong>Planos de Saúde:</strong> Dedutíveis como despesa operacional para empresas
                          </li>
                          <li>
                            <strong>Previdência Privada:</strong> Planos PGBL permitem dedução de até 12% da renda bruta
                            anual no IR
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="taxes" className="mt-6 space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-medium mb-4">Sistema Tributário Brasileiro para Empregadores</h3>
                <p className="mb-4">
                  O sistema tributário brasileiro é conhecido por sua complexidade. Empregadores devem estar atentos a
                  diversos impostos e contribuições relacionados à folha de pagamento e à atividade empresarial.
                </p>

                <div className="space-y-4 mt-6">
                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Encargos sobre a Folha de Pagamento</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>INSS Patronal:</strong> 20% sobre a folha de pagamento (empresas no regime de Lucro Real
                        ou Presumido)
                      </li>
                      <li>
                        <strong>RAT/SAT:</strong> 1% a 3% sobre a folha, dependendo do grau de risco da atividade
                      </li>
                      <li>
                        <strong>Contribuições para Terceiros (Sistema S):</strong> Aproximadamente 5,8% sobre a folha
                      </li>
                      <li>
                        <strong>FGTS:</strong> 8% sobre a remuneração mensal
                      </li>
                      <li>
                        <strong>Multa FGTS em Demissão sem Justa Causa:</strong> 40% sobre o saldo do FGTS + 10% de
                        contribuição social
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Regimes Tributários para Empresas</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Simples Nacional:</strong> Regime simplificado para micro e pequenas empresas, com
                        alíquotas unificadas (inclui substituição da contribuição patronal)
                      </li>
                      <li>
                        <strong>Lucro Presumido:</strong> Cálculo simplificado do IR e CSLL com base em percentual de
                        presunção sobre a receita bruta
                      </li>
                      <li>
                        <strong>Lucro Real:</strong> Apuração do lucro efetivo para cálculo de impostos, obrigatório
                        para empresas com faturamento acima de R$ 78 milhões
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-2">Obrigações Acessórias</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>eSocial:</strong> Sistema de escrituração digital das obrigações fiscais,
                        previdenciárias e trabalhistas
                      </li>
                      <li>
                        <strong>EFD-Reinf:</strong> Escrituração Fiscal Digital de Retenções e Outras Informações
                        Fiscais
                      </li>
                      <li>
                        <strong>DCTF-Web:</strong> Declaração de Débitos e Créditos Tributários Federais Previdenciários
                        e de Outras Entidades e Fundos
                      </li>
                      <li>
                        <strong>DIRF:</strong> Declaração do Imposto de Renda Retido na Fonte
                      </li>
                      <li>
                        <strong>RAIS:</strong> Relação Anual de Informações Sociais
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Desoneração da Folha de Pagamento</h3>
                    <p className="text-sm mb-4">
                      Alguns setores da economia brasileira podem se beneficiar da desoneração da folha de pagamento,
                      substituindo a contribuição previdenciária patronal de 20% por uma alíquota sobre a receita bruta.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Setores Beneficiados (2025)</h4>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Tecnologia da Informação e Comunicação</li>
                        <li>Call Center</li>
                        <li>Construção Civil</li>
                        <li>Transporte Rodoviário de Cargas</li>
                        <li>Têxtil e Calçados</li>
                        <li>Comunicação</li>
                        <li>Entre outros</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Planejamento Tributário</h3>
                    <p className="text-sm mb-4">
                      Estratégias legais para otimização da carga tributária relacionada à folha de pagamento:
                    </p>
                    <ul className="list-disc pl-5 text-sm">
                      <li>
                        <strong>Escolha do Regime Tributário:</strong> Análise do melhor enquadramento (Simples, Lucro
                        Presumido ou Real)
                      </li>
                      <li>
                        <strong>Estruturação de Benefícios:</strong> Utilização de programas com incentivos fiscais
                        (PAT, Lei do Bem)
                      </li>
                      <li>
                        <strong>Remuneração Estratégica:</strong> Combinação adequada entre salário fixo, variável e
                        benefícios
                      </li>
                      <li>
                        <strong>PLR:</strong> Implementação de programas de participação nos lucros com tratamento
                        tributário favorecido
                      </li>
                      <li>
                        <strong>Análise de Enquadramento no CNAE:</strong> Verificação do código de atividade para
                        correta aplicação do RAT/FAP
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6 space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-medium mb-4">Conformidade Trabalhista no Brasil</h3>
                <p className="mb-4">
                  A legislação trabalhista brasileira é extensa e detalhada, exigindo atenção constante dos empregadores
                  para garantir conformidade e evitar penalidades.
                </p>

                <div className="space-y-4 mt-6">
                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Principais Legislações</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>CLT (Consolidação das Leis do Trabalho):</strong> Principal legislação trabalhista,
                        estabelece direitos e deveres básicos
                      </li>
                      <li>
                        <strong>Constituição Federal:</strong> Garante direitos fundamentais dos trabalhadores
                      </li>
                      <li>
                        <strong>Lei 13.467/2017 (Reforma Trabalhista):</strong> Modernizou aspectos da CLT,
                        flexibilizando algumas regras
                      </li>
                      <li>
                        <strong>NRs (Normas Regulamentadoras):</strong> Estabelecem requisitos de segurança e saúde no
                        trabalho
                      </li>
                      <li>
                        <strong>Convenções e Acordos Coletivos:</strong> Negociações específicas por categoria
                        profissional
                      </li>
                      <li>
                        <strong>LGPD (Lei Geral de Proteção de Dados):</strong> Impacta o tratamento de dados de
                        funcionários
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Documentação e Registros Obrigatórios</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Registro de Empregados:</strong> Documentação completa de todos os funcionários
                      </li>
                      <li>
                        <strong>Carteira de Trabalho:</strong> Anotações obrigatórias (físicas ou digitais)
                      </li>
                      <li>
                        <strong>Controle de Jornada:</strong> Registro de ponto para empresas com mais de 20
                        funcionários
                      </li>
                      <li>
                        <strong>Exames Médicos:</strong> Admissionais, periódicos, demissionais
                      </li>
                      <li>
                        <strong>PPRA e PCMSO:</strong> Programas de prevenção de riscos e controle médico
                      </li>
                      <li>
                        <strong>CIPA:</strong> Comissão Interna de Prevenção de Acidentes (quando aplicável)
                      </li>
                      <li>
                        <strong>Comprovantes de Pagamento:</strong> Recibos de salário, férias, 13º
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-2">Fiscalização e Penalidades</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Ministério do Trabalho:</strong> Principal órgão fiscalizador
                      </li>
                      <li>
                        <strong>Multas:</strong> Variam conforme a infração e o porte da empresa
                      </li>
                      <li>
                        <strong>Ações Trabalhistas:</strong> Processos movidos por funcionários ou ex-funcionários
                      </li>
                      <li>
                        <strong>TAC (Termo de Ajustamento de Conduta):</strong> Compromisso firmado com o Ministério
                        Público do Trabalho
                      </li>
                      <li>
                        <strong>Dano Moral Coletivo:</strong> Indenizações por práticas que afetem coletivamente os
                        trabalhadores
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Melhores Práticas de Compliance</h3>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li>
                        <strong>Auditoria Trabalhista Periódica:</strong> Revisão regular de processos e documentação
                      </li>
                      <li>
                        <strong>Atualização Constante:</strong> Acompanhamento de mudanças na legislação e
                        jurisprudência
                      </li>
                      <li>
                        <strong>Treinamento de Gestores:</strong> Capacitação sobre práticas corretas de gestão de
                        pessoas
                      </li>
                      <li>
                        <strong>Canal de Denúncias:</strong> Mecanismo para reportar irregularidades
                      </li>
                      <li>
                        <strong>Política de Compliance:</strong> Diretrizes claras sobre conduta e procedimentos
                      </li>
                      <li>
                        <strong>Documentação Adequada:</strong> Manutenção de registros completos e atualizados
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Terceirização e Pejotização</h3>
                    <p className="text-sm mb-4">Aspectos legais de modelos alternativos de contratação:</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Terceirização</h4>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Permitida para qualquer atividade desde a Lei 13.467/2017</li>
                          <li>Empresa contratante tem responsabilidade subsidiária</li>
                          <li>Necessário verificar idoneidade da empresa terceirizada</li>
                          <li>Proibido caracterizar relação de subordinação direta</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Pejotização</h4>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Contratação de pessoa jurídica em substituição a vínculo empregatício</li>
                          <li>Considerada fraude quando presentes os elementos de relação de emprego</li>
                          <li>Riscos de reconhecimento de vínculo e passivos trabalhistas</li>
                          <li>Legítima apenas quando há real autonomia e ausência de subordinação</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stock" className="mt-6 space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-medium mb-4">Stock Options no Brasil</h3>
                <p className="mb-4">
                  Programas de Stock Options (opções de compra de ações) e outros incentivos baseados em ações têm se
                  tornado cada vez mais comuns no Brasil, especialmente em startups e empresas de tecnologia. No
                  entanto, sua implementação envolve considerações legais, tributárias e contábeis específicas.
                </p>

                <div className="space-y-4 mt-6">
                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Tipos de Planos</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Stock Options Tradicionais:</strong> Direito de comprar ações da empresa a um preço
                        pré-determinado após um período de carência
                      </li>
                      <li>
                        <strong>Restricted Stock Units (RSUs):</strong> Promessa de entrega de ações após cumprimento de
                        condições específicas
                      </li>
                      <li>
                        <strong>Stock Appreciation Rights (SARs):</strong> Direito de receber o equivalente à
                        valorização das ações sem efetivamente adquiri-las
                      </li>
                      <li>
                        <strong>Phantom Shares:</strong> Unidades que simulam o valor das ações, liquidadas em dinheiro
                      </li>
                      <li>
                        <strong>Employee Stock Purchase Plans (ESPPs):</strong> Programas que permitem aos funcionários
                        comprar ações com desconto
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Aspectos Tributários</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Natureza Jurídica:</strong> Pode ser considerada remuneratória (sujeita a encargos
                        trabalhistas) ou mercantil (isenta de encargos), dependendo da estruturação
                      </li>
                      <li>
                        <strong>Imposto de Renda:</strong> Incide sobre o ganho de capital (diferença entre valor de
                        venda e custo de aquisição), geralmente à alíquota de 15%
                      </li>
                      <li>
                        <strong>Momento da Tributação:</strong> Geralmente na venda das ações, não no exercício da opção
                      </li>
                      <li>
                        <strong>Contribuições Previdenciárias:</strong> Podem incidir se o plano for considerado de
                        natureza remuneratória
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-2">Desafios e Considerações</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Empresas Estrangeiras:</strong> Complexidades adicionais para subsidiárias brasileiras
                        de empresas estrangeiras
                      </li>
                      <li>
                        <strong>Variação Cambial:</strong> Impacto da flutuação do câmbio em planos denominados em moeda
                        estrangeira
                      </li>
                      <li>
                        <strong>Liquidez:</strong> Desafios para exercício e venda em empresas de capital fechado
                      </li>
                      <li>
                        <strong>Documentação:</strong> Necessidade de contratos claros e bem estruturados
                      </li>
                      <li>
                        <strong>Comunicação:</strong> Importância de explicar claramente os termos e condições aos
                        participantes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Estruturação de Planos</h3>
                    <p className="text-sm mb-4">Elementos-chave para um plano de Stock Options eficaz:</p>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li>
                        <strong>Elegibilidade:</strong> Definição clara de quem pode participar
                      </li>
                      <li>
                        <strong>Vesting (Aquisição de Direitos):</strong> Cronograma para exercício das opções
                        (geralmente 4 anos com cliff de 1 ano)
                      </li>
                      <li>
                        <strong>Preço de Exercício:</strong> Valor a ser pago pelas ações (geralmente valor justo de
                        mercado na data da concessão)
                      </li>
                      <li>
                        <strong>Período de Exercício:</strong> Prazo para exercer as opções após o vesting
                      </li>
                      <li>
                        <strong>Cláusulas de Saída:</strong> Tratamento em caso de desligamento (good leaver vs. bad
                        leaver)
                      </li>
                      <li>
                        <strong>Ajustes por Diluição:</strong> Proteções em caso de eventos societários
                      </li>
                      <li>
                        <strong>Governança:</strong> Comitê responsável pela administração do plano
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Tendências e Melhores Práticas</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Tendências Recentes</h4>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Maior adoção de RSUs em substituição a opções tradicionais</li>
                          <li>Planos mais flexíveis com vesting acelerado em eventos de liquidez</li>
                          <li>Extensão de planos para trabalhadores remotos internacionais</li>
                          <li>Democratização do acesso a planos para níveis hierárquicos diversos</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Melhores Práticas</h4>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Assessoria jurídica e tributária especializada na estruturação</li>
                          <li>Documentação clara e transparente</li>
                          <li>Comunicação efetiva sobre o valor e funcionamento do plano</li>
                          <li>Revisão periódica para adequação a mudanças legislativas</li>
                          <li>Alinhamento com estratégia de retenção e cultura organizacional</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
