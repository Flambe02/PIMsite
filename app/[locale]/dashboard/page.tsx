"use client"

import Image from "next/image";
import { BarChart3, Gift, Heart, Shield, TrendingUp, FileText, PercentCircle, ArrowDownUp, Download, CheckCircle2, MessageCircle, PieChart as PieIcon, Upload, UserCircle, LogOut, Menu, Lightbulb, HelpCircle, Info, ArrowUpRight, ArrowDownLeft, ArrowRight } from "lucide-react";
import BemEstar from "@/components/bemEstar/BemEstar";
import Seguros from "@/components/seguros/Seguros"; // Importer Seguros
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import DashboardPerfilView from "@/components/dashboard/DashboardPerfilView";
import FinancialHealthScore from "@/components/dashboard/FinancialHealthScore";
import PersonalizedRecommendations from "@/components/dashboard/PersonalizedRecommendations";
import Beneficios, { Beneficio } from "@/components/beneficios/Beneficios";
import { useSupabase } from "@/components/supabase-provider";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { GettingStarted } from "@/components/GettingStarted";
import { useRouter, useParams } from "next/navigation"; // Importer useParams
import { createClient } from "@/lib/supabase/client";
import InvestimentosComp from "@/components/investimentos/Investimentos";
import useInvestimentos from "@/hooks/useInvestimentos";
// Temporairement désactivé pour éviter les erreurs next-intl
// import { useTranslations, useLocale } from 'next-intl';
import { useMediaQuery } from 'react-responsive';

// Import dynamique avec fallback
const UploadHolerite = dynamic(() => import("@/app/[locale]/calculadora/upload-holerite"), {
  loading: () => <div className="p-8 text-center text-emerald-900">Chargement du module d’upload...</div>,
  ssr: false
});

const navItems = [
  { label: "Compensação", icon: <BarChart3 className="w-6 h-6" /> },
  { label: "Benefícios", icon: <Gift className="w-6 h-6" /> },
  { label: "Bem-estar", icon: <Heart className="w-6 h-6" /> },
  { label: "Seguros", icon: <Shield className="w-6 h-6" /> },
  { label: "Investimentos", icon: <TrendingUp className="w-6 h-6" /> },
  { label: "Dados", icon: <UserCircle className="w-6 h-6" /> },
];

const summaryCards: any[] = [];

const quickActions = [
  {
    label: "Upload Holerite",
    desc: "Analise sua folha de pagamento",
    color: "bg-green-50 text-green-700",
    icon: <Upload className="w-4 h-4 text-green-400" />,
  },
  {
    label: "Coaching Live",
    desc: "Fale com um especialista",
    color: "bg-blue-50 text-blue-700",
    icon: <MessageCircle className="w-4 h-4 text-blue-400" />,
  },
];

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
  if (!data || typeof data !== 'object' || Object.values(data).every((v: any) => v === null || v === undefined || v === '' || v === 'null')) return null;
  return (
    <div className="mb-6 bg-white rounded-xl shadow p-4">
      <div className="font-bold text-blue-800 text-lg mb-2 mt-2">{title}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-base">
        {Object.entries(data).map(([k, v]: [string, any]) => {
          if (Array.isArray(v)) return null;
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
  // Champs principaux
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
  ];
  // Montants principaux (affiche label d'origine si présent)
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
  ];
  // Earnings/deductions
  const earnings = Array.isArray(raw.earnings) ? raw.earnings : [];
  const deductions = Array.isArray(raw.deductions) ? raw.deductions : [];
  // Résumé et recommandations
  const summary = raw.analysis?.summary;
  const oportunidades = Array.isArray(raw.analysis?.optimization_opportunities) ? raw.analysis.optimization_opportunities : [];

  // Gestion spéciale du net : si c'est un tableau ou plusieurs candidats, afficher tous avec label
  let netCandidates = [];
  if (Array.isArray(raw.net_salary)) {
    netCandidates = raw.net_salary.filter((n: any) => n && n.label && !n.label.toLowerCase().includes('base de cálculo'));
  } else if (raw.net_salary && typeof raw.net_salary === 'object' && raw.net_salary.label && !raw.net_salary.label.toLowerCase().includes('base de cálculo')) {
    netCandidates = [raw.net_salary];
  } else if (raw.net_salary && typeof raw.net_salary === 'number') {
    netCandidates = [{ label: 'Salário Líquido', valor: raw.net_salary }];
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-xl md:text-2xl font-bold text-blue-900 mb-1">Análise do Holerite</div>
        <div className="text-gray-700">Analisamos seu holerite e identificamos as seguintes oportunidades de otimização:</div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Colonne gauche : Infos + montants + earnings/deductions */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="text-lg font-bold text-blue-900 mb-4">Detalhamento do Holerite</div>
          <div className="mb-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {infos.filter(i => i.value).map((i, idx) => {
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
          <div className="mb-2">
            {montants.filter(m => m.value).map((m, idx) => {
              let v = m.value;
              if (typeof v === 'object' && v !== null) v = v.value ?? v.valor ?? '—';
              return (
                <div key={idx} className="flex justify-between text-base">
                  <span>{m.label}:</span>
                  <span className="font-bold text-blue-900">{formatMontant(v)}</span>
                </div>
              );
            })}
            {/* Affichage spécial pour le net si plusieurs candidats */}
            {netCandidates.length > 1 && <div className="mt-2 text-xs text-gray-500">Vários candidatos para o líquido: {netCandidates.map((n: any, i: number) => <span key={i} className="ml-2">{formatMontant(n)}</span>)}</div>}
          </div>
          {earnings.length > 0 && <>
            <div className="font-bold mt-4 mb-1 text-green-700">Vencimentos</div>
            <table className="w-full text-sm mb-2">
              <tbody>
                {earnings.map((e: any, i: number) => (
                  <tr key={i}>
                    <td className="text-gray-700">{e.description}</td>
                    <td className="text-green-700 text-right font-mono">{formatMontant(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>}
          {deductions.length > 0 && <>
            <div className="font-bold mt-2 mb-1 text-red-600">Descontos</div>
            <table className="w-full text-sm">
              <tbody>
                {deductions.map((d: any, i: number) => (
                  <tr key={i}>
                    <td className="text-gray-700">{d.description}</td>
                    <td className="text-red-600 text-right font-mono">-{formatMontant(d.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>}
        </div>
        {/* Colonne droite : Oportunidades */}
        <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="text-lg font-bold text-green-900 mb-4">Oportunidades Identificadas</div>
          {summary && <div className="mb-4 text-green-900 text-sm bg-green-100 rounded p-2 shadow-inner">{summary}</div>}
          <div className="space-y-4">
            {oportunidades.length === 0 && <div className="text-gray-500 italic">Nenhuma oportunidade clara identificada neste holerite.</div>}
            {oportunidades.map((op: any, i: number) => {
              const match = op.match(/^([^:]+:)(.*)$/);
              return (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    {match ? <><span className="font-bold text-green-900">{match[1]}</span>{match[2]}</> : op}
                  </div>
                </div>
              );
            })}
          </div>
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

export default function DashboardFullWidth() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [holeriteResult, setHoleriteResult] = useState<HoleriteResult | null>(null);
  const [showAnalysisDetail, setShowAnalysisDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("Compensação");
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

  const { onboarding } = useUserOnboarding(userId || undefined);

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  const onboardingComplete = onboarding ? (onboarding.profile_completed && onboarding.checkup_completed && onboarding.holerite_uploaded) : false;

  // 1. Lecture initiale du cache local
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('holeriteResult');
      if (cached) {
        try {
          setHoleriteResult(JSON.parse(cached));
        } catch {}
      }
    }
  }, []);

  // 2. Synchronisation avec Supabase (en arrière-plan ou sur demande)
  const syncWithSupabase = async () => {
    if (!userId) return;
    setIsSyncing(true);
    try {
      const { data, error } = await supabase
        .from('holerites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data && !error) {
        setHoleriteResult({
          salarioBruto: Number(data.structured_data?.gross_salary ?? data.salario_bruto ?? 0),
          salarioLiquido: Number(data.structured_data?.net_salary ?? data.salario_liquido ?? 0),
          descontos: Number((data.structured_data?.gross_salary ?? data.salario_bruto ?? 0) - (data.structured_data?.net_salary ?? data.salario_liquido ?? 0)),
          eficiencia: data.structured_data?.gross_salary && data.structured_data?.net_salary ? Number(((data.structured_data.net_salary / data.structured_data.gross_salary) * 100).toFixed(1)) : 0,
          raw: {
            ...data.structured_data,
            employee_name: data.structured_data?.employee_name ?? data.nome ?? '',
            company_name: data.structured_data?.company_name ?? data.empresa ?? '',
            position: data.structured_data?.position ?? data.cargo ?? '',
            profile_type: data.structured_data?.profile_type ?? data.perfil ?? '',
          },
          insights: [],
        });
        if (typeof window !== 'undefined') localStorage.setItem('holeriteResult', JSON.stringify(data));
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Synchronisation automatique à chaque changement de userId
  useEffect(() => {
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

  // Use holeriteResult to update summary cards if available
  const summaryCardsData = holeriteResult ? [
    {
      title: "Salário Bruto",
      value: `R$ ${holeriteResult.salarioBruto?.toLocaleString()}`,
      color: "border-blue-100 bg-white text-blue-700",
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${formatPeriod(holeriteResult.raw.period)}` : "Dados do holerite",
      isMinSalary: holeriteResult.salarioBruto && Math.abs(holeriteResult.salarioBruto - SALARIO_MINIMO) < 0.01
    },
    {
      title: "Salário Líquido",
      value: `R$ ${holeriteResult.salarioLiquido?.toLocaleString()}`,
      color: "border-green-100 bg-white text-green-700",
      icon: <FileText className="w-5 h-5 text-green-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${formatPeriod(holeriteResult.raw.period)}` : "Dados do holerite",
    },
    {
      title: "Descontos",
      value: `R$ ${holeriteResult.descontos?.toLocaleString()}`,
      color: "border-orange-100 bg-white text-orange-700",
      icon: <ArrowDownUp className="w-5 h-5 text-orange-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${formatPeriod(holeriteResult.raw.period)}` : "Dados do holerite",
    },
    {
      title: "Eficiência",
      value: `${holeriteResult.eficiencia}%`,
      color: "border-purple-100 bg-white text-purple-700",
      icon: <PercentCircle className="w-5 h-5 text-purple-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${formatPeriod(holeriteResult.raw.period)}` : "Dados do holerite",
    },
  ] : [];

  // Affiche automatiquement le détail après analyse
  const handleHoleriteResult = (result: HoleriteResult) => {
    console.log('🎯 Dashboard: Nouveau résultat holerite reçu:', result);
    setHoleriteResult(result);
    if (typeof window !== 'undefined') localStorage.setItem('holeriteResult', JSON.stringify(result));
    setShowUploadModal(false);
    setShowAnalysisDetail(true);
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
        // 1. Si on dispose déjà d’un holerite analysé, on l’utilise comme source principale
        if (holeriteResult?.raw) {
          const text = JSON.stringify(holeriteResult.raw).toLowerCase();
          setBeneficiosDetectados(
            BENEFIT_CATALOG.map((b) => ({
              tipo: b.tipo,
              comentario: b.comentario,
              actionLink: b.actionLink,
              detectado: b.keys.some((k) => text.includes(k)),
            }))
          );
          return; // pas besoin d’interroger la BD
        }

        // 2. Si aucun holerite n’est chargé, on récupère les données sauvegardées (manuel ou dernier scan)
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
    if (label === "Dados" && perfilRef.current) {
      perfilRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // ici tu peux ajouter d'autres actions pour d'autres sections si besoin
  };

  const { data: investimentos = [] } = useInvestimentos(userId, holeriteResult?.raw);

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

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* GettingStarted en haut si onboarding non complet et visible */}
      {showOnboarding && !onboardingComplete && userId && (
        <div className="mb-8">
          <GettingStarted 
            userId={userId} 
            onDismiss={() => setShowOnboarding(false)}
            onStepClick={(step) => {
              const stepMap: { [key: string]: number } = { profile: 1, checkup: 2, holerite: 3 };
              const stepNum = stepMap[step] || 1;
              router.push(`/${locale}/onboarding?step=${stepNum}`);
            }} 
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block col-span-3 xl:col-span-2 mb-8 lg:mb-0">
          <div className="sticky top-8">
            {holeriteResult && holeriteResult.raw?.period ? (
              <div className="w-full bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-lg flex flex-col gap-2 shadow text-base mb-8 border border-blue-200">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Holerite Analisado</span>
                </div>
                <div className="text-center text-sm">
                  <div className="font-bold">{formatPeriod(holeriteResult.raw.period)}</div>
                  {holeriteResult.raw.employee_name && (
                    <div className="text-xs opacity-75">{holeriteResult.raw.employee_name}</div>
                  )}
                  {holeriteResult.raw.company_name && (
                    <div className="text-xs opacity-75">{holeriteResult.raw.company_name}</div>
                  )}
                </div>
                <button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded mt-2 transition-all duration-200" 
                  onClick={() => setShowUploadModal(true)}
                >
                  Novo Upload
                </button>
              </div>
            ) : (
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow text-base mb-8 focus:ring-2 focus:ring-emerald-400 transition-all duration-200" onClick={() => setShowUploadModal(true)}>
                <Upload className="w-4 h-4" /> Upload Holerite
              </button>
            )}
            <nav className="flex flex-col gap-2 w-full">
              {navItems.map((item, i) => (
                <button
                  key={i}
                  className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 items-center ${activeTab === item.label ? "bg-emerald-100 text-emerald-700 shadow border-l-4 border-emerald-500" : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"}`}
                  onClick={() => handleSidebarNav(item.label)}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1 whitespace-normal break-words text-left">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>
        {/* Sidebar Mobile Hamburger */}
        <button className="lg:hidden fixed top-4 left-4 z-40 bg-white border rounded-full p-2 shadow-md" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-7 h-7" />
        </button>
        {/* Sidebar Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-64 bg-white h-full p-6 flex flex-col gap-6 animate-fadeIn">
              <button className="self-end mb-4 text-gray-500" onClick={() => setMobileMenuOpen(false)}>&times;</button>
              {holeriteResult && holeriteResult.raw?.period ? (
                <div className="w-full bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-lg flex flex-col gap-2 shadow text-base mb-8 border border-blue-200">
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Holerite Analisado</span>
                  </div>
                  <div className="text-center text-sm">
                    <div className="font-bold">{formatPeriod(holeriteResult.raw.period)}</div>
                    {holeriteResult.raw.employee_name && (
                      <div className="text-xs opacity-75">{holeriteResult.raw.employee_name}</div>
                    )}
                    {holeriteResult.raw.company_name && (
                      <div className="text-xs opacity-75">{holeriteResult.raw.company_name}</div>
                    )}
                  </div>
                  <button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded mt-2 transition-all duration-200" 
                    onClick={() => setShowUploadModal(true)}
                  >
                    Novo Upload
                  </button>
                </div>
              ) : (
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow text-base mb-8 focus:ring-2 focus:ring-emerald-400 transition-all duration-200" onClick={() => setShowUploadModal(true)}>
                  <Upload className="w-4 h-4" /> Upload Holerite
                </button>
              )}
              <nav className="flex flex-col gap-2 w-full">
                {navItems.map((item, i) => (
            <button
                    key={i}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 ${activeTab === item.label ? "bg-emerald-100 text-emerald-700 shadow border-l-4 border-emerald-500" : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"}`}
                    onClick={() => { handleSidebarNav(item.label); setMobileMenuOpen(false); }}
            >
                    {item.icon}
                    <span className="ml-2 truncate">{item.label}</span>
            </button>
                ))}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
        {/* Upload Holerite Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowUploadModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowUploadModal(false)}>&times;</button>
              <UploadHolerite onResult={handleHoleriteResult} />
            </div>
          </div>
        )}
        {/* Main content dynamique */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col gap-8">
          {/* Retiré : Section Saúde Financeira */}
          {/* GettingStarted juste après Saúde Financeira */}
          {/* Le deuxième GettingStarted a été supprimé d'ici */}
          
          {/* Contenu selon l'onglet actif */}
          {activeTab === "Dados" && (
            <>
              {/* Section Perfil */}
              <div ref={perfilRef} className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                <div className="font-semibold text-lg mb-2 text-emerald-900 flex items-center gap-2">
                  <UserCircle className="w-6 h-6 text-emerald-600" /> Perfil do Colaborador
                  {holeriteResult?.raw?.profile_type && (
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200`}>
                      {holeriteResult.raw.profile_type}
                    </span>
                  )}
                </div>
                {holeriteResult && holeriteResult.raw && (
                  <div className="flex flex-col gap-2 text-base">
                    <div><span className="font-semibold">Nome:</span> {holeriteResult.raw.employee_name || <span className="text-gray-400">(não identificado)</span>}</div>
                    <div><span className="font-semibold">Empresa:</span> {holeriteResult.raw.company_name || <span className="text-gray-400">(não identificado)</span>}</div>
                    <div><span className="font-semibold">Cargo:</span> {holeriteResult.raw.position || <span className="text-gray-400">(não identificado)</span>}</div>
                    <div><span className="font-semibold">Perfil:</span> {holeriteResult.raw.profile_type || <span className="text-gray-400">(não identificado)</span>}</div>
                  </div>
                )}
                {(!holeriteResult || !holeriteResult.raw) && (
                  <div className="text-gray-400">Aucune donnée extraite d'un holerite pour le moment.</div>
                )}
              </div>
              {/* Composant DashboardPerfilView pour l'édition des données */}
              <DashboardPerfilView holeriteResult={holeriteResult} user={null} onShowHolerite={() => setShowAnalysisDetail(true)} />
            </>
          )}
          
          {activeTab === "Compensação" && (
            <>
              {/* Section Perfil (version résumée) */}
              <div ref={perfilRef} className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                <div className="font-semibold text-lg mb-2 text-emerald-900 flex items-center gap-2">
                  <UserCircle className="w-6 h-6 text-emerald-600" /> Perfil do Colaborador
                  {holeriteResult?.raw?.profile_type && (
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200`}>
                      {holeriteResult.raw.profile_type}
                    </span>
                  )}
                </div>
                {holeriteResult && holeriteResult.raw && (
                  <div className="flex flex-col gap-2 text-base">
                    <div><span className="font-semibold">Nome:</span> {holeriteResult.raw.employee_name || <span className="text-gray-400">(não identificado)</span>}</div>
                    <div><span className="font-semibold">Empresa:</span> {holeriteResult.raw.company_name || <span className="text-gray-400">(não identificado)</span>}</div>
                    <div><span className="font-semibold">Cargo:</span> {holeriteResult.raw.position || <span className="text-gray-400">(não identificado)</span>}</div>
                    <div><span className="font-semibold">Perfil:</span> {holeriteResult.raw.profile_type || <span className="text-gray-400">(não identificado)</span>}</div>
                  </div>
                )}
                {(!holeriteResult || !holeriteResult.raw) && (
                  <div className="text-gray-400">Aucune donnée extraite d'un holerite pour le moment.</div>
                )}
              </div>
              {/* Résumé cards */}
              {summaryCardsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summaryCardsData.map((card, i) => (
                  <div key={i} className={`flex flex-col w-full min-h-[120px] px-6 py-4 rounded-2xl border ${card.color} shadow-sm items-start transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}>
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
                <div className="bg-white rounded-2xl border border-gray-100 shadow p-6 text-center text-gray-500 mb-6">
                  Nenhum dado disponível. Faça o upload do seu holerite para ver os resultados.
                </div>
              )}
              {/* Recommandations personnalisées basées sur le quiz */}
              <PersonalizedRecommendations 
                quizAnswers={quizAnswers}
                employmentStatus={employmentStatus}
                financialHealthScore={financialHealthScore}
              />
              
              {/* Recommandations générales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendations.map((rec, i) => (
                  <div key={i} className={`flex flex-col w-full min-h-[100px] p-6 rounded-2xl border shadow bg-white ${rec.color} transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}>
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
            <>
              {holeriteResult ? (
                <Beneficios
                  userStatus={holeriteResult.raw?.profile_type || employmentStatus || "CLT"}
                  beneficios={beneficiosDetectados || []}
                  onSimularPacote={() => router.push("/simuladores/beneficios")}
                />
              ) : (
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center">
                  <p className="text-gray-600">Faça upload do seu holerite para ver seus benefícios.</p>
                </div>
              )}
            </>
          )}

          {activeTab === "Bem-estar" && (
            <BemEstar userId={userId} employmentStatus={employmentStatus} />
          )}
 
          {activeTab === "Seguros" && (
            <Seguros userId={userId} employmentStatus={employmentStatus} />
          )}

          {activeTab === "Investimentos" && (
            <InvestimentosComp status={employmentStatus} investimentos={investimentos} />
          )}
          
          {/* Pour les autres onglets, afficher un message temporaire */}
          {activeTab !== "Dados" && activeTab !== "Compensação" && activeTab !== "Benefícios" && activeTab !== "Bem-estar" && activeTab !== "Seguros" && activeTab !== "Investimentos" && (
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center">
              <div className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</div>
              <p className="text-gray-600">Cette section sera bientôt disponible.</p>
            </div>
          )}
        </section>
        {/* Colonne droite */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-3 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <div className="font-semibold text-lg mb-3 text-gray-800">Ações Rápidas</div>
            <div className="flex flex-col gap-3">
              <button
                className="flex items-center gap-2 px-3 py-3 rounded-lg font-semibold text-base bg-green-50 text-green-700 hover:bg-green-100 transition-all duration-200 focus:ring-2 focus:ring-emerald-400"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="w-4 h-4 text-green-400" />
                <div className="flex flex-col items-start">
                  <span>Upload Holerite</span>
                  <span className="text-sm text-gray-500 font-normal">Analise sua folha de pagamento</span>
                </div>
              </button>
              <button
                className="flex items-center gap-2 px-3 py-3 rounded-lg font-semibold text-base bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200 focus:ring-2 focus:ring-emerald-400"
              >
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <div className="flex flex-col items-start">
                  <span>Coaching Live</span>
                  <span className="text-sm text-gray-500 font-normal">Fale com um especialista</span>
                </div>
              </button>
            </div>
          </div>
          {holeriteResult && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <div className="font-semibold text-lg mb-3 text-gray-800">Resumo Financeiro</div>
            <div className="flex flex-col gap-3 text-base">
                <div className="flex justify-between"><span>Salário Bruto</span><span className="font-bold">R$ {holeriteResult.salarioBruto?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Salário Líquido</span><span className="font-bold">R$ {holeriteResult.salarioLiquido?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Eficiência</span><span className="font-bold">{holeriteResult.eficiencia}%</span></div>
              </div>
            </div>
          )}
          {/* Bloc résultat holerite (synthétique, cliquable) */}
          {holeriteResult && (
            <div className="bg-emerald-50 rounded-2xl shadow border border-emerald-200 p-6 cursor-pointer hover:bg-emerald-100 transition" onClick={() => setShowAnalysisDetail(true)}>
              <div className="font-semibold text-lg mb-3 text-emerald-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-500" />
                Oportunidades Identificadas
              </div>
              <ul className="flex flex-col gap-2">
                {(holeriteResult.raw?.analysis?.optimization_opportunities && holeriteResult.raw.analysis.optimization_opportunities.length > 0
                  ? holeriteResult.raw.analysis.optimization_opportunities
                  : getDefaultOpportunities(holeriteResult.raw?.profile_type || 'PJ')
                ).slice(0, 5).map((op: string, i: number) => {
                  // Extraction améliorée du titre du thème (avant les deux-points, sans suffixe)
                  let keyword = op.match(/^([^:]+):/)?.[1] || op.split(' ').slice(0,3).join(' ');
                  // Nettoie les suffixes éventuels (ex: 'PME', 'Privada', etc.) pour ne garder que le thème principal
                  keyword = keyword.replace(/\b(PME|Privada|com cobertura por invalidez\/doenças graves|Fiscal)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
                  // Capitalise la première lettre de chaque mot
                  keyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                  return (
                    <li key={i} className="flex items-center gap-2 text-emerald-800 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-xs whitespace-nowrap">{keyword}</span>
                    </li>
                  );
                })}
              </ul>
              <button className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-4 rounded-2xl shadow text-base transition-all duration-200 focus:ring-2 focus:ring-emerald-400 mt-6"><Download className="w-5 h-5" /> Baixar Relatório</button>
            </div>
          )}
          {/* Modal détail analyse */}
          {showAnalysisDetail && holeriteResult && (
            <PayslipAnalysisDetail result={holeriteResult} onClose={() => setShowAnalysisDetail(false)} />
          )}
        </aside>
        </div>
      </main>
  );
}

