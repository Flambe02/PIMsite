"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  User, 
  Upload,
  Heart,
  Shield,
  PiggyBank,
  PercentCircle,
  Zap,
  Plus,
  BarChart3,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import BeneficiosInputModal from '@/components/dashboard/BeneficiosInputModal';
import { useUserBeneficios } from '@/hooks/useUserBeneficios';
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OverviewProps {
  holeriteResult: any;
  financialHealthScore: number;
  locale: string;
  onUploadClick: () => void;
}

export default function Overview({ 
  holeriteResult, 
  financialHealthScore, 
  locale, 
  onUploadClick 
}: OverviewProps) {
  const router = useRouter();
  const [isBeneficiosModalOpen, setIsBeneficiosModalOpen] = useState(false);
  const { beneficios: userBeneficios, getTotalBeneficios, loadBeneficios } = useUserBeneficios();
  const hasHolerite = holeriteResult && holeriteResult.raw;

  // Calculer les données financières
  const salarioBruto = hasHolerite ? (holeriteResult.salarioBruto || 0) : 0;
  const salarioLiquido = hasHolerite ? (holeriteResult.salarioLiquido || 0) : 0;
  const descontos = hasHolerite ? (holeriteResult.descontos || 0) : 0;
  const eficiencia = hasHolerite ? (holeriteResult.eficiencia || 0) : 0;
  
  // Calculer le pouvoir d'achat réel (salaire net + bénéfices)
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

  // Extraire les bénéfices depuis différentes structures (pour détection)
  const beneficiosArray = hasHolerite ? 
    (holeriteResult.raw?.structured_data?.final_data?.beneficios ||
     holeriteResult.raw?.structured_data?.beneficios ||
     holeriteResult.raw?.beneficios ||
     []) : [];
  
  // Utiliser les bénéfices saisis par l'utilisateur, sinon les bénéfices détectés
  const userBeneficiosTotal = getTotalBeneficios();
  const detectedBeneficios = calculateBenefitsTotal(beneficiosArray);
  const beneficios = userBeneficiosTotal > 0 ? userBeneficiosTotal : detectedBeneficios;
  const poderCompraReal = salarioLiquido + beneficios;

  // Extraire les noms des bénéfices détectés pour le modal
  const detectedBenefitNames = beneficiosArray
    .filter((b: any) => b && typeof b === 'object' && b.nome)
    .map((b: any) => b.nome);

  // Extraire les vraies recommandations du holerite
  const holeriteRecommendations = hasHolerite ? 
    (holeriteResult.raw?.recommendations?.recommendations || 
     holeriteResult.raw?.analysis_result?.recommendations?.recommendations || 
     holeriteResult.raw?.aiRecommendations || []) : [];

  // Prendre les 2 premières recommandations du holerite
  const topRecommendations = holeriteRecommendations.slice(0, 2).map((rec: any, index: number) => {
    // Déterminer le titre selon la catégorie et le contenu
    const getTitleByCategory = (category: string, description: string) => {
      const desc = description.toLowerCase();
      
      switch (category) {
        case "fiscal":
        case "impostos":
          if (desc.includes("irrf") || desc.includes("imposto")) return "Otimização IRRF";
          if (desc.includes("dedução") || desc.includes("deducao")) return "Deduções Fiscais";
          return "Impostos";
        case "previdencia":
          if (desc.includes("pgbl") || desc.includes("vgbl")) return "Plano PGBL/VGBL";
          if (desc.includes("aposentadoria") || desc.includes("futuro")) return "Previdência Privada";
          return "Previdência";
        case "beneficios":
          if (desc.includes("vale") || desc.includes("refeição")) return "Vale Refeição";
          if (desc.includes("transporte")) return "Vale Transporte";
          if (desc.includes("saúde") || desc.includes("saude")) return "Plano de Saúde";
          return "Benefícios";
        case "seguros":
          if (desc.includes("saúde") || desc.includes("saude")) return "Seguro Saúde";
          if (desc.includes("vida")) return "Seguro de Vida";
          if (desc.includes("auto") || desc.includes("carro")) return "Seguro Auto";
          return "Seguros";
        case "salario":
          if (desc.includes("negociação") || desc.includes("negociacao")) return "Negociação Salarial";
          if (desc.includes("promoção") || desc.includes("promocao")) return "Promoção";
          return "Salário";
        default:
          // Analyser le contenu pour déterminer un titre générique
          if (desc.includes("economizar") || desc.includes("economia")) return "Economia";
          if (desc.includes("investir") || desc.includes("investimento")) return "Investimento";
          if (desc.includes("otimizar") || desc.includes("otimização")) return "Otimização";
          if (desc.includes("melhorar") || desc.includes("melhoria")) return "Melhoria";
          return rec.title || rec.recommendation || `Recomendação ${index + 1}`;
      }
    };

    const category = rec.category || "geral";
    const description = rec.description || rec.detail || rec.explanation || "";
    const title = getTitleByCategory(category, description);

    return {
      id: index + 1,
      title: title,
      description: rec.description || rec.detail || rec.explanation || "Recomendação personalizada baseada na análise do seu holerite",
      priority: rec.priority || (index === 0 ? "high" : "medium"),
      category: category,
      icon: category === "fiscal" || category === "impostos" ? <PercentCircle className="w-4 h-4" /> :
            category === "previdencia" ? <PiggyBank className="w-4 h-4" /> :
            category === "seguros" ? <Shield className="w-4 h-4" /> :
            category === "beneficios" ? <Heart className="w-4 h-4" /> :
            category === "salario" ? <DollarSign className="w-4 h-4" /> :
            <Zap className="w-4 h-4" />,
      color: category === "fiscal" || category === "impostos" ? "bg-red-50 border-red-200" :
             category === "previdencia" ? "bg-blue-50 border-blue-200" :
             category === "seguros" ? "bg-green-50 border-green-200" :
             category === "beneficios" ? "bg-purple-50 border-purple-200" :
             category === "salario" ? "bg-emerald-50 border-emerald-200" :
             "bg-orange-50 border-orange-200",
      badgeColor: category === "fiscal" || category === "impostos" ? "bg-red-100 text-red-800" :
                 category === "previdencia" ? "bg-blue-100 text-blue-800" :
                 category === "seguros" ? "bg-green-100 text-green-800" :
                 category === "beneficios" ? "bg-purple-100 text-purple-800" :
                 category === "salario" ? "bg-emerald-100 text-emerald-800" :
                 "bg-orange-100 text-orange-800",
      action: rec.action || (category === "salario" ? "Salário" : 
                           category === "beneficios" ? "Benefícios" : 
                           category === "seguros" ? "Seguros" : 
                           category === "previdencia" ? "Investimentos" : 
                           "Salário")
    };
  });

  // Utiliser les vraies recommandations si disponibles, sinon les recommandations par défaut
  const recommendations = hasHolerite ? 
    (topRecommendations.length > 0 ? topRecommendations : [
      {
        id: 1,
        title: "Recomendação 1",
        description: "Considere negociar um aumento salarial com base em uma análise de mercado para escrivães judiciais, destacando suas contribuições e experiência desde 2017.",
        priority: "high",
        category: "salario",
        icon: <Zap className="w-4 h-4" />,
        color: "bg-orange-50 border-orange-200",
        badgeColor: "bg-orange-100 text-orange-800",
        action: "Salário"
      },
      {
        id: 2,
        title: "Melhoria",
        description: "Atualmente, não há benefícios listados. Considere solicitar à empresa a inclusão de vale refeição, vale alimentação e vale transporte para melhorar a remuneração indireta.",
        priority: "medium",
        category: "beneficios",
        icon: <Zap className="w-4 h-4" />,
        color: "bg-gray-50 border-gray-200",
        badgeColor: "bg-gray-100 text-gray-800",
        action: "Benefícios"
      }
    ]) : [];

  const formatPeriod = (period?: string): string => {
    if (!period) return "janeiro de 2017";
    try {
      const date = new Date(period);
      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } catch {
      return "janeiro de 2017";
    }
  };

  const getFinancialHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getFinancialHealthLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    return "Precisa melhorar";
  };

  const handleTabClick = (tabName: string) => {
    // Simuler un clic sur l'onglet correspondant
    const tabButton = document.querySelector(`[data-tab="${tabName}"]`) as HTMLButtonElement;
    if (tabButton) {
      tabButton.click();
    }
  };

  const handleFinancialCheckupClick = () => {
    router.push(`/${locale}/financial-checkup`);
  };

  const handleBeneficiosClick = () => {
    setIsBeneficiosModalOpen(true);
  };

  const handleSaveBeneficios = async (beneficios: any[]) => {
    await loadBeneficios(); // Recharger les bénéfices après sauvegarde
  };

  if (!hasHolerite) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        {/* Header - Message d'incitation */}
        <Card className="shadow-lg border-gray-100 rounded-2xl bg-white">
          <CardHeader className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              {locale === 'br' ? 'Comece sua análise financeira' : 
               locale === 'fr' ? 'Commencez votre analyse financière' : 
               'Start your financial analysis'}
            </CardTitle>
            <p className="text-gray-600 mb-6">
              {locale === 'br' ? 'Uploadez seu primeiro holerite para obter insights personalizados sobre sua situação financeira.' :
               locale === 'fr' ? 'Téléchargez votre premier bulletin de paie pour obtenir des insights personnalisés sur votre situation financière.' :
               'Upload your first payslip to get personalized insights about your financial situation.'}
            </p>
            <Button 
              onClick={onUploadClick}
              className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              <Upload className="w-4 h-4 mr-2" />
              {locale === 'br' ? 'Upload Holerite' : 
               locale === 'fr' ? 'Télécharger bulletin' : 
               'Upload Payslip'}
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-0">
      {/* Main Overview Card - Single white card encapsulating everything */}
      <Card className="shadow-lg border-gray-100 rounded-2xl bg-white">
        <CardContent className="p-4">
          {/* Header Row - Profile and Buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {holeriteResult.raw?.employee_name || 'Marcos'}
                </h1>
                {/* Icône discret pour revenir au dernier scan */}
                <button
                  onClick={() => {
                    // Rediriger vers la page du dernier scan
                    router.push(`/${locale}/ultimo-scan`);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                  title={locale === 'br' ? 'Ver último scan' : 
                         locale === 'fr' ? 'Voir dernier scan' : 
                         'View last scan'}
                >
                  <FileText className="w-4 h-4 group-hover:scale-110" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {formatPeriod(holeriteResult.raw?.period)}
              </p>
            </div>
            {/* Bouton upload desktop */}
            <Button 
              onClick={onUploadClick}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              {locale === 'br' ? 'Novo Holerite' : 
               locale === 'fr' ? 'Nouveau bulletin' : 
               'New Payslip'}
            </Button>
          </div>

          {/* Header Mobile - Version mobile du profil avec icône */}
          <div className="md:hidden mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {holeriteResult.raw?.employee_name || 'Marcos'}
                </h2>
                {/* Icône discret pour revenir au dernier scan - Version mobile */}
                <button
                  onClick={() => {
                    // Rediriger vers la page du dernier scan
                    router.push(`/${locale}/ultimo-scan`);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  title={locale === 'br' ? 'Ver último scan' : 
                         locale === 'fr' ? 'Voir dernier scan' : 
                         'View last scan'}
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 ml-13 mt-1">
              {formatPeriod(holeriteResult.raw?.period)}
            </p>
          </div>

          {/* Bouton Upload Mobile */}
          <div className="md:hidden mb-4">
            <Button 
              onClick={onUploadClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              <Upload className="w-4 h-4 mr-2" />
              {locale === 'br' ? 'Novo Holerite' : 
               locale === 'fr' ? 'Nouveau bulletin' : 
               'New Payslip'}
            </Button>
          </div>

          {/* Top Row - Cartes principales avec proportions optimisées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
            {/* Salário Líquido - Proportions équilibrées */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 h-full shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-900">
                      {locale === 'br' ? 'Salário Líquido' : 
                       locale === 'fr' ? 'Salaire Net' : 
                       'Net Salary'}
                    </h3>
                    <p className="text-sm text-green-700">
                      {hasHolerite && holeriteResult.raw?.period ? 
                        formatPeriod(holeriteResult.raw.period) :
                        (locale === 'br' ? 'junho de 2021' : 
                         locale === 'fr' ? 'juin 2021' : 
                         'June 2021')
                      }
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-900 mb-2">
                  {hasHolerite ? `R$ ${salarioLiquido.toLocaleString('pt-BR')}` : 'R$ 0'}
                </div>
                <div className="text-sm text-green-600">
                  {locale === 'br' ? 'Valor recebido' : 
                   locale === 'fr' ? 'Montant reçu' : 
                   'Amount received'}
                </div>
              </div>
            </div>

            {/* Benefícios Mensais - Proportions équilibrées */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 h-full shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-pink-900">
                      {locale === 'br' ? 'Benefícios Mensais' : 
                       locale === 'fr' ? 'Avantages Mensuels' : 
                       'Monthly Benefits'}
                    </h3>
                    <p className="text-sm text-pink-700">
                      {locale === 'br' ? 'Valor total' : 
                       locale === 'fr' ? 'Valeur totale' : 
                       'Total value'}
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-pink-900 mb-2">
                  {beneficios > 0 ? `R$ ${beneficios.toLocaleString('pt-BR')}` : 
                   locale === 'br' ? 'Nenhum benefício' : 
                   locale === 'fr' ? 'Aucun avantage' : 
                   'No benefits'}
                </div>
                {beneficios === 0 ? (
                  <button
                    onClick={() => setIsBeneficiosModalOpen(true)}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
                  >
                    {locale === 'br' ? '+ Configurar benefícios' : 
                     locale === 'fr' ? '+ Configurer les avantages' : 
                     '+ Configure benefits'}
                  </button>
                ) : (
                  <div className="text-sm text-pink-600">
                    {locale === 'br' ? 'Benefícios ativos' : 
                     locale === 'fr' ? 'Avantages actifs' : 
                     'Active benefits'}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Check-up Unifié - Proportions optimisées et design premium */}
            <div className="md:col-span-1">
              <div 
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-6 h-full shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                onClick={handleFinancialCheckupClick}
              >
                {/* Effet de brillance subtil */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
                
                {/* Header avec icône et titre */}
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center shadow-sm">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {locale === 'br' ? 'Financial Check-up 360°' : 
                         locale === 'fr' ? 'Check-up financier 360°' : 
                         'Financial Check-up 360°'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {locale === 'br' ? 'Último diagnóstico' : 
                         locale === 'fr' ? 'Dernier diagnostic' : 
                         'Last diagnosis'}: {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'pt-BR', {
                           day: 'numeric',
                           month: 'long',
                           year: 'numeric'
                         })}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <ArrowRight className="w-4 h-4 text-purple-600" />
                  </div>
                </div>

                {/* Score principal avec jauge circulaire - Taille optimisée */}
                <div className="relative z-10 flex items-center justify-center mb-5">
                  <div className="relative" style={{ width: 110, height: 110 }}>
                    <CircularProgressbarWithChildren
                      value={financialHealthScore}
                      minValue={0}
                      maxValue={100}
                      circleRatio={0.75}
                      styles={buildStyles({
                        rotation: 0.625,
                        strokeLinecap: "round",
                        pathColor: financialHealthScore >= 80 ? "#8b5cf6" : financialHealthScore >= 60 ? "#f59e0b" : "#ef4444",
                        trailColor: "#e5e7eb",
                        textColor: "#111",
                        textSize: "22px",
                      })}
                    >
                      <div style={{ marginTop: 12, textAlign: "center" }}>
                        <div style={{
                          fontSize: 26,
                          fontWeight: 700,
                          color: "#374151",
                          marginBottom: 0
                        }}>{financialHealthScore}%</div>
                        <div style={{
                          fontSize: 13,
                          color: "#6b7280",
                          fontWeight: 600
                        }}>
                          {financialHealthScore >= 80 ? "Excelente" : financialHealthScore >= 60 ? "Bom" : "Ruim"}
                        </div>
                      </div>
                    </CircularProgressbarWithChildren>
                  </div>
                </div>

                {/* Informations détaillées - Layout optimisé */}
                <div className="relative z-10 space-y-3">
                  {/* Score global avec couleur dynamique */}
                  <div className="text-center">
                    <div className={`text-sm font-semibold ${
                      financialHealthScore >= 80 ? 'text-green-600' : 
                      financialHealthScore >= 60 ? 'text-yellow-600' : 
                      financialHealthScore >= 40 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {locale === 'br' ? 'Saúde financeira' : 
                       locale === 'fr' ? 'Santé financière' : 
                       'Financial health'}
                    </div>
                  </div>

                  {/* Indicateurs rapides - Grille 2x2 pour plus d'information */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/70 rounded-lg p-2.5 text-center backdrop-blur-sm">
                      <div className="font-semibold text-gray-700 mb-1">Resiliência</div>
                      <div className="text-purple-600 font-bold text-sm">85%</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-2.5 text-center backdrop-blur-sm">
                      <div className="font-semibold text-gray-700 mb-1">Renda</div>
                      <div className="text-green-600 font-bold text-sm">72%</div>
                    </div>
                  </div>

                  {/* CTA d'amélioration - Plus visible */}
                  <div className="text-center pt-2">
                    <div className="text-xs text-purple-600 font-medium bg-purple-50 px-3 py-1.5 rounded-full">
                      {locale === 'br' ? 'Clique para melhorar seu score' : 
                       locale === 'fr' ? 'Cliquez pour améliorer votre score' : 
                       'Click to improve your score'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations & Salary Analysis - Layout optimisé et proportions équilibrées */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-6">
            {/* Recommendations Block - Layout optimisé */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    {locale === 'br' ? 'Recomendações PIM' : 
                      locale === 'fr' ? 'Recommandations PIM' : 
                      'PIM Recommendations'}
                  </h3>
                  <Link 
                    href={`/${locale}/recommendations`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {locale === 'br' ? 'Ver todas →' : 
                     locale === 'fr' ? 'Voir toutes →' : 
                     'See all →'}
                  </Link>
                </div>
                
                {/* Recommendations List - Espacement optimisé */}
                <div className="space-y-4">
                  {recommendations.length > 0 ? (
                    recommendations.slice(0, 2).map((rec: any, index: number) => (
                      <div key={rec.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shrink-0">
                            {rec.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-base font-semibold text-gray-900 truncate">{rec.title}</span>
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                rec.priority === 'high'
                                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                                {rec.priority === 'high'
                                  ? (locale === 'br' ? 'Alta' : locale === 'fr' ? 'Élevée' : 'High')
                                  : (locale === 'br' ? 'Média' : locale === 'fr' ? 'Moyenne' : 'Medium')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Zap className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        {locale === 'br' ? 'Nenhuma recomendação disponível no momento' : 
                         locale === 'fr' ? 'Aucune recommandation disponible pour le moment' : 
                         'No recommendations available at the moment'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Analysis - Proportions équilibrées */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-200 p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-900">
                    {locale === 'br' ? 'Análise Salarial' : 
                     locale === 'fr' ? 'Analyse Salariale' : 
                     'Salary Analysis'}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="text-sm text-amber-700 mb-1">
                      {locale === 'br' ? 'Salário Bruto' : 
                       locale === 'fr' ? 'Salaire Brut' : 
                       'Gross Salary'}
                    </div>
                    <div className="text-2xl font-bold text-amber-900">
                      {hasHolerite ? `R$ ${salarioBruto.toLocaleString('pt-BR')}` : 'R$ 0'}
                    </div>
                  </div>
                  
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="text-sm text-amber-700 mb-1">
                      {locale === 'br' ? 'Eficiência' : 
                       locale === 'fr' ? 'Efficacité' : 
                       'Efficiency'}
                    </div>
                    <div className="text-2xl font-bold text-amber-900">
                      {eficiencia.toFixed(1)}%
                    </div>
                  </div>
                  
                  {eficiencia < 70 && (
                    <div className="bg-amber-100 border border-amber-200 rounded-lg p-3">
                      <div className="text-xs text-amber-800 font-medium">
                        {locale === 'br' ? 'Seu salário bruto está abaixo da média do mercado. Considere renegociação.' : 
                         locale === 'fr' ? 'Votre salaire brut est en dessous de la moyenne du marché. Considérez une renégociation.' : 
                         'Your gross salary is below market average. Consider renegotiation.'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de saisie des bénéfices */}
      <BeneficiosInputModal
        isOpen={isBeneficiosModalOpen}
        onClose={() => setIsBeneficiosModalOpen(false)}
        detectedBenefits={detectedBenefitNames}
        onSave={handleSaveBeneficios}
        holeriteData={holeriteResult?.raw}
      />
    </div>
  );
} 