"use client";

import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { EducationWidget } from "@/components/education/EducationWidget";
import { PimChatWidget } from "@/components/chatbot/PimChatWidget";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { PayslipAnalysisSection } from "@/components/dashboard/PayslipAnalysisSection";
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection";
import { PayslipHistory } from "@/components/dashboard/PayslipHistory";
import { PayrollCharts } from "@/components/dashboard/PayrollCharts";
import { usePayslips } from "@/hooks/usePayslips";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";

// Déclare le type Recommendation localement
interface Recommendation {
  type: "alert" | "tip" | "info";
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function Dashboard() {
  const { session, loading: authLoading } = useSupabase();
  const userId = session?.user?.id;
  const { payslips, loading } = usePayslips(userId);
  const router = useRouter();

  if (authLoading || loading) return <div>Carregando...</div>;
  if (!userId) return <div>Você precisa estar autenticado para acessar o dashboard.</div>;
  // SUPPRIME le bloc qui bloque l'accès si aucun holerite
  // if (!payslips.length) return (
  //   <div className="flex flex-col items-center justify-center min-h-[60vh]">
  //     <div className="text-lg mb-4">Nenhum holerite enviado ainda.</div>
  //     <button
  //       className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition"
  //       onClick={() => router.push("/calculadora?tab=upload")}
  //     >
  //       Enviar novo holerite
  //     </button>
  //   </div>
  // );

  const hasPayslip = payslips.length > 0;
  const last = hasPayslip ? payslips[0] : null;

  // Récupère les opportunités IA du dernier holerite (si présentes)
  let iaRecommendations: Recommendation[] = [];
  if (last?.recommendations && Array.isArray(last.recommendations)) {
    iaRecommendations = last.recommendations;
  } else if (last?.structured_data && typeof last.structured_data === 'object' && last.structured_data !== null) {
    const structuredData = last.structured_data as { analysis?: { optimization_opportunities?: string[] } };
    if (structuredData.analysis?.optimization_opportunities) {
      iaRecommendations = structuredData.analysis.optimization_opportunities.map((msg: string) => ({
        type: "tip",
        message: msg,
      }));
    }
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        {/* Message d'accueil + bouton d'upload si aucun holerite */}
        {!hasPayslip && (
          <div className="flex flex-col items-center justify-center min-h-[10vh] mb-8">
            <div className="text-lg mb-4">Bem-vindo ao seu dashboard PIM!</div>
            <div className="mb-2 text-gray-600 text-sm">Envie seu primeiro holerite para começar a análise personalizada.</div>
            <button
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition"
              onClick={() => router.push("/calculadora?tab=upload")}
            >
              Enviar novo holerite
            </button>
          </div>
        )}
        <WelcomeHeader
          userName={last?.nome || session?.user?.user_metadata?.name || "Usuário"}
          netSalary={last?.salario_liquido ? `R$ ${last.salario_liquido}` : "-"}
          nextPayrollDate={last?.data_pagamento || last?.proxima_data_pagamento || "-"}
          nextPayrollAmount={last?.proximo_valor_liquido ? `R$ ${last.proximo_valor_liquido}` : "-"}
        />
        <PayslipAnalysisSection
          lastUploadDate={last?.created_at ? new Date(last.created_at).toLocaleDateString() : "-"}
          uploadMethod={last?.metodo as "manual" | "auto" | "entry" || "manual"}
          status={last?.status as "analyzed" | "pending" | "error" || "analyzed"}
          summary={{
            net: last?.salario_liquido ? `R$ ${last.salario_liquido}` : "-",
            gross: last?.salario_bruto ? `R$ ${last.salario_bruto}` : "-",
            taxes: last?.impostos || last?.structured_data?.inss || last?.inss ? `R$ ${last.impostos || last.structured_data?.inss || last.inss}` : "-",
            benefits: last?.beneficios || last?.structured_data?.beneficios ? `R$ ${last.beneficios || last.structured_data?.beneficios}` : "-",
          }}
          onUpload={() => router.push("/calculadora?tab=upload")}
        />
        {/* Section recommandations IA intégrée dans le dashboard */}
        <RecommendationsSection
          recommendations={iaRecommendations.length > 0 ? iaRecommendations : [
            {
              type: "alert",
              message: "Envie um holerite para receber recomendações personalizadas!",
              actionLabel: "Enviar holerite",
              onAction: () => router.push("/calculadora?tab=upload"),
              icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
            },
          ]}
        />
        <PayslipHistory payslips={payslips} />
        <PayrollCharts />
        {/* Widgets dynamiques */}
        <div className="mb-8">
          <div className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="inline-block bg-emerald-100 text-emerald-700 rounded-full px-2 py-1 text-xs font-bold">🎓</span>
            Centro de Educação Financeira
          </div>
          <EducationWidget />
        </div>
        <PimChatWidget />
      </main>
    </div>
  );
}
