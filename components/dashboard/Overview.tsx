"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  PercentCircle, 
  MinusCircle, 
  Upload, 
  FileText, 
  Heart, 
  Shield, 
  PiggyBank, 
  Target, 
  ArrowRight, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Star
} from "lucide-react";
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
  const poderAquisitivoReal = salarioLiquido + beneficios;

  // Recommandations IA prioritaires
  const recommendations = hasHolerite ? [
    {
      id: 1,
      title: "Otimização IRRF",
      description: "Você pode economizar até R$ 180/mês com deduções médicas",
      priority: "high",
      category: "fiscal",
      icon: <PercentCircle className="w-4 h-4" />,
      color: "bg-red-50 border-red-200",
      badgeColor: "bg-red-100 text-red-800",
      action: "Salário"
    },
    {
      id: 2,
      title: "Plano de Previdência",
      description: "Considere um PGBL/VGBL para reduzir o IR e garantir o futuro",
      priority: "medium",
      category: "previdencia",
      icon: <PiggyBank className="w-4 h-4" />,
      color: "bg-blue-50 border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800",
      action: "Investimentos"
    },
    {
      id: 3,
      title: "Seguro de Saúde",
      description: "Avalie um plano de saúde para complementar o SUS",
      priority: "medium",
      category: "seguros",
      icon: <Shield className="w-4 h-4" />,
      color: "bg-green-50 border-green-200",
      badgeColor: "bg-green-100 text-green-800",
      action: "Seguros"
    }
  ] : [];

  // Badges de synthèse rapide
  const summaryBadges = hasHolerite ? [
    {
      id: "irrf",
      label: "IRRF",
      value: hasHolerite ? `R$ ${(holeriteResult.raw?.irrf || 0).toLocaleString('pt-BR')}` : "N/A",
      icon: <PercentCircle className="w-5 h-5" />,
      color: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      action: "Salário"
    },
    {
      id: "previdencia",
      label: "Previdência",
      value: hasHolerite ? `R$ ${(holeriteResult.raw?.inss || 0).toLocaleString('pt-BR')}` : "N/A",
      icon: <PiggyBank className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      action: "Investimentos"
    },
    {
      id: "beneficios",
      label: "Benefícios",
      value: hasHolerite ? `${holeriteResult.raw?.beneficios_count || 0} ativos` : "N/A",
      icon: <Heart className="w-5 h-5" />,
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      action: "Benefícios"
    },
    {
      id: "seguros",
      label: "Seguros",
      value: hasHolerite ? `${holeriteResult.raw?.seguros_count || 0} coberturas` : "N/A",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-800",
      action: "Seguros"
    }
  ] : [];

  const formatPeriod = (period?: string): string => {
    if (!period) return "Período não informado";
    try {
      const date = new Date(period);
      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } catch {
      return period;
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
      <div className="flex flex-col gap-8">
        {/* Header - Message d'incitation */}
        <Card className="shadow-lg border-blue-100 rounded-2xl">
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
    <div className="flex flex-col gap-8">
      {/* Header - Résumé visuel */}
      <Card className="shadow-lg border-gray-100 rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {locale === 'br' ? 'Holerite Analisado' : 
                 locale === 'fr' ? 'Bulletin analysé' : 
                 'Payslip Analyzed'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {formatPeriod(holeriteResult.raw?.period)}
              </p>
            </div>
          </div>
          <Button 
            onClick={onUploadClick}
            variant="outline"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            {locale === 'br' ? 'Novo Upload' : 
             locale === 'fr' ? 'Nouveau upload' : 
             'New Upload'}
          </Button>
        </CardHeader>
      </Card>

      {/* Section A - Synthèse Financière */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Salaire Brut */}
        <Card 
          className="shadow-sm border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          onClick={() => handleTabClick("Salário")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                {locale === 'br' ? 'Salário Bruto' : 
                 locale === 'fr' ? 'Salaire brut' : 
                 'Gross Salary'}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              R$ {salarioBruto.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        {/* Salaire Net */}
        <Card 
          className="shadow-sm border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          onClick={() => handleTabClick("Salário")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                {locale === 'br' ? 'Salário Líquido' : 
                 locale === 'fr' ? 'Salaire net' : 
                 'Net Salary'}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              R$ {salarioLiquido.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        {/* Total Déductions */}
        <Card 
          className="shadow-sm border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          onClick={() => handleTabClick("Salário")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MinusCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">
                {locale === 'br' ? 'Total Deduções' : 
                 locale === 'fr' ? 'Total déductions' : 
                 'Total Deductions'}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              R$ {descontos.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        {/* Efficience */}
        <Card 
          className="shadow-sm border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          onClick={() => handleTabClick("Salário")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PercentCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                {locale === 'br' ? 'Eficiência' : 
                 locale === 'fr' ? 'Efficacité' : 
                 'Efficiency'}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {eficiencia.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pouvoir d'achat réel */}
      <Card className="shadow-lg border-emerald-100 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-1">
                {locale === 'br' ? 'Poder de Compra Real' : 
                 locale === 'fr' ? 'Pouvoir d\'achat réel' : 
                 'Real Purchasing Power'}
              </h3>
              <p className="text-sm text-emerald-700">
                {locale === 'br' ? 'Salário líquido + benefícios declarados' : 
                 locale === 'fr' ? 'Salaire net + avantages déclarés' : 
                 'Net salary + declared benefits'}
              </p>
            </div>
            <div className="text-2xl font-bold text-emerald-900">
              R$ {poderAquisitivoReal.toLocaleString('pt-BR')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section B - Financial Check-up */}
      <Card className="shadow-lg border-blue-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            {locale === 'br' ? 'Financial Check-up' : 
             locale === 'fr' ? 'Check-up financier' : 
             'Financial Check-up'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Jauge de santé financière */}
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => router.push(`/${locale}/financial-checkup`)}
            >
              <div className={`p-6 rounded-xl border ${getFinancialHealthColor(financialHealthScore)}`}>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{financialHealthScore}%</div>
                  <div className="text-sm font-medium mb-4">
                    {getFinancialHealthLabel(financialHealthScore)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${financialHealthScore}%` }}
                    ></div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    {locale === 'br' ? 'Refazer teste' : 
                     locale === 'fr' ? 'Refaire le test' : 
                     'Retake test'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Labels des dimensions */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {[
                { label: locale === 'br' ? 'Salário' : locale === 'fr' ? 'Salaire' : 'Salary', action: 'Salário' },
                { label: locale === 'br' ? 'Benefícios' : locale === 'fr' ? 'Avantages' : 'Benefits', action: 'Benefícios' },
                { label: locale === 'br' ? 'Seguros' : locale === 'fr' ? 'Assurances' : 'Insurance', action: 'Seguros' },
                { label: locale === 'br' ? 'Investimentos' : locale === 'fr' ? 'Investissements' : 'Investments', action: 'Investimentos' },
                { label: locale === 'br' ? 'Well-being' : locale === 'fr' ? 'Bien-être' : 'Well-being', action: 'Well-being' }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-sm h-auto py-2 px-3"
                  onClick={() => handleTabClick(item.action)}
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section C - Recommandations IA */}
      {recommendations.length > 0 && (
        <Card className="shadow-lg border-orange-100 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-orange-900 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {locale === 'br' ? 'Recomendações IA Prioritárias' : 
               locale === 'fr' ? 'Recommandations IA prioritaires' : 
               'Priority AI Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <Card 
                  key={rec.id}
                  className={`${rec.color} border cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
                  onClick={() => handleTabClick(rec.action)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${rec.badgeColor} text-xs`}>
                            {rec.priority === 'high' ? 'Alta' : 'Média'}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs p-0 h-auto"
                        >
                          {locale === 'br' ? 'Ver detalhes' : 
                           locale === 'fr' ? 'Voir détails' : 
                           'See details'}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section D - Synthèse Rapide (Badges) */}
      <Card className="shadow-lg border-gray-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5" />
            {locale === 'br' ? 'Resumo Rápido' : 
             locale === 'fr' ? 'Résumé rapide' : 
             'Quick Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryBadges.map((badge) => (
              <Card 
                key={badge.id}
                className={`${badge.color} border cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
                onClick={() => handleTabClick(badge.action)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    {badge.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {badge.label}
                  </div>
                  <div className={`text-lg font-bold ${badge.textColor}`}>
                    {badge.value}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs mt-2 p-0 h-auto"
                  >
                    {locale === 'br' ? 'Saiba mais' : 
                     locale === 'fr' ? 'En savoir plus' : 
                     'Learn more'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 