"use client"

import Image from "next/image";
import { BarChart3, Gift, Heart, Shield, TrendingUp, FileText, PercentCircle, ArrowDownUp, Download, CheckCircle2, MessageCircle, PieChart as PieIcon, Upload, UserCircle, LogOut, Menu, Lightbulb, HelpCircle, Info, X, ChevronRight, Plus, Settings, CheckCircle, XCircle, ExternalLink, BookOpen, Video } from "lucide-react";
import BemEstar from "@/components/bemEstar/BemEstar";
import Seguros from "@/components/seguros/Seguros";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import DashboardPerfilView from "@/components/dashboard/DashboardPerfilView";
import FinancialHealthScore from "@/components/dashboard/FinancialHealthScore";
import PersonalizedRecommendations from "@/components/dashboard/PersonalizedRecommendations";
import Beneficios, { Beneficio } from "@/components/beneficios/Beneficios";
import { useSupabase } from "@/components/supabase-provider";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { GettingStarted } from "@/components/GettingStarted";
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr";
import InvestimentosComp from "@/components/investimentos/Investimentos";
import useInvestimentos from "@/hooks/useInvestimentos";
import Link from "next/link";
import { useTranslations } from '@/hooks/useTranslations';

// Import dynamique avec fallback
const UploadHolerite = dynamic(() => import("@/app/[locale]/calculadora/upload-holerite"), {
  loading: () => <div className="p-8 text-center text-emerald-900">Chargement du module d'upload...</div>,
  ssr: false
});

const navItems = [
  { label: "Compensação", icon: <BarChart3 className="w-5 h-5" />, color: "text-blue-600" },
  { label: "Benefícios", icon: <Gift className="w-5 h-5" />, color: "text-purple-600" },
  { label: "Bem-estar", icon: <Heart className="w-5 h-5" />, color: "text-pink-600" },
  { label: "Seguros", icon: <Shield className="w-5 h-5" />, color: "text-orange-600" },
  { label: "Investimentos", icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-600" },
  { label: "Dados", icon: <UserCircle className="w-5 h-5" />, color: "text-gray-600" },
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
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="#f3f4f6" />
        <circle 
          cx="24" 
          cy="24" 
          r="20" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="4" 
          strokeDasharray={2*Math.PI*20} 
          strokeDashoffset={2*Math.PI*20*(1 - financialHealthScore/100)} 
          style={{transition: 'stroke-dashoffset 1s'}} 
        />
        <text x="24" y="28" textAnchor="middle" fontSize="14" fill="#10b981" fontWeight="bold">
          {financialHealthScore}
        </text>
      </svg>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">Saúde Financeira</span>
        <span className="text-sm font-bold text-emerald-600">
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

function isFirstProfile(profile: any) {
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
  raw?: any;
};

function PayslipAnalysisDetail({ result, onClose }: { result: HoleriteResult, onClose: () => void }) {
  if (!result) return null;
  const raw = result.raw || {};
  const formattedPeriod = formatPeriod(raw.period);
  const profileType = raw.profile_type;
  const opportunities = (raw.analysis?.optimization_opportunities && raw.analysis.optimization_opportunities.length > 0
    ? raw.analysis.optimization_opportunities
    : getDefaultOpportunities(profileType)).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Análise do Holerite</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Détail du holerite */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg text-blue-900">Detalhamento do Holerite</div>
                {formattedPeriod && (
                  <div className="text-xs text-blue-700 font-semibold bg-blue-100 rounded px-2 py-1">
                    Mês: {formattedPeriod.charAt(0).toUpperCase() + formattedPeriod.slice(1)}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-gray-700">Salário Base:</div>
                <div className="font-bold text-gray-900 text-right">R$ {raw.gross_salary?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                {raw.earnings?.map((e: any, i: number) => {
                  const val = e.amount ?? e.value ?? e.valor ?? 0;
                  return [
                    <div key={"e-label-"+i} className="text-gray-700">{e.description || e.tipo || 'Provento'}:</div>,
                    <div key={"e-val-"+i} className="text-green-700 text-right">R$ {Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  ];
                })}
                {raw.deductions?.map((d: any, i: number) => {
                  const val = d.amount ?? d.value ?? d.valor ?? 0;
                  return [
                    <div key={"d-label-"+i} className="text-gray-700">{d.description || d.tipo || 'Desconto'}:</div>,
                    <div key={"d-val-"+i} className="text-red-600 text-right">-R$ {Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  ];
                })}
                <div className="col-span-2 border-t border-blue-200 my-2"></div>
                <div className="font-bold">Salário Líquido:</div>
                <div className="font-bold text-blue-900 text-right">R$ {raw.net_salary?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>

            {/* Opportunités */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-green-500" />
                Oportunidades Identificadas
              </div>
              {profileType && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Perfil: {profileType}
                  </span>
                </div>
              )}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {opportunities.map((op: string, i: number) => {
                  const match = op.match(/^([^:]+:)(.*)$/);
                  return (
                    <div key={i} className="flex items-start gap-3 bg-white/70 rounded-lg p-3 border border-green-100 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div className="text-green-800 text-sm leading-snug">
                        {match ? (
                          <>
                            <span className="font-bold">{match[1]}</span>{match[2]}
                          </>
                        ) : (
                          op
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardFullWidth() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [holeriteResult, setHoleriteResult] = useState<HoleriteResult | null>(null);
  const [showAnalysisDetail, setShowAnalysisDetail] = useState(false);
  const [activeTab, setActiveTab] = useState(t.dashboard?.compensacao || 'Compensação');
  const [financialHealthScore, setFinancialHealthScore] = useState(75);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [employmentStatus, setEmploymentStatus] = useState("");
  const perfilRef = useRef<HTMLDivElement>(null);
  const SALARIO_MINIMO = 1320;
  const [userId, setUserId] = useState<string | null>(null);
  const { supabase } = useSupabase();
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const country = 'br';
  const onboarding = useUserOnboarding(userId || undefined);

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

  // 2. Synchronisation avec Supabase
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

  useEffect(() => {
    if (userId) {
      syncWithSupabase();
    }
  }, [userId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'supabase.auth.token' && !event.newValue) {
          localStorage.removeItem('holeriteResult');
          localStorage.removeItem('userProfile');
        }
      });
    }
  }, []);

  useEffect(() => {
    if (holeriteResult && typeof window !== 'undefined') {
      localStorage.setItem('holeriteResult', JSON.stringify(holeriteResult));
    }
  }, [holeriteResult]);

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

  const handleHoleriteResult = (result: HoleriteResult) => {
    setHoleriteResult(result);
    if (typeof window !== 'undefined') localStorage.setItem('holeriteResult', JSON.stringify(result));
    setShowUploadModal(false);
    setShowAnalysisDetail(true);
  };

  const BENEFIT_CATALOG: (Omit<Beneficio, "detectado"> & { keys: string[] })[] = [
    {
      tipo: "Vale Refeição",
      comentario: "Ajuda na alimentação diária e pode ser negociado.",
      actionLink: "/recursos/vale-refeicao",
      keys: ["vale refeição", "vale refeicao", "vr", "vale alimentação", "vale alimentacao", "va", "refeição", "alimentação"],
    },
    {
      tipo: "Plano de Saúde",
      comentario: "Compare cobertura e rede credenciada.",
      actionLink: "/recursos/plano-saude",
      keys: ["plano de saúde", "plano de saude", "assistência médica", "assistencia medica", "saúde", "médico"],
    },
    {
      tipo: "Previdência Privada",
      comentario: "Pense na aposentadoria: benefícios fiscais.",
      actionLink: "/recursos/previdencia-privada",
      keys: ["previdência", "previdencia", "pgbl", "vgbl", "aposentadoria"],
    },
    {
      tipo: "FGTS",
      comentario: "Depósitos regulares garantem segurança financeira.",
      actionLink: "/recursos/fgts",
      keys: ["fgts", "fundo de garantia"],
    },
  ];

  const [beneficiosDetectados, setBeneficiosDetectados] = useState<Beneficio[] | null>(null);

  useEffect(() => {
    const fetchBeneficios = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Récupérer les bénéfices réels de la table beneficios_usuario
        const { data: beneficiosData, error } = await supabase
          .from('beneficios_usuario')
          .select('tipo, ativo, origem')
          .eq('user_id', user.id)
          .order('criado_em', { ascending: false });

        if (error) throw error;

        // Mapper les données réelles avec le catalogue
        const beneficiosDetectados = BENEFIT_CATALOG.map((b) => {
          const foundBeneficio = beneficiosData?.find(d => d.tipo === b.tipo);
          
          return {
            tipo: b.tipo,
            comentario: b.comentario,
            actionLink: b.actionLink,
            detectado: foundBeneficio?.ativo || false,
          };
        });

        setBeneficiosDetectados(beneficiosDetectados);
      } catch (error) {
        console.error('Error fetching beneficios:', error);
        // En cas d'erreur, afficher tous les bénéfices comme non détectés
        setBeneficiosDetectados(
          BENEFIT_CATALOG.map((b) => ({
            tipo: b.tipo,
            comentario: b.comentario,
            actionLink: b.actionLink,
            detectado: false,
          }))
        );
      }
    };

    fetchBeneficios();
  }, [supabase]);

  const { data: investimentos = [] } = useInvestimentos(userId, holeriteResult?.raw);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, [supabase]);

  const handleSidebarNav = (label: string) => {
    setActiveTab(label);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header responsive - mobile seulement */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Menu mobile seulement */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Boutons visibles seulement sur mobile */}
              <button 
                onClick={() => setShowUploadModal(true)}
                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile - bottom tabs (mobile seulement) */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="flex overflow-x-auto scrollbar-hide">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSidebarNav(item.label)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 min-w-0 ${
                activeTab === item.label 
                  ? "text-emerald-600 border-b-2 border-emerald-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu mobile latéral */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 flex lg:hidden">
          <div className="w-80 bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {navItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { handleSidebarNav(item.label); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === item.label 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Layout responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <div className="sticky top-24">
              {/* Upload section */}
              {holeriteResult && holeriteResult.raw?.period ? (
                <div className="bg-blue-50 text-blue-700 font-semibold px-4 py-3 rounded-lg flex flex-col gap-2 shadow text-sm mb-6 border border-blue-200">
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Holerite Analisado</span>
                  </div>
                  <div className="text-center text-xs">
                    <div className="font-bold">{formatPeriod(holeriteResult.raw.period)}</div>
                    {holeriteResult.raw.employee_name && (
                      <div className="opacity-75">{holeriteResult.raw.employee_name}</div>
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
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow text-sm mb-6 focus:ring-2 focus:ring-emerald-400 transition-all duration-200" onClick={() => setShowUploadModal(true)}>
                  <Upload className="w-4 h-4" /> Upload Holerite
                </button>
              )}

              {/* Navigation desktop */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <button
                    key={i}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      activeTab === item.label 
                        ? "bg-emerald-100 text-emerald-700 shadow border-l-4 border-emerald-500" 
                        : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                    onClick={() => handleSidebarNav(item.label)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="lg:col-span-6 xl:col-span-7 space-y-6">
            {/* GettingStarted */}
            {onboarding && !onboarding.onboarding_complete && userId && (
              <div className="mb-6">
                <GettingStarted userId={userId} />
              </div>
            )}

            {/* Contenu selon l'onglet actif */}
            {activeTab === "Compensação" && (
              <div className="space-y-6">
                {/* Profil résumé */}
                {holeriteResult && holeriteResult.raw && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <UserCircle className="w-6 h-6 text-emerald-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Perfil do Colaborador</h3>
                        {holeriteResult.raw.profile_type && (
                          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            {holeriteResult.raw.profile_type}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><span className="font-medium">Nome:</span> {holeriteResult.raw.employee_name || "Não identificado"}</div>
                      <div><span className="font-medium">Empresa:</span> {holeriteResult.raw.company_name || "Não identificado"}</div>
                    </div>
                  </div>
                )}

                {/* Cards de résumé */}
                {summaryCardsData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summaryCardsData.map((card, i) => (
                      <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          {card.icon}
                          <span className="font-semibold text-gray-700">{card.title}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">{card.value}</div>
                        <div className="text-sm text-gray-500">{card.source}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum dado disponível</h3>
                    <p className="text-gray-500 mb-6">Faça o upload do seu holerite para ver os resultados.</p>
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Upload Holerite
                    </button>
                  </div>
                )}

                {/* Recommandations */}
                <PersonalizedRecommendations 
                  quizAnswers={quizAnswers}
                  employmentStatus={employmentStatus}
                  financialHealthScore={financialHealthScore}
                />

                {/* Aprenda com o PIM - Sujets relatifs au salaire */}
                <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Aprenda com o PIM</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/90 border border-emerald-100 shadow-lg rounded-2xl hover:-translate-y-1 transition p-6 flex flex-col gap-3">
                      <TrendingUp className="w-8 h-8 text-emerald-500" />
                      <span className="font-bold text-gray-900">Como negociar um aumento salarial?</span>
                      <Link href="/recursos/negociacao-salario" className="text-emerald-600 hover:underline text-sm">Ler guia</Link>
                    </div>
                    <div className="bg-white/90 border border-emerald-100 shadow-lg rounded-2xl hover:-translate-y-1 transition p-6 flex flex-col gap-3">
                      <PieIcon className="w-8 h-8 text-emerald-500" />
                      <span className="font-bold text-gray-900">Salário bruto vs líquido: entenda a diferença</span>
                      <Link href="/recursos/salario-bruto-liquido" className="text-emerald-600 hover:underline text-sm">Ver calculadora</Link>
                    </div>
                    <div className="bg-white/90 border border-emerald-100 shadow-lg rounded-2xl hover:-translate-y-1 transition p-6 flex flex-col gap-3">
                      <BarChart3 className="w-8 h-8 text-emerald-500" />
                      <span className="font-bold text-gray-900">Média salarial do seu setor</span>
                      <Link href="/recursos/pesquisa-salarial" className="text-emerald-600 hover:underline text-sm">Consultar dados</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Benefícios" && (
              <div className="space-y-6">
                {holeriteResult ? (
                  <Beneficios
                    userStatus={holeriteResult.raw?.profile_type || employmentStatus || "CLT"}
                    beneficios={beneficiosDetectados || []}
                    onSimularPacote={() => router.push("/simuladores/beneficios")}
                  />
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                    <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Benefícios</h3>
                    <p className="text-gray-500 mb-6">Faça upload do seu holerite para ver seus benefícios.</p>
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Upload Holerite
                    </button>
                  </div>
                )}
              </div>
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

            {activeTab === "Dados" && (
              <div className="space-y-6">
                <DashboardPerfilView holeriteResult={holeriteResult} user={null} onShowHolerite={() => setShowAnalysisDetail(true)} />
              </div>
            )}

            {/* Pour les autres onglets */}
            {activeTab !== "Compensação" && activeTab !== "Benefícios" && activeTab !== "Bem-estar" && activeTab !== "Seguros" && activeTab !== "Investimentos" && activeTab !== "Dados" && (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</div>
                <p className="text-gray-600">Cette section sera bientôt disponible.</p>
              </div>
            )}
          </main>

          {/* Sidebar droite desktop */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Actions rapides */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="font-semibold text-lg mb-4 text-gray-800">Ações Rápidas</div>
                <div className="flex flex-col gap-3">
                  <button
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm bg-green-50 text-green-700 hover:bg-green-100 transition-all duration-200 focus:ring-2 focus:ring-emerald-400"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Upload className="w-4 h-4 text-green-400" />
                    <div className="flex flex-col items-start">
                      <span>Upload Holerite</span>
                      <span className="text-xs text-gray-500 font-normal">Analise sua folha de pagamento</span>
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200 focus:ring-2 focus:ring-emerald-400"
                  >
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <div className="flex flex-col items-start">
                      <span>Coaching Live</span>
                      <span className="text-xs text-gray-500 font-normal">Fale com um especialista</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Résumé financier */}
              {holeriteResult && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="font-semibold text-lg mb-4 text-gray-800">Resumo Financeiro</div>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>Salário Bruto</span>
                      <span className="font-bold">R$ {holeriteResult.salarioBruto?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salário Líquido</span>
                      <span className="font-bold">R$ {holeriteResult.salarioLiquido?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eficiência</span>
                      <span className="font-bold">{holeriteResult.eficiencia}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bloc opportunités (desktop seulement) */}
              {holeriteResult && (
                <div className="bg-emerald-50 rounded-xl shadow-sm border border-emerald-200 p-6 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => setShowAnalysisDetail(true)}>
                  <div className="font-semibold text-lg mb-4 text-emerald-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-emerald-500" />
                    Oportunidades Identificadas
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {(holeriteResult.raw?.analysis?.optimization_opportunities && holeriteResult.raw.analysis.optimization_opportunities.length > 0
                      ? holeriteResult.raw.analysis.optimization_opportunities
                      : getDefaultOpportunities(holeriteResult.raw?.profile_type || 'PJ')
                    ).slice(0, 3).map((op: string, i: number) => {
                      let keyword = op.match(/^([^:]+):/)?.[1] || op.split(' ').slice(0,3).join(' ');
                      keyword = keyword.replace(/\b(PME|Privada|com cobertura por invalidez\/doenças graves|Fiscal)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
                      keyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                      return (
                        <div key={i} className="flex items-center gap-2 text-emerald-800 text-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          <span className="font-bold">{keyword}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-400 mt-4">
                    <Download className="w-4 h-4" /> Ver Detalhes
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md lg:max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upload Holerite</h2>
                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <UploadHolerite onResult={handleHoleriteResult} />
            </div>
          </div>
        </div>
      )}

      {showAnalysisDetail && holeriteResult && (
        <PayslipAnalysisDetail result={holeriteResult} onClose={() => setShowAnalysisDetail(false)} />
      )}
    </div>
  );
}
