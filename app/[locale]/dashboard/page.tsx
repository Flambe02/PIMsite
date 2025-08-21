"use client"

import Image from "next/image";
import { BarChart3, Gift, Heart, Shield, TrendingUp, FileText, PercentCircle, ArrowDownUp, Download, CheckCircle2, MessageCircle, PieChart as PieIcon, Upload, UserCircle, LogOut, Menu, Lightbulb, HelpCircle, Info, ArrowUpRight, ArrowDownLeft, ArrowRight, DollarSign, Users, Calendar, MoreHorizontal, Settings } from "lucide-react";
import BemEstar from "@/components/bemEstar/BemEstar";
import Seguros from "@/components/seguros/Seguros"; // Importer Seguros
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import DashboardPerfilView from "@/components/dashboard/DashboardPerfilView";
import FinancialHealthScore from "@/components/dashboard/FinancialHealthScore";
import PersonalizedRecommendations from "@/components/dashboard/PersonalizedRecommendations";
import AIRecommendations from "@/components/dashboard/AIRecommendations";
import Beneficios, { Beneficio } from "@/components/beneficios/Beneficios";
import { useSupabase } from "@/components/supabase-provider";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

import { useRouter, useParams } from "next/navigation"; // Importer useParams
import { createClient } from "@/lib/supabase/client";
import InvestimentosComp from "@/components/investimentos/Investimentos";
import useInvestimentos from "@/hooks/useInvestimentos";
import { useFinancialCheckup } from "@/hooks/useFinancialCheckup";
import { HoleriteHistory } from "@/components/dashboard/HoleriteHistory";
// Temporairement désactivé pour éviter les erreurs next-intl
// import { useTranslations, useLocale } from 'next-intl';
import { useMediaQuery } from 'react-responsive';

// Import dynamique avec fallback
const UploadHolerite = dynamic(() => import("@/app/[locale]/calculadora/upload-holerite"), {
  loading: () => <div className="p-8 text-center text-emerald-900">Chargement du module d'upload...</div>,
  ssr: false
});

// Import du nouveau composant Overview
const Overview = dynamic(() => import("@/components/dashboard/Overview"), {
  loading: () => <div className="p-8 text-center text-emerald-900">Chargement de l'overview...</div>,
  ssr: false
});

const navItems = [
  { 
    label: "Overview", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
  { 
    label: "Salário", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
  { 
    label: "Benefícios", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
  { 
    label: "Seguros", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
  { 
    label: "Investimentos", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
  { 
    label: "Well-being", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
  { 
    label: "Direitos Sociais", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
  { 
    label: "Histórico & Documentos", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
  { 
    label: "Dados", 
    color: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    activeColor: "bg-gray-100 text-indigo-700"
  },
];

const summaryCards: any[] = [];



const recommendations = [
  {
    label: "Economia Fiscal",
    title: "Otimização IRRF",
    desc: "Você pode economizar até R$ 180/mês com deduções médicas e educacionais.",
    btn: "Saiba Mais",
    color: "border-green-100 bg-green-50",
    tag: "bg-green-200 text-green-800",
  },
  {
    label: "Previdência",
    title: "PGBL/VGBL",
    desc: "Considere um plano de previdência para reduzir o IR e garantir o futuro.",
    btn: "Simular",
    color: "border-blue-100 bg-blue-50",
    tag: "bg-blue-200 text-blue-800",
  },
  {
    label: "Salary Sacrifice",
    title: "Vale Alimentação",
    desc: "Aumente seu vale alimentação para economizar R$ 120/mês em impostos.",
    btn: "Configurar",
    color: "border-purple-100 bg-purple-50",
    tag: "bg-purple-200 text-purple-800",
  },
];

function SaudeFinanceiraIndicator({ 
  financialHealthScore, 
  setFinancialHealthScore, 
  quizAnswers, 
  setQuizAnswers, 
  employmentStatus, 
  setEmploymentStatus 
}: {
  financialHealthScore: number;
  setFinancialHealthScore: (score: number) => void;
  quizAnswers: Record<string, string>;
  setQuizAnswers: (answers: Record<string, string>) => void;
  employmentStatus: string;
  setEmploymentStatus: (status: string) => void;
}) {
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('financial_health_score, quiz_answers, tipo_profissional')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFinancialHealthScore(profile.financial_health_score || 75)
          setQuizAnswers(profile.quiz_answers || {})
          setEmploymentStatus(profile.tipo_profissional || "")
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [supabase, setFinancialHealthScore, setQuizAnswers, setEmploymentStatus])

  return (
    <div className="flex items-center gap-2 mb-8">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="25" fill="#f3f4f6" />
        <circle 
          cx="28" 
          cy="28" 
          r="25" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="5" 
          strokeDasharray={2*Math.PI*25} 
          strokeDashoffset={2*Math.PI*25*(1 - financialHealthScore/100)} 
          style={{transition: 'stroke-dashoffset 1s'}} 
        />
        <text x="28" y="34" textAnchor="middle" fontSize="18" fill="#10b981" fontWeight="bold">
          {financialHealthScore}
        </text>
      </svg>
      <div className="flex flex-col ml-1">
        <span className="text-[13px] font-semibold text-gray-800 leading-tight">Saúde Financeira</span>
        <span className="text-[13px] font-bold text-emerald-600 leading-tight">
          {financialHealthScore >= 80 ? "Excelente" : 
           financialHealthScore >= 60 ? "Boa" : 
           financialHealthScore >= 40 ? "Regular" : "Precisa Melhorar"}
        </span>
      </div>
    </div>
  )
}

function formatPeriod(period?: string): string | null {
  if (!period) return null;
  // Gère "2024-06" ou "06/2024"
  let year, month;
  if (/^\d{4}-\d{2}$/.test(period)) {
    [year, month] = period.split('-');
  } else if (/^\d{2}\/\d{4}$/.test(period)) {
    [month, year] = period.split('/');
  } else {
    return period;
  }
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

// Ajoute une fonction utilitaire pour détecter si c'est le premier upload (profil inexistant)
function isFirstProfile(profile: any) {
  // On considère qu'un profil inexistant n'a pas de nom ou d'email
  return !profile || (!profile.nome && !profile.email);
}

function getDefaultOpportunities(profileType?: string): string[] {
  if (profileType === 'PJ') {
    return [
      'Plano de Saúde Empresarial: Considere contratar um plano de saúde empresarial para reduzir custos e garantir proteção.',
      'Previdência Privada: Avalie a possibilidade de contribuir para previdência privada e otimizar sua aposentadoria.',
      'Simulação de IR para PJ: Simule diferentes formas de retirada (pro labore, distribuição de lucros) para pagar menos imposto.'
    ];
  }
  if (profileType === 'Estagiario') {
    return [
      'Aproveite benefícios de estágio: Verifique se está recebendo todos os direitos previstos na lei do estágio.'
    ];
  }
  // CLT ou autre
  return [
    'Plano de Saúde: Considere negociar ou aderir a um plano de saúde empresarial para reduzir custos.',
    'Previdência Privada: Avalie a possibilidade de contribuir para previdência privada e otimizar sua aposentadoria.'
  ];
}

type HoleriteResult = {
  salarioBruto: number;
  salarioLiquido: number;
  descontos: number;
  eficiencia: number;
  insights: { label: string; value: string }[];
  raw?: any; // Added raw property
};

function SummaryCards({ raw }: { raw: any }) {
  const cards = [
    {
      label: 'Salário Base',
      value: raw.gross_salary,
      color: 'from-blue-100 to-blue-50',
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
    },
    {
      label: 'Salário Líquido',
      value: raw.net_salary,
      color: 'from-green-100 to-green-50',
      icon: <FileText className="w-6 h-6 text-green-400" />,
    },
    {
      label: 'Total Proventos',
      value: raw.total_earnings,
      color: 'from-emerald-100 to-emerald-50',
      icon: <ArrowUpRight className="w-6 h-6 text-emerald-400" />,
    },
    {
      label: 'Total Descontos',
      value: raw.total_deductions,
      color: 'from-rose-100 to-rose-50',
      icon: <ArrowDownLeft className="w-6 h-6 text-rose-400" />,
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => (
        <div key={c.label} className={`rounded-2xl shadow-lg bg-gradient-to-br ${c.color} p-4 flex flex-col items-center justify-center glassmorphism animate-fade-in`}>
          <div className="mb-2">{c.icon}</div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{c.label}</div>
          <div className={`text-lg font-bold ${i===1? 'text-green-700':'text-blue-900'}`}>{c.value !== undefined && c.value !== null ? 'R$ ' + Number(c.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '–'}</div>
        </div>
      ))}
    </div>
  );
}

function StyledTable({ title, rows, color }: { title: string; rows: any[]; color: string }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="rounded-2xl shadow bg-white/70 backdrop-blur-md border border-gray-100 overflow-hidden mb-4 animate-fade-in">
      <div className="sticky top-0 bg-gradient-to-r from-white/80 to-gray-50/80 px-4 py-2 font-bold text-gray-700 border-b border-gray-200 z-10">{title}</div>
      <div className="max-h-64 overflow-y-auto relative">
        <table className="min-w-full text-sm">
          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i} className={i%2===0 ? 'bg-white/60' : 'bg-gray-50/60'}>
                <td className="px-4 py-2 text-gray-700 w-2/3">{row.description}</td>
                <td className={`px-4 py-2 text-right font-mono ${color}`}>{row.amount < 0 ? '-R$ ' : 'R$ '}{Math.abs(Number(row.amount)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 8 && <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />}
      </div>
    </div>
  );
}

const LABELS_PT: { [key: string]: string } = {
  company_name: 'Empresa',
  employee_name: 'Nome',
  position: 'Cargo',
  profile_type: 'Perfil',
  department: 'Departamento',
  admission_date: 'Admissão',
  period: 'Período',
  pj_role: 'Cargo PJ',
  gross_salary: 'Salário Bruto',
  net_salary: 'Salário Líquido',
  total_earnings: 'Total de Proventos',
  total_deductions: 'Total de Descontos',
  earnings: 'Proventos',
  deductions: 'Descontos',
  work_hours: 'Horas Trabalhadas',
  vale_refeicao: 'Vale-refeição',
  vale_alimentacao: 'Vale-alimentação',
  auxilio_educacao: 'Auxílio Educação',
  outros_beneficios: 'Outros Benefícios',
  inss_base: 'Base INSS',
  fgts_base: 'Base FGTS',
  irrf_base: 'Base IRRF',
  fgts_deposit: 'Depósito FGTS',
  dependents: 'Dependentes',
  cbo: 'CBO',
  base_calc_fgts: 'Base Cálc. FGTS',
  fgts_mes: 'FGTS do Mês',
  base_calc_irrf: 'Base Cálc. IRRF',
  faixa_irrf: 'Faixa IRRF',
  Resumo: 'Resumo',
};

function formatValuePT(k: string, v: any): React.ReactNode {
  if (v === null || v === undefined || v === '' || v === 'null') return <span className="text-gray-400 italic">(não informado)</span>;
  if (typeof v === 'number' && !isNaN(v)) return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  if (k.toLowerCase().includes('date') && typeof v === 'string' && v !== 'Invalid Date') {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR');
  }
  return v;
}

function PayslipBlock({ title, data }: { title: string; data: any }) {
  if (!data || typeof data !== 'object') return null;
  
  // Filtrer les valeurs significatives
  const significantEntries = Object.entries(data).filter(([k, v]: [string, any]) => {
    if (Array.isArray(v)) return false;
    if (v === null || v === undefined || v === '' || v === 'null') return false;
    if (typeof v === 'number' && v === 0) return false;
    if (typeof v === 'string' && v.trim() === '') return false;
    return true;
  });

  // Si aucune donnée significative, ne pas afficher le bloc
  if (significantEntries.length === 0) return null;

  return (
    <div className="mb-6 bg-white rounded-xl shadow p-4">
      <div className="font-bold text-blue-800 text-lg mb-2 mt-2">{title}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-base">
        {significantEntries.map(([k, v]: [string, any]) => {
          const label = LABELS_PT[k] || (k.charAt(0).toUpperCase() + k.slice(1));
          return (
            <React.Fragment key={k}>
              <div className="text-gray-700 font-medium">{label}:</div>
              <div className="font-bold text-gray-900 text-right">{formatValuePT(k, v)}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function PayslipSummaryCards({ ident, salarios }: { ident: any; salarios: any }) {
  const cards = [
    { label: 'Nome', value: ident.employee_name },
    { label: 'Empresa', value: ident.company_name },
    { label: 'Cargo', value: ident.position },
    { label: 'Período', value: ident.period },
    { label: 'Salário Bruto', value: salarios.gross_salary, color: 'from-blue-100 to-blue-50' },
    { label: 'Salário Líquido', value: salarios.net_salary, color: 'from-green-100 to-green-50' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {cards.map((c, i) => (
        <div key={c.label} className={`rounded-2xl shadow bg-gradient-to-br ${c.color || 'from-gray-100 to-white'} p-4 flex flex-col items-center glassmorphism`}>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{c.label}</div>
          <div className="text-lg font-bold text-blue-900">{formatValuePT(c.label, c.value)}</div>
        </div>
      ))}
    </div>
  );
}

function PayslipArrayTable({ title, rows, color }: { title: string; rows: any[]; color: string }) {
  if (!rows || !Array.isArray(rows) || rows.length === 0) return null;
  return (
    <div className="rounded-2xl shadow bg-white/70 backdrop-blur-md border border-gray-100 overflow-hidden mb-4 animate-fade-in">
      <div className="sticky top-0 bg-gradient-to-r from-white/80 to-gray-50/80 px-4 py-2 font-bold text-gray-700 border-b border-gray-200 z-10">{title}</div>
      <div className="max-h-64 overflow-y-auto relative">
        <table className="min-w-full text-sm">
          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i} className={i%2===0 ? 'bg-white/60' : 'bg-gray-50/60'}>
                <td className="px-4 py-2 text-gray-700 w-2/3">{row.description}</td>
                <td className={`px-4 py-2 text-right font-mono ${color}`}>{row.amount < 0 ? '-R$ ' : 'R$ '}{Math.abs(Number(row.amount)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 8 && <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />}
      </div>
    </div>
  );
}

function HoleriteTable({ linhas, totais }: { linhas: any[]; totais: any }) {
  if (!Array.isArray(linhas) || linhas.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
      <div className="font-bold text-xl text-center mb-4 text-blue-900">Recibo de Pagamento de Salário</div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-1 font-semibold">Descrição</th>
              <th className="border px-2 py-1 font-semibold">Referência</th>
              <th className="border px-2 py-1 font-semibold">Proventos</th>
              <th className="border px-2 py-1 font-semibold">Descontos</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l: any, i: number) => (
              <tr key={i} className={i%2===0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border px-2 py-1 text-gray-800">{l.descricao || ''}</td>
                <td className="border px-2 py-1 text-gray-700 text-center">{l.referencia || ''}</td>
                <td className="border px-2 py-1 text-green-700 text-right font-mono">{l.proventos || ''}</td>
                <td className="border px-2 py-1 text-red-600 text-right font-mono">{l.descontos || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totais && Object.keys(totais).length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(totais).map(([label, value]: [string, any], i: number) => (
            <div key={i} className="flex justify-between bg-blue-50 rounded px-3 py-2 font-semibold text-blue-900 border border-blue-100">
              <span>{label}</span>
              <span className="font-mono">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getHolField(raw: any, bloc: string, key: string, totauxLabel: string, linhaLabel: string) {
  // 1. Bloc enrichi
  if (raw[bloc]?.[key]) return raw[bloc][key];
  // 2. Totaux (label exact)
  if (raw.totais && raw.totais[totauxLabel]) return raw.totais[totauxLabel];
  // 3. Lignes (label exact)
  if (Array.isArray(raw.linhas)) {
    const l = raw.linhas.find((l: any) => (l.descricao || '').toUpperCase().includes(linhaLabel.toUpperCase()));
    if (l && (l.proventos || l.descontos)) return l.proventos || l.descontos;
  }
  return '—';
}

function formatMontant(m: any) {
  if (!m) return '—';
  if (typeof m === 'object' && m.valor !== undefined) {
    return 'R$ ' + Number(m.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
  if (typeof m === 'number') return 'R$ ' + m.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  if (typeof m === 'string') return m;
  // Si c'est un objet inattendu, afficher JSON stringifié pour éviter l'erreur React
  if (typeof m === 'object') return <span className="text-xs text-red-500">{JSON.stringify(m)}</span>;
  return String(m);
}

function HoleriteAnalysisDisplay({ raw }: { raw: any }) {
  // Fonction pour vérifier si une valeur est significative
  const hasSignificantValue = (value: any): boolean => {
    if (value == null || value === undefined || value === '') return false;
    if (typeof value === 'number') return value > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
      if (value.value !== undefined) return hasSignificantValue(value.value);
      if (value.valor !== undefined) return hasSignificantValue(value.valor);
      return Object.values(value).some(v => hasSignificantValue(v));
    }
    return true;
  };

  // Champs principaux - filtrer les valeurs significatives
  const infos = [
    { label: 'Empresa', value: raw.company_name },
    { label: 'Nome', value: raw.employee_name },
    { label: 'Cargo', value: raw.position },
    { label: 'Perfil', value: raw.profile_type },
    { label: 'Período', value: raw.period },
    { label: 'Admissão', value: raw.admission_date },
    { label: 'CBO', value: raw.cbo },
    { label: 'Departamento', value: raw.department },
    { label: 'Horas Trabalhadas', value: raw.work_hours },
    { label: 'Dependentes', value: raw.dependents },
  ].filter(i => hasSignificantValue(i.value));

  // Montants principaux - filtrer les valeurs significatives
  const montants = [
    { label: 'Salário Base', value: raw.gross_salary },
    { label: 'Salário Líquido', value: raw.net_salary },
    { label: 'Total Vencimentos', value: raw.total_earnings },
    { label: 'Total Descontos', value: raw.total_deductions },
    { label: 'INSS', value: raw.inss_base },
    { label: 'FGTS', value: raw.fgts_base },
    { label: 'IRRF', value: raw.irrf_base },
    { label: 'FGTS do Mês', value: raw.fgts_mes },
    { label: 'Base Cálc. FGTS', value: raw.base_calc_fgts },
    { label: 'Base Cálc. IRRF', value: raw.base_calc_irrf },
    { label: 'Faixa IRRF', value: raw.faixa_irrf },
    { label: 'Depósito FGTS', value: raw.fgts_deposit },
  ].filter(m => hasSignificantValue(m.value));

  // Earnings/deductions - filtrer les valeurs significatives
  const earnings = Array.isArray(raw.earnings) ? raw.earnings.filter((e: any) => 
    hasSignificantValue(e.amount) || hasSignificantValue(e.valor)
  ) : [];
  const deductions = Array.isArray(raw.deductions) ? raw.deductions.filter((d: any) => 
    hasSignificantValue(d.amount) || hasSignificantValue(d.valor)
  ) : [];

  // Résumé et recommandations
  const summary = raw.analysis?.summary;
  const oportunidades = Array.isArray(raw.analysis?.optimization_opportunities) ? 
    raw.analysis.optimization_opportunities.filter((opp: any) => 
      typeof opp === 'string' && opp.trim().length > 0
    ) : [];

  // Gestion spéciale du net : si c'est un tableau ou plusieurs candidats, afficher tous avec label
  let netCandidates = [];
  if (Array.isArray(raw.net_salary)) {
    netCandidates = raw.net_salary.filter((n: any) => n && n.label && !n.label.toLowerCase().includes('base de cálculo'));
  } else if (raw.net_salary && typeof raw.net_salary === 'object' && raw.net_salary.label && !raw.net_salary.label.toLowerCase().includes('base de cálculo')) {
    netCandidates = [raw.net_salary];
  } else if (raw.net_salary && typeof raw.net_salary === 'number') {
    netCandidates = [{ label: 'Salário Líquido', valor: raw.net_salary }];
  }

  // Vérifier s'il y a des données significatives à afficher
  const hasSignificantData = infos.length > 0 || montants.length > 0 || earnings.length > 0 || deductions.length > 0;

  if (!hasSignificantData) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-yellow-50 rounded-xl shadow p-6 text-center">
          <div className="text-xl font-bold text-yellow-800 mb-2">⚠️ Análise concluída</div>
          <div className="text-yellow-700">Nenhum dado significativo foi extraído deste documento.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-xl md:text-2xl font-bold text-blue-900 mb-1">Análise do Holerite</div>
        <div className="text-gray-700">Analisamos seu holerite e identificamos as seguintes oportunidades de otimização:</div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Coluna esquerda: Informações + valores + vencimentos/descontos */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="text-lg font-bold text-blue-900 mb-4">Detalhamento do Holerite</div>
          
          {/* Informações básicas */}
          {infos.length > 0 && (
            <div className="mb-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {infos.map((i, idx) => {
                let v = i.value;
                if (typeof v === 'object' && v !== null) v = v.value ?? v.valor ?? '—';
                return (
                  <React.Fragment key={idx}>
                    <div className="text-gray-500">{i.label}:</div>
                    <div className="text-gray-900 font-semibold">{v ?? '—'}</div>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Valores significativos */}
          {montants.length > 0 && (
            <div className="mb-2">
              {montants.map((m, idx) => {
                let v = m.value;
                if (typeof v === 'object' && v !== null) v = v.value ?? v.valor ?? '—';
                return (
                  <div key={idx} className="flex justify-between text-base">
                    <span>{m.label}:</span>
                    <span className="font-bold text-blue-900">{formatMontant(v)}</span>
                  </div>
                );
              })}
              {/* Exibição especial para o líquido se vários candidatos */}
              {netCandidates.length > 1 && (
                <div className="mt-2 text-xs text-gray-500">
                  Vários candidatos para o líquido: {netCandidates.map((n: any, i: number) => 
                    <span key={i} className="ml-2">{formatMontant(n)}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Vencimentos significatifs */}
          {earnings.length > 0 && (
            <>
              <div className="font-bold mt-4 mb-1 text-green-700">Vencimentos</div>
              <table className="w-full text-sm mb-2">
                <tbody>
                  {earnings.map((e: any, i: number) => (
                    <tr key={i}>
                      <td className="text-gray-700">{e.description}</td>
                      <td className="text-right font-mono text-green-700">
                        {formatMontant(e.amount || e.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Descontos significatifs */}
          {deductions.length > 0 && (
            <>
              <div className="font-bold mt-4 mb-1 text-red-700">Descontos</div>
              <table className="w-full text-sm mb-2">
                <tbody>
                  {deductions.map((d: any, i: number) => (
                    <tr key={i}>
                      <td className="text-gray-700">{d.description}</td>
                      <td className="text-right font-mono text-red-700">
                        {formatMontant(d.amount || d.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Coluna direita: Resumo e recomendações */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-lg font-bold text-blue-900 mb-4">Análise e Recomendações</div>
          
          {/* Resumo */}
          {summary && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800 mb-1">Resumo da Situação</div>
              <div className="text-sm text-blue-700">{summary}</div>
            </div>
          )}

          {/* Oportunidades de otimização */}
          {oportunidades.length > 0 ? (
            <div className="space-y-3">
              <div className="font-semibold text-green-800 mb-2">💡 Oportunidades de Otimização ({oportunidades.length})</div>
              {oportunidades.map((opp: string, idx: number) => (
                <div key={idx} className="p-3 bg-green-50 rounded-lg border-l-2 border-green-300">
                  <div className="text-sm text-green-800">{opp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800 mb-1">📋 Análise das Recomendações</div>
              <div className="text-sm text-blue-700">
                Nenhuma oportunidade de otimização específica foi identificada para esta folha de pagamento.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PayslipAnalysisDetail({ result, onClose }: { result: any; onClose: () => void }) {
  if (!result) return null;
  const raw = result.raw || {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white/90 rounded-2xl shadow-2xl max-w-5xl w-full p-4 md:p-8 flex flex-col gap-8 relative max-h-[95vh] overflow-y-auto glassmorphism animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={onClose}>&times;</button>
        <HoleriteAnalysisDisplay raw={raw} />
      </div>
    </div>
  );
}



function NoDataMessage({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center">
      <div className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo ao PIM!</div>
      <p className="text-gray-600 mb-6">
        Para começar a analisar seus dados financeiros, faça o upload do seu primeiro holerite.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
          onClick={onUpload}
        >
          <Upload className="w-5 h-5" />
          Upload Holerite
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
        >
          <MessageCircle className="w-5 h-5" />
          Falar com Especialista
        </button>
      </div>
    </div>
  );
}

import { DASHBOARD_V2 } from '@/lib/flags';
export default function DashboardFullWidth() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [holeriteResult, setHoleriteResult] = useState<HoleriteResult | null>(null);
  const [showAnalysisDetail, setShowAnalysisDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [financialHealthScore, setFinancialHealthScore] = useState(75);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [employmentStatus, setEmploymentStatus] = useState("");
  const perfilRef = useRef<HTMLDivElement>(null);
  const SALARIO_MINIMO = 1320;
  const { supabase, session } = useSupabase(); // Utiliser la session du contexte
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = typeof params!.locale === 'string' ? params!.locale : 'br';
  const [showOnboarding, setShowOnboarding] = useState(true); // Gérer la visibilité

  // Ajout : Redirection si session absente
  useEffect(() => {
    if (session === null) {
      router.replace(`/${locale}/login?redirectTo=/${locale}/dashboard`);
    }
  }, [session, router, locale]);

  const { onboarding } = useUserOnboarding(userId || undefined);

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  const onboardingComplete = onboarding ? (onboarding.profile_completed && onboarding.checkup_completed && onboarding.holerite_uploaded) : false;

  // SUPPRESSION DU LOCALSTORAGE - Utiliser uniquement les vraies données

  // 2. Synchronisation avec Supabase (en arrière-plan ou sur demande)
  const syncWithSupabase = async () => {
    // Utiliser uniquement l'userId connecté, pas de données de test
    if (!userId) {
      console.log('⚠️ Aucun utilisateur connecté, pas de synchronisation');
      return;
    }
    
    console.log('🔄 Début syncWithSupabase pour userId:', userId);
    setIsSyncing(true);
    try {
      const { data, error } = await supabase
        .from('holerites')
        .select('*')
        .eq('user_id', userId as string)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      console.log('🔍 Résultat de la requête Supabase:');
      console.log('Data:', data);
      console.log('Error:', error);
      
      if (data && !error) {
        console.log('📊 Données récupérées de Supabase:', data);
        
        // DEBUG: Affichage JSON brut pour voir la structure
        console.log("DATA RECUE:", data);
        
        // DEBUG: Structure détaillée des données
        console.log('🔍 STRUCTURE DES DONNÉES RECUES:', {
          structured_data: data.structured_data,
          final_data: data.structured_data?.final_data,
          direct_columns: {
            salario_bruto: data.salario_bruto,
            salario_liquido: data.salario_liquido,
            gross_salary: data.gross_salary,
            net_salary: data.net_salary
          }
        });
        
        // Extraction sécurisée des données avec gestion des différents formats
        const extractValue = (obj: any, path: string, defaultValue: any = 0) => {
          if (!obj) return defaultValue;
          
          // Gestion des chemins imbriqués
          const keys = path.split('.');
          let value = obj;
          
          for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
              value = value[key];
            } else {
              return defaultValue;
            }
          }
          
          // Conversion en nombre si possible
          if (value === null || value === undefined || value === '') {
            return defaultValue;
          }
          
          // Gestion des objets avec propriété 'valor' (format JSON)
          if (typeof value === 'object' && value !== null && 'valor' in value) {
            value = value.valor;
          }
          
          // Gestion des objets avec propriété 'value' (format alternatif)
          if (typeof value === 'object' && value !== null && 'value' in value) {
            value = value.value;
          }
          
          // Gestion des valeurs text qui doivent être converties en nombre
          if (typeof value === 'string') {
            // Nettoyer la valeur (enlever espaces, caractères non numériques sauf point et virgule)
            const cleanedValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
            const numValue = Number(cleanedValue);
            return isNaN(numValue) ? defaultValue : numValue;
          }
          
          const numValue = Number(value);
          return isNaN(numValue) ? defaultValue : numValue;
        };

        // PRIORITÉ 1: Colonnes directes de la table (gestion des types text)
        let salarioBruto = extractValue(data, 'salario_bruto') || 0;
        let salarioLiquido = extractValue(data, 'salario_liquido') || 0;

        // PRIORITÉ 2: structured_data si colonnes directes vides
        if (!salarioBruto && data.structured_data) {
          salarioBruto = extractValue(data.structured_data, 'final_data.salario_bruto') ||
                         extractValue(data.structured_data, 'final_data.gross_salary') ||
                         extractValue(data.structured_data, 'salario_bruto') ||
                         extractValue(data.structured_data, 'gross_salary') ||
                         extractValue(data.structured_data, 'salario_bruto_total') ||
                         extractValue(data.structured_data, 'total_gross_salary') ||
                         0;
        }

        if (!salarioLiquido && data.structured_data) {
          salarioLiquido = extractValue(data.structured_data, 'final_data.salario_liquido') ||
                           extractValue(data.structured_data, 'final_data.net_salary') ||
                           extractValue(data.structured_data, 'salario_liquido') ||
                           extractValue(data.structured_data, 'net_salary') ||
                           extractValue(data.structured_data, 'salario_liquido_total') ||
                           extractValue(data.structured_data, 'total_net_salary') ||
                           0;
        }

        // Extraction des descontos avec mapping exact
        const descontos = extractValue(data.structured_data, 'final_data.descontos') ||
                         extractValue(data.structured_data, 'total_deductions') ||
                         extractValue(data.structured_data, 'descontos') ||
                         (salarioBruto > 0 && salarioLiquido > 0 ? salarioBruto - salarioLiquido : 0);
        
        const eficiencia = salarioBruto > 0 && salarioLiquido > 0 ? 
          Number(((salarioLiquido / salarioBruto) * 100).toFixed(1)) : 0;

        // Extraction des informations d'identification avec mapping exact
        // PRIORITÉ 1: final_data (nouvelle structure unifiée)
        // PRIORITÉ 2: structured_data direct (ancienne structure)
        // PRIORITÉ 3: colonnes directes de la table
        const employeeName = data.structured_data?.final_data?.employee_name ||
                           data.structured_data?.employee_name ||
                           data.nome ||
                           '';

        const companyName = data.structured_data?.final_data?.company_name ||
                          data.structured_data?.company_name ||
                          data.empresa ||
                          '';

        const position = data.structured_data?.final_data?.position ||
                        data.structured_data?.position ||
                        '';

        const profileType = data.structured_data?.final_data?.statut ||
                          data.structured_data?.profile_type ||
                          data.perfil ||
                          '';

        const period = data.structured_data?.final_data?.period ||
                     data.structured_data?.period ||
                     '';

        // Extraction des données supplémentaires
        // Fonction pour calculer le total des bénéfices à partir d'un tableau d'objets
        const calculateBenefitsTotal = (beneficiosArray: any[]): number => {
          if (!Array.isArray(beneficiosArray)) return 0;
          return beneficiosArray.reduce((total, beneficio) => {
            if (beneficio && typeof beneficio === 'object') {
              const valor = beneficio.valor || beneficio.value || 0;
              return total + (Number(valor) || 0);
            }
            return total;
          }, 0);
        };

        // Extraire les bénéfices depuis différentes structures
        const beneficiosArray = data.structured_data?.final_data?.beneficios ||
                               data.structured_data?.beneficios ||
                               [];
        
        const beneficios = calculateBenefitsTotal(beneficiosArray);

        const seguros = extractValue(data.structured_data, 'final_data.seguros') ||
                       extractValue(data.structured_data, 'seguros') ||
                       0;

        const pays = data.structured_data?.final_data?.pays ||
                   data.structured_data?.pays ||
                   data.pays ||
                   '';

        const incoherenceDetectee = data.structured_data?.final_data?.incoherence_detectee ||
                                  data.structured_data?.incoherence_detectee ||
                                  data.incoherence_detectee ||
                                  false;

        // DIAGNOSTIC DÉTAILLÉ DES SALAIRES
        console.log('🔍 DIAGNOSTIC SALARIES:', {
          direct_salario_bruto: data.salario_bruto,
          direct_salario_liquido: data.salario_liquido,
          structured_final_salario_bruto: data.structured_data?.final_data?.salario_bruto,
          structured_final_salario_liquido: data.structured_data?.final_data?.salario_liquido,
          structured_salario_bruto: data.structured_data?.salario_bruto,
          structured_salario_liquido: data.structured_data?.salario_liquido,
          structured_gross_salary: data.structured_data?.gross_salary,
          structured_net_salary: data.structured_data?.net_salary,
          final_salario_bruto: salarioBruto,
          final_salario_liquido: salarioLiquido
        });

        // DIAGNOSTIC STRUCTURE COMPLÈTE
        console.log('🔍 STRUCTURE COMPLÈTE structured_data:', JSON.stringify(data.structured_data, null, 2));

        console.log('🔍 Données extraites:', {
          salarioBruto,
          salarioLiquido,
          descontos,
          eficiencia,
          employeeName,
          companyName,
          position,
          profileType,
          period
        });
        
        // DEBUG: Vérifier si les valeurs sont correctes
        console.log('🔍 VÉRIFICATION DES VALEURS:');
        console.log('Salário Bruto > 0?', salarioBruto > 0);
        console.log('Salário Líquido > 0?', salarioLiquido > 0);
        console.log('Employee Name non vide?', employeeName && employeeName.length > 0);
        console.log('Company Name non vide?', companyName && companyName.length > 0);

        // Extraction des recommandations IA avec fallbacks multiples
        const aiRecommendations = data.structured_data?.analysis_result?.recommendations?.recommendations ||
                                data.structured_data?.recommendations?.recommendations ||
                                data.structured_data?.aiRecommendations ||
                                [];
        
        const resumeSituation = data.structured_data?.analysis_result?.recommendations?.resume_situation ||
                              data.structured_data?.recommendations?.resume_situation ||
                              data.structured_data?.resumeSituation ||
                              '';
        
        const scoreOptimisation = data.structured_data?.analysis_result?.recommendations?.score_optimisation ||
                                data.structured_data?.recommendations?.score_optimisation ||
                                data.structured_data?.scoreOptimisation ||
                                0;

        console.log('🔍 Recommandations IA extraites:', {
          aiRecommendations: aiRecommendations.length,
          resumeSituation: resumeSituation ? 'Présent' : 'Absent',
          scoreOptimisation
        });

        // Log final des données dashboard
        console.log('Donnée dashboard finale:', {
          salarioBruto,
          salarioLiquido,
          descontos,
          eficiencia,
          employeeName,
          companyName,
          position,
          profileType,
          period,
          beneficios,
          seguros,
          pays,
          incoherenceDetectee,
          aiRecommendations: aiRecommendations.length
        });

        // VÉRIFICATION CRITIQUE : Rejeter les données de fallback
        console.log('🔍 VÉRIFICATION DES DONNÉES DE TEST:');
        console.log('Employee Name:', employeeName);
        console.log('Company Name:', companyName);
        console.log('Salário Bruto:', salarioBruto);
        console.log('Est-ce des données de test?', employeeName === 'Test User' || companyName === 'Test Company Ltda' || salarioBruto === 5000);
        
        // TEMPORAIREMENT DÉSACTIVÉ : Permettre l'affichage de toutes les données
        // if (employeeName === 'Test User' || companyName === 'Test Company Ltda' || salarioBruto === 5000) {
        //   console.warn('⚠️ Données de fallback détectées, pas d\'affichage');
        //   setHoleriteResult(null);
        //   return;
        // }

        // VÉRIFICATION SUPPLEMENTAIRE : Rejeter aussi les données de test OCR
        // TEMPORAIREMENT DÉSACTIVÉ : Permettre l'affichage de toutes les données
        // if (data.structured_data?.final_data?.employee_name === 'Test User' || 
        //     data.structured_data?.final_data?.company_name === 'Test Company Ltda') {
        //   console.warn('⚠️ Données de test OCR détectées, pas d\'affichage');
        //   setHoleriteResult(null);
        //   return;
        // }

        // Créer le nouveau holeriteResult avec les données Supabase
        const newHoleriteResult = {
          salarioBruto,
          salarioLiquido,
          descontos,
          eficiencia,
          raw: {
            ...data.structured_data,
            employee_name: employeeName,
            company_name: companyName,
            position: position,
            profile_type: profileType,
            period: period,
            beneficios,
            seguros,
            pays,
            incoherence_detectee: incoherenceDetectee,
            recommendations: {
              recommendations: aiRecommendations,
              resume_situation: resumeSituation,
              score_optimisation: scoreOptimisation
            },
            aiRecommendations,
            resumeSituation,
            scoreOptimisation,
          },
          insights: [],
        };

        console.log('🔍 NOUVEAU HOLERITE RESULT CRÉÉ:', {
          salarioBruto: newHoleriteResult.salarioBruto,
          salarioLiquido: newHoleriteResult.salarioLiquido,
          descontos: newHoleriteResult.descontos,
          eficiencia: newHoleriteResult.eficiencia
        });

        // Mettre à jour holeriteResult avec les données Supabase
        setHoleriteResult(newHoleriteResult);
        
        // Nettoyer le localStorage pour éviter les conflits
        if (typeof window !== 'undefined') {
          localStorage.removeItem('holeriteResult');
        }
        
        // SUPPRESSION DU LOCALSTORAGE - Utiliser uniquement les vraies données
        // localStorage.removeItem('holeriteResult');
      } else {
        console.log('❌ Aucune donnée trouvée ou erreur:', error);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation avec Supabase:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Synchronisation automatique à chaque changement de userId
  useEffect(() => {
    // Synchroniser seulement si userId est présent
    if (userId) {
      syncWithSupabase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Ajoute ce useEffect pour vider le localStorage après login/logout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'supabase.auth.token' && !event.newValue) {
          // Déconnexion détectée
          localStorage.removeItem('holeriteResult');
          localStorage.removeItem('userProfile');
        }
      });
    }
  }, []);

  // À chaque update, sauvegarde dans localStorage
  useEffect(() => {
    if (holeriteResult && typeof window !== 'undefined') {
      console.log('💾 Dashboard: Sauvegarde holeriteResult dans localStorage:', holeriteResult);
      localStorage.setItem('holeriteResult', JSON.stringify(holeriteResult));
    }
  }, [holeriteResult]);

  // Charger automatiquement les données sauvegardées du localStorage au démarrage
  // MAIS seulement si pas de données Supabase disponibles
  useEffect(() => {
    if (typeof window !== 'undefined' && !holeriteResult) {
      const savedHolerite = localStorage.getItem('holeriteResult');
      if (savedHolerite) {
        try {
          const parsedResult = JSON.parse(savedHolerite);
          console.log('📊 Dashboard: Chargement des données sauvegardées:', parsedResult);
          
          // Vérifier si les données sauvegardées ont des valeurs valides
          if (parsedResult.salarioBruto > 0 || parsedResult.salarioLiquido > 0) {
            console.log('✅ Données sauvegardées valides, utilisation du localStorage');
            setHoleriteResult(parsedResult);
          } else {
            console.log('⚠️ Données sauvegardées invalides, attente des données Supabase');
            // Ne pas utiliser les données invalides du localStorage
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données sauvegardées:', error);
        }
      }
    }
  }, [holeriteResult]);

  // DEBUG: Log holeriteResult pour diagnostic
  console.log('🔍 SUMMARY CARDS - holeriteResult:', holeriteResult);
  console.log('🔍 SUMMARY CARDS - salarioBruto:', holeriteResult?.salarioBruto);
  console.log('🔍 SUMMARY CARDS - salarioLiquido:', holeriteResult?.salarioLiquido);
  
  // DEBUG: Vérifier si holeriteResult a été mis à jour par syncWithSupabase
  console.log('🔍 SUMMARY CARDS - holeriteResult complet:', JSON.stringify(holeriteResult, null, 2));

  // Use holeriteResult to update summary cards if available
  const summaryCardsData = holeriteResult ? [
    {
      title: "Salário Bruto",
      value: holeriteResult.salarioBruto > 0 ? 
        `R$ ${holeriteResult.salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
        'R$ 0,00',
      color: "border-blue-100 bg-white text-blue-700",
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${formatPeriod(holeriteResult.raw.period)}` : "Dados do holerite",
      isMinSalary: holeriteResult.salarioBruto > 0 && Math.abs(holeriteResult.salarioBruto - SALARIO_MINIMO) < 0.01
    },
    {
      title: "Salário Líquido",
      value: holeriteResult.salarioLiquido > 0 ? 
        `R$ ${holeriteResult.salarioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
        'R$ 0,00',
      color: "border-green-100 bg-white text-green-700",
      icon: <FileText className="w-5 h-5 text-green-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${formatPeriod(holeriteResult.raw.period)}` : "Dados do holerite",
    },
    {
      title: "Descontos",
      value: holeriteResult.descontos > 0 ? 
        `R$ ${holeriteResult.descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
        'R$ 0,00',
      color: "border-orange-100 bg-white text-orange-700",
      icon: <ArrowDownUp className="w-5 h-5 text-orange-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${formatPeriod(holeriteResult.raw.period)}` : "Dados do holerite",
    },
    {
      title: "Eficiência",
      value: holeriteResult.eficiencia > 0 ? 
        `${holeriteResult.eficiencia.toFixed(1)}%` : 
        '0,0%',
      color: "border-purple-100 bg-white text-purple-700",
      icon: <PercentCircle className="w-5 h-5 text-purple-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${formatPeriod(holeriteResult.raw.period)}` : "Dados do holerite",
    },
  ] : [];

  // DEBUG: Ajouter des logs pour vérifier les valeurs dans holeriteResult
  console.log('🔍 DEBUG SUMMARY CARDS - holeriteResult:', {
    salarioBruto: holeriteResult?.salarioBruto,
    salarioLiquido: holeriteResult?.salarioLiquido,
    descontos: holeriteResult?.descontos,
    eficiencia: holeriteResult?.eficiencia,
    raw: holeriteResult?.raw
  });

  // Affiche automatiquement le détail après analyse
  const handleHoleriteResult = (result: HoleriteResult) => {
    console.log('🎯 Dashboard: Nouveau résultat holerite reçu:', result);
    console.log('🎯 Structure du résultat:', {
      salarioBruto: result.salarioBruto,
      salarioLiquido: result.salarioLiquido,
      descontos: result.descontos,
      eficiencia: result.eficiencia,
      raw: result.raw
    });
    setHoleriteResult(result);
    if (typeof window !== 'undefined') localStorage.setItem('holeriteResult', JSON.stringify(result));
    setShowUploadModal(false);
    setShowAnalysisDetail(true);
    // Automatiquement basculer vers l'onglet Overview pour afficher les données
    setActiveTab("Overview");
  };

  // Ajoute une fonction pour scroller sur la section Perfil
  const BENEFIT_CATALOG: (Omit<Beneficio, "detectado"> & { keys: string[] })[] = [
    {
      tipo: "Vale Refeição",
      comentario: "Ajuda na alimentação diária e pode ser negociado.",
      actionLink: "/recursos/vale-refeicao",
      keys: ["vale refeição", "vale refeicao", "vr", "vale alimentação", "vale alimentacao", "va"],
    },
    {
      tipo: "Plano de Saúde",
      comentario: "Compare cobertura e rede credenciada.",
      actionLink: "/recursos/plano-saude",
      keys: ["plano de saúde", "plano de saude", "assistência médica", "assistencia medica"],
    },
    {
      tipo: "Previdência Privada",
      comentario: "Pense na aposentadoria: benefícios fiscais.",
      actionLink: "/recursos/previdencia-privada",
      keys: ["previdência", "previdencia", "pgbl", "vgbl"],
    },
    {
      tipo: "FGTS",
      comentario: "Depósitos regulares garantem segurança financeira.",
      actionLink: "/recursos/fgts",
      keys: ["fgts"],
    },
  ];

  const [beneficiosDetectados, setBeneficiosDetectados] = useState<Beneficio[] | null>(null);

  useEffect(() => {
    const fetchBeneficios = async () => {
      try {
        // 1. Si on dispose déjà d'un holerite analysé, on l'utilise comme source principale
        if (holeriteResult?.raw) {
          // Vérifier d'abord si des bénéfices sont explicitement extraits par l'IA
          const beneficiosExtraits = holeriteResult.raw.beneficios || [];
          const segurosExtraits = holeriteResult.raw.seguros || [];
          
          // Si l'IA a extrait des bénéfices, les utiliser
          if (beneficiosExtraits.length > 0 || segurosExtraits.length > 0) {
            console.log('🔍 Bénéfices extraits par l\'IA:', { beneficiosExtraits, segurosExtraits });
            setBeneficiosDetectados(
              BENEFIT_CATALOG.map((b) => ({
                tipo: b.tipo,
                comentario: b.comentario,
                actionLink: b.actionLink,
                detectado: beneficiosExtraits.some((beneficio: any) => 
                  beneficio.toLowerCase().includes(b.tipo.toLowerCase()) ||
                  b.keys.some((k) => beneficio.toLowerCase().includes(k))
                ),
              }))
            );
          } else {
            // Si aucun bénéfice extrait, chercher dans le texte OCR
            const ocrText = holeriteResult.raw.ocr_text || '';
            console.log('🔍 Recherche dans le texte OCR:', ocrText.substring(0, 200) + '...');
            setBeneficiosDetectados(
              BENEFIT_CATALOG.map((b) => ({
                tipo: b.tipo,
                comentario: b.comentario,
                actionLink: b.actionLink,
                detectado: b.keys.some((k) => ocrText.toLowerCase().includes(k)),
              }))
            );
          }
          return; // pas besoin d'interroger la BD
        }

        // 2. Si aucun holerite n'est chargé, on récupère les données sauvegardées (manuel ou dernier scan)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('beneficios_usuario')
          .select('tipo, ativo')
          .eq('user_id', user.id);
        if (error) throw error;
        if (data && data.length > 0) {
          const map = new Map<string, boolean>();
          data.forEach((row: any) => map.set(row.tipo, row.ativo));
          setBeneficiosDetectados(
            BENEFIT_CATALOG.map((b) => ({
              tipo: b.tipo,
              comentario: b.comentario,
              actionLink: b.actionLink,
              detectado: map.get(b.tipo) || false,
            }))
          );
        } else {
          // fallback simple : aucun enregistrement => aucun benefício ativo
          setBeneficiosDetectados(
            BENEFIT_CATALOG.map((b) => ({
              tipo: b.tipo,
              comentario: b.comentario,
              actionLink: b.actionLink,
              detectado: false,
            }))
          );
        }
      } catch (err) {
        console.error('Erro fetch beneficios:', err);
      }
    };
    fetchBeneficios();
  }, [holeriteResult]);

  const handleSidebarNav = (label: string) => {
    setActiveTab(label);
    // ici tu peux ajouter d'autres actions pour d'autres sections si besoin
  };

  const { data: investimentos = [] } = useInvestimentos(userId, holeriteResult?.raw);
  const { latestCheckup, loading: checkupLoading } = useFinancialCheckup(userId || undefined);

  const DashboardPerfilView = dynamic(() => import("@/components/dashboard/DashboardPerfilView"), {
    loading: () => <div className="py-8 text-center text-emerald-900">Chargement du profil...</div>,
    ssr: false
  })

  const FinancialHealthScore = dynamic(() => import("@/components/dashboard/FinancialHealthScore"), {
    loading: () => <div className="py-8 text-center text-emerald-900">Chargement du score financier...</div>,
    ssr: false
  })

  const PersonalizedRecommendations = dynamic(() => import("@/components/dashboard/PersonalizedRecommendations"), {
    loading: () => <div className="py-8 text-center text-emerald-900">Chargement des recommandations...</div>,
    ssr: false
  })
const Beneficios = dynamic(() => import("@/components/beneficios/Beneficios"), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement des bénéfices...</div>,
  ssr: false
})
const BemEstar = dynamic(() => import("@/components/bemEstar/BemEstar").then(m => m.default), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement du module bien-être...</div>,
  ssr: false
})
const Seguros = dynamic(() => import("@/components/seguros/Seguros").then(m => m.default), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement des assurances...</div>,
  ssr: false
})
const InvestimentosComp = dynamic(() => import("@/components/investimentos/Investimentos").then(m => m.default), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement des investissements...</div>,
  ssr: false
})

const FinancialCheckupSummaryCard = dynamic(() => import("@/components/financial-checkup/FinancialCheckupSummaryCard"), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement du Financial Check-up...</div>,
  ssr: false
})

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 animate-fadeIn">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block col-span-2 mb-8 lg:mb-0">
          <div className="sticky top-8 pr-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Navigation principale */}
            <nav className="space-y-1">
              {navItems.map((item, i) => (
                <button
                  key={i}
                  data-tab={item.label}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === item.label 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => handleSidebarNav(item.label)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Notification badge - SUPPRIMÉ */}
          </div>
        </aside>

        {/* Upload Holerite Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-8" onClick={() => setShowUploadModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-4xl max-h-[85vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10" onClick={() => setShowUploadModal(false)}>&times;</button>
              <UploadHolerite onResult={handleHoleriteResult} />
            </div>
          </div>
        )}
        {/* Main content dynamique */}
        <section className="col-span-12 lg:col-span-10 flex flex-col gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 lg:pl-6">
          {/* Guarded V2 hero + top row (non-destructive) */}
          {DASHBOARD_V2 && (
            <>
              {/* Hero Financial Check-up 360° elevated to top */}
              {latestCheckup && !checkupLoading && (
                // Server component placeholder; chart still loaded dynamically elsewhere
                // @ts-expect-error Async Server Component
                <(await import('@/components/dashboard-v2/HeroFinancialCheck')).default
                  checkup={latestCheckup}
                  locale={locale as string || 'br'}
                />
              )}

              {/* Top 3 cards (reuse same computed values) */}
              {/* @ts-expect-error Async Server Component */}
              <(await import('@/components/dashboard-v2/TopRow')).default
                locale={locale as string || 'br'}
                netSalaryCard={{
                  title: 'Salário Líquido',
                  value: holeriteResult?.salarioLiquido ?? '—',
                  hint: holeriteResult?.raw?.period ? `Holerite ${holeriteResult.raw.period}` : undefined,
                }}
                monthlyBenefitsCard={{
                  title: 'Benefícios Mensais',
                  value: beneficiosDetectados?.filter(b => b.detectado).length ?? 0,
                }}
                salaryAnalysisCard={{
                  title: 'Análise Salarial',
                  value: holeriteResult?.eficiencia ? `${holeriteResult.eficiencia.toFixed(1)}%` : '—',
                }}
              />

              {/* CTA to improve score (keeps existing navigation) */}
              {(await import('@/components/dashboard-v2/CTAImproveScore')).default({ href: '/br/simulador' })}
            </>
          )}

          
          {activeTab === "Overview" && (
            <Overview 
              holeriteResult={holeriteResult}
              financialHealthScore={financialHealthScore}
              locale={locale as string || 'br'}
              onUploadClick={() => router.push('/br/scan-new-pim')}
            />
          )}

          {activeTab === "Salário" && (
            <>
              {/* Résumé cards */}
              {summaryCardsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {summaryCardsData.map((card, i) => (
                  <div key={i} className={`flex flex-col w-full min-h-[120px] px-4 md:px-6 py-4 rounded-2xl border ${card.color} shadow-sm items-start transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}>
                    <div className="flex items-center gap-2 mb-2">
                      {card.icon}
                      <span className="font-semibold text-base flex items-center">{card.title}
                        {card.title === "Eficiência" && (
                          <span className="relative group ml-1 align-middle flex items-center">
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
                            <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-20 shadow-lg">
                              Calculado como Salário Líquido dividido por Salário Bruto. Indica sua capacidade de converter o bruto em neto.
                            </span>
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-xl font-bold flex items-center gap-2">
                      {card.value}
                      {card.title === "Salário Bruto" && card.isMinSalary && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Salário Mínimo</span>
                      )}
                    </span>
                    {card.source && (
                      <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {holeriteResult ? (
                          <>
                            <FileText className="w-3 h-3" />
                            {card.source}
                          </>
                        ) : (
                          <>
                            <Info className="w-3 h-3" />
                            {card.source}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              ) : (
                <NoDataMessage onUpload={() => router.push('/br/scan-new-pim')} />
              )}
              
              {/* Recommandations IA basées sur l'analyse du holerite */}
              <AIRecommendations 
                recommendations={holeriteResult?.raw?.recommendations?.recommendations || 
                              holeriteResult?.raw?.analysis_result?.recommendations?.recommendations || 
                              holeriteResult?.raw?.aiRecommendations || []}
                resumeSituation={holeriteResult?.raw?.recommendations?.resume_situation || 
                               holeriteResult?.raw?.analysis_result?.recommendations?.resume_situation || 
                               holeriteResult?.raw?.resumeSituation}
                scoreOptimisation={holeriteResult?.raw?.recommendations?.score_optimisation || 
                                 holeriteResult?.raw?.analysis_result?.recommendations?.score_optimisation || 
                                 holeriteResult?.raw?.scoreOptimisation}
              />
              
              {/* Recommandations personnalisées basées sur le quiz */}
              <PersonalizedRecommendations 
                quizAnswers={quizAnswers}
                employmentStatus={employmentStatus}
                financialHealthScore={financialHealthScore}
              />
              
              {/* Recommandations générales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {recommendations.map((rec, i) => (
                  <div key={i} className={`flex flex-col w-full min-h-[100px] p-4 md:p-6 rounded-2xl border shadow bg-white ${rec.color} transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded mb-2 w-max ${rec.tag}`}>{rec.label}</span>
                    <span className="font-bold text-base mb-1 text-gray-800">{rec.title}</span>
                    <span className="text-gray-600 text-sm mb-3">{rec.desc}</span>
                    <button className="mt-auto bg-white border border-gray-200 hover:bg-gray-50 text-emerald-700 font-semibold px-3 py-1.5 rounded shadow-sm text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-400">{rec.btn}</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "Benefícios" && (
            <Beneficios
              userStatus={holeriteResult?.raw?.profile_type || employmentStatus || "CLT"}
              beneficios={beneficiosDetectados || []}
              onSimularPacote={() => router.push("/simuladores/beneficios")}
            />
          )}

          {activeTab === "Well-being" && (
            <BemEstar userId={userId} employmentStatus={employmentStatus} />
          )}
 
          {activeTab === "Seguros" && (
            <Seguros userId={userId} employmentStatus={employmentStatus} holeriteRaw={holeriteResult?.raw} />
          )}

          {activeTab === "Investimentos" && (
            <InvestimentosComp status={employmentStatus} investimentos={investimentos} />
          )}

          {activeTab === "Direitos Sociais" && (
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-8">
              <div className="font-semibold text-lg mb-4 text-emerald-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-600" /> Direitos Sociais
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* FGTS */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-900">FGTS</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">Fundo de Garantia por Tempo de Serviço</p>
                  <div className="text-lg font-bold text-blue-900">
                    {holeriteResult?.raw?.fgts ? `R$ ${holeriteResult.raw.fgts.toLocaleString('pt-BR')}` : 'N/A'}
                  </div>
                </div>

                {/* Férias */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-semibold text-green-900">Férias</span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">Saldo de férias disponível</p>
                  <div className="text-lg font-bold text-green-900">30 dias</div>
                </div>

                {/* 13º Salário */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-semibold text-purple-900">13º Salário</span>
                  </div>
                  <p className="text-sm text-purple-700 mb-2">Próximo pagamento</p>
                  <div className="text-lg font-bold text-purple-900">Dezembro 2024</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Histórico & Documentos" && (
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-8">
              <div className="font-semibold text-lg mb-4 md:mb-6 text-emerald-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-600" /> Histórico & Documentos
              </div>
              <HoleriteHistory />
            </div>
          )}
          
          {activeTab === "Dados" && (
            <>
              {/* Composant DashboardPerfilView pour l'édition des données */}
              <DashboardPerfilView holeriteResult={holeriteResult} user={null} onShowHolerite={() => setShowAnalysisDetail(true)} />
              
              {/* Section Dados do Holerite */}
              {holeriteResult && holeriteResult.raw && (
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6">
                  <div className="font-semibold text-lg mb-4 text-emerald-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-emerald-600" /> Dados do Holerite
                  </div>
                  <HoleriteAnalysisDisplay raw={holeriteResult.raw} />
                </div>
              )}
            </>
          )}
          
          {/* Pour les autres onglets, afficher un message temporaire */}
          {activeTab !== "Dados" && activeTab !== "Overview" && activeTab !== "Salário" && activeTab !== "Benefícios" && activeTab !== "Well-being" && activeTab !== "Seguros" && activeTab !== "Investimentos" && activeTab !== "Direitos Sociais" && activeTab !== "Histórico & Documentos" && (
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-8 text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{activeTab}</div>
              <p className="text-gray-600">Cette section sera bientôt disponible.</p>
            </div>
          )}
        </section>
        {/* Colonne droite - Masquée sur mobile */}
        <aside className="hidden lg:flex col-span-12 lg:col-span-3 xl:col-span-3 flex-col gap-8">
          {/* Financial Check-up Summary */}
          {latestCheckup && !checkupLoading && (
            <FinancialCheckupSummaryCard 
              checkup={latestCheckup} 
              locale={locale as string || 'br'} 
            />
          )}
          {/* Modal détail analyse */}
          {showAnalysisDetail && holeriteResult && (
            <PayslipAnalysisDetail result={holeriteResult} onClose={() => setShowAnalysisDetail(false)} />
          )}
        </aside>
        </div>
        
        {/* Navigation mobile en bas d'écran - Nouvelle barre optimisée */}
        {(() => {
          const DashMobileTabBar = dynamic(() => import("@/components/dash/DashMobileTabBar"), {
            loading: () => null,
            ssr: false
          });
          return (
            <DashMobileTabBar
              activeTab={activeTab}
              onTabChange={handleSidebarNav}
            />
          );
        })()}
      </main>
  );
}

