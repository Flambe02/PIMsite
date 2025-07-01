"use client"

import { Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function VirtualPayslip() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Payslip Card */}
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-blue-900">Recibo de Pagamento de Salário</CardTitle>
              <div className="text-sm text-gray-500">THE PIMENTAO ROUGE COMPANY LTDA</div>
              <div className="text-sm text-gray-500">CNPJ: 53.998.139/0001-32</div>
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
        <CardContent className="p-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4 border-b">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome do Colaborador</p>
                  <p className="font-medium">FLORENT LAMBERT</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Código</p>
                  <p className="font-medium">900000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Função</p>
                  <p className="font-medium">SOCIO ADM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CBO</p>
                  <p className="font-medium">2521-05</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Admissão</p>
                  <p className="font-medium">21/02/2024</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="font-medium">232.139.288-60</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CTPS</p>
                  <p className="font-medium">2321392 Série: 8860</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referente ao mês</p>
                  <p className="font-medium">Abril/2025</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">CÓDIGOS</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">DESCRIÇÕES</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">REFERÊNCIAS</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">PROVENTOS</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">DESCONTOS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm">01</td>
                    <td className="px-4 py-3 text-sm">Honorário pro-labore - Prop. ou sócio</td>
                    <td className="px-4 py-3 text-sm">35</td>
                    <td className="px-4 py-3 text-sm text-right">R$ 1.518,00</td>
                    <td className="px-4 py-3 text-sm text-right">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm">91006</td>
                    <td className="px-4 py-3 text-sm">INSS pro-labore</td>
                    <td className="px-4 py-3 text-sm">11,00%</td>
                    <td className="px-4 py-3 text-sm text-right">-</td>
                    <td className="px-4 py-3 text-sm text-right">R$ 166,98</td>
                  </tr>
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-4 py-3 text-sm" colSpan={3}>
                      Totais
                    </td>
                    <td className="px-4 py-3 text-sm text-right">R$ 1.518,00</td>
                    <td className="px-4 py-3 text-sm text-right">R$ 166,98</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                <span className="font-medium">SALÁRIO LÍQUIDO</span>
                <span className="font-bold text-lg">R$ 1.351,02</span>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Salário base</p>
                  <p className="text-sm font-medium">R$ 1.518,00</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Base INSS</p>
                  <p className="text-sm font-medium">R$ 1.518,00</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Base FGTS</p>
                  <p className="text-sm font-medium">R$ 0,00</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Valor FGTS</p>
                  <p className="text-sm font-medium">R$ 0,00</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Base IRRF</p>
                  <p className="text-sm font-medium">R$ 953,20</p>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Declaro ter recebido o valor líquido deste recibo.</p>
                <p className="mt-4">____/____/______ Assinatura do Colaborador: ________________________</p>
              </div>

              <div className="mt-6 text-right text-xs text-gray-400">
                <p>24/04/2025 17:02 - SCI Ambiente Contábil ÚNICO</p>
                <p>CONTMAIS ASSESSORIA CONTABIL</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations in Portuguese */}
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="bg-emerald-50 border-b">
          <CardTitle className="text-xl text-emerald-900">Recomendações de Otimização</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">1. Decomposição Atual da Folha</h3>
            <div className="space-y-2">
              <p className="font-medium">Salário Abril/2025</p>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-sm">Pro-labore (Bruto)</td>
                    <td className="px-4 py-2 text-sm text-right">R$ 1.518,00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-sm">– INSS (11%)</td>
                    <td className="px-4 py-2 text-sm text-right">R$ 166,98</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-sm">– IRRF</td>
                    <td className="px-4 py-2 text-sm text-right">R$ 0,00 (calculado sobre base de R$ 953,20)</td>
                  </tr>
                  <tr className="border-b font-medium">
                    <td className="px-4 py-2 text-sm">Salário líquido</td>
                    <td className="px-4 py-2 text-sm text-right">R$ 1.351,02</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-sm">FGTS (0%)</td>
                    <td className="px-4 py-2 text-sm text-right">R$ 0,00</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p>
                  <strong>Base IRRF</strong> = R$ 1.518,00 – R$ 166,98 = R$ 1.351,02 → após abatimento de dependentes
                  (nenhum neste caso) → aplicação da alíquota IRRF
                </p>
                <p className="mt-2">
                  <strong>Nota:</strong> Não há recolhimento de FGTS, pois pagamentos de pro-labore para sócios
                  geralmente não estão sujeitos a este recolhimento.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">2. Objetivo de Otimização</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reduzir contribuições sociais e fiscais</li>
              <li>Preservar ou aumentar sua renda líquida</li>
              <li>Beneficiar-se de vantagens (aposentadoria, seguridade social, benefícios não tributáveis)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">3. Estratégias de Otimização</h3>

            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">A. Ajustar a proporção &quot;pro-labore&quot; vs &quot;dividendos&quot;</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Pro-labore está sujeito a INSS (11%) e IRRF</li>
                  <li>Dividendos (lucros) são isentos de IR (e contribuições sociais)</li>
                </ul>
                <p className="text-sm mt-2">
                  <strong>Estratégia:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Fixar um pro-labore mínimo legal (ex: salário mínimo ou R$ 1.100,00) para manter seus direitos
                    sociais
                  </li>
                  <li>Distribuir o restante dos lucros como dividendos, não tributáveis</li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">B. Explorar deduções e benefícios fiscais</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>
                    Registrar dependentes (cônjuge, filhos) aumenta a dedução do IRRF (R$ 189,59/dependente em 2025)
                  </li>
                  <li>
                    Contratar um plano de previdência privada:
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Contribuições voluntárias podem ser deduzidas da base do IRRF (até 12% da sua renda bruta)
                      </li>
                    </ul>
                  </li>
                  <li>
                    Adicionar benefícios não tributáveis (vale-refeição, transporte, saúde):
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Para cada R$ 1 em benefícios, até certo limite, você reduz a parte tributável sem contribuições
                        adicionais
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">C. Ativar o FGTS para o pro-labore</h4>
                <p className="text-sm mt-2">Mesmo não sendo obrigatório para sócios, aderir ao FGTS (8%) permite:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Acumular um fundo de garantia (útil em caso de plano de aposentadoria antecipada ou rescisão
                    fictícia)
                  </li>
                  <li>Suavizar suas contribuições sociais a longo prazo</li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">D. Revisar seu valor de pro-labore</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Com R$ 1.518,00: você paga 11% de INSS sobre o total</li>
                  <li>Se aumentar para o teto (R$ 8.157,41), o INSS é limitado, mas desnecessário neste caso</li>
                  <li>
                    Reduzindo (ex: R$ 1.100,00), você diminui proporcionalmente INSS e IRRF, ajustando os dividendos
                    para manter o valor líquido global
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">4. Exemplo Numérico de Redistribuição</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium">Cenário</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Pro-labore</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">INSS (11%)</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Base IRRF</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">IRRF</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Dividendos</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Total Líquido</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-sm">Atual</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 1.518,00</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 166,98</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 1.351,02</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 0*</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 0</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 1.351,02</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-sm">Otimizado</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 1.100,00</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 121,00</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 979,00</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 0*</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 418,00</td>
                  <td className="px-4 py-2 text-sm text-right">R$ 1.397,00</td>
                </tr>
              </tbody>
            </table>

            <div className="p-3 bg-gray-50 rounded-lg text-sm mt-2">
              <p>* IRRF zero, pois a base IRRF está abaixo do limite de isenção (R$ 2.259,20)</p>
              <p className="mt-2">
                <strong>Ganho líquido mensal</strong> ≈ R$ 46 (∼3%)
              </p>
              <p>
                <strong>Ganho líquido anual</strong> (×12 + dividendo 13º) superior, sem encargos adicionais
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">5. Próximos Passos</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Definir legalmente um novo valor de pro-labore (via alteração de ata de assembleia)</li>
              <li>Implementar a distribuição de dividendos</li>
              <li>Contratar um plano de previdência e registrar seus dependentes para o IR</li>
              <li>Ativar ou não o FGTS para seguridade social</li>
            </ol>
            <p className="mt-2 text-sm">
              Aplicando esses ajustes, você maximiza sua renda líquida mantendo-se em conformidade com a legislação
              brasileira.
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Comparativo: Se fosse CLT ou PJ</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-800">Cenário CLT (Empregado formal)</h4>
                <p className="text-sm mt-1">Com o mesmo valor bruto de R$ 1.518,00 como CLT:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                  <li>INSS: R$ 113,85 (7,5% - alíquota menor que sócio)</li>
                  <li>FGTS: R$ 121,44 (8% - depositado pelo empregador)</li>
                  <li>Direito a férias remuneradas + 1/3</li>
                  <li>13º salário garantido</li>
                  <li>Proteções trabalhistas (aviso prévio, seguro-desemprego)</li>
                  <li>Salário líquido aproximado: R$ 1.404,15</li>
                </ul>
                <p className="text-sm mt-1">
                  <strong>Vantagem:</strong> Maior proteção social e trabalhista
                </p>
                <p className="text-sm">
                  <strong>Desvantagem:</strong> Menor flexibilidade fiscal e tributária
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-800">Cenário PJ (Pessoa Jurídica)</h4>
                <p className="text-sm mt-1">Como PJ recebendo R$ 1.518,00 por serviços:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                  <li>Tributação pelo Simples Nacional (4-16% dependendo da atividade)</li>
                  <li>Possibilidade de deduzir despesas operacionais</li>
                  <li>Contribuição previdenciária opcional (11% sobre o salário mínimo)</li>
                  <li>Sem FGTS, férias ou 13º obrigatórios</li>
                  <li>Valor líquido potencial: R$ 1.366,20 a R$ 1.457,28</li>
                </ul>
                <p className="text-sm mt-1">
                  <strong>Vantagem:</strong> Maior flexibilidade fiscal e possibilidade de deduzir despesas
                </p>
                <p className="text-sm">
                  <strong>Desvantagem:</strong> Menor proteção social, necessidade de gestão contábil
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-medium text-emerald-800">Recomendação</h4>
                <p className="text-sm mt-1">
                  Para este valor de remuneração (R$ 1.518,00), a estrutura atual de sócio com pro-labore otimizado +
                  dividendos oferece a melhor relação custo-benefício, especialmente se você:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                  <li>Reduzir o pro-labore para R$ 1.100,00</li>
                  <li>Complementar com R$ 418,00 em dividendos</li>
                  <li>Considerar um plano de previdência privada para proteção futura</li>
                </ul>
                <p className="text-sm mt-1">
                  Esta estrutura proporciona um ganho líquido de aproximadamente 3% mensal, mantendo direitos
                  previdenciários básicos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations in French */}
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-xl text-blue-900">Recommandations d&apos;Optimisation</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">1. Décomposition actuelle de la paie</h3>
            <div className="space-y-2">
              <p className="font-medium">Salaire Avril 2025</p>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-sm">Pro-labore (Brut)</td>
                    <td className="px-4 py-2 text-sm text-right">1 518,00 R$</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-sm">– INSS (11 %)</td>
                    <td className="px-4 py-2 text-sm text-right">166,98 R$</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-sm">– IRRF</td>
                    <td className="px-4 py-2 text-sm text-right">0,00 R$ (calculé sur une base de 953,20 R$)</td>
                  </tr>
                  <tr className="border-b font-medium">
                    <td className="px-4 py-2 text-sm">Salaire net</td>
                    <td className="px-4 py-2 text-sm text-right">1 351,02 R$</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-sm">FGTS (0 %)</td>
                    <td className="px-4 py-2 text-sm text-right">0,00 R$</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p>
                  <strong>Base IRRF</strong> = 1 518,00 R$ – 166,98 R$ = 1 351,02 R$ → puis abattement dépendants (ici
                  aucun) → taux IRRF appliqué
                </p>
                <p className="mt-2">
                  <strong>Note:</strong> Aucun versement FGTS, car les pro-labores de dirigeants n&apos;y sont pas toujours
                  soumis.
                </p>
              </div>
            </div>
          </div>

          <div>
                            <h3 className="text-lg font-bold text-blue-900 mb-2">2. Objectif d&apos;optimisation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Réduire les cotisations sociales et fiscales</li>
              <li>Préserver ou augmenter votre revenu net</li>
                              <li>Bénéficier d&apos;avantages (retraite, sécurité sociale, avantages non imposables)</li>
            </ul>
          </div>

          <div>
                            <h3 className="text-lg font-bold text-blue-900 mb-2">3. Pistes d&apos;optimisation</h3>

            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">A. Ajuster le mix « pro-labore » vs « dividendes »</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Pro-labore est soumis à INSS (11 %) et IRRF</li>
                  <li>Dividendes (bénéfice) sont exonérés d&apos;IR (et de cotisations sociales)</li>
                </ul>
                <p className="text-sm mt-2">
                  <strong>Stratégie:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Fixer un pro-labore minimum légal (par ex. salaire de base minimal ou 1 100 R$) pour conserver vos
                    droits sociaux.
                  </li>
                  <li>Distribuer le reste des bénéfices sous forme de dividendes, non imposables.</li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">B. Exploiter les abattements et avantages fiscaux</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>
                    Enregistrer des dépendants (conjoint, enfants) augmente l&apos;abattement IRRF (189,59 R$ / département
                    en 2025)
                  </li>
                  <li>
                    Souscrire à une prévoyance privée (Plano de Previdência):
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Les cotisations volontaires peuvent être déduites de la base IRRF (jusqu&apos;à 12 % de votre revenu
                        brut).
                      </li>
                    </ul>
                  </li>
                  <li>
                    Ajouter des avantages non imposables (ticket-restauration, transport, santé):
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Pour chaque 1 R$ valeur avantage, jusqu&apos;à un certain plafond, vous réduisez la part imposable
                        sans cotisations supplémentaires.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">C. Activer le FGTS pour le pro-labore</h4>
                <p className="text-sm mt-2">
                  Même si ce n&apos;est pas obligatoire pour les dirigeants, adhérer au FGTS (8 %) vous permet:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    D&apos;accumuler un fonds de garantie (utile en cas de plan de retraite anticipée ou de licenciement
                    fictif)
                  </li>
                  <li>De lisser vos cotisations sociales sur le long terme</li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">D. Réviser votre niveau de pro-labore</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>À 1 518,00 R$: vous payez 11 % INSS sur l&apos;intégralité</li>
                  <li>Si vous passez au plafond (8 157,41 R$), l&apos;INSS se plafonne, mais inutile ici</li>
                  <li>
                                          En l&apos;abaissant (ex. 1 100 R$), vous réduisez proportionnellement INSS et IRRF, tout en ajustant le
                    dividende pour conserver le net global.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">4. Exemple chiffré de redistribution</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium">Scénario</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Pro-labore</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">INSS (11 %)</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Base IRRF</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">IRRF</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Dividendes</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Net total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-sm">Actuel</td>
                  <td className="px-4 py-2 text-sm text-right">1 518,00 R$</td>
                  <td className="px-4 py-2 text-sm text-right">166,98 R$</td>
                  <td className="px-4 py-2 text-sm text-right">1 351,02 R$</td>
                  <td className="px-4 py-2 text-sm text-right">0 R$*</td>
                  <td className="px-4 py-2 text-sm text-right">0 R$</td>
                  <td className="px-4 py-2 text-sm text-right">1 351,02 R$</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-sm">Optimisé</td>
                  <td className="px-4 py-2 text-sm text-right">1 100,00 R$</td>
                  <td className="px-4 py-2 text-sm text-right">121,00 R$</td>
                  <td className="px-4 py-2 text-sm text-right">979,00 R$</td>
                  <td className="px-4 py-2 text-sm text-right">0 R$*</td>
                  <td className="px-4 py-2 text-sm text-right">418,00 R$</td>
                  <td className="px-4 py-2 text-sm text-right">1 397,00 R$</td>
                </tr>
              </tbody>
            </table>

            <div className="p-3 bg-gray-50 rounded-lg text-sm mt-2">
              <p>* IRRF nul ici, car base IRRF en-dessous du seuil d&apos;exonération (2 259,20 R$)</p>
              <p className="mt-2">
                <strong>Gain net mensuel</strong> ≈ 46 R$ (∼3 %)
              </p>
              <p>
                <strong>Gain net annuel</strong> (×12 + dividende 13ᵉ) supérieur, sans charges supplémentaires.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">5. Prochaines étapes</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Définir légalement un nouveau montant de pro-labore (via modification de procès-verbal d&apos;assemblée).
              </li>
              <li>Mettre en place la distribution des dividendes.</li>
                              <li>Souscrire à un plan de prévoyance et enregistrer vos dépendants pour l&apos;IR.</li>
              <li>Activer ou non le FGTS pour la sécurité sociale.</li>
            </ol>
            <p className="mt-2 text-sm">
              En appliquant ces ajustements, vous maximisez votre revenu net tout en restant en règle avec la
              législation brésilienne.
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Comparatif: Si vous étiez en CLT ou PJ</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-800">Scénario CLT (Salarié formel)</h4>
                <p className="text-sm mt-1">Avec le même montant brut de 1 518,00 R$ en CLT:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                  <li>INSS: 113,85 R$ (7,5% - taux inférieur à celui d&apos;un associé)</li>
                  <li>FGTS: 121,44 R$ (8% - versé par l&apos;employeur)</li>
                  <li>Droit aux congés payés + 1/3</li>
                  <li>13ème mois garanti</li>
                  <li>Protections du droit du travail (préavis, assurance chômage)</li>
                  <li>Salaire net approximatif: 1 404,15 R$</li>
                </ul>
                <p className="text-sm mt-1">
                  <strong>Avantage:</strong> Protection sociale et du travail plus élevée
                </p>
                <p className="text-sm">
                  <strong>Inconvénient:</strong> Moins de flexibilité fiscale et tributaire
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-800">Scénario PJ (Personne Juridique)</h4>
                <p className="text-sm mt-1">En tant que PJ recevant 1 518,00 R$ pour services:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                  <li>Imposition via Simples Nacional (4-16% selon l&apos;activité)</li>
                  <li>Possibilité de déduire les dépenses opérationnelles</li>
                  <li>Cotisation de sécurité sociale optionnelle (11% sur le salaire minimum)</li>
                  <li>Sans FGTS, congés ou 13ème mois obligatoires</li>
                  <li>Valeur nette potentielle: 1 366,20 R$ à 1 457,28 R$</li>
                </ul>
                <p className="text-sm mt-1">
                  <strong>Avantage:</strong> Plus grande flexibilité fiscale et possibilité de déduire les dépenses
                </p>
                <p className="text-sm">
                  <strong>Inconvénient:</strong> Protection sociale moindre, nécessité de gestion comptable
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-medium text-emerald-800">Recommandation</h4>
                <p className="text-sm mt-1">
                  Pour ce niveau de rémunération (1 518,00 R$), la structure actuelle d&apos;associé avec pro-labore optimisé
                  + dividendes offre le meilleur rapport coût-bénéfice, particulièrement si vous:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                  <li>Réduisez le pro-labore à 1 100,00 R$</li>
                  <li>Complétez avec 418,00 R$ en dividendes</li>
                  <li>Envisagez un plan de prévoyance privée pour une protection future</li>
                </ul>
                <p className="text-sm mt-1">
                  Cette structure procure un gain net d&apos;environ 3% mensuel, tout en maintenant des droits de sécurité
                  sociale de base.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
