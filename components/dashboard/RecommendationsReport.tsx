"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign,
  Star,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Users,
  Shield,
  PiggyBank,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { RecommendationsReport, AnalysisVersion } from '@/lib/ia/enhancedPayslipAnalysisService';
import { ReportFeedback } from './ReportFeedback';

interface RecommendationsReportProps {
  recommendations: RecommendationsReport;
  holeriteId?: string;
  analysisVersion?: AnalysisVersion;
  className?: string;
}

export function RecommendationsReportDisplay({ 
  recommendations, 
  holeriteId,
  analysisVersion,
  className = "" 
}: RecommendationsReportProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'tax_optimization': <DollarSign className="w-4 h-4" />,
      'benefits': <Shield className="w-4 h-4" />,
      'retirement': <PiggyBank className="w-4 h-4" />,
      'insurance': <Shield className="w-4 h-4" />,
      'financial_education': <GraduationCap className="w-4 h-4" />,
      'budget_management': <Calendar className="w-4 h-4" />
    };
    return icons[category] || <Lightbulb className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'tax_optimization': 'bg-green-100 text-green-800 border-green-200',
      'benefits': 'bg-blue-100 text-blue-800 border-blue-200',
      'retirement': 'bg-purple-100 text-purple-800 border-purple-200',
      'insurance': 'bg-orange-100 text-orange-800 border-orange-200',
      'financial_education': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'budget_management': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getImpactColor = (impact: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[impact] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'tax_optimization': 'Otimização Fiscal',
      'benefits': 'Benefícios',
      'retirement': 'Previdência',
      'insurance': 'Seguros',
      'financial_education': 'Educação Financeira',
      'budget_management': 'Gestão Orçamentária'
    };
    return labels[category] || category;
  };

  const getImpactLabel = (impact: string) => {
    const labels: Record<string, string> = {
      'high': 'Alto Impacto',
      'medium': 'Médio Impacto',
      'low': 'Baixo Impacto'
    };
    return labels[impact] || impact;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Score d'optimisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Score de Otimização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-900">
                  {recommendations.optimizationScore}
                </div>
                <div className="text-xs text-emerald-700">/100</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {recommendations.profileAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Recomendações Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.recommendations
              .sort((a, b) => a.priority - b.priority)
              .map((recommendation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(recommendation.category)}
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryColor(recommendation.category)}`}
                      >
                        {getCategoryLabel(recommendation.category)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${getImpactColor(recommendation.impact)}`}
                      >
                        {getImpactLabel(recommendation.impact)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Prioridade {recommendation.priority}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">
                    {recommendation.title}
                  </h4>
                  
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {recommendation.description}
                  </p>

                  {/* Économies estimées */}
                  {recommendation.estimatedSavings && (
                    <div className="bg-green-50 p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-900">
                          Economia Estimada:
                        </span>
                        <span className="text-sm font-bold text-green-900">
                          {formatCurrency(recommendation.estimatedSavings)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Étapes d'implémentation */}
                  {recommendation.implementationSteps && recommendation.implementationSteps.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1">
                        <ArrowRight className="w-4 h-4" />
                        Passos de Implementação
                      </h5>
                      <ol className="text-sm text-blue-800 space-y-1">
                        {recommendation.implementationSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="text-xs font-bold text-blue-600 mt-0.5">
                              {stepIndex + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Indicateur d'actionnabilité */}
                  <div className="flex items-center gap-2 mt-3">
                    {recommendation.actionable ? (
                      <div className="flex items-center gap-1 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Actionnable</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-medium">Informative</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparaison avec le marché */}
      {recommendations.marketComparison && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Comparação com o Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-purple-900 mb-2">
                    Benchmark Salarial
                  </h4>
                  <p className="text-sm text-purple-800">
                    {recommendations.marketComparison.salaryBenchmark}
                  </p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-indigo-900 mb-2">
                    Benchmark de Benefícios
                  </h4>
                  <p className="text-sm text-indigo-800">
                    {recommendations.marketComparison.benefitsBenchmark}
                  </p>
                </div>
              </div>

              {recommendations.marketComparison.recommendations && 
               recommendations.marketComparison.recommendations.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Recomendações Baseadas no Mercado
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {recommendations.marketComparison.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-xs font-bold text-gray-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Com base nas recomendações acima, sugerimos as seguintes ações prioritárias:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Consultoria
              </Button>
              
              <Button variant="outline" className="justify-start">
                <GraduationCap className="w-4 h-4 mr-2" />
                Acessar Recursos Educativos
              </Button>
              
              <Button variant="outline" className="justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Comparar Benefícios
              </Button>
              
              <Button variant="outline" className="justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                Simular Otimizações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      {holeriteId && analysisVersion && (
        <ReportFeedback
          holeriteId={holeriteId}
          reportType="recommendation"
          analysisVersion={analysisVersion}
          className="mt-6"
        />
      )}
    </div>
  );
} 