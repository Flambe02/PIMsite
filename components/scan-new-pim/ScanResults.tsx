/**
 * Composant ScanResults optimisé UX/UI
 * Interface claire et intuitive pour l'analyse des holerites
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  TrendingUp, 
  Lightbulb, 
  RefreshCw, 
  FileText, 
  User, 
  Building, 
  GraduationCap, 
  Briefcase, 
  Info, 
  Eye,
  BookOpen,
  Calculator,
  DollarSign,
  ArrowRight,
  ChevronRight,
  Smartphone
} from 'lucide-react';
import { SalarySimulation } from './SalarySimulation';
import Link from 'next/link';

export interface ScanResultsProps {
  results: any;
  onReset: () => void;
  className?: string;
  locale?: 'br' | 'fr';
}

export const ScanResults: React.FC<ScanResultsProps> = ({
  results,
  onReset,
  className = '',
  locale = 'br'
}) => {
  const [activeSection, setActiveSection] = useState('resumo');
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extraction sécurisée des données
  const analysis = results?.data?.analysis || results?.analysis || {};
  const structuredData = analysis?.extraction || analysis?.structuredData || analysis?.finalData || analysis?.final_data || {};
  const recommendations = analysis?.recommendations || {};
  const enhancedExplanation = analysis?.finalData?.enhancedExplanation || structuredData?.enhancedExplanation;

  const formatCurrency = (value: any): string => {
    if (!value || isNaN(Number(value))) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value));
  };

  // Navigation des sections
  const sections = [
    { 
      id: 'resumo', 
      name: 'Resumo Pedagógico', 
      icon: BookOpen,
      description: 'Visão geral do holerite'
    },
    { 
      id: 'como-ler', 
      name: 'Como Ler a Folha', 
      icon: Calculator,
      description: 'Explicação dos termes'
    },
    { 
      id: 'recomendacoes', 
      name: 'Recomendações', 
      icon: Lightbulb,
      description: 'Dicas de otimização'
    },
    { 
      id: 'simulacao', 
      name: 'Simulação', 
      icon: TrendingUp,
      description: 'Otimize seu salário'
    }
  ];

  // Composant de navigation mobile
  const MobileNavigation = () => (
    <div className="md:hidden mb-6">
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href={`/${locale}/dashboard`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'br' ? 'Dashboard' : 'Dashboard'}
          </Link>
          <button
            onClick={onReset}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {locale === 'br' ? 'Novo Scan' : 'Nouveau Scan'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`${
                activeSection === section.id
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              } flex items-center justify-center p-3 rounded-lg border-2 transition-colors`}
            >
              <section.icon className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium">{section.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Composant de navigation desktop
  const DesktopNavigation = () => (
    <div className="hidden md:block mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link 
            href={`/${locale}/dashboard`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'br' ? 'Voltar ao Dashboard' : 'Retour au Dashboard'}
          </Link>
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {locale === 'br' ? 'Novo Scan' : 'Nouveau Scan'}
          </button>
        </div>
      </div>
      
      <nav className="flex space-x-8" aria-label="Tabs">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`${
              activeSection === section.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            {section.name}
          </button>
        ))}
      </nav>
    </div>
  );

  // Section: Resumo Pedagógico
  const ResumoPedagogico = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Résumé principal - Plus compact */}
      {enhancedExplanation?.summary && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">📋</span>
                </div>
            <h3 className="text-lg font-bold text-blue-900">Resumo Executivo</h3>
                </div>
          
          <p className="text-blue-800 leading-relaxed text-base font-medium">
            {enhancedExplanation?.summary ? (
              <>
                <strong>Resumo do Mês:</strong> {enhancedExplanation.summary}
                <br /><br />
                <strong>O que isso significa:</strong> Este holerite representa seu pagamento mensal completo, incluindo salário base, benefícios e todas as deduções legais. O valor líquido é o que você efetivamente recebe na conta, após descontos obrigatórios como INSS (aposentadoria) e IRRF (imposto de renda).
                {structuredData?.vacation_payment?.valor && (
                  <>
                    <br /><br />
                    <strong>Destaque do Mês:</strong> Este mês inclui o pagamento de férias com adicional de 1/3 constitucional, o que explica o valor total de proventos mais elevado que o habitual.
                  </>
                )}
                {structuredData?.advances?.valor && (
                  <>
                    <br /><br />
                    <strong>Atenção:</strong> Houve adiantamento salarial que foi descontado do pagamento final, reduzindo o valor líquido recebido.
                  </>
                )}
              </>
            ) : (
              <>
                <strong>Resumo do Mês:</strong> Seu holerite de {structuredData?.period || 'este mês'} mostra um salário base de {formatCurrency(structuredData?.gross_salary?.valor || 0)}, com total de proventos de {formatCurrency(structuredData?.total_earnings?.valor || 0)} e descontos de {formatCurrency(structuredData?.total_deductions?.valor || 0)}, resultando em um líquido de {formatCurrency(structuredData?.net_salary?.valor || 0)}.
                <br /><br />
                <strong>O que isso significa:</strong> Este é seu pagamento mensal completo, incluindo salário base, benefícios e todas as deduções legais obrigatórias. O valor líquido representa o que você efetivamente recebe na conta.
              </>
            )}
          </p>
          </div>
        )}

      {/* Informations principales en grille - Plus compact et responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Dados Principais */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Dados Principais</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium text-sm flex-shrink-0">Empresa:</span>
              <span className="font-semibold text-gray-800 text-sm truncate ml-2 text-right">
                {structuredData?.company_name || enhancedExplanation?.company_name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium text-sm flex-shrink-0">Funcionário:</span>
              <span className="font-semibold text-gray-800 text-sm truncate ml-2 text-right">
                {structuredData?.employee_name || enhancedExplanation?.employee_name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium text-sm flex-shrink-0">Cargo:</span>
              <span className="font-semibold text-gray-800 text-sm truncate ml-2 text-right">
                {structuredData?.position || enhancedExplanation?.position || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium text-sm flex-shrink-0">Período:</span>
              <span className="font-semibold text-gray-800 text-sm truncate ml-2 text-right">
                {structuredData?.period || enhancedExplanation?.period || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Análise Financeira */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Análise Financeira</h3>
          </div>
            
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium text-sm flex-shrink-0">Salário Base:</span>
              <span className="font-bold text-green-800 text-sm truncate ml-2 text-right">
                {formatCurrency(structuredData?.gross_salary?.valor || structuredData?.salario_bruto?.valor || enhancedExplanation?.gross_salary || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium text-sm flex-shrink-0">Total Proventos:</span>
              <span className="font-bold text-green-800 text-sm truncate ml-2 text-right">
                {formatCurrency(structuredData?.total_earnings?.valor || enhancedExplanation?.total_earnings || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
              <span className="text-red-700 font-medium text-sm flex-shrink-0">Total Descontos:</span>
              <span className="font-bold text-red-800 text-sm truncate ml-2 text-right">
                {formatCurrency(structuredData?.total_deductions?.valor || enhancedExplanation?.total_deductions || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium text-sm flex-shrink-0">Líquido a Receber:</span>
              <span className="font-bold text-blue-800 text-sm truncate ml-2 text-right">
                {formatCurrency(structuredData?.net_salary?.valor || structuredData?.salario_liquido?.valor || enhancedExplanation?.net_salary || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explicação Detalhada - Plus compact */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-yellow-600" />
        </div>
          <h3 className="text-base font-bold text-gray-900">Explicação Detalhada</h3>
            </div>
            
        <div className="text-gray-700 space-y-3 text-sm">
          {/* Explicação Detalhada - Baseada no holerite scannado */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">📚 Como Entender seu Holerite</h4>
            
            <div className="space-y-4">
              {/* Proventos - O que você ganha */}
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-700 mb-2">💰 Proventos (O que você ganha)</h5>
                <div className="space-y-2">
                  {structuredData?.gross_salary?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Salário Base:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(structuredData.gross_salary.valor)}</span>
                  </div>
                  )}
                  {structuredData?.vacation_payment?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Férias + 1/3:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(structuredData.vacation_payment.valor)}</span>
                  </div>
                  )}
                  {structuredData?.thirteenth_salary?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">13º Salário:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(structuredData.thirteenth_salary.valor)}</span>
                  </div>
                  )}
                  {structuredData?.overtime?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Horas Extras:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(structuredData.overtime.valor)}</span>
                  </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-green-200">
                    <span className="text-sm font-medium text-gray-700">Total de Proventos:</span>
                    <span className="font-bold text-green-700 text-lg">{formatCurrency(structuredData?.total_earnings?.valor || 0)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Explicação:</strong> Proventos são todos os valores que você recebe. O salário base é o valor acordado no contrato. 
                    {structuredData?.vacation_payment?.valor && ' As férias incluem o adicional de 1/3 constitucional (direito garantido por lei).'}
                    {structuredData?.thirteenth_salary?.valor && ' O 13º salário é um benefício obrigatório pago em duas parcelas.'}
                    {structuredData?.overtime?.valor && ' As horas extras são remuneradas com adicional de 50% sobre o valor da hora normal.'}
                  </p>
                </div>
              </div>

              {/* Descontos - O que sai do seu pagamento */}
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-700 mb-2">💸 Descontos (O que sai do seu pagamento)</h5>
                <div className="space-y-2">
                  {structuredData?.inss_amount?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">INSS:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(structuredData.inss_amount.valor)}</span>
                  </div>
                  )}
                  {structuredData?.irrf_amount?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">IRRF:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(structuredData.irrf_amount.valor)}</span>
                  </div>
                  )}
                  {structuredData?.health_plan?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Plano de Saúde:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(structuredData.health_plan.valor)}</span>
                  </div>
                  )}
                  {structuredData?.meal_allowance?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vale Refeição:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(structuredData.meal_allowance.valor)}</span>
                  </div>
                  )}
                  {structuredData?.transport_allowance?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vale Transporte:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(structuredData.transport_allowance.valor)}</span>
                </div>
                  )}
                  {structuredData?.education_allowance?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Auxílio Educação:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(structuredData.education_allowance.valor)}</span>
              </div>
                  )}
                  {structuredData?.advances?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Adiantamento:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(structuredData.advances.valor)}</span>
            </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-red-200">
                    <span className="text-sm font-medium text-gray-700">Total de Descontos:</span>
                    <span className="font-bold text-red-700 text-lg">{formatCurrency(structuredData?.total_deductions?.valor || 0)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Explicação:</strong> Descontos são deduções obrigatórias ou opcionais. 
                    {structuredData?.inss_amount?.valor && ' O INSS é contribuição para aposentadoria pública (desconto obrigatório).'}
                    {structuredData?.irrf_amount?.valor && ' O IRRF é imposto de renda retido na fonte (progressivo conforme o salário).'}
                    {structuredData?.health_plan?.valor && ' O plano de saúde é um benefício descontado para cobrir despesas médicas.'}
                    {structuredData?.meal_allowance?.valor && ' O vale refeição é benefício para alimentação, geralmente com subsídio da empresa.'}
                    {structuredData?.advances?.valor && ' O adiantamento é valor pago antecipadamente e descontado do pagamento final.'}
                </p>
              </div>
            </div>
              
              {/* Bases de Cálculo */}
              <div className="bg-white p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-700 mb-2">🧮 Bases de Cálculo (Como são calculados os impostos)</h5>
                <div className="space-y-2">
                  {structuredData?.inss_base?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Base INSS:</span>
                      <span className="font-semibold text-purple-600">{formatCurrency(structuredData.inss_base.valor)}</span>
          </div>
        )}
                  {structuredData?.irrf_base?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Base IRRF:</span>
                      <span className="font-semibold text-purple-600">{formatCurrency(structuredData.irrf_base.valor)}</span>
              </div>
                  )}
                  {structuredData?.fgts_base?.valor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Base FGTS:</span>
                      <span className="font-semibold text-purple-600">{formatCurrency(structuredData.fgts_base.valor)}</span>
          </div>
        )}
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Explicação:</strong> As bases de cálculo são valores sobre os quais os impostos são calculados. 
                    {structuredData?.inss_base?.valor && ' A base INSS pode ser limitada ao teto previdenciário.'}
                    {structuredData?.irrf_base?.valor && ' A base IRRF considera deduções como dependentes e contribuição INSS.'}
                    {structuredData?.fgts_base?.valor && ' A base FGTS é geralmente o total de proventos. O FGTS (8%) é pago pela empresa e NÃO sai do seu líquido.'}
                  </p>
                </div>
              </div>
              
              {/* Cálculo do Líquido */}
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-700 mb-2">📊 Cálculo do Salário Líquido</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de Proventos:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(structuredData?.total_earnings?.valor || 0)}</span>
                </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de Descontos:</span>
                    <span className="font-semibold text-red-600">- {formatCurrency(structuredData?.total_deductions?.valor || 0)}</span>
              </div>
                  <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                    <span className="text-sm font-bold text-gray-800">= Salário Líquido:</span>
                    <span className="font-bold text-blue-700 text-xl">{formatCurrency(structuredData?.net_salary?.valor || 0)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Fórmula:</strong> Líquido = Proventos - Descontos
                    <br />
                    <strong>Resultado:</strong> Este é o valor que efetivamente cai na sua conta bancária.
                  </p>
              </div>
            </div>
              
              {/* Informações Adicionais */}
              {structuredData?.dependents && (
                <div className="bg-white p-3 rounded-lg border border-orange-200">
                  <h5 className="font-semibold text-orange-700 mb-2">👨‍👩‍👧‍👦 Informações Pessoais</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dependentes:</span>
                      <span className="font-semibold text-orange-600">{structuredData.dependents}</span>
                </div>
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Benefício:</strong> Cada dependente reduz a base de cálculo do IRRF em R$ 189,59 por mês, 
                      diminuindo o imposto de renda retido.
                    </p>
              </div>
                  </div>
              )}
              
              {/* Observações importantes */}
              {enhancedExplanation?.observations && enhancedExplanation.observations.length > 0 && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <h5 className="font-semibold text-orange-800 mb-2">⚠️ Observações Importantes</h5>
                  <ul className="space-y-1">
                    {enhancedExplanation.observations.map((obs: string, index: number) => (
                      <li key={index} className="text-orange-700 text-xs">• {obs}</li>
                    ))}
                  </ul>
            </div>
          )}
            </div>
        </div>

          {/* Fallback si pas de données */}
          {!structuredData && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm">
                <strong>Análise detalhada:</strong> Nenhum holerite disponível para análise detalhada.
              </p>
              </div>
          )}
            </div>
                </div>
    </motion.div>
  );

  // Section: Como Ler a Folha
  const ComoLerFolha = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Explicação Detalhada - Baseada no holerite scannado */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3">📚 Como Entender seu Holerite</h4>
        
        <div className="space-y-4">
          {/* Proventos - O que você ganha */}
          <div className="bg-white p-3 rounded-lg border border-green-200">
            <h5 className="font-semibold text-green-700 mb-2">💰 Proventos (O que você ganha)</h5>
            <div className="space-y-2">
              {structuredData?.gross_salary?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Salário Base:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(structuredData.gross_salary.valor)}</span>
            </div>
              )}
              {structuredData?.vacation_payment?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Férias + 1/3:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(structuredData.vacation_payment.valor)}</span>
          </div>
        )}
              {structuredData?.thirteenth_salary?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">13º Salário:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(structuredData.thirteenth_salary.valor)}</span>
              </div>
              )}
              {structuredData?.overtime?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Horas Extras:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(structuredData.overtime.valor)}</span>
            </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-green-200">
                <span className="text-sm font-medium text-gray-700">Total de Proventos:</span>
                <span className="font-bold text-green-700 text-lg">{formatCurrency(structuredData?.total_earnings?.valor || 0)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Explicação:</strong> Proventos são todos os valores que você recebe. O salário base é o valor acordado no contrato. 
                {structuredData?.vacation_payment?.valor && ' As férias incluem o adicional de 1/3 constitucional (direito garantido por lei).'}
                {structuredData?.thirteenth_salary?.valor && ' O 13º salário é um benefício obrigatório pago em duas parcelas.'}
                {structuredData?.overtime?.valor && ' As horas extras são remuneradas com adicional de 50% sobre o valor da hora normal.'}
            </p>
          </div>
          </div>
          
          {/* Descontos - O que sai do seu pagamento */}
          <div className="bg-white p-3 rounded-lg border border-red-200">
            <h5 className="font-semibold text-red-700 mb-2">💸 Descontos (O que sai do seu pagamento)</h5>
            <div className="space-y-2">
              {structuredData?.inss_amount?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">INSS:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(structuredData.inss_amount.valor)}</span>
              </div>
              )}
              {structuredData?.irrf_amount?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">IRRF:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(structuredData.irrf_amount.valor)}</span>
            </div>
              )}
              {structuredData?.health_plan?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plano de Saúde:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(structuredData.health_plan.valor)}</span>
                </div>
              )}
              {structuredData?.meal_allowance?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vale Refeição:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(structuredData.meal_allowance.valor)}</span>
            </div>
              )}
              {structuredData?.transport_allowance?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vale Transporte:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(structuredData.transport_allowance.valor)}</span>
          </div>
        )}
              {structuredData?.education_allowance?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Auxílio Educação:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(structuredData.education_allowance.valor)}</span>
            </div>
              )}
              {structuredData?.advances?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Adiantamento:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(structuredData.advances.valor)}</span>
          </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-red-200">
                <span className="text-sm font-medium text-gray-700">Total de Descontos:</span>
                <span className="font-bold text-red-700 text-lg">{formatCurrency(structuredData?.total_deductions?.valor || 0)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Explicação:</strong> Descontos são deduções obrigatórias ou opcionais. 
                {structuredData?.inss_amount?.valor && ' O INSS é contribuição para aposentadoria pública (desconto obrigatório).'}
                {structuredData?.irrf_amount?.valor && ' O IRRF é imposto de renda retido na fonte (progressivo conforme o salário).'}
                {structuredData?.health_plan?.valor && ' O plano de saúde é um benefício descontado para cobrir despesas médicas.'}
                {structuredData?.meal_allowance?.valor && ' O vale refeição é benefício para alimentação, geralmente com subsídio da empresa.'}
                {structuredData?.advances?.valor && ' O adiantamento é valor pago antecipadamente e descontado do pagamento final.'}
              </p>
        </div>
      </div>
          
          {/* Bases de Cálculo */}
          <div className="bg-white p-3 rounded-lg border border-purple-200">
            <h5 className="font-semibold text-purple-700 mb-2">🧮 Bases de Cálculo (Como são calculados os impostos)</h5>
            <div className="space-y-2">
              {structuredData?.inss_base?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Base INSS:</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(structuredData.inss_base.valor)}</span>
        </div>
              )}
              {structuredData?.irrf_base?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Base IRRF:</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(structuredData.irrf_base.valor)}</span>
                </div>
              )}
              {structuredData?.fgts_base?.valor && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Base FGTS:</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(structuredData.fgts_base.valor)}</span>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-2">
                <strong>Explicação:</strong> As bases de cálculo são valores sobre os quais os impostos são calculados. 
                {structuredData?.inss_base?.valor && ' A base INSS pode ser limitada ao teto previdenciário.'}
                {structuredData?.irrf_base?.valor && ' A base IRRF considera deduções como dependentes e contribuição INSS.'}
                {structuredData?.fgts_base?.valor && ' A base FGTS é geralmente o total de proventos. O FGTS (8%) é pago pela empresa e NÃO sai do seu líquido.'}
              </p>
                </div>
              </div>
          
          {/* Cálculo do Líquido */}
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-700 mb-2">📊 Cálculo do Salário Líquido</h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Proventos:</span>
                <span className="font-semibold text-green-600">{formatCurrency(structuredData?.total_earnings?.valor || 0)}</span>
        </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Descontos:</span>
                <span className="font-semibold text-red-600">- {formatCurrency(structuredData?.total_deductions?.valor || 0)}</span>
            </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="text-sm font-bold text-gray-800">= Salário Líquido:</span>
                <span className="font-bold text-blue-700 text-xl">{formatCurrency(structuredData?.net_salary?.valor || 0)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                <strong>Fórmula:</strong> Líquido = Proventos - Descontos
                <br />
                <strong>Resultado:</strong> Este é o valor que efetivamente cai na sua conta bancária.
              </p>
            </div>
          </div>
          
          {/* Informações Adicionais */}
          {structuredData?.dependents && (
            <div className="bg-white p-3 rounded-lg border border-orange-200">
              <h5 className="font-semibold text-orange-700 mb-2">👨‍👩‍👧‍👦 Informações Pessoais</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dependentes:</span>
                  <span className="font-semibold text-orange-600">{structuredData.dependents}</span>
            </div>
                <p className="text-xs text-gray-600 mt-1">
                  <strong>Benefício:</strong> Cada dependente reduz a base de cálculo do IRRF em R$ 189,59 por mês, 
                  diminuindo o imposto de renda retido.
                </p>
          </div>
        </div>
          )}
          
          {/* Observações importantes */}
          {enhancedExplanation?.observations && enhancedExplanation.observations.length > 0 && (
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <h5 className="font-semibold text-orange-800 mb-2">⚠️ Observações Importantes</h5>
              <ul className="space-y-1">
                {enhancedExplanation.observations.map((obs: string, index: number) => (
                  <li key={index} className="text-orange-700 text-xs">• {obs}</li>
                ))}
              </ul>
          </div>
        )}
        </div>
            </div>
            
      {/* Fallback si pas de données */}
      {!structuredData && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">
            <strong>Análise detalhada:</strong> Nenhum holerite disponível para análise detalhada.
              </p>
            </div>
      )}
    </motion.div>
  );

  // Section: Recomendações
  const Recomendacoes = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Score d'optimisation - Plus compact */}
      {recommendations?.score_optimisation && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
                </div>
            <h3 className="text-lg font-bold text-purple-900">Score de Otimização</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {recommendations.score_optimisation}%
            </div>
            <p className="text-purple-700 font-medium text-sm">
              Potencial de melhoria identificado
            </p>
                </div>
              </div>
            )}
            
      {/* Liste des recommandations - Plus compact */}
      {recommendations?.recommendations && Array.isArray(recommendations.recommendations) && recommendations.recommendations.length > 0 && (
        <div className="space-y-3">
          {recommendations.recommendations.map((rec: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-base font-bold text-gray-900">{rec.title || rec.titre}</h4>
                    {rec.priority && (
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        rec.priority === 'high' || rec.priorite === 'high'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {rec.priority === 'high' || rec.priorite === 'high' ? 'Alta' : 'Média'}
                      </span>
                    )}
                </div>
                  <p className="text-gray-600 leading-relaxed mb-2 text-sm">
                    {rec.description || rec.desc}
                  </p>
                  {rec.estimatedSavings && rec.estimatedSavings !== 'N/A' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <p className="text-green-700 text-xs font-medium">
                        💰 Economia estimada: {formatCurrency(rec.estimatedSavings)}
                </p>
              </div>
            )}
              </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}

      {/* Message si pas de recommandations - Plus compact */}
      {(!recommendations?.recommendations || !Array.isArray(recommendations.recommendations) || recommendations.recommendations.length === 0) && (
        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
            <Info className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">Nenhuma Recomendação Disponível</h3>
          <p className="text-gray-600 text-sm">
            Não foi possível gerar recomendações específicas para este holerite.
            </p>
          </div>
        )}
      </motion.div>
  );

  // Section: Simulação
  const SimulacaoOtimizacao = () => (
          <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">💰</span>
          </div>
          <h3 className="text-lg font-bold text-blue-900">Simulação de Otimização</h3>
        </div>
        <p className="text-blue-800 font-medium text-base leading-relaxed">
          Esta seção permite simular diferentes cenários de salário para identificar oportunidades de otimização.
          Você pode ajustar os valores de proventos, descontos ou bases de cálculo para ver como isso afeta seu salário líquido.
        </p>
      </div>

      <SalarySimulation
        structuredData={structuredData}
        enhancedExplanation={enhancedExplanation}
      />
          </motion.div>
  );

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 ${className}`}>
      {/* Navigation mobile et desktop - Plus compact */}
      <MobileNavigation />
      <DesktopNavigation />

      {/* Contenu des sections - Taille optimisée et responsive */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 overflow-hidden"
        >
          <div className="max-h-[80vh] overflow-y-auto pr-2">
            {activeSection === 'resumo' && <ResumoPedagogico />}
            {activeSection === 'como-ler' && <ComoLerFolha />}
            {activeSection === 'recomendacoes' && <Recomendacoes />}
            {activeSection === 'simulacao' && (
              <SalarySimulation 
                structuredData={structuredData}
                enhancedExplanation={enhancedExplanation}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bouton de reset - Plus compact */}
      <div className="text-center mt-6 mb-4">
        <button
          onClick={onReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Analisar Outro Holerite
        </button>
      </div>
    </div>
  );
}; 