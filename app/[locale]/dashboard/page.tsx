"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { computeFound, MoneyFoundResult } from "@/lib/computeFound";
import { useUserMode, UserMode } from "@/lib/userMode";
import { usePayslips } from "@/hooks/usePayslips";
import ActionCard from "@/components/ActionCard";
import StatTile from "@/components/StatTile";
import ProofMiniList, { ProofItem } from "@/components/ProofMiniList";
import { 
  Upload, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  Clock,
  ArrowRight
} from "lucide-react";

interface DashboardData {
  moneyFound: MoneyFoundResult;
  userMode: UserMode;
  latestHolerite: any;
  ongoingActions: ProofItem[];
  proofs: ProofItem[];
  totalRealized: number;
  loading: boolean;
  error: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params?.locale : 'pt-BR';
  const { session } = useSupabase();
  
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    moneyFound: { foundAmount: 0, source: 'fallback', confidence: 'low' },
    userMode: 'clt',
    latestHolerite: null,
    ongoingActions: [],
    proofs: [],
    totalRealized: 0,
    loading: true,
    error: null
  });

  // Hooks pour les données
  const { payslips, loading: payslipsLoading } = usePayslips(session?.user?.id);

  // Charger les données du dashboard
  useEffect(() => {
    if (!session?.user?.id) {
      setDashboardData(prev => ({ ...prev, loading: false, error: 'Non authentifié' }));
      return;
    }

    loadDashboardData();
  }, [session?.user?.id, payslips]);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // 1. Récupérer le dernier holerite
      const latestHolerite = payslips?.[0] || null;

      // 2. Détecter le mode utilisateur
      const userModeDetection = useUserMode({
        profile: session?.user,
        latestHolerite,
        documents: payslips
      });

      // 3. Calculer Money Found
      const moneyFound = latestHolerite ? computeFound(latestHolerite) : {
        foundAmount: 287,
        source: 'fallback' as const,
        confidence: 'low' as const
      };

      // 4. Générer les actions prioritaires selon le mode
      const actions = generatePriorityActions(userModeDetection.mode, moneyFound);

      // 5. Générer les actions en cours et preuves (mock pour l'instant)
      const ongoingActions = generateOngoingActions();
      const proofs = generateProofs();
      const totalRealized = proofs.reduce((sum, proof) => sum + (proof.value || 0), 0);

      setDashboardData({
        moneyFound,
        userMode: userModeDetection.mode,
        latestHolerite,
        ongoingActions,
        proofs,
        totalRealized,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      setDashboardData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erreur lors du chargement des données' 
      }));
    }
  };

  const generatePriorityActions = (userMode: UserMode, moneyFound: MoneyFoundResult) => {
    if (userMode === 'clt') {
      return [
        {
          title: "Trocar VR",
          estValue: 110,
          estTime: "10 min",
          subtitle: "Plano com taxa menor",
          ctaLabel: "Gerar dossiê",
          onClick: () => router.push(`/${locale}/portabilidade`)
        },
        {
          title: "Plano de saúde",
          estValue: 62,
          estTime: "8 min",
          subtitle: "Migrar para rede melhor",
          ctaLabel: "Solicitar migração",
          onClick: () => router.push(`/${locale}/portabilidade`)
        },
        {
          title: "Ajuste IRRF",
          estValue: 115,
          estTime: "5 min",
          subtitle: "Carta pronta ao RH",
          ctaLabel: "Gerar carta",
          onClick: () => router.push(`/${locale}/explain/payslip`)
        }
      ];
    } else {
      return [
        {
          title: "Gerar DAS do mês",
          estValue: 0,
          estTime: "3 min",
          subtitle: "Evita multa",
          ctaLabel: "Gerar boleto",
          onClick: () => router.push(`/${locale}/tax-center`)
        },
        {
          title: "Otimizar Fator R",
          estValue: 180,
          estTime: "8 min",
          subtitle: "Possível redução",
          ctaLabel: "Simular pró-labore",
          onClick: () => router.push(`/${locale}/tax-center`)
        },
        {
          title: "Trocar conta PJ",
          estValue: 95,
          estTime: "10 min",
          subtitle: "Reduzir tarifas",
          ctaLabel: "Migrar pacote",
          onClick: () => router.push(`/${locale}/tax-center`)
        }
      ];
    }
  };

  const generateOngoingActions = (): ProofItem[] => {
    return [
      {
        id: "1",
        title: "Pedido de portabilidade VR enviado",
        date: "2025-01-31",
        state: "submitted",
        value: 110,
        type: "vr_switch"
      },
      {
        id: "2",
        title: "Carta IRRF enviada ao RH",
        date: "2025-01-30",
        state: "in_progress",
        value: 115,
        type: "irrf_adjust"
      }
    ];
  };

  const generateProofs = (): ProofItem[] => {
    return [
      {
        id: "1",
        title: "Pedido de portabilidade VR enviado",
        date: "2025-01-31",
        state: "completed",
        value: 110,
        type: "vr_switch"
      },
      {
        id: "2",
        title: "Guia DAS paga",
        date: "2025-02-05",
        state: "completed",
        value: 0,
        type: "das_payment"
      }
    ];
  };

  const handleUploadClick = () => {
    router.push(`/${locale}/scan-new-pim`);
  };

  // États de chargement et d'erreur
  if (dashboardData.loading) {
    return <LoadingState />;
  }

  if (dashboardData.error) {
    return <ErrorState error={dashboardData.error} onRetry={loadDashboardData} />;
  }

  if (!dashboardData.latestHolerite) {
    return <EmptyState onUploadClick={handleUploadClick} />;
  }

  const actions = generatePriorityActions(dashboardData.userMode, dashboardData.moneyFound);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header Money Found */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">Dinheiro na mesa</h1>
          <p className="text-emerald-100 mb-4">
            Você pode recuperar <span className="text-3xl font-bold">R${dashboardData.moneyFound.foundAmount}</span> este mês
          </p>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>Baseado na sua última análise</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 gap-3">
          <StatTile 
            title="Economias acumuladas" 
            value={`R$${dashboardData.totalRealized}`}
            hint="Total realizado"
          />
          <StatTile 
            title="Ações em andamento" 
            value={dashboardData.ongoingActions.length.toString()}
            hint="Pendentes"
          />
        </div>

        {/* Actions prioritaires */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Ações prioritárias</h2>
          {actions.map((action, index) => (
            <ActionCard
              key={index}
              title={action.title}
              estValue={action.estValue}
              estTime={action.estTime}
              ctaLabel={action.ctaLabel}
              subtitle={action.subtitle}
              onClick={action.onClick}
            />
          ))}
        </div>

        {/* Actions en cours */}
        {dashboardData.ongoingActions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Ações em andamento</h2>
            <div className="space-y-2">
              {dashboardData.ongoingActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-white rounded-xl border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    +R${action.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preuves et économies */}
        <ProofMiniList
          items={dashboardData.proofs}
          totalRealized={dashboardData.totalRealized}
          locale={locale}
        />

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50"
          >
            <Upload className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Upload Holerite</span>
          </button>
          <button
            onClick={() => router.push(`/${locale}/explain/${dashboardData.userMode === 'clt' ? 'payslip' : 'pj'}`)}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50"
          >
            <FileText className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Explicar</span>
          </button>
        </div>
      </div>
    </main>
  );
}

// Composants d'état
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dashboard...</p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Bem-vindo ao PIM!</h2>
        <p className="text-gray-600 mb-6">
          Faça upload do seu holerite para começar a economizar e otimizar seus benefícios.
        </p>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mx-auto"
        >
          <Upload className="h-5 w-5" />
          Fazer upload do holerite
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
