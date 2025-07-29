"use client";

import React from "react";

// Fonction pour vérifier si une valeur est significative
function hasSignificantValue(value: any): boolean {
  if (value == null || value === undefined || value === '') return false;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    if (value.value !== undefined) return hasSignificantValue(value.value);
    if (value.valor !== undefined) return hasSignificantValue(value.valor);
    return Object.values(value).some(v => hasSignificantValue(v));
  }
  return true;
}

// Composant pour afficher les recommandations
function RecommendationsSection({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  // Si il y a un message no_recommendation, l'afficher
  if (analysis.no_recommendation) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-900">📋 Analyse des Recommandations</h2>
        <div className="text-blue-700">{analysis.no_recommendation}</div>
      </div>
    );
  }

  // Si il y a des recommandations, les afficher
  if (Array.isArray(analysis.optimization_opportunities) && analysis.optimization_opportunities.length > 0) {
    const significantOpportunities = analysis.optimization_opportunities.filter((opp: any) => 
      typeof opp === 'string' && opp.trim().length > 0
    );

    if (significantOpportunities.length === 0) {
      return (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-900">📋 Analyse des Recommandations</h2>
          <div className="text-blue-700">Aucune opportunité d'optimisation spécifique n'a été identifiée.</div>
        </div>
      );
    }

    return (
      <div className="bg-green-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-green-900">💡 Oportunidades Identificadas ({significantOpportunities.length})</h2>
        <ul className="space-y-4 list-disc list-inside">
          {significantOpportunities.map((opp: string, index: number) => (
            <li key={index} className="text-green-700">{opp}</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

export default function AnalysisDisplay({ data }: { data: any }) {
  if (!data) return null;

  // Extraire et filtrer les données significatives
  const significantEarnings = Array.isArray(data.earnings) ? 
    data.earnings.filter((item: any) => hasSignificantValue(item.amount)) : [];
  
  const significantDeductions = Array.isArray(data.deductions) ? 
    data.deductions.filter((item: any) => hasSignificantValue(item.amount)) : [];

  const hasSignificantNetSalary = hasSignificantValue(data.net_salary);
  const hasSignificantSummary = data.analysis?.summary && data.analysis.summary.trim().length > 0;

  // Vérifier s'il y a des données significatives à afficher
  const hasSignificantData = 
    significantEarnings.length > 0 || 
    significantDeductions.length > 0 || 
    hasSignificantNetSalary ||
    hasSignificantSummary;

  if (!hasSignificantData) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-yellow-50 rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold mb-4 text-yellow-800">⚠️ Analyse terminée</h1>
          <p className="text-yellow-700">Aucune donnée significative n'a été extraite de ce document.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Análise do Holerite</h1>
      
      {/* Résumé si disponible */}
      {hasSignificantSummary && (
        <p className="text-gray-600 mb-8">{data.analysis.summary}</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Détail du holerite */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-6">Detalhamento do Holerite</h2>
          
          <div className="space-y-4">
            {/* Vencimentos significatifs */}
            {significantEarnings.length > 0 && (
              <div>
                <h3 className="font-semibold text-green-700 mb-2">Vencimentos</h3>
                <div className="space-y-2">
                  {significantEarnings.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-gray-700">{item.description}</span>
                      <span className="font-mono text-green-600">
                        R$ {typeof item.amount === 'number' ? item.amount.toFixed(2) : item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descontos significatifs */}
            {significantDeductions.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-700 mb-2">Descontos</h3>
                <div className="space-y-2">
                  {significantDeductions.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-gray-700">{item.description}</span>
                      <span className="font-mono text-red-600">
                        -R$ {typeof item.amount === 'number' ? item.amount.toFixed(2) : item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Salário Líquido significatif */}
            {hasSignificantNetSalary && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Salário Líquido:</span>
                  <span className="text-lg font-bold font-mono text-blue-600">
                    R$ {typeof data.net_salary === 'number' ? data.net_salary.toFixed(2) : data.net_salary}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-green-50 p-6 rounded-lg">
          <RecommendationsSection analysis={data.analysis} />
        </div>
      </div>
    </div>
  );
} 