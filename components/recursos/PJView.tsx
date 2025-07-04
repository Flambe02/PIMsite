import React, { useState, useRef } from "react";
import { Info } from "lucide-react";

// Composant autonome pour la vue PJ (Pessoa Jurídica - Freelancer/Sócio-Dirigente)
const PJView: React.FC = () => {
  // États principaux pour la vue PJ
  const [pjView, setPjView] = useState<'simplified' | 'complete'>('complete');
  const [pjSubProfile, setPjSubProfile] = useState<'freelancer' | 'dirigente'>('freelancer');
  const [selectedItem, setSelectedItem] = useState<string>('pro_labore');
  const explanationRef = useRef<HTMLDivElement>(null);

  // Handler pour sélectionner un item du tableau (affiche l'explication à droite)
  const handleItemClick = (itemKey: string) => {
    setSelectedItem(itemKey);
    if (explanationRef.current) {
      explanationRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Affichage direct de la vue détaillée selon le sous-profil sélectionné par défaut */}
      {pjSubProfile === "freelancer" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Colonne 1 : Toggle + PJ Receipts */}
          <div className="md:col-span-5 pl-0 md:pl-0">
            {/* Toggle Simplified/Complete */}
            <div className="flex justify-center items-center mb-4 gap-2">
              <button
                className={`px-4 py-2 rounded-l-full border border-emerald-400 font-semibold text-sm transition ${pjView === 'complete' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}
                onClick={() => setPjView('complete')}
              >
                Sócio-Dirigente
              </button>
              <button
                className={`px-4 py-2 rounded-r-full border border-emerald-400 font-semibold text-sm transition ${pjView === 'simplified' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}
                onClick={() => setPjView('simplified')}
              >
                Freelancer
              </button>
            </div>

            {/* Simplified View - Freelancer Invoice */}
            {pjView === 'simplified' && (
              <div className="relative p-6 bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 max-w-lg">
                {/* Badge */}
                <span className="absolute top-4 right-6 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Nota Fiscal Exemplo</span>
                {/* Invoice Header */}
                <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-bold mb-1 text-emerald-700">Dados do Prestador</div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-1">
                        <span>Nome:</span>
                        <span>Maria Oliveira</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>CNPJ:</span>
                        <span>23.456.789/0001-10</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold mb-1 text-emerald-700">Dados da Empresa Contratante</div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-1">
                        <span>Razão Social:</span>
                        <span>Cliente Exemplo Ltda.</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>CNPJ:</span>
                        <span>98.765.432/0001-55</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-3 border-b border-emerald-100"></div>
                {/* Invoice Items */}
                <div className="space-y-2 mb-4">
                  <button className={`w-full flex justify-between items-center px-3 py-3 rounded transition ${selectedItem === 'pj_valor_servicos' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => handleItemClick('pj_valor_servicos')}>
                    <span className="font-medium text-left">Valor dos Serviços Prestados</span>
                    <span className="font-mono font-bold">R$ 7.000,00</span>
                  </button>
                  <button className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'pj_irrf' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => handleItemClick('pj_irrf')}>
                    <span className="font-medium text-left">Imposto de Renda Retido na Fonte (IRRF)</span>
                    <span className="font-mono font-bold text-rose-700">-R$ 787,50</span>
                  </button>
                </div>
                {/* Totals Section */}
                <div className="flex justify-between items-center py-3 border-t border-emerald-200 font-bold text-emerald-900 text-lg mb-4">
                  <span>Valor Líquido Recebido</span>
                  <span className="font-mono">R$ 6.212,50</span>
                </div>
                {/* Tax Reminder Section */}
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <div className="font-semibold text-yellow-900 mb-2">Custos e Impostos da Empresa (PJ)</div>
                  <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'pj_simples_nacional' ? 'bg-yellow-100' : 'hover:bg-yellow-50'}`} onClick={() => handleItemClick('pj_simples_nacional')}>
                    <span className="font-medium text-left">Simples Nacional (DAS)</span>
                    <span className="font-mono font-bold">R$ 500,00</span>
                  </button>
                  <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'pj_plano_saude' ? 'bg-yellow-100' : 'hover:bg-yellow-50'}`} onClick={() => handleItemClick('pj_plano_saude')}>
                    <span className="font-medium text-left">Plano de Saúde Empresarial</span>
                    <span className="font-mono font-bold">R$ 600,00</span>
                  </button>
                </div>
              </div>
            )}

            {/* Complete View - Pró-labore Receipt */}
            {pjView === 'complete' && (
              <div className="space-y-6">
                {/* Recibo do Sócio */}
                <div className="bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 p-6">
                  <h2 className="text-xl font-bold text-emerald-900 mb-4">Recibo do Sócio</h2>
                  <div className="space-y-2 mb-4">
                    <button className={`w-full flex justify-between items-center px-3 py-3 rounded transition ${selectedItem === 'pro_labore' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => handleItemClick('pro_labore')}>
                      <span className="font-medium text-left">Pró-labore</span>
                      <span className="font-mono font-bold">R$ 1.520,00</span>
                    </button>
                    <button className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'inss_pro_labore' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => handleItemClick('inss_pro_labore')}>
                      <span className="font-medium text-left">INSS (11%)</span>
                      <span className="font-mono font-bold text-rose-700">-R$ 167,20</span>
                    </button>
                    <button className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'irrf_pro_labore' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => handleItemClick('irrf_pro_labore')}>
                      <span className="font-medium text-left">IRRF</span>
                      <span className="font-mono font-bold text-rose-700">-R$ 0,00</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-emerald-200 font-bold text-emerald-900 text-lg">
                    <span>Net a receber</span>
                    <span className="font-mono">R$ 1.352,80</span>
                  </div>
                </div>

                {/* Custo para a Empresa */}
                <div className="bg-blue-50 rounded-xl shadow-lg border border-blue-100 p-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-4">Custo para a Empresa (PJ)</h2>
                  <div className="space-y-2 mb-4">
                    <button className={`w-full flex justify-between items-center px-3 py-3 rounded transition ${selectedItem === 'pj_das' ? 'bg-blue-100' : 'hover:bg-blue-50'}`} onClick={() => handleItemClick('pj_das')}>
                      <span className="font-medium text-left">
                        Imposto do Simples Nacional (DAS)
                        <br />
                        <span className="text-xs italic text-muted-foreground">(calculado sobre o faturamento da empresa)</span>
                      </span>
                      <span className="font-mono font-bold">R$ 288,00</span>
                    </button>
                    <button className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'pj_plano_saude' ? 'bg-blue-100' : 'hover:bg-blue-50'}`} onClick={() => handleItemClick('pj_plano_saude')}>
                      <span className="font-medium text-left">Plano de Saúde Empresarial</span>
                      <span className="font-mono font-bold">R$ 600,00</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-blue-200 font-bold text-blue-900 text-lg">
                    <span>Custo Total para a Empresa</span>
                    <span className="font-mono">R$ 2.408,00</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Colonne 2 : Explication contextuelle PJ */}
          <div className="md:col-span-7 p-6 bg-white rounded-lg shadow-sm border h-full overflow-y-auto" ref={explanationRef}>
            <div className="mb-6">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-emerald-800 font-semibold text-base">
                <Info className="w-5 h-5 text-emerald-600" />
                <span>Clique em um item do recibo para ver a explicação detalhada.</span>
              </div>
            </div>
            
            {/* Freelancer explanations */}
            {selectedItem === 'pj_valor_servicos' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Valor dos Serviços Prestados</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Valor total dos serviços prestados ao cliente, antes de qualquer desconto ou retenção de impostos.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>É o valor bruto acordado no contrato</li>
                  <li>Pode incluir materiais, despesas e lucro</li>
                  <li>É a base para cálculo de impostos</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">No exemplo, R$ 7.000,00 representa o valor total dos serviços prestados no mês.</p>
              </div>
            )}
            {selectedItem === 'pj_irrf' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Imposto de Renda Retido na Fonte (IRRF)</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Imposto federal retido pelo cliente contratante sobre o valor dos serviços.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Alíquota de 11% sobre o valor dos serviços</li>
                  <li>É retido pelo cliente e repassado à Receita Federal</li>
                  <li>Pode ser compensado na declaração anual</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">Sobre R$ 7.000,00, o IRRF retido é de R$ 787,50 (11% de R$ 7.000,00).</p>
              </div>
            )}
            {selectedItem === 'pj_simples_nacional' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Simples Nacional (DAS)</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Documento de Arrecadação do Simples Nacional, guia unificada para pagamento de impostos.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Unifica ICMS, IPI, PIS, COFINS, IRPJ, CSLL e INSS</li>
                  <li>Alíquota varia conforme faturamento e atividade</li>
                  <li>Deve ser pago mensalmente</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">No exemplo, R$ 500,00 representa o DAS mensal baseado no faturamento.</p>
              </div>
            )}

            {/* Director explanations */}
            {selectedItem === 'pro_labore' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Pró-labore</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Remuneração paga aos sócios e dirigentes de empresas, equivalente ao salário de um funcionário CLT.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>É obrigatório para sócios que trabalham na empresa</li>
                  <li>Deve ser pelo menos o valor do salário mínimo</li>
                  <li>Gera obrigações de INSS e IRRF</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">No exemplo, o sócio recebe R$ 1.520,00 de pró-labore, que é o salário mínimo de 2024.</p>
              </div>
            )}
            {selectedItem === 'inss_pro_labore' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">INSS sobre Pró-labore</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Contribuição previdenciária pessoal obrigatória sobre o pró-labore, similar ao desconto de INSS do CLT.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Alíquota de 11% sobre o valor do pró-labore</li>
                  <li>É descontado diretamente do valor recebido</li>
                  <li>Garante direitos previdenciários futuros</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">Sobre R$ 1.520,00 de pró-labore, o INSS é de R$ 167,20 (11% de R$ 1.520,00).</p>
              </div>
            )}
            {selectedItem === 'irrf_pro_labore' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">IRRF sobre Pró-labore</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Imposto de Renda Retido na Fonte sobre o pró-labore, calculado conforme tabela progressiva.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Segue a mesma tabela do IRRF de funcionários CLT</li>
                  <li>Considera dependentes e outras deduções</li>
                  <li>Pode ser isento dependendo do valor</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">Com base de cálculo de R$ 1.352,80 (pró-labore - INSS), o IRRF seria isento por estar abaixo da faixa tributável.</p>
              </div>
            )}
            {selectedItem === 'pj_das' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Imposto do Simples Nacional (DAS)</h3>
                <div>
                  <h4 className="text-lg font-semibold mb-2">O que é?</h4>
                  <p className="text-muted-foreground">
                    É a guia de pagamento mensal que unifica os principais impostos da sua <strong>empresa (PJ)</strong>, calculada sobre o seu <strong>faturamento bruto</strong> (a soma de todas as suas Notas Fiscais emitidas no mês).
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Importante:</h4>
                  <p className="text-muted-foreground">
                    O valor do DAS <strong>não tem relação com o valor do seu Pró-labore</strong>. São duas coisas completamente separadas. O Pró-labore gera o seu INSS pessoal; o faturamento gera o DAS da empresa.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Exemplo Prático:</h4>
                  <p className="text-muted-foreground">
                    Se sua empresa faturou R$ 10.000,00 em um mês e sua alíquota do Simples é de 6%, o valor do seu DAS a pagar será de R$ 600,00, independentemente se o seu Pró-labore foi de R$ 1.520,00 ou R$ 5.000,00.
                  </p>
                </div>
              </div>
            )}
            {selectedItem === 'pj_plano_saude' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Plano de Saúde Empresarial</h3>
                <div>
                  <h4 className="text-lg font-semibold mb-2">O que é?</h4>
                  <p className="text-muted-foreground">
                    É um benefício de plano de saúde contratado através do seu CNPJ. É uma das maiores vantagens de ser PJ, pois os planos empresariais são geralmente mais baratos e completos que os planos para pessoa física.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>O contrato é feito entre a sua empresa (PJ) e a seguradora de saúde.</li>
                    <li>O pagamento mensal é uma <strong>despesa da sua empresa</strong>, e não uma dedução do valor que você recebe pelos seus serviços.</li>
                    <li>Você pode incluir dependentes (cônjuge, filhos) no plano.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sócio/Dirigente View */}
      {pjSubProfile === "dirigente" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Colonne 1 : Toggle + PJ Receipts */}
          <div className="md:col-span-5 pl-0 md:pl-0">
            {/* Toggle Simplified/Complete */}
            <div className="flex justify-center items-center mb-4 gap-2">
              <button
                className={`px-4 py-2 rounded-l-full border border-emerald-400 font-semibold text-sm transition ${pjView === 'complete' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}
                onClick={() => setPjView('complete')}
              >
                Sócio-Dirigente
              </button>
              <button
                className={`px-4 py-2 rounded-r-full border border-emerald-400 font-semibold text-sm transition ${pjView === 'simplified' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}
                onClick={() => setPjView('simplified')}
              >
                Freelancer
              </button>
            </div>

            {/* Simplified View - Freelancer Invoice */}
            {pjView === 'simplified' && (
              <div className="relative p-6 bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 max-w-lg">
                {/* Badge */}
                <span className="absolute top-4 right-6 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Nota Fiscal Exemplo</span>
                {/* Invoice Header */}
                <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-bold mb-1 text-emerald-700">Dados do Prestador</div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-1">
                        <span>Nome:</span>
                        <span>Maria Oliveira</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>CNPJ:</span>
                        <span>23.456.789/0001-10</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold mb-1 text-emerald-700">Dados da Empresa Contratante</div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-1">
                        <span>Razão Social:</span>
                        <span>Cliente Exemplo Ltda.</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>CNPJ:</span>
                        <span>98.765.432/0001-55</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-3 border-b border-emerald-100"></div>
                {/* Invoice Items */}
                <div className="space-y-2 mb-4">
                  <button className={`w-full flex justify-between items-center px-3 py-3 rounded transition ${selectedItem === 'pj_valor_servicos' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => handleItemClick('pj_valor_servicos')}>
                    <span className="font-medium text-left">Valor dos Serviços Prestados</span>
                    <span className="font-mono font-bold">R$ 7.000,00</span>
                  </button>
                  <button className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'pj_irrf' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => handleItemClick('pj_irrf')}>
                    <span className="font-medium text-left">Imposto de Renda Retido na Fonte (IRRF)</span>
                    <span className="font-mono font-bold text-rose-700">-R$ 787,50</span>
                  </button>
                </div>
                {/* Totals Section */}
                <div className="flex justify-between items-center py-3 border-t border-emerald-200 font-bold text-emerald-900 text-lg mb-4">
                  <span>Valor Líquido Recebido</span>
                  <span className="font-mono">R$ 6.212,50</span>
                </div>
                {/* Tax Reminder Section */}
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <div className="font-semibold text-yellow-900 mb-2">Custos e Impostos da Empresa (PJ)</div>
                  <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'pj_simples_nacional' ? 'bg-yellow-100' : 'hover:bg-yellow-50'}`} onClick={() => handleItemClick('pj_simples_nacional')}>
                    <span className="font-medium text-left">Simples Nacional (DAS)</span>
                    <span className="font-mono font-bold">R$ 500,00</span>
                  </button>
                  <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'pj_plano_saude' ? 'bg-yellow-100' : 'hover:bg-yellow-50'}`} onClick={() => handleItemClick('pj_plano_saude')}>
                    <span className="font-medium text-left">Plano de Saúde Empresarial</span>
                    <span className="font-mono font-bold">R$ 600,00</span>
                  </button>
                </div>
              </div>
            )}

            {/* Complete View - Pró-labore Receipt */}
            {pjView === 'complete' && (
              <div className="space-y-6">
                {/* Recibo do Sócio */}
                <div className="bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 p-6">
                  <h2 className="text-xl font-bold text-emerald-900 mb-4">Recibo do Sócio</h2>
                  <div className="space-y-2 mb-4">
                    <button className={`w-full flex justify-between items-center px-3 py-3 rounded transition ${selectedItem === 'pro_labore' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => handleItemClick('pro_labore')}>
                      <span className="font-medium text-left">Pró-labore</span>
                      <span className="font-mono font-bold">R$ 1.520,00</span>
                    </button>
                    <button className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'inss_pro_labore' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => handleItemClick('inss_pro_labore')}>
                      <span className="font-medium text-left">INSS (11%)</span>
                      <span className="font-mono font-bold text-rose-700">-R$ 167,20</span>
                    </button>
                    <button className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'irrf_pro_labore' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => handleItemClick('irrf_pro_labore')}>
                      <span className="font-medium text-left">IRRF</span>
                      <span className="font-mono font-bold text-rose-700">-R$ 0,00</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-emerald-200 font-bold text-emerald-900 text-lg">
                    <span>Net a receber</span>
                    <span className="font-mono">R$ 1.352,80</span>
                  </div>
                </div>

                {/* Custo para a Empresa */}
                <div className="bg-blue-50 rounded-xl shadow-lg border border-blue-100 p-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-4">Custo para a Empresa (PJ)</h2>
                  <div className="space-y-2 mb-4">
                    <button className={`w-full flex justify-between items-center px-3 py-3 rounded transition ${selectedItem === 'pj_das' ? 'bg-blue-100' : 'hover:bg-blue-50'}`} onClick={() => handleItemClick('pj_das')}>
                      <span className="font-medium text-left">
                        Imposto do Simples Nacional (DAS)
                        <br />
                        <span className="text-xs italic text-muted-foreground">(calculado sobre o faturamento da empresa)</span>
                      </span>
                      <span className="font-mono font-bold">R$ 288,00</span>
                    </button>
                    <button className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'pj_plano_saude' ? 'bg-blue-100' : 'hover:bg-blue-50'}`} onClick={() => handleItemClick('pj_plano_saude')}>
                      <span className="font-medium text-left">Plano de Saúde Empresarial</span>
                      <span className="font-mono font-bold">R$ 600,00</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-blue-200 font-bold text-blue-900 text-lg">
                    <span>Custo Total para a Empresa</span>
                    <span className="font-mono">R$ 2.408,00</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Colonne 2 : Explication contextuelle PJ */}
          <div className="md:col-span-7 p-6 bg-white rounded-lg shadow-sm border h-full overflow-y-auto" ref={explanationRef}>
            <div className="mb-6">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-emerald-800 font-semibold text-base">
                <Info className="w-5 h-5 text-emerald-600" />
                <span>Clique em um item do recibo para ver a explicação detalhada.</span>
              </div>
            </div>
            
            {/* Freelancer explanations */}
            {selectedItem === 'pj_valor_servicos' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Valor dos Serviços Prestados</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Valor total dos serviços prestados ao cliente, antes de qualquer desconto ou retenção de impostos.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>É o valor bruto acordado no contrato</li>
                  <li>Pode incluir materiais, despesas e lucro</li>
                  <li>É a base para cálculo de impostos</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">No exemplo, R$ 7.000,00 representa o valor total dos serviços prestados no mês.</p>
              </div>
            )}
            {selectedItem === 'pj_irrf' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Imposto de Renda Retido na Fonte (IRRF)</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Imposto federal retido pelo cliente contratante sobre o valor dos serviços.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Alíquota de 11% sobre o valor dos serviços</li>
                  <li>É retido pelo cliente e repassado à Receita Federal</li>
                  <li>Pode ser compensado na declaração anual</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">Sobre R$ 7.000,00, o IRRF retido é de R$ 787,50 (11% de R$ 7.000,00).</p>
              </div>
            )}
            {selectedItem === 'pj_simples_nacional' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Simples Nacional (DAS)</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Documento de Arrecadação do Simples Nacional, guia unificada para pagamento de impostos.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Unifica ICMS, IPI, PIS, COFINS, IRPJ, CSLL e INSS</li>
                  <li>Alíquota varia conforme faturamento e atividade</li>
                  <li>Deve ser pago mensalmente</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">No exemplo, R$ 500,00 representa o DAS mensal baseado no faturamento.</p>
              </div>
            )}

            {/* Director explanations */}
            {selectedItem === 'pro_labore' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Pró-labore</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Remuneração paga aos sócios e dirigentes de empresas, equivalente ao salário de um funcionário CLT.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>É obrigatório para sócios que trabalham na empresa</li>
                  <li>Deve ser pelo menos o valor do salário mínimo</li>
                  <li>Gera obrigações de INSS e IRRF</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">No exemplo, o sócio recebe R$ 1.520,00 de pró-labore, que é o salário mínimo de 2024.</p>
              </div>
            )}
            {selectedItem === 'inss_pro_labore' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">INSS sobre Pró-labore</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Contribuição previdenciária pessoal obrigatória sobre o pró-labore, similar ao desconto de INSS do CLT.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Alíquota de 11% sobre o valor do pró-labore</li>
                  <li>É descontado diretamente do valor recebido</li>
                  <li>Garante direitos previdenciários futuros</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">Sobre R$ 1.520,00 de pró-labore, o INSS é de R$ 167,20 (11% de R$ 1.520,00).</p>
              </div>
            )}
            {selectedItem === 'irrf_pro_labore' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">IRRF sobre Pró-labore</h3>
                <h4 className="font-semibold">O que é?</h4>
                <p className="text-muted-foreground">Imposto de Renda Retido na Fonte sobre o pró-labore, calculado conforme tabela progressiva.</p>
                <h4 className="font-semibold">Como funciona?</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Segue a mesma tabela do IRRF de funcionários CLT</li>
                  <li>Considera dependentes e outras deduções</li>
                  <li>Pode ser isento dependendo do valor</li>
                </ul>
                <h4 className="font-semibold">Exemplo Prático</h4>
                <p className="text-muted-foreground">Com base de cálculo de R$ 1.352,80 (pró-labore - INSS), o IRRF seria isento por estar abaixo da faixa tributável.</p>
              </div>
            )}
            {selectedItem === 'pj_das' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Imposto do Simples Nacional (DAS)</h3>
                <div>
                  <h4 className="text-lg font-semibold mb-2">O que é?</h4>
                  <p className="text-muted-foreground">
                    É a guia de pagamento mensal que unifica os principais impostos da sua <strong>empresa (PJ)</strong>, calculada sobre o seu <strong>faturamento bruto</strong> (a soma de todas as suas Notas Fiscais emitidas no mês).
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Importante:</h4>
                  <p className="text-muted-foreground">
                    O valor do DAS <strong>não tem relação com o valor do seu Pró-labore</strong>. São duas coisas completamente separadas. O Pró-labore gera o seu INSS pessoal; o faturamento gera o DAS da empresa.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Exemplo Prático:</h4>
                  <p className="text-muted-foreground">
                    Se sua empresa faturou R$ 10.000,00 em um mês e sua alíquota do Simples é de 6%, o valor do seu DAS a pagar será de R$ 600,00, independentemente se o seu Pró-labore foi de R$ 1.520,00 ou R$ 5.000,00.
                  </p>
                </div>
              </div>
            )}
            {selectedItem === 'pj_plano_saude' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Plano de Saúde Empresarial</h3>
                <div>
                  <h4 className="text-lg font-semibold mb-2">O que é?</h4>
                  <p className="text-muted-foreground">
                    É um benefício de plano de saúde contratado através do seu CNPJ. É uma das maiores vantagens de ser PJ, pois os planos empresariais são geralmente mais baratos e completos que os planos para pessoa física.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>O contrato é feito entre a sua empresa (PJ) e a seguradora de saúde.</li>
                    <li>O pagamento mensal é uma <strong>despesa da sua empresa</strong>, e não uma dedução do valor que você recebe pelos seus serviços.</li>
                    <li>Você pode incluir dependentes (cônjuge, filhos) no plano.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PJView; 