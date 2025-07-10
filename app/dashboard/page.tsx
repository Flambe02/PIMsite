"use client";

import Image from "next/image";
import { BarChart3, Gift, Heart, Shield, TrendingUp, FileText, PercentCircle, ArrowDownUp, Download, CheckCircle2, MessageCircle, PieChart as PieIcon, Upload, UserCircle, LogOut, Menu, Lightbulb, HelpCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import DashboardPerfilView from "@/components/dashboard/DashboardPerfilView";
const UploadHolerite = dynamic(() => import("@/app/calculadora/upload-holerite"), { ssr: false });
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const navItems = [
  { label: "Compensação", icon: <BarChart3 className="w-6 h-6" /> },
  { label: "Benefícios", icon: <Gift className="w-6 h-6" /> },
  { label: "Bem-estar", icon: <Heart className="w-6 h-6" /> },
  { label: "Seguros", icon: <Shield className="w-6 h-6" /> },
  { label: "Investimentos", icon: <TrendingUp className="w-6 h-6" /> },
  { label: "Dados", icon: <UserCircle className="w-6 h-6" /> },
];

const summaryCards = [
  {
    title: "Salário Bruto",
    value: "R$ 10.500",
    color: "border-blue-100 bg-white text-blue-700",
    icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Salário Líquido",
    value: "R$ 8.450",
    color: "border-green-100 bg-white text-green-700",
    icon: <FileText className="w-5 h-5 text-green-400" />,
  },
  {
    title: "Descontos",
    value: "R$ 2.050",
    color: "border-orange-100 bg-white text-orange-700",
    icon: <ArrowDownUp className="w-5 h-5 text-orange-400" />,
  },
  {
    title: "Eficiência",
    value: "80.5%",
    color: "border-purple-100 bg-white text-purple-700",
    icon: <PercentCircle className="w-5 h-5 text-purple-400" />,
  },
];

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

function SaudeFinanceiraIndicator() {
  // 75% example
  return (
    <div className="flex items-center gap-2 mb-8">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="25" fill="#f3f4f6" />
        <circle cx="28" cy="28" r="25" fill="none" stroke="#10b981" strokeWidth="5" strokeDasharray={2*Math.PI*25} strokeDashoffset={2*Math.PI*25*0.25} style={{transition: 'stroke-dashoffset 1s'}} />
        <text x="28" y="34" textAnchor="middle" fontSize="18" fill="#10b981" fontWeight="bold">75</text>
      </svg>
      <div className="flex flex-col ml-1">
        <span className="text-[13px] font-semibold text-gray-800 leading-tight">Saúde Financeira</span>
        <span className="text-[13px] font-bold text-emerald-600 leading-tight">Boa</span>
      </div>
    </div>
  );
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

function PayslipAnalysisDetail({ result, onClose }: { result: HoleriteResult, onClose: () => void }) {
  if (!result) return null;
  const raw = result.raw || {};
  const formattedPeriod = formatPeriod(raw.period);
  const profileType = raw.profile_type;
  const opportunities = (raw.analysis?.optimization_opportunities && raw.analysis.optimization_opportunities.length > 0
    ? raw.analysis.optimization_opportunities
    : getDefaultOpportunities(profileType)).slice(0, 5); // Limite à 5
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 flex flex-col md:flex-row gap-8 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={onClose}>&times;</button>
        {/* Détail du holerite */}
        <div className="flex-1 bg-blue-50 rounded-xl p-6 border border-blue-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-lg text-blue-900">Detalhamento do Holerite</div>
              {formattedPeriod && (
                <div className="text-xs text-blue-700 font-semibold bg-blue-100 rounded px-2 py-1">Mês: {formattedPeriod.charAt(0).toUpperCase() + formattedPeriod.slice(1)}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-base mt-4">
              <div className="text-gray-700">Salário Base:</div>
              <div className="font-bold text-gray-900 text-right">R$ {raw.gross_salary?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              {raw.earnings?.map((e: any, i: number) => [
                <div key={"e-label-"+i} className="text-gray-700">{e.description}:</div>,
                <div key={"e-val-"+i} className="text-green-700 text-right">R$ {e.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              ])}
              {raw.deductions?.map((d: any, i: number) => [
                <div key={"d-label-"+i} className="text-gray-700">{d.description}:</div>,
                <div key={"d-val-"+i} className="text-red-600 text-right">-R$ {d.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              ])}
              <div className="col-span-2 border-t border-blue-200 my-2"></div>
              <div className="font-bold">Salário Líquido:</div>
              <div className="font-bold text-blue-900 text-right">R$ {raw.net_salary?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
        {/* Opportunités */}
        <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 flex flex-col justify-between max-h-[70vh] overflow-y-auto">
          <div>
            <div className="font-bold text-lg text-green-900 mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-green-500" />Oportunidades Identificadas</div>
            {profileType && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Perfil: {profileType}</span>
              </div>
            )}
            <div className="flex flex-col gap-4">
              {opportunities.map((op: string, i: number) => {
                // Sépare le thème (avant les deux-points) du reste
                const match = op.match(/^([^:]+:)(.*)$/);
                return (
                  <div key={i} className="flex items-start gap-3 bg-white/70 rounded-lg p-3 border border-green-100 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
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
          <button className="mt-8 self-end bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition" onClick={onClose}>Fechar</button>
        </div>
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
  const perfilRef = useRef<HTMLDivElement>(null);
  const SALARIO_MINIMO = 1320;
  const supabase = createClientComponentClient();

  // Persistance : au chargement, relit la dernière analyse si rien n'est chargé
  useEffect(() => {
    if (holeriteResult) return;
    // 1. Essaye de relire depuis localStorage
    const local = typeof window !== 'undefined' ? localStorage.getItem('holeriteResult') : null;
    if (local) {
      try {
        setHoleriteResult(JSON.parse(local));
        return;
      } catch {}
    }
    // 2. Sinon, fetch depuis Supabase
    async function fetchLastAnalysis() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data && !error) {
        setHoleriteResult(data.result || data);
        if (typeof window !== 'undefined') localStorage.setItem('holeriteResult', JSON.stringify(data.result || data));
      }
    }
    fetchLastAnalysis();
    // eslint-disable-next-line
  }, []);

  // À chaque update, sauvegarde dans localStorage
  useEffect(() => {
    if (holeriteResult && typeof window !== 'undefined') {
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
      source: holeriteResult.raw?.period ? `Holerite mês ${holeriteResult.raw.period}` : undefined,
      isMinSalary: holeriteResult.salarioBruto && Math.abs(holeriteResult.salarioBruto - SALARIO_MINIMO) < 0.01
    },
    {
      title: "Salário Líquido",
      value: `R$ ${holeriteResult.salarioLiquido.toLocaleString()}`,
      color: "border-green-100 bg-white text-green-700",
      icon: <FileText className="w-5 h-5 text-green-400" />,
    },
    {
      title: "Descontos",
      value: `R$ ${holeriteResult.descontos.toLocaleString()}`,
      color: "border-orange-100 bg-white text-orange-700",
      icon: <ArrowDownUp className="w-5 h-5 text-orange-400" />,
    },
    {
      title: "Eficiência",
      value: `${holeriteResult.eficiencia}%`,
      color: "border-purple-100 bg-white text-purple-700",
      icon: <PercentCircle className="w-5 h-5 text-purple-400" />,
    },
  ] : summaryCards;

  // Affiche automatiquement le détail après analyse
  const handleHoleriteResult = (result: HoleriteResult) => {
    setHoleriteResult(result);
    if (typeof window !== 'undefined') localStorage.setItem('holeriteResult', JSON.stringify(result));
    setShowUploadModal(false);
    setShowAnalysisDetail(true);
  };

  // Ajoute une fonction pour scroller sur la section Perfil
  const handleSidebarNav = (label: string) => {
    setActiveTab(label);
    if (label === "Dados" && perfilRef.current) {
      perfilRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // ici tu peux ajouter d'autres actions pour d'autres sections si besoin
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block col-span-3 xl:col-span-2 mb-8 lg:mb-0">
          <div className="sticky top-8">
            <SaudeFinanceiraIndicator />
            {holeriteResult && holeriteResult.raw?.period ? (
              <div className="w-full bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow text-base mb-8 border border-blue-200">
                <FileText className="w-4 h-4 text-blue-400" />
                Referência holerite: {formatPeriod(holeriteResult.raw.period)}
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
              <SaudeFinanceiraIndicator />
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow text-base mb-8 focus:ring-2 focus:ring-emerald-400 transition-all duration-200" onClick={() => setShowUploadModal(true)}>
                <Upload className="w-4 h-4" /> Upload Holerite
              </button>
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
          {activeTab === "Dados" ? (
            <DashboardPerfilView holeriteResult={holeriteResult} />
          ) : (
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
              {/* Résumé cards */}
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
                    {card.title === "Salário Bruto" && card.source && (
                      <span className="text-xs text-gray-400 mt-1">{card.source}</span>
                    )}
                  </div>
                ))}
              </div>
              {/* Graphiques supprimés ici */}
              {/* Recommandations */}
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
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <div className="font-semibold text-lg mb-3 text-gray-800">Resumo Financeiro</div>
            <div className="flex flex-col gap-3 text-base">
              <div className="flex justify-between"><span>Saúde Financeira</span><span className="font-bold text-emerald-600">Boa</span></div>
              <div className="flex justify-between"><span>Economia Mensal</span><span className="font-bold">R$ 1.240</span></div>
              <div className="flex justify-between"><span>Próximo Objetivo</span><span className="font-bold text-blue-600 cursor-pointer underline">Reserva</span></div>
            </div>
          </div>
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
