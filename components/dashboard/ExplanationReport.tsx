"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calculator, 
  Info, 
  TrendingUp, 
  FileText,
  DollarSign,
  Percent,
  Calendar,
  Building,
  User
} from 'lucide-react';
import { ExplanationReport, AnalysisVersion } from '@/lib/ia/enhancedPayslipAnalysisService';
import { ReportFeedback } from './ReportFeedback';

interface ExplanationReportProps {
  explanation: ExplanationReport;
  holeriteId?: string;
  analysisVersion?: AnalysisVersion;
  className?: string;
}

export function ExplanationReportDisplay({ 
  explanation, 
  holeriteId,
  analysisVersion,
  className = "" 
}: ExplanationReportProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Résumé général */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Explicação do Holerite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {explanation.summary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Spécificités du mois */}
      {explanation.monthSpecifics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Especificidades do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {explanation.monthSpecifics}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explications champ par champ */}
      {explanation.fieldExplanations && explanation.fieldExplanations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-green-600" />
              Explicação Detalhada dos Campos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {explanation.fieldExplanations.map((field, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      {field.label}
                    </h4>
                    {typeof field.value === 'number' && (
                      <Badge variant="outline" className="font-mono">
                        {formatCurrency(field.value)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      {field.explanation}
                    </p>
                    
                    {field.legalContext && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          Contexto Legal
                        </h5>
                        <p className="text-xs text-blue-800">
                          {field.legalContext}
                        </p>
                      </div>
                    )}
                    
                    {field.calculationMethod && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="text-xs font-semibold text-green-900 mb-1 flex items-center gap-1">
                          <Calculator className="w-3 h-3" />
                          Método de Cálculo
                        </h5>
                        <p className="text-xs text-green-800">
                          {field.calculationMethod}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bases de calcul */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-orange-600" />
            Bases de Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Contribuições Sociais
                </h4>
                <p className="text-sm text-blue-800">
                  {explanation.calculationBases.socialContributions}
                </p>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-red-900 mb-1">
                  Impostos
                </h4>
                <p className="text-sm text-red-800">
                  {explanation.calculationBases.taxes}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-green-900 mb-1">
                  Benefícios
                </h4>
                <p className="text-sm text-green-800">
                  {explanation.calculationBases.benefits}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                  Descontos
                </h4>
                <p className="text-sm text-yellow-800">
                  {explanation.calculationBases.deductions}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Composition du salaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Composição do Salário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Résumé des totaux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-emerald-700 mb-1">Total de Vencimentos</p>
                <p className="text-lg font-bold text-emerald-900">
                  {formatCurrency(explanation.salaryComposition.totalEarnings)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-xs text-red-700 mb-1">Total de Descontos</p>
                <p className="text-lg font-bold text-red-900">
                  {formatCurrency(explanation.salaryComposition.totalDeductions)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-blue-700 mb-1">Salário Líquido</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(explanation.salaryComposition.netPay)}
                </p>
              </div>
            </div>

            {/* Détail par catégorie */}
            {explanation.salaryComposition.breakdown && explanation.salaryComposition.breakdown.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Detalhamento por Categoria
                </h4>
                <div className="space-y-2">
                  {explanation.salaryComposition.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatPercentage(item.percentage)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      {holeriteId && analysisVersion && (
        <ReportFeedback
          holeriteId={holeriteId}
          reportType="explanation"
          analysisVersion={analysisVersion}
          className="mt-6"
        />
      )}
    </div>
  );
} 