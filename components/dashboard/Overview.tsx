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
  Zap
} from 'lucide-react';
import FinancialGauge from '@/components/FinancialGauge';
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
  const hasHolerite = holeriteResult && holeriteResult.raw;

  // Calculer les données financières
  const salarioBruto = hasHolerite ? (holeriteResult.salarioBruto || 0) : 0;
  const salarioLiquido = hasHolerite ? (holeriteResult.salarioLiquido || 0) : 0;
  const descontos = hasHolerite ? (holeriteResult.descontos || 0) : 0;
  const eficiencia = hasHolerite ? (holeriteResult.eficiencia || 0) : 0;
  
  // Calculer le pouvoir d'achat réel (salaire net + bénéfices)
  const beneficios = hasHolerite ? (holeriteResult.raw?.beneficios || 0) : 0;
  const poderCompraReal = salarioLiquido + beneficios;

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

  if (!hasHolerite) {
    return (
      <div className="flex flex-col gap-8 mt-8">
        {/* Header - Message d'incitation */}
        <Card className="shadow-lg border-gray-100 rounded-2xl bg-white">
          <CardHeader className="text-center">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
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
    <div className="flex flex-col gap-6 mt-8">
      {/* Main Overview Card - Single white card encapsulating everything */}
      <Card className="shadow-lg border-gray-100 rounded-2xl bg-white">
        <CardContent className="p-8">
          {/* Header Row - Profile and Upload Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {holeriteResult.raw?.employee_name || 'Marcos'}
                </h1>
                <p className="text-xs text-gray-500">
                  {formatPeriod(holeriteResult.raw?.period)}
                </p>
              </div>
            </div>
            <Button 
              onClick={onUploadClick}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              {locale === 'br' ? 'Novo Holerite' : 
               locale === 'fr' ? 'Nouveau bulletin' : 
               'New Payslip'}
            </Button>
          </div>

          {/* First Row - Key Info Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Salário Líquido */}
            <div className="md:col-span-1">
              <div className="bg-gray-50/60 rounded-2xl shadow-[0_1px_6px_#0000000D] p-6 h-28 min-w-[220px] flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-500">
                    {locale === 'br' ? 'Salário Líquido' : 
                     locale === 'fr' ? 'Salaire net' : 
                     'Net Salary'}
                  </span>
                </div>
                <div className="text-3xl font-black text-black">
                  R$ {salarioLiquido.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {locale === 'br' ? 'Último holerite' : 
                   locale === 'fr' ? 'Dernier bulletin' : 
                   'Last payslip'}
                </div>
              </div>
            </div>

            {/* Poder de Compra Real */}
            <div className="md:col-span-1">
              <div className="bg-gray-50/60 rounded-2xl shadow-[0_1px_6px_#0000000D] p-6 h-28 min-w-[220px] flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-500">
                    {locale === 'br' ? 'Poder de Compra Real' : 
                     locale === 'fr' ? 'Pouvoir d\'achat réel' : 
                     'Real Purchasing Power'}
                  </span>
                </div>
                <div className="text-3xl font-black text-black">
                  R$ {poderCompraReal.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {locale === 'br' ? 'Ajustado pela inflação' : 
                   locale === 'fr' ? 'Ajusté par l\'inflation' : 
                   'Inflation adjusted'}
                </div>
              </div>
            </div>

            {/* Financial Check-up */}
            <div className="md:col-span-2">
              <div className="bg-gray-50/60 rounded-2xl shadow-[0_1px_6px_#0000000D] p-6 h-28 min-w-[220px] flex flex-col justify-center">
                <div className="flex items-center justify-center">
                  <FinancialGauge 
                    value={financialHealthScore / 100} 
                    title={locale === 'br' ? 'Financial Check-up' : 
                           locale === 'fr' ? 'Check-up financier' : 
                           'Financial Check-up'}
                    locale={locale}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations & Salary Analysis - Unified Apple/Stripe Style */}
          <div className="flex flex-col lg:flex-row gap-6 w-full mt-8">
            {/* Recommendations Block - Left, 2/3 width */}
            <div className="flex-1 min-w-0">
              <div className="bg-[#FAFAFA] rounded-2xl shadow-[0_1px_6px_#0000000D] px-7 py-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {locale === 'br' ? 'Recomendações PIM' : 
                      locale === 'fr' ? 'Recommandations PIM' : 
                      'PIM Recommendations'}
                  </h3>
                  <button 
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium transition p-0 bg-transparent shadow-none focus:outline-none"
                    onClick={() => handleTabClick("Salário")}
                  >
                    {locale === 'br' ? 'Ver todas' : locale === 'fr' ? 'Voir toutes' : 'View all'}
                  </button>
                </div>
                {/* Recommendations List */}
                <div className="flex flex-col gap-4">
                  {recommendations.length > 0 ? (
                    recommendations.slice(0,2).map((rec: any) => (
                      <div key={rec.id} className="bg-white/80 rounded-xl px-5 py-3 shadow border border-gray-100 flex gap-4 items-start">
                        <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-lg shrink-0 mt-0.5">
                          {rec.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-900">{rec.title}</span>
                            <span className={
                              `px-2 py-0.5 text-xs rounded-full
                               ${rec.priority === 'high'
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'bg-gray-50 text-gray-600'}
                              `
                            }>
                              {rec.priority === 'high'
                                ? (locale === 'br' ? 'Alta' : locale === 'fr' ? 'Élevée' : 'High')
                                : (locale === 'br' ? 'Média' : locale === 'fr' ? 'Moyenne' : 'Medium')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm py-7 text-center">
                      {locale === 'br'
                        ? 'Nenhuma recomendação disponível no momento.'
                        : locale === 'fr'
                        ? 'Aucune recommandation disponible pour le moment.'
                        : 'No recommendations available at the moment.'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Analysis Block - Right, 1/3 width */}
            <div className="w-full lg:max-w-xs">
              <div className="bg-[#FAFAFA] rounded-2xl px-7 py-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-base font-semibold text-gray-900">
                      {locale === 'br'
                        ? 'Análise Salarial'
                        : locale === 'fr'
                        ? 'Analyse salariale'
                        : 'Salary Analysis'}
                    </h3>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">
                        {locale === 'br' ? 'Salário Bruto:' : locale === 'fr' ? 'Salaire brut:' : 'Gross Salary:'}
                      </span>
                      <span className="text-lg font-black text-gray-900">
                        R$ {salarioBruto.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {locale === 'br' ? 'Eficiência:' : locale === 'fr' ? 'Efficacité:' : 'Efficiency:'}
                      </span>
                      <span className="text-lg font-black text-gray-900">
                        {eficiencia.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 flex gap-2 items-start mt-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1" />
                  <div>
                    <span className="block text-xs font-semibold text-yellow-700 mb-0.5">
                      {locale === 'br'
                        ? 'Seu salário bruto está abaixo da média do mercado.'
                        : locale === 'fr'
                        ? 'Votre salaire brut est en dessous de la moyenne du marché.'
                        : 'Your gross salary is below market average.'}
                    </span>
                    <span className="text-xs text-yellow-700">
                      {locale === 'br'
                        ? 'Considere renegociação'
                        : locale === 'fr'
                        ? 'Considérez une renégociation'
                        : 'Consider renegotiation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 