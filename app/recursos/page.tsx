"use client";

import { useState, useRef } from "react";
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/logo"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function ResourcesPage() {
  const [selectedProfile, setSelectedProfile] = useState<string>("geral");
  const [tab, setTab] = useState("pagamento");
  const [selectedItem, setSelectedItem] = useState<string>('salario_base');
  const [viewMode, setViewMode] = useState<'simplified' | 'complete'>('simplified');
  const [selectedItemPJ, setSelectedItemPJ] = useState<string>('contrato');
  const explanationRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (itemKey: string) => {
    setSelectedItem(itemKey);
    if (explanationRef.current) {
      explanationRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-4">Recursos</h1>
              <p className="text-gray-500 mb-6">
                Bem-vindo ao seu hub de aprendizado personalizado! Selecione seu tipo de contrato para ver conteúdos feitos para você.
              </p>
              {/* Profile Selector */}
              <div className="flex gap-4 mb-8">
                <Button
                  variant={selectedProfile === "geral" ? "default" : "outline"}
                  className="flex-1 py-6 text-lg"
                  onClick={() => setSelectedProfile("geral")}
                >
                  Geral
                </Button>
                <Button
                  variant={selectedProfile === "CLT" ? "default" : "outline"}
                  className="flex-1 py-6 text-lg"
                  onClick={() => { setSelectedProfile("CLT"); setSelectedItem("salario_base"); }}
                >
                  CLT
                </Button>
                <Button
                  variant={selectedProfile === "PJ" ? "default" : "outline"}
                  className="flex-1 py-6 text-lg"
                  onClick={() => { setSelectedProfile("PJ"); setSelectedItem("pj_contrato"); }}
                >
                  PJ
                </Button>
                <Button
                  variant={selectedProfile === "Estagiário" ? "default" : "outline"}
                  className="flex-1 py-6 text-lg"
                  onClick={() => { setSelectedProfile("Estagiário"); setSelectedItem("estagio_bolsa"); }}
                >
                  Estagiário
                </Button>
              </div>
              {/* Content Hub Tabs */}
              {selectedProfile && (
                <section className="mt-8 p-6 bg-emerald-50 rounded-lg shadow">
                  <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="pagamento">Pagamento & Deduções</TabsTrigger>
                      <TabsTrigger value="beneficios">Guia de Benefícios</TabsTrigger>
                      <TabsTrigger value="direitos">Direitos e Deveres</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pagamento">
                      {selectedProfile === "geral" && (
                        <div>
                          <h3 className="text-xl font-bold mb-2">Entendendo a Remuneração</h3>
                          <p className="text-gray-700">Conteúdo geral sobre salário bruto, líquido e as deduções mais comuns no Brasil...</p>
                        </div>
                      )}
                      {selectedProfile === "CLT" && (
                        <>
                          {/* PAGAMENTO & DEDUÇÕES */}
                          {tab == "pagamento" && (
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
                                    {/* Badge */}
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
                              <div className="md:col-span-7 p-6 bg-white rounded-lg shadow-sm border h-full overflow-y-auto">
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
                          )}
                        </>
                      )}
                      {selectedProfile === "PJ" && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                          {/* Colonne 1 : Extrato de Pagamento PJ */}
                          <div className="md:col-span-5 pl-0 md:pl-0">
                            {/* Extrato de Pagamento PJ */}
                            <div className="bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 p-6 max-w-lg mx-auto">
                              {/* Header */}
                              <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <div className="font-bold mb-1 text-emerald-700">Dados do Prestador</div>
                                  <div className="flex flex-col gap-1 mt-1">
                                    <div className="flex items-center gap-1"><span>Nome:</span><span>Maria Oliveira</span></div>
                                    <div className="flex items-center gap-1"><span>CNPJ:</span><span>23.456.789/0001-10</span></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold mb-1 text-emerald-700">Dados da Empresa Contratante</div>
                                  <div className="flex flex-col gap-1 mt-1">
                                    <div className="flex items-center gap-1"><span>Razão Social:</span><span>Cliente Exemplo Ltda.</span></div>
                                    <div className="flex items-center gap-1"><span>CNPJ:</span><span>98.765.432/0001-55</span></div>
                                  </div>
                                </div>
                              </div>
                              <div className="my-3 border-b border-emerald-100"></div>
                              {/* Payment Table */}
                              <div className="space-y-1 mb-4">
                                <button className={`w-full flex justify-between items-center px-2 py-3 rounded transition ${selectedItem === 'valor_servicos' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => setSelectedItem('valor_servicos')}>
                                  <span className="font-medium text-left">Valor dos Serviços Prestados</span>
                                  <span className="font-mono font-bold">R$ 7.000,00</span>
                                </button>
                                <button className={`w-full flex justify-between items-center px-2 py-3 rounded transition ${selectedItem === 'irrf_pj' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => setSelectedItem('irrf_pj')}>
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
                                <div className="font-semibold text-yellow-900 mb-2">Impostos a pagar como PJ</div>
                                <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'simples_nacional' ? 'bg-yellow-100' : 'hover:bg-yellow-50'}`} onClick={() => setSelectedItem('simples_nacional')}>
                                  <span className="font-medium text-left">Simples Nacional (DAS)</span>
                                  <span className="font-mono font-bold">R$ 500,00</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Colonne 2 : Explication contextuelle PJ */}
                          <div className="md:col-span-7 p-6 bg-white rounded-lg shadow-sm border h-full overflow-y-auto">
                            {selectedItem === 'valor_servicos' && (
                              <div>
                                <h3 className="text-2xl font-bold">Valor dos Serviços Prestados</h3>
                                <p className="text-muted-foreground mt-4">Explicação sobre como é definido o valor dos serviços, critérios de negociação, e boas práticas para contratos PJ...</p>
                              </div>
                            )}
                            {selectedItem === 'irrf_pj' && (
                              <div>
                                <h3 className="text-2xl font-bold">Imposto de Renda Retido na Fonte (IRRF)</h3>
                                <p className="text-muted-foreground mt-4">Explicação sobre o IRRF para PJ, quando é retido, como calcular e como declarar...</p>
                              </div>
                            )}
                            {selectedItem === 'simples_nacional' && (
                              <div>
                                <h3 className="text-2xl font-bold">Simples Nacional (DAS)</h3>
                                <p className="text-muted-foreground mt-4">O Documento de Arrecadação do Simples Nacional (DAS) é a guia unificada para o pagamento dos impostos do microempreendedor...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="beneficios">
                      <div>
                        <h3 className="text-xl font-bold mb-2">Guia de Benefícios</h3>
                        <p className="text-gray-700">Aqui você encontra informações sobre os principais benefícios trabalhistas, independente do seu perfil. Em breve, conteúdos personalizados para cada categoria!</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="direitos">
                      {selectedProfile === "geral" && (
                        <div>
                          <h3 className="text-xl font-bold mb-2">Direitos e Deveres Gerais</h3>
                          <p className="text-gray-700">Conheça os direitos e deveres básicos de todo trabalhador no Brasil...</p>
                        </div>
                      )}
                      {selectedProfile === "CLT" && (
                        <div>
                          <h3 className="text-xl font-bold mb-2">Direitos do Trabalhador CLT</h3>
                          <p className="text-gray-700">Férias, 13º salário, aviso prévio, e mais...</p>
                        </div>
                      )}
                      {selectedProfile === "PJ" && (
                        <div>
                          <h3 className="text-xl font-bold mb-2">Direitos e Obrigações do PJ</h3>
                          <p className="text-gray-700">Contratos, impostos, obrigações fiscais...</p>
                        </div>
                      )}
                      {selectedProfile === "Estagiário" && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                          {/* Colonne 1 : Recibo de Pagamento de Bolsa-Auxílio */}
                          <div className="md:col-span-5 pl-0 md:pl-0">
                            <div className="bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 p-6 max-w-lg mx-auto">
                              <h2 className="text-xl font-bold text-emerald-900 mb-4">Recibo de Pagamento de Bolsa-Auxílio</h2>
                              {/* Détails de paiement */}
                              <div className="mb-2">
                                <div className="font-semibold text-emerald-800 mb-1">Detalhes do Pagamento</div>
                                <button className={`w-full flex justify-between items-center px-2 py-3 rounded transition ${selectedItem === 'estagio_bolsa' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => setSelectedItem('estagio_bolsa')}>
                                  <span className="font-medium text-left">Bolsa-Auxílio</span>
                                  <span className="font-mono font-bold">R$ 1.800,00</span>
                                </button>
                                <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'estagio_transporte' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => setSelectedItem('estagio_transporte')}>
                                  <span className="font-medium text-left">Auxílio-Transporte</span>
                                  <span className="font-mono font-bold">R$ 150,00</span>
                                </button>
                                <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'estagio_irrf' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => setSelectedItem('estagio_irrf')}>
                                  <span className="font-medium text-left">Desconto de IRRF (se aplicável)</span>
                                  <span className="font-mono font-bold text-rose-700">-R$ 0,00</span>
                                </button>
                              </div>
                              {/* Total net */}
                              <div className="flex justify-between items-center py-3 border-t border-emerald-200 font-bold text-emerald-900 text-lg mb-4">
                                <span>Valor Líquido Recebido</span>
                                <span className="font-mono">R$ 1.950,00</span>
                              </div>
                              {/* Concepts légaux */}
                              <div className="mt-6">
                                <div className="font-semibold text-emerald-800 mb-2">Contexto Legal do Estágio</div>
                                <button className={`w-full text-left px-4 py-2 rounded-lg border font-semibold transition mb-2 ${selectedItem === 'estagio_lei' ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50'}`} onClick={() => setSelectedItem('estagio_lei')}>Lei do Estágio (Nº 11.788/08)</button>
                                <button className={`w-full text-left px-4 py-2 rounded-lg border font-semibold transition mb-2 ${selectedItem === 'estagio_vinculo' ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50'}`} onClick={() => setSelectedItem('estagio_vinculo')}>Ausência de Vínculo Empregatício</button>
                                <button className={`w-full text-left px-4 py-2 rounded-lg border font-semibold transition ${selectedItem === 'estagio_recesso' ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50'}`} onClick={() => setSelectedItem('estagio_recesso')}>Recesso Remunerado (Férias de 30 dias)</button>
                              </div>
                            </div>
                          </div>
                          {/* Colonne 2 : Explication contextuelle Estagiário */}
                          <div className="md:col-span-7 p-6 bg-white rounded-lg shadow-sm border h-full overflow-y-auto">
                            <div className="mb-4 text-sm text-muted-foreground">Clique em um item do recibo ou conceito para ver a explicação detalhada.</div>
                            {selectedItem === 'estagio_bolsa' && (
                              <div>
                                <h3 className="text-2xl font-bold">Bolsa-Auxílio</h3>
                                <p className="text-muted-foreground mt-4">A bolsa-auxílio é o valor pago ao estagiário como contraprestação pelo estágio. Não é salário, mas uma ajuda de custo, e seu valor pode variar conforme o acordo entre as partes.</p>
                              </div>
                            )}
                            {selectedItem === 'estagio_transporte' && (
                              <div>
                                <h3 className="text-2xl font-bold">Auxílio-Transporte</h3>
                                <p className="text-muted-foreground mt-4">O auxílio-transporte é um benefício obrigatório para o estagiário, destinado a custear o deslocamento entre a residência e o local de estágio.</p>
                              </div>
                            )}
                            {selectedItem === 'estagio_irrf' && (
                              <div>
                                <h3 className="text-2xl font-bold">Desconto de IRRF (se aplicável)</h3>
                                <p className="text-muted-foreground mt-4">Em geral, a bolsa-auxílio do estágio não sofre desconto de IRRF, exceto em casos de valores elevados ou situações específicas previstas em lei.</p>
                              </div>
                            )}
                            {selectedItem === 'estagio_lei' && (
                              <div>
                                <h3 className="text-2xl font-bold">Lei do Estágio (Nº 11.788/08)</h3>
                                <p className="text-muted-foreground mt-4">O estágio é regido por uma legislação própria, que estabelece as regras para a contratação, incluindo carga horária, duração, e os direitos e deveres da empresa e do estudante.</p>
                              </div>
                            )}
                            {selectedItem === 'estagio_vinculo' && (
                              <div>
                                <h3 className="text-2xl font-bold">Ausência de Vínculo Empregatício</h3>
                                <p className="text-muted-foreground mt-4">O estágio, quando realizado conforme a lei, não gera vínculo empregatício, ou seja, não há direitos trabalhistas típicos como FGTS, INSS ou 13º salário.</p>
                              </div>
                            )}
                            {selectedItem === 'estagio_recesso' && (
                              <div>
                                <h3 className="text-2xl font-bold">Recesso Remunerado (Férias de 30 dias)</h3>
                                <p className="text-muted-foreground mt-4">Após 12 meses de estágio na mesma empresa, o estagiário tem direito a 30 dias de recesso remunerado, preferencialmente coincidente com as férias escolares.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
