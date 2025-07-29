import React from "react";

function safeDisplay(value: any): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.every(v => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
      return value.join(', ');
    }
    return '[objet complexe]';
  }
  return '[objet complexe]';
}

function extractValor(value: any): string {
  if (value == null || value === undefined || value === '') return '—';
  if (typeof value === 'object' && value !== null) {
    return value.value ?? value.valor ?? '—';
  }
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  return String(value);
}

// Fonction pour vérifier si une valeur est significative (non vide, non nulle, non zéro)
function hasSignificantValue(value: any): boolean {
  if (value == null || value === undefined || value === '') return false;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    // Pour les objets avec value/valor
    if (value.value !== undefined) return hasSignificantValue(value.value);
    if (value.valor !== undefined) return hasSignificantValue(value.valor);
    // Pour les objets avec des propriétés
    return Object.values(value).some(v => hasSignificantValue(v));
  }
  return true;
}

// Composant pour afficher les recommandations
function RecommendationsDisplay({ recommendations }: { recommendations: any }) {
  if (!recommendations) return null;

  // Si il y a un message no_recommendation, l'afficher
  if (recommendations.no_recommendation) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 mt-4 text-blue-900">
        <div className="font-semibold mb-2">📋 Analyse des Recommandations</div>
        <div className="text-sm">{recommendations.no_recommendation}</div>
      </div>
    );
  }

  // Si il y a des recommandations, les afficher
  if (Array.isArray(recommendations.recommendations) && recommendations.recommendations.length > 0) {
    return (
      <div className="bg-green-50 rounded-lg p-4 mt-4 text-green-900">
        <div className="font-semibold mb-2">💡 Recommandations ({recommendations.recommendations.length})</div>
        {recommendations.resume_situation && (
          <div className="text-sm mb-3 italic">{recommendations.resume_situation}</div>
        )}
        <div className="space-y-2">
          {recommendations.recommendations.map((rec: any, idx: number) => (
            <div key={idx} className="text-sm border-l-2 border-green-300 pl-3">
              <div className="font-medium">{rec.titre}</div>
              <div className="text-xs text-green-700">{rec.description}</div>
              <div className="text-xs text-green-600 mt-1">
                Impact: {rec.impact} | Priorité: {rec.priorite}
              </div>
            </div>
          ))}
        </div>
        {recommendations.score_optimisation && (
          <div className="text-xs mt-3 text-green-700">
            Score d'optimisation: {recommendations.score_optimisation}%
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default function PayslipAnalysisResult({ result }: { result: any }) {
  if (!result) return null;
  console.log('PayslipAnalysisResult result:', result);

  // Extraire les données significatives
  const significantData = {
    salarioBruto: result.salarioBruto ?? result.gross_salary ?? result.structured_data?.gross_salary,
    salarioLiquido: result.salarioLiquido ?? result.net_salary ?? result.structured_data?.net_salary,
    eficiencia: result.eficiencia,
    insights: Array.isArray(result.insights) ? result.insights.filter((insight: any) => 
      hasSignificantValue(insight.value ?? insight.valor)
    ) : []
  };

  // Vérifier s'il y a des données significatives à afficher
  const hasSignificantValues = 
    hasSignificantValue(significantData.salarioBruto) ||
    hasSignificantValue(significantData.salarioLiquido) ||
    hasSignificantValue(significantData.eficiencia) ||
    significantData.insights.length > 0;

  if (!hasSignificantValues) {
    return (
      <div className="bg-yellow-50 rounded-lg p-4 w-full text-yellow-900 text-center shadow">
        <div className="font-bold text-lg md:text-2xl mb-2">⚠️ Analyse terminée</div>
        <div className="text-sm">Aucune donnée significative n'a été extraite de ce document.</div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 rounded-lg p-4 md:p-8 w-full text-green-900 text-center shadow">
      <div className="font-bold text-lg md:text-2xl mb-2">Holerite analisado com sucesso!</div>
      
      {/* Données principales significatives */}
      <div className="flex flex-col md:flex-row md:justify-center md:gap-8 gap-2 mb-2">
        {hasSignificantValue(significantData.salarioBruto) && (
          <div><b>Salário bruto:</b> {extractValor(significantData.salarioBruto)}</div>
        )}
        {hasSignificantValue(significantData.salarioLiquido) && (
          <div><b>Salário líquido:</b> {extractValor(significantData.salarioLiquido)}</div>
        )}
        {hasSignificantValue(significantData.eficiencia) && (
          <div><b>Eficiência:</b> {extractValor(significantData.eficiencia)}</div>
        )}
      </div>

      {/* Insights significatifs */}
      {significantData.insights.length > 0 && (
        <div className="text-left md:text-center mt-2">
          {significantData.insights.map((insight: any, idx: number) => (
            <div key={idx} className="text-sm md:text-base mb-1">
              <b>{safeDisplay(insight.label)}:</b> {safeDisplay(insight.value ?? insight.valor ?? '')}
            </div>
          ))}
        </div>
      )}

      {/* Affichage des recommandations */}
      <RecommendationsDisplay recommendations={result.recommendations} />
    </div>
  );
} 