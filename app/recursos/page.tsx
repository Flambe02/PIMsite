import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/logo"

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Início
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/recursos">
            Recursos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/precos">
            Preços
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/sobre">
            Sobre
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Cadastrar
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Recursos</h1>
              <p className="text-gray-500 mt-2">
                Aprenda sobre folha de pagamento, benefícios e como otimizar suas finanças.
              </p>
            </div>

            <Tabs defaultValue="payroll" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="payroll">Estrutura da Folha</TabsTrigger>
                <TabsTrigger value="benefits">Benefícios</TabsTrigger>
              </TabsList>

              <TabsContent value="payroll" className="mt-6 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Entendendo sua Folha de Pagamento</CardTitle>
                    <CardDescription>
                      Guia completo para compreender cada seção da sua folha de pagamento brasileira.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Seções Principais da Folha de Pagamento</h3>
                      <p>
                        A folha de pagamento brasileira é composta por várias seções importantes que detalham sua
                        remuneração e deduções. Entender cada componente é essencial para otimizar seus benefícios.
                      </p>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Salário Bruto</h4>
                          <p className="text-sm text-gray-500">
                            O salário bruto incorpora todos os elementos que contribuem para o pacote de remuneração do
                            funcionário no Brasil. Inclui a renda total antes de calcular as deduções da folha de
                            pagamento. Alguns dos componentes que abrange são contribuições para a previdência social,
                            plano de saúde, etc.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Salário Líquido</h4>
                          <p className="text-sm text-gray-500">
                            Refere-se ao valor restante após o empregador ter feito todas as deduções do salário bruto.
                            O valor é creditado nas contas bancárias do funcionário. Este é o valor que você
                            efetivamente recebe.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Salário Base</h4>
                          <p className="text-sm text-gray-500">
                            Refere-se ao valor que os funcionários recebem após calcular todas as adições e deduções do
                            pacote anual. Este elemento depende de dois fatores: a designação do cargo do funcionário na
                            empresa e as atividades do setor.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Adicionais</h4>
                          <p className="text-sm text-gray-500">
                            Envolve todas as despesas relacionadas ao trabalho que os empregadores devem pagar aos seus
                            funcionários. Beneficia os funcionários com um equilíbrio decente entre vida profissional e
                            pessoal. Todos os funcionários têm direito a múltiplos adicionais, independentemente da
                            empresa e do setor.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Deduções Comuns</h3>
                      <p>
                        Entender as deduções em sua folha de pagamento é crucial para planejar suas finanças e garantir
                        que todos os cálculos estejam corretos.
                      </p>

                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">INSS (Instituto Nacional do Seguro Social)</h4>
                          <p className="text-sm text-gray-500">
                            Contribuição obrigatória para a previdência social. O valor varia de acordo com o salário,
                            seguindo uma tabela progressiva. Esta contribuição garante benefícios como aposentadoria,
                            auxílio-doença e licença-maternidade.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">IRRF (Imposto de Renda Retido na Fonte)</h4>
                          <p className="text-sm text-gray-500">
                            Imposto de renda descontado diretamente na folha. O valor depende da faixa salarial e das
                            deduções permitidas, como dependentes e despesas médicas. É possível otimizar este valor
                            através de planejamento tributário adequado.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">FGTS (Fundo de Garantia do Tempo de Serviço)</h4>
                          <p className="text-sm text-gray-500">
                            Não é uma dedução do salário, mas um depósito feito pelo empregador equivalente a 8% do
                            salário bruto. O FGTS pode ser sacado em situações específicas, como demissão sem justa
                            causa, aposentadoria ou compra da casa própria.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Vale Transporte</h4>
                          <p className="text-sm text-gray-500">
                            O empregado pode contribuir com até 6% do seu salário base para receber o vale transporte.
                            Esta dedução é opcional, mas muitas vezes vale a pena para quem utiliza transporte público
                            regularmente.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" asChild>
                        <Link href="/recursos/folha-detalhada">
                          Guia Completo da Folha de Pagamento
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Como Ler seu Holerite</CardTitle>
                    <CardDescription>
                      Aprenda a interpretar cada linha do seu holerite para entender melhor sua remuneração.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative border rounded-lg p-6 bg-gray-50">
                      <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium">Código</span>
                          <span className="font-medium">Descrição</span>
                          <span className="font-medium">Valor (R$)</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>001</span>
                          <span>Salário Base</span>
                          <span className="text-green-600">3.500,00</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>203</span>
                          <span>Vale Refeição</span>
                          <span className="text-green-600">660,00</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>204</span>
                          <span>Vale Alimentação</span>
                          <span className="text-green-600">400,00</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>302</span>
                          <span>INSS</span>
                          <span className="text-red-600">-385,00</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>303</span>
                          <span>IRRF</span>
                          <span className="text-red-600">-142,50</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>401</span>
                          <span>Vale Transporte</span>
                          <span className="text-red-600">-210,00</span>
                        </div>

                        <div className="flex justify-between border-t pt-2 font-medium">
                          <span></span>
                          <span>Total Líquido</span>
                          <span>2.762,50</span>
                        </div>
                      </div>

                      <div className="absolute -top-3 right-3 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                        Exemplo
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      Este é um exemplo simplificado de holerite. Seu holerite real pode conter códigos e descrições
                      diferentes, dependendo da empresa e dos benefícios oferecidos.
                    </p>

                    <div className="flex justify-end">
                      <Button variant="outline" asChild>
                        <Link href="/recursos/guia-holerite">
                          Guia Completo de Holerite
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="mt-6 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Benefícios Corporativos no Brasil</CardTitle>
                    <CardDescription>
                      Conheça os principais benefícios oferecidos por empresas brasileiras e como aproveitá-los ao
                      máximo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Principais Fornecedores de Benefícios</h3>
                      <p>
                        No Brasil, diversas empresas oferecem soluções de benefícios corporativos. Conheça as principais
                        e os produtos que oferecem:
                      </p>

                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Pluxee (antiga Sodexo)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="h-12 w-full flex items-center justify-center bg-gray-100 rounded-md">
                              <p className="text-sm font-medium">Logo Pluxee</p>
                            </div>
                            <h4 className="font-medium text-sm">Produtos Oferecidos:</h4>
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Vale Refeição</li>
                              <li>• Vale Alimentação</li>
                              <li>• Vale Cultura</li>
                              <li>• Vale Transporte</li>
                              <li>• Pluxee Multibenefícios</li>
                            </ul>
                            <p className="text-xs text-gray-500">
                              A Pluxee (antiga Sodexo) é uma das maiores empresas de benefícios do Brasil, com ampla
                              rede de estabelecimentos credenciados.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Alelo</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="h-12 w-full flex items-center justify-center bg-gray-100 rounded-md">
                              <p className="text-sm font-medium">Logo Alelo</p>
                            </div>
                            <h4 className="font-medium text-sm">Produtos Oferecidos:</h4>
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Alelo Refeição</li>
                              <li>• Alelo Alimentação</li>
                              <li>• Alelo Mobilidade</li>
                              <li>• Alelo Multibenefícios</li>
                              <li>• Alelo Natal</li>
                            </ul>
                            <p className="text-xs text-gray-500">
                              A Alelo é uma empresa do grupo Banco do Brasil e Bradesco, oferecendo soluções completas
                              de benefícios.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Swile</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="h-12 w-full flex items-center justify-center bg-gray-100 rounded-md">
                              <p className="text-sm font-medium">Logo Swile</p>
                            </div>
                            <h4 className="font-medium text-sm">Produtos Oferecidos:</h4>
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Swile Card (VR e VA integrados)</li>
                              <li>• Swile App (gestão de benefícios)</li>
                              <li>• Swile Mobilidade</li>
                              <li>• Swile Cultura</li>
                            </ul>
                            <p className="text-xs text-gray-500">
                              A Swile é uma empresa francesa que chegou recentemente ao Brasil, trazendo soluções
                              inovadoras e digitais para benefícios.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Flash</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="h-12 w-full flex items-center justify-center bg-gray-100 rounded-md">
                              <p className="text-sm font-medium">Logo Flash</p>
                            </div>
                            <h4 className="font-medium text-sm">Produtos Oferecidos:</h4>
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Flash Alimentação</li>
                              <li>• Flash Refeição</li>
                              <li>• Flash Mobilidade</li>
                              <li>• Flash Saúde</li>
                              <li>• Flash Educação</li>
                            </ul>
                            <p className="text-xs text-gray-500">
                              A Flash oferece uma plataforma flexível de benefícios, permitindo que os colaboradores
                              escolham como utilizar seus recursos.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Caju</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="h-12 w-full flex items-center justify-center bg-gray-100 rounded-md">
                              <p className="text-sm font-medium">Logo Caju</p>
                            </div>
                            <h4 className="font-medium text-sm">Produtos Oferecidos:</h4>
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Caju Benefícios (cartão único)</li>
                              <li>• Caju Alimentação</li>
                              <li>• Caju Refeição</li>
                              <li>• Caju Mobilidade</li>
                              <li>• Caju Saúde</li>
                            </ul>
                            <p className="text-xs text-gray-500">
                              A Caju é uma startup brasileira que oferece um cartão único para todos os benefícios, com
                              gestão via aplicativo.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">iFood Benefícios</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="h-12 w-full flex items-center justify-center bg-gray-100 rounded-md">
                              <p className="text-sm font-medium">Logo iFood Benefícios</p>
                            </div>
                            <h4 className="font-medium text-sm">Produtos Oferecidos:</h4>
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• iFood Card (VR e VA)</li>
                              <li>• iFood Refeição</li>
                              <li>• iFood Alimentação</li>
                              <li>• iFood Cultura</li>
                            </ul>
                            <p className="text-xs text-gray-500">
                              O iFood Benefícios é a solução da empresa de delivery para o mercado de benefícios
                              corporativos, com foco em alimentação.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Como Otimizar seus Benefícios</h3>
                      <p>Aproveite ao máximo os benefícios oferecidos pela sua empresa com estas dicas:</p>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Vale Refeição e Alimentação</h4>
                          <ul className="text-sm text-gray-500 space-y-2">
                            <li>• Verifique estabelecimentos com descontos especiais para seu cartão</li>
                            <li>• Utilize aplicativos das operadoras para acompanhar saldo e promoções</li>
                            <li>• Considere acumular o saldo para compras maiores em supermercados</li>
                            <li>• Verifique se sua empresa permite a portabilidade entre VR e VA</li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Plano de Saúde</h4>
                          <ul className="text-sm text-gray-500 space-y-2">
                            <li>• Conheça a rede credenciada do seu plano</li>
                            <li>• Utilize serviços de telemedicina quando disponíveis</li>
                            <li>• Verifique programas de prevenção oferecidos pela operadora</li>
                            <li>• Avalie se o plano atual é adequado para suas necessidades</li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Vale Transporte</h4>
                          <ul className="text-sm text-gray-500 space-y-2">
                            <li>• Calcule se vale a pena o desconto de 6% do salário</li>
                            <li>• Verifique integrações entre diferentes meios de transporte</li>
                            <li>• Considere alternativas como carona compartilhada ou home office</li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Benefícios Flexíveis</h4>
                          <ul className="text-sm text-gray-500 space-y-2">
                            <li>• Entenda as regras do programa de benefícios flexíveis da sua empresa</li>
                            <li>• Priorize benefícios com vantagens fiscais</li>
                            <li>• Reavalie suas escolhas periodicamente conforme mudanças de vida</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" asChild>
                        <Link href="/recursos/guia-beneficios">
                          Guia Completo de Benefícios
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <div className="flex items-center">
          <Image src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={32} height={32} className="h-8 w-auto mr-2" />
          <p className="text-xs text-gray-500">© 2025 The Pimentão Rouge Company. Todos os direitos reservados.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}
