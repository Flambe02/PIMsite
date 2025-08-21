"use client"

import Image from "next/image";
import { BarChart3, Gift, Heart, Shield, TrendingUp, FileText, PercentCircle, ArrowDownUp, Download, CheckCircle2, MessageCircle, PieChart as PieIcon, Upload, UserCircle, LogOut, Menu, Lightbulb, HelpCircle, Info, ArrowUpRight, ArrowDownLeft, ArrowRight, DollarSign, Users, Calendar, MoreHorizontal, Settings } from "lucide-react";
import BemEstar from "@/components/bemEstar/BemEstar";
import Seguros from "@/components/seguros/Seguros";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import DashboardPerfilView from "@/components/dashboard/DashboardPerfilView";
import FinancialHealthScore from "@/components/dashboard/FinancialHealthScore";
import PersonalizedRecommendations from "@/components/dashboard/PersonalizedRecommendations";
import AIRecommendations from "@/components/dashboard/AIRecommendations";
import Beneficios, { Beneficio } from "@/components/beneficios/Beneficios";
import { useSupabase } from "@/components/supabase-provider";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import InvestimentosComp from "@/components/investimentos/Investimentos";
import useInvestimentos from "@/hooks/useInvestimentos";
import { useFinancialCheckup } from "@/hooks/useFinancialCheckup";
import { HoleriteHistory } from "@/components/dashboard/HoleriteHistory";
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

type HoleriteResult = {
  salarioBruto: number;
  salarioLiquido: number;
  descontos: number;
  eficiencia: number;
  insights: { label: string; value: string }[];
  raw?: any;
};

export default function LegacyDashboardContent({ locale }: { locale: 'br' | 'fr' }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [holeriteResult, setHoleriteResult] = useState<HoleriteResult | null>(null);
  const [showAnalysisDetail, setShowAnalysisDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [financialHealthScore, setFinancialHealthScore] = useState(75);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [employmentStatus, setEmploymentStatus] = useState("");
  const perfilRef = useRef<HTMLDivElement>(null);
  const SALARIO_MINIMO = 1320;
  const { supabase, session } = useSupabase();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Redirection si session absente
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

  // Synchronisation avec Supabase
  const syncWithSupabase = async () => {
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
      
      if (data && !error) {
        console.log('📊 Données récupérées de Supabase:', data);
        
        // Extraction des données avec gestion des différents formats
        const extractValue = (obj: any, path: string, defaultValue: any = 0) => {
          if (!obj) return defaultValue;
          
          const keys = path.split('.');
          let value = obj;
          
          for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
              value = value[key];
            } else {
              return defaultValue;
            }
          }
          
          if (value === null || value === undefined || value === '') {
            return defaultValue;
          }
          
          if (typeof value === 'object' && value !== null && 'valor' in value) {
            value = value.valor;
          }
          
          if (typeof value === 'object' && value !== null && 'value' in value) {
            value = value.value;
          }
          
          if (typeof value === 'string') {
            const cleanedValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
            const numValue = Number(cleanedValue);
            return isNaN(numValue) ? defaultValue : numValue;
          }
          
          const numValue = Number(value);
          return isNaN(numValue) ? defaultValue : numValue;
        };

        let salarioBruto = extractValue(data, 'salario_bruto') || 0;
        let salarioLiquido = extractValue(data, 'salario_liquido') || 0;

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

        const descontos = extractValue(data.structured_data, 'final_data.descontos') ||
                         extractValue(data.structured_data, 'total_deductions') ||
                         extractValue(data.structured_data, 'descontos') ||
                         (salarioBruto > 0 && salarioLiquido > 0 ? salarioBruto - salarioLiquido : 0);
        
        const eficiencia = salarioBruto > 0 && salarioLiquido > 0 ? 
          Number(((salarioLiquido / salarioBruto) * 100).toFixed(1)) : 0;

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

        setHoleriteResult(newHoleriteResult);
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('holeriteResult');
        }
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
    if (userId) {
      syncWithSupabase();
    }
  }, [userId]);

  // À chaque update, sauvegarde dans localStorage
  useEffect(() => {
    if (holeriteResult && typeof window !== 'undefined') {
      console.log('💾 Dashboard: Sauvegarde holeriteResult dans localStorage:', holeriteResult);
      localStorage.setItem('holeriteResult', JSON.stringify(holeriteResult));
    }
  }, [holeriteResult]);

  // Charger automatiquement les données sauvegardées du localStorage au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined' && !holeriteResult) {
      const savedHolerite = localStorage.getItem('holeriteResult');
      if (savedHolerite) {
        try {
          const parsedResult = JSON.parse(savedHolerite);
          console.log('📊 Dashboard: Chargement des données sauvegardées:', parsedResult);
          
          if (parsedResult.salarioBruto > 0 || parsedResult.salarioLiquido > 0) {
            console.log('✅ Données sauvegardées valides, utilisation du localStorage');
            setHoleriteResult(parsedResult);
          } else {
            console.log('⚠️ Données sauvegardées invalides, attente des données Supabase');
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données sauvegardées:', error);
        }
      }
    }
  }, [holeriteResult]);

  // Use holeriteResult to update summary cards if available
  const summaryCardsData = holeriteResult ? [
    {
      title: "Salário Bruto",
      value: holeriteResult.salarioBruto > 0 ? 
        `R$ ${holeriteResult.salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
        'R$ 0,00',
      color: "border-blue-100 bg-white text-blue-700",
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${holeriteResult.raw.period}` : "Dados do holerite",
      isMinSalary: holeriteResult.salarioBruto > 0 && Math.abs(holeriteResult.salarioBruto - SALARIO_MINIMO) < 0.01
    },
    {
      title: "Salário Líquido",
      value: holeriteResult.salarioLiquido > 0 ? 
        `R$ ${holeriteResult.salarioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
        'R$ 0,00',
      color: "border-green-100 bg-white text-green-700",
      icon: <FileText className="w-5 h-5 text-green-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${holeriteResult.raw.period}` : "Dados do holerite",
    },
    {
      title: "Descontos",
      value: holeriteResult.descontos > 0 ? 
        `R$ ${holeriteResult.descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
        'R$ 0,00',
      color: "border-orange-100 bg-white text-orange-700",
      icon: <ArrowDownUp className="w-5 h-5 text-orange-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${holeriteResult.raw.period}` : "Dados do holerite",
    },
    {
      title: "Eficiência",
      value: holeriteResult.eficiencia > 0 ? 
        `${holeriteResult.eficiencia.toFixed(1)}%` : 
        '0,0%',
      color: "border-purple-100 bg-white text-purple-700",
      icon: <PercentCircle className="w-5 h-5 text-purple-400" />,
      source: holeriteResult.raw?.period ? `Holerite ${holeriteResult.raw.period}` : "Dados do holerite",
    },
  ] : [];

  // Affiche automatiquement le détail après analyse
  const handleHoleriteResult = (result: HoleriteResult) => {
    console.log('🎯 Dashboard: Nouveau résultat holerite reçu:', result);
    setHoleriteResult(result);
    if (typeof window !== 'undefined') localStorage.setItem('holeriteResult', JSON.stringify(result));
    setShowUploadModal(false);
    setShowAnalysisDetail(true);
    setActiveTab("Overview");
  };

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
        if (holeriteResult?.raw) {
          const beneficiosExtraits = holeriteResult.raw.beneficios || [];
          const segurosExtraits = holeriteResult.raw.seguros || [];
          
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
          return;
        }

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
              <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center">
                <div className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo ao PIM!</div>
                <p className="text-gray-600 mb-6">
                  Para começar a analisar seus dados financeiros, faça o upload do seu primeiro holerite.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
                    onClick={() => router.push('/br/scan-new-pim')}
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
                {/* TODO: Add HoleriteAnalysisDisplay component here */}
                <div className="text-gray-600">Análise detalhada do holerite será exibida aqui</div>
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
      </aside>

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
    </div>
  );
}
