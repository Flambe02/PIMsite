import React, { useState, useRef } from "react";

// Composant autonome pour la vue CLT (Carte de paiement, explications, interactions)
const CLTView: React.FC = () => {
  // États principaux pour la vue CLT
  const [viewMode, setViewMode] = useState<'simplified' | 'complete'>('simplified');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  // Handler pour sélectionner un item du tableau (affiche l'explication à droite)
  const handleItemClick = (itemKey: string) => {
    setSelectedItem(itemKey);
    if (explanationRef.current) {
      explanationRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // TODO: Ajouter le JSX détaillé ici (header, tableau, explications, etc.)
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Colonne 1 : Toggle + Holerite visuel interactif */}
      <div className="md:col-span-5 pl-0 md:pl-0">
        {/* Toggle Simplified/Complete */}
        <div className="flex justify-center items-center mb-4 gap-2">
          <button
            className={`px-4 py-2 rounded-l-full border border-emerald-400 font-semibold text-sm transition ${viewMode === 'simplified' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}
            onClick={() => setViewMode('simplified')}
          >
            Visão Simplificada
          </button>
          <button
            className={`px-4 py-2 rounded-r-full border border-emerald-400 font-semibold text-sm transition ${viewMode === 'complete' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}
            onClick={() => setViewMode('complete')}
          >
            Visão Completa
          </button>
        </div>
        {/* Payslip Conditional Rendering */}
        {viewMode === 'simplified' && (
          <div className="relative p-6 bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 max-w-lg">
            <span className="absolute top-4 right-6 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Holerite Exemplo</span>
            {/* Payslip Header */}
            <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <button className="font-bold mb-1 text-left text-emerald-700 underline" onClick={() => handleItemClick('dados_funcionario')}>Dados do Funcionário</button>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1">
                    <span>Nome Completo:</span>
                    <span>João da Silva</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>CPF:</span>
                    <span>123.456.789-00</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Cargo:</span>
                    <span>Analista de RH</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Data de Admissão:</span>
                    <span>01/02/2020</span>
                  </div>
                </div>
              </div>
              <div>
                <button className="font-bold mb-1 text-left text-emerald-700 underline" onClick={() => handleItemClick('dados_empresa')}>Dados da Empresa</button>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1">
                    <span>Razão Social:</span>
                    <span>Empresa Exemplo S.A.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>CNPJ:</span>
                    <span>12.345.678/0001-99</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-3 border-b border-emerald-100"></div>
            {/* Payslip Table */}
            <div>
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 font-bold text-xs border-b pb-2 mb-2 text-emerald-800">
                <div className="font-mono">Cód.</div>
                <div>Descrição</div>
                <div>Ref.</div>
                <div className="text-right">Vencimentos</div>
                <div className="text-right">Descontos</div>
              </div>
              {/* Vencimentos */}
              {[
                { code: '001', key: 'salario_base', label: 'Salário Base', ref: '30,00', val: '5.000,00' },
                { code: '005', key: 'horas_extras', label: 'Horas Extras', ref: '10,00', val: '250,00' },
                { code: '010', key: 'adicional_noturno', label: 'Adicional Noturno', ref: '5,00', val: '100,00' },
                { code: '020', key: 'ferias', label: 'Férias', ref: '2,50', val: '416,67' },
                { code: '021', key: 'decimo_terceiro', label: '13º Salário', ref: '2,50', val: '416,67' },
                { code: '022', key: 'comissoes', label: 'Comissões', ref: '---', val: '300,00' },
              ].map((item, idx) => (
                <div key={item.key} className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 items-center text-xs border-b py-1 ${idx % 2 === 1 ? 'bg-emerald-100/40' : ''}`}>
                  <div className="font-mono text-gray-500">{item.code}</div>
                  <button className="text-left underline text-emerald-700 col-span-1 flex items-center gap-1 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick(item.key)}>{item.label}</button>
                  <div className="font-mono text-gray-500">{item.ref}</div>
                  <div className="font-mono text-emerald-700 font-medium text-right">{item.val}</div>
                  <div></div>
                </div>
              ))}
              {/* Descontos */}
              {[
                { code: '301', key: 'inss', label: 'INSS', ref: '9,00%', val: '450,00' },
                { code: '302', key: 'irrf', label: 'IRRF', ref: '7,50%', val: '150,00' },
                { code: '401', key: 'vale_transporte', label: 'Vale-Transporte', ref: '6,00%', val: '300,00' },
                { code: '402', key: 'vale_refeicao', label: 'Vale-Refeição/Alimentação', ref: '---', val: '200,00' },
                { code: '403', key: 'adiantamentos', label: 'Adiantamentos', ref: '---', val: '100,00' },
                { code: '501', key: 'faltas_atrasos', label: 'Faltas/Atrasos', ref: '2,00', val: '100,00' },
              ].map((item, idx) => (
                <div key={item.key} className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 items-center text-xs border-b py-1 ${idx % 2 === 1 ? 'bg-rose-50/40' : ''}`}>
                  <div className="font-mono text-gray-500">{item.code}</div>
                  <button className="text-left underline text-rose-700 col-span-1 flex items-center gap-1 hover:bg-rose-100/60 rounded px-1 transition" onClick={() => handleItemClick(item.key)}>{item.label}</button>
                  <div className="font-mono text-gray-500">{item.ref}</div>
                  <div></div>
                  <div className="font-mono text-rose-700 font-medium text-right">{item.val}</div>
                </div>
              ))}
            </div>
            {/* Payslip Footer */}
            <div className="mt-4 text-xs">
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <button className="text-left underline text-emerald-700 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick('base_inss')}>Base Cálc. INSS</button>
                <span className="font-mono">R$ 5.350,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <button className="text-left underline text-emerald-700 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick('base_fgts')}>Base Cálc. FGTS</button>
                <span className="font-mono">R$ 5.350,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <button className="text-left underline text-emerald-700 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick('fgts_mes')}>FGTS do Mês</button>
                <span className="font-mono">R$ 428,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <button className="text-left underline text-emerald-700 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick('base_irrf')}>Base Cálc. IRRF</button>
                <span className="font-mono">R$ 4.900,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <span>Total de Vencimentos</span>
                <span className="font-mono">R$ 5.350,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-rose-700">
                <span>Total de Descontos</span>
                <span className="font-mono">R$ 1.000,00</span>
              </div>
              <div className="flex justify-between items-center py-2 mt-2 border-t font-bold text-emerald-900 text-lg">
                <span>Valor Líquido</span>
                <span className="font-mono">R$ 4.350,00</span>
              </div>
            </div>
          </div>
        )}
        {viewMode === 'complete' && (
          <div className="relative p-6 bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 max-w-lg">
            {/* Badge */}
            <span className="absolute top-4 right-6 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Holerite Completo</span>
            {/* Payslip Header - plus détaillé */}
            <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <button className="font-bold mb-1 text-left text-emerald-700 underline" onClick={() => handleItemClick('dados_funcionario')}>Dados do Funcionário</button>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1">
                    <span>Nome Completo:</span>
                    <span>João da Silva</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>CPF:</span>
                    <span>123.456.789-00</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>PIS:</span>
                    <span>123.45678.90-1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Endereço:</span>
                    <span>Rua Exemplo, 123</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Cargo:</span>
                    <span>Analista de RH</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Data de Admissão:</span>
                    <span>01/02/2020</span>
                  </div>
                </div>
              </div>
              <div>
                <button className="font-bold mb-1 text-left text-emerald-700 underline" onClick={() => handleItemClick('dados_empresa')}>Dados da Empresa</button>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1">
                    <span>Razão Social:</span>
                    <span>Empresa Exemplo S.A.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>CNPJ:</span>
                    <span>12.345.678/0001-99</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Endereço:</span>
                    <span>Av. Central, 456</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-3 border-b border-emerald-100"></div>
            {/* Payslip Table - Vencimentos */}
            <div>
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 font-bold text-xs border-b pb-2 mb-2 text-emerald-800">
                <div className="font-mono">Cód.</div>
                <div>Descrição</div>
                <div>Ref.</div>
                <div className="text-right">Vencimentos</div>
                <div className="text-right">Descontos</div>
              </div>
              {/* Vencimentos - plus complet */}
              {[
                { code: '001', key: 'salario_base', label: 'Salário Base', ref: '30,00', val: '5.000,00' },
                { code: '005', key: 'horas_extras', label: 'Horas Extras', ref: '10,00', val: '250,00' },
                { code: '010', key: 'adicional_noturno', label: 'Adicional Noturno', ref: '5,00', val: '100,00' },
                { code: '012', key: 'adicional_periculosidade', label: 'Adicional de Periculosidade', ref: '---', val: '200,00' },
                { code: '020', key: 'ferias', label: 'Férias', ref: '2,50', val: '416,67' },
                { code: '021', key: 'decimo_terceiro', label: '13º Salário', ref: '2,50', val: '416,67' },
                { code: '023', key: 'ferias_terco', label: 'Férias (com 1/3)', ref: '---', val: '138,89' },
                { code: '022', key: 'comissoes', label: 'Comissões', ref: '---', val: '300,00' },
              ].map((item, idx) => (
                <div key={item.key} className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 items-center text-xs border-b py-1 ${idx % 2 === 1 ? 'bg-emerald-100/40' : ''}`}>
                  <div className="font-mono text-gray-500">{item.code}</div>
                  <button className="text-left underline text-emerald-700 col-span-1 flex items-center gap-1 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick(item.key)}>{item.label}</button>
                  <div className="font-mono text-gray-500">{item.ref}</div>
                  <div className="font-mono text-emerald-700 font-medium text-right">{item.val}</div>
                  <div></div>
                </div>
              ))}
              {/* Descontos - plus complet */}
              {[
                { code: '301', key: 'inss', label: 'INSS', ref: '9,00%', val: '450,00' },
                { code: '302', key: 'irrf', label: 'IRRF', ref: '7,50%', val: '150,00' },
                { code: '401', key: 'vale_transporte', label: 'Vale-Transporte', ref: '6,00%', val: '300,00' },
                { code: '402', key: 'vale_refeicao', label: 'Vale-Refeição/Alimentação', ref: '---', val: '200,00' },
                { code: '403', key: 'adiantamentos', label: 'Adiantamentos', ref: '---', val: '100,00' },
                { code: '404', key: 'plano_saude', label: 'Plano de Saúde', ref: '---', val: '250,00' },
                { code: '405', key: 'pensao_alimenticia', label: 'Pensão Alimentícia', ref: '---', val: '300,00' },
                { code: '406', key: 'contribuicao_sindical', label: 'Contribuição Sindical', ref: '---', val: '50,00' },
                { code: '501', key: 'faltas_atrasos', label: 'Faltas/Atrasos', ref: '2,00', val: '100,00' },
              ].map((item, idx) => (
                <div key={item.key} className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 items-center text-xs border-b py-1 ${idx % 2 === 1 ? 'bg-rose-50/40' : ''}`}>
                  <div className="font-mono text-gray-500">{item.code}</div>
                  <button className="text-left underline text-rose-700 col-span-1 flex items-center gap-1 hover:bg-rose-100/60 rounded px-1 transition" onClick={() => handleItemClick(item.key)}>{item.label}</button>
                  <div className="font-mono text-gray-500">{item.ref}</div>
                  <div></div>
                  <div className="font-mono text-rose-700 font-medium text-right">{item.val}</div>
                </div>
              ))}
            </div>
            {/* Payslip Footer */}
            <div className="mt-4 text-xs">
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <button className="text-left underline text-emerald-700 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick('base_inss')}>Base Cálc. INSS</button>
                <span className="font-mono">R$ 5.350,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <button className="text-left underline text-emerald-700 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick('base_fgts')}>Base Cálc. FGTS</button>
                <span className="font-mono">R$ 5.350,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <button className="text-left underline text-emerald-700 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick('fgts_mes')}>FGTS do Mês</button>
                <span className="font-mono">R$ 428,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <button className="text-left underline text-emerald-700 hover:bg-emerald-100/60 rounded px-1 transition" onClick={() => handleItemClick('base_irrf')}>Base Cálc. IRRF</button>
                <span className="font-mono">R$ 4.900,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-emerald-800">
                <span>Total de Vencimentos</span>
                <span className="font-mono">R$ 5.350,00</span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-rose-700">
                <span>Total de Descontos</span>
                <span className="font-mono">R$ 1.000,00</span>
              </div>
              <div className="flex justify-between items-center py-2 mt-2 border-t font-bold text-emerald-900 text-lg">
                <span>Valor Líquido</span>
                <span className="font-mono">R$ 4.350,00</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Colonne 2 : Explication contextuelle */}
      <div className="md:col-span-7 p-6 bg-white rounded-lg shadow-sm border h-full overflow-y-auto" ref={explanationRef}>
        <div className="mb-4 text-sm text-muted-foreground">Clique em um item do extrato para ver a explicação detalhada.</div>
        {selectedItem === 'salario_base' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Salário Base</h3>
            <div>
              <h4 className="text-lg font-semibold mb-2">O que é?</h4>
              <p className="text-muted-foreground">
                É o valor registrado em carteira (CTPS) que serve de referência para o cálculo de todos os direitos trabalhistas, como férias, 13º salário, FGTS e INSS. O salário base não inclui adicionais, comissões ou benefícios.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
              <p className="text-muted-foreground">
                O salário base é definido no contrato de trabalho e deve respeitar o piso da categoria profissional, nunca podendo ser inferior ao salário mínimo nacional (R$ 1.518,00 em 2025). Pode variar conforme acordos coletivos, região e função.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Exemplo Prático</h4>
              <p className="text-muted-foreground">
                Se o salário base do seu cargo é R$ 2.500,00, esse será o valor utilizado para calcular férias, 13º salário e descontos obrigatórios, independentemente de adicionais ou bônus recebidos.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-2">
              <h4 className="text-lg font-semibold mb-1 text-blue-900">Consulta Salarial</h4>
              <p className="text-muted-foreground text-sm">
                Quer saber o piso salarial, média e teto do seu cargo? Consulte a
                <a href="https://www.salario.com.br/tabela-salarial/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700 ml-1">Tabela Salarial do Mercado Brasileiro</a>.
              </p>
            </div>
          </div>
        )}
        {selectedItem === 'horas_extras' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Horas Extras</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Remuneração pelas horas trabalhadas além da sua jornada normal de trabalho.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Horas extras em dias úteis são pagas com um adicional de no mínimo 50%.</li>
              <li>Horas extras em domingos e feriados são pagas com um adicional de 100%.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se você trabalhou 10 horas extras em um mês, cada uma será paga com o adicional correspondente.</p>
          </div>
        )}
        {selectedItem === 'adicional_noturno' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Adicional Noturno</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Valor extra pago para trabalho realizado entre 22h e 5h.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>O adicional é de, no mínimo, 20% sobre a hora diurna.</li>
              <li>O cálculo pode variar conforme convenção coletiva.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se você trabalhou 5 horas noturnas, receberá 20% a mais por cada uma.</p>
          </div>
        )}
        {selectedItem === 'ferias' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Férias</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Período anual de descanso remunerado garantido por lei.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Após 12 meses de trabalho, você tem direito a 30 dias de férias.</li>
              <li>Recebe 1/3 a mais do salário durante as férias.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se seu salário é R$ 3.000,00, nas férias você recebe R$ 4.000,00 (salário + 1/3).</p>
          </div>
        )}
        {selectedItem === 'decimo_terceiro' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">13º Salário</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Pagamento extra anual equivalente a um salário, proporcional ao tempo trabalhado.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Pago em duas parcelas, normalmente em novembro e dezembro.</li>
              <li>Proporcional se você trabalhou menos de 12 meses.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se trabalhou o ano todo e seu salário é R$ 3.000,00, recebe mais R$ 3.000,00 de 13º.</p>
          </div>
        )}
        {selectedItem === 'comissoes' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Comissões</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Valores variáveis pagos conforme desempenho, vendas ou metas atingidas.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Podem ser fixas ou percentuais sobre vendas.</li>
              <li>Devem constar no holerite e influenciam FGTS, INSS e férias.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se você vendeu R$ 10.000,00 e sua comissão é 3%, recebe R$ 300,00.</p>
          </div>
        )}
        {selectedItem === 'inss' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">INSS (Instituto Nacional do Seguro Social)</h3>
            <div>
              <h4 className="text-lg font-semibold mb-2">O que é?</h4>
              <p className="text-muted-foreground">
                É a sua contribuição obrigatória para a Previdência Social, que garante seus direitos futuros como aposentadoria e auxílios em caso de necessidade.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>O valor é descontado diretamente do seu salário bruto.</li>
                <li>A alíquota (porcentagem) do desconto é progressiva, ou seja, quem ganha mais, contribui com um percentual maior, seguindo uma tabela oficial.</li>
                <li>Esta contribuição garante acesso a benefícios como aposentadoria, auxílio-doença, salário-maternidade e pensão por morte.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Exemplo Prático:</h4>
              <p className="text-muted-foreground">
                Para um salário de R$ 5.000,00, a contribuição do INSS seria calculada aplicando as faixas da tabela, resultando em um desconto aproximado de R$ 450,00.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Tabela Progressiva (2024):</h4>
              <div className="text-sm border rounded-md p-2 bg-slate-50">
                <div className="grid grid-cols-2 gap-2 font-medium border-b pb-2 mb-2">
                  <span>Faixa Salarial</span><span className="text-right">Alíquota</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span>Até R$ 1.412,00</span><span className="text-right">7,5%</span>
                  <span>De R$ 1.412,01 a R$ 2.666,68</span><span className="text-right">9%</span>
                  <span>De R$ 2.666,69 a R$ 4.000,03</span><span className="text-right">12%</span>
                  <span>De R$ 4.000,04 a R$ 7.786,02</span><span className="text-right">14%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedItem === 'irrf' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">IRRF (Imposto de Renda Retido na Fonte)</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Imposto federal descontado diretamente na fonte sobre o seu rendimento.</p>
            <h4 className="font-semibold">Exemplo de Tabela Progressiva:</h4>
            <div className="text-sm border rounded-md p-2 bg-slate-50">
              <div className="grid grid-cols-2 gap-2 font-medium border-b pb-2 mb-2">
                <span>Base de Cálculo</span><span className="text-right">Alíquota</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span>Até R$ 2.259,20</span><span className="text-right">Isento</span>
                <span>De R$ 2.259,21 a R$ 2.826,65</span><span className="text-right">7,5%</span>
                <span>De R$ 2.826,66 a R$ 3.751,05</span><span className="text-right">15%</span>
                <span>De R$ 3.751,06 a R$ 4.664,68</span><span className="text-right">22,5%</span>
                <span>Acima de R$ 4.664,68</span><span className="text-right">27,5%</span>
              </div>
            </div>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se sua base de cálculo é R$ 3.000,00, a alíquota será de 15%.</p>
          </div>
        )}
        {selectedItem === 'vale_transporte' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Vale-Transporte</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Benefício obrigatório para custear o deslocamento do trabalhador até o local de trabalho.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Desconto de até 6% do salário base.</li>
              <li>O empregador pode complementar o valor se o custo for maior.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se seu salário é R$ 3.000,00, o desconto máximo será de R$ 180,00.</p>
          </div>
        )}
        {selectedItem === 'vale_refeicao' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Vale-Refeição/Alimentação</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Benefício que auxilia na alimentação do trabalhador.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Pode ser descontado parcialmente do salário, conforme política da empresa.</li>
              <li>Não é obrigatório por lei, mas é comum em muitas empresas.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se o desconto mensal é de R$ 50,00, esse valor aparecerá no seu holerite.</p>
          </div>
        )}
        {selectedItem === 'adiantamentos' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Adiantamentos</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Valores pagos antecipadamente ao empregado, descontados do salário do mês.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Normalmente corresponde a 40% do salário, pago até o dia 20.</li>
              <li>O valor é descontado do pagamento final do mês.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se você recebe um adiantamento de R$ 1.200,00, esse valor será descontado do salário do mês.</p>
          </div>
        )}
        {selectedItem === 'faltas_atrasos' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Faltas/Atrasos</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Descontos aplicados por ausências ou atrasos não justificados.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>O desconto é proporcional ao tempo não trabalhado.</li>
              <li>Faltas justificadas (atestado, etc.) não geram desconto.</li>
            </ul>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se você faltou 2 dias sem justificativa, o desconto será proporcional a esses dias.</p>
          </div>
        )}
        {selectedItem === 'base_inss' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Base de Cálculo do INSS</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">É o valor total considerado para calcular o desconto do INSS.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <p className="text-muted-foreground">Inclui salário base, adicionais e comissões, excluindo descontos legais.</p>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se seu salário base é R$ 3.000,00 e você recebeu R$ 200,00 de adicional, a base será R$ 3.200,00.</p>
          </div>
        )}
        {selectedItem === 'base_fgts' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Base de Cálculo do FGTS</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Valor sobre o qual é calculado o depósito do FGTS.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <p className="text-muted-foreground">Inclui salário, adicionais, comissões e horas extras.</p>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se sua remuneração total foi R$ 3.500,00, o FGTS será 8% desse valor.</p>
          </div>
        )}
        {selectedItem === 'fgts_mes' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">FGTS do Mês</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Valor depositado pelo empregador na conta vinculada do trabalhador.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <p className="text-muted-foreground">Corresponde a 8% da remuneração bruta mensal.</p>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se seu salário bruto é R$ 3.000,00, o FGTS do mês será R$ 240,00.</p>
          </div>
        )}
        {selectedItem === 'base_irrf' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Base de Cálculo do IRRF</h3>
            <h4 className="font-semibold">O que é?</h4>
            <p className="text-muted-foreground">Valor total considerado para calcular o desconto do IRRF.</p>
            <h4 className="font-semibold">Como funciona?</h4>
            <p className="text-muted-foreground">Inclui salário, adicionais, descontos legais e dependentes.</p>
            <h4 className="font-semibold">Exemplo Prático</h4>
            <p className="text-muted-foreground">Se sua base de cálculo é R$ 3.000,00, a alíquota será de 15%.</p>
          </div>
        )}
        {selectedItem === 'dados_funcionario' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Dados do Funcionário</h3>
            <div>
              <h4 className="text-lg font-semibold mb-2">O que são?</h4>
              <p className="text-muted-foreground">
                Esta seção contém suas informações de identificação pessoal e profissional na empresa. Elas são essenciais para garantir que os pagamentos e as obrigações legais estejam corretos.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Detalhamento dos Campos</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Nome Completo, CPF, Endereço:</strong> Seus dados de identificação civil e fiscal.</li>
                <li><strong>Cargo e Data de Admissão:</strong> Definem sua função, responsabilidades e tempo de casa, impactando cálculos de férias e outros direitos.</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold mb-2 text-blue-900">PIS (Programa de Integração Social)</h4>
              <p className="text-muted-foreground mb-3">
                É um número de cadastro essencial para o trabalhador, usado para o recebimento de benefícios como o Abono Salarial e o seguro-desemprego.
              </p>
              <h5 className="font-semibold mb-2">Não sabe seu número do PIS? Onde encontrar:</h5>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Na sua <strong>Carteira de Trabalho Digital</strong> (aplicativo).</li>
                <li>No site ou aplicativo <strong>Meu INSS</strong>.</li>
                <li>No aplicativo <strong>Caixa Trabalhador</strong>.</li>
                <li><a href="https://www.caixa.gov.br/atendimento/paginas/default.aspx" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">No Atendimento ao Cidadão da Caixa</a> ou pelo telefone 0800 726 0207.</li>
              </ul>
            </div>
          </div>
        )}
        {selectedItem === 'dados_empresa' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Dados da Empresa</h3>
            <div>
              <h4 className="text-lg font-semibold mb-2">O que são?</h4>
              <p className="text-muted-foreground">
                São as informações cadastrais e fiscais da empresa onde você trabalha. Elas garantem a legalidade do vínculo empregatício e são essenciais para o correto recolhimento de impostos e benefícios.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Detalhamento dos Campos</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Razão Social:</strong> Nome oficial da empresa, registrado nos órgãos competentes.</li>
                <li><strong>CNPJ:</strong> Cadastro Nacional da Pessoa Jurídica, identifica a empresa perante a Receita Federal e outros órgãos.</li>
                <li><strong>Endereço:</strong> Localização física da empresa, importante para questões fiscais e trabalhistas.</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold mb-2 text-blue-900">CNPJ (Cadastro Nacional da Pessoa Jurídica)</h4>
              <p className="text-muted-foreground mb-3">
                O CNPJ é o número que identifica a empresa junto à Receita Federal. Ele é fundamental para garantir que a empresa está regularizada e para a emissão de notas fiscais, recolhimento de impostos e acesso a benefícios.
              </p>
              <h5 className="font-semibold mb-2">Onde consultar o CNPJ da empresa?</h5>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>No <a href="https://www.gov.br/receitafederal/pt-br" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">site da Receita Federal</a> (consulta pública).</li>
                <li>Em documentos oficiais da empresa, como holerite, contrato de trabalho ou nota fiscal.</li>
                <li>Solicitando ao setor de RH ou departamento pessoal da empresa.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CLTView; 