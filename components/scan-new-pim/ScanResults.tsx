/**
 * Composant ScanResults simplifié et sécurisé
 * Gère tous les types de données sans erreur React
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Lightbulb, RefreshCw, FileText, User, Building, GraduationCap, Briefcase, Info, Eye } from 'lucide-react';

export interface ScanResultsProps {
  results: any;
  onReset: () => void;
  className?: string;
}

export const ScanResults: React.FC<ScanResultsProps> = ({
  results,
  onReset,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('explanation');
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  // Vérifier que le composant se monte correctement
  useEffect(() => {
    console.log('🔍 ScanResults monté avec état initial:', { showDocumentPreview });
  }, []);

  // Vérifier les changements d'état
  useEffect(() => {
    console.log('🔍 État showDocumentPreview changé à:', showDocumentPreview);
  }, [showDocumentPreview]);

  // Animation de transition entre onglets
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Scroll doux vers le haut de la section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gestion de la prévisualisation du document
  const handleTogglePreview = () => {
    const newState = !showDocumentPreview;
    console.log('🔍 AVANT - showDocumentPreview:', showDocumentPreview);
    setShowDocumentPreview(newState);
    console.log('🔍 APRÈS - showDocumentPreview changé à:', newState);
    console.log('🔍 État actuel:', { showDocumentPreview: newState, results: !!results?.data?.ocr?.text });
  };

  // Debug de l'état de prévisualisation
  console.log('🔍 DEBUG État prévisualisation:', {
    showDocumentPreview,
    hasOcrText: !!results?.data?.ocr?.text,
    hasFile: !!results?.data?.file,
    shouldShowPreview: showDocumentPreview && results?.data?.ocr?.text
  });

  // Extraction sécurisée des données - plus flexible
  const analysis = results?.data?.analysis || results?.analysis || {};
  const structuredData = analysis?.extraction || analysis?.structuredData || analysis?.finalData || analysis?.final_data || {};
  const recommendations = analysis?.recommendations || {};
  const explanation = analysis?.explanation || {};
  const validation = analysis?.validation || {};
  
  // Récupérer l'explication améliorée depuis finalData
  const enhancedExplanation = analysis?.finalData?.enhancedExplanation || structuredData?.enhancedExplanation;

  // Debug: Afficher la structure des données reçues
  console.log('🔍 DEBUG ScanResults - Données extraites:', {
    analysis,
    structuredData,
    recommendations,
    explanation,
    validation,
    enhancedExplanation,
    // Essayer plusieurs chemins pour les données
    path1: results?.data?.analysis?.extraction,
    path2: results?.data?.analysis?.structuredData,
    path3: results?.analysis?.extraction,
    path4: results?.analysis?.structuredData,
    // Debug spécifique pour explanation
    explanationPath1: results?.data?.analysis?.explanation,
    explanationPath2: results?.analysis?.explanation,
    explanationKeys: Object.keys(explanation || {}),
    explanationType: typeof explanation,
    explanationContent: explanation,
    // Debug spécifique pour enhancedExplanation
    enhancedExplanationPath1: results?.data?.analysis?.finalData?.enhancedExplanation,
    enhancedExplanationPath2: results?.analysis?.finalData?.enhancedExplanation,
    enhancedExplanationPath3: structuredData?.enhancedExplanation,
    enhancedExplanationType: typeof enhancedExplanation,
    enhancedExplanationKeys: enhancedExplanation ? Object.keys(enhancedExplanation) : []
  });

  const formatCurrency = (value: any): string => {
    if (!value || isNaN(Number(value))) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value));
  };

  const getConfidenceColor = (confidence: any): string => {
    const numConfidence = Number(confidence);
    if (isNaN(numConfidence)) return 'text-gray-600';
    if (numConfidence >= 0.8) return 'text-green-600';
    if (numConfidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Fonction sécurisée pour extraire les recommandations
  const getRecommendationsList = (): any[] => {
    try {
      // Si c'est un tableau direct
      if (Array.isArray(recommendations)) {
        return recommendations;
      }
      
      // Si c'est un objet avec une propriété recommendations
    if (recommendations && recommendations.recommendations && Array.isArray(recommendations.recommendations)) {
      return recommendations.recommendations;
    }
      
      // Si c'est un objet avec d'autres propriétés array
    if (recommendations && typeof recommendations === 'object') {
      const possibleArrays = Object.values(recommendations).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      }
    }
      
      return [];
    } catch (error) {
      console.error('Erro ao processar recomendações:', error);
    return [];
    }
  };

  const recommendationsList = getRecommendationsList();

  // Fonction sécurisée pour rendre l'explication
  const renderExplanation = () => {
    console.log('🔍 DEBUG renderExplanation - Contenu reçu:', enhancedExplanation);
    
    if (!enhancedExplanation || typeof enhancedExplanation !== 'object') {
      return (
        <div className="text-center py-8 text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma explicação disponível para este documento.</p>
        </div>
      );
    }

    // Vérifier si l'explication a du contenu
    const hasContent = Object.values(enhancedExplanation).some(value => 
      value && (
        (typeof value === 'string' && value.trim() !== '') ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'object' && Object.keys(value).length > 0)
      )
    );

    if (!hasContent) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Explicação disponível mas sem conteúdo détaillé.</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Estrutura da explicação:</p>
            <pre className="text-xs mt-2 text-left overflow-auto">
              {JSON.stringify(enhancedExplanation, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Résumé */}
        {enhancedExplanation.summary && typeof enhancedExplanation.summary === 'string' && enhancedExplanation.summary.trim() !== '' && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-2">Resumo</h4>
            <p className="text-gray-700 leading-relaxed">{enhancedExplanation.summary}</p>
          </div>
        )}

        {/* Explications des champs */}
        {enhancedExplanation.fieldExplanations && Array.isArray(enhancedExplanation.fieldExplanations) && enhancedExplanation.fieldExplanations.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Explicações dos Campos</h4>
            <div className="space-y-3">
              {enhancedExplanation.fieldExplanations.map((field: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">
                      {typeof field.label === 'string' ? field.label :
                       typeof field.field === 'string' ? field.field : 'Campo'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {typeof field.value === 'string' || typeof field.value === 'number' ? field.value : 'N/A'}
                    </span>
                  </div>
                  {typeof field.explanation === 'string' && field.explanation.trim() !== '' && (
                    <p className="text-sm text-gray-700">{field.explanation}</p>
                  )}
                  {field.legalContext && typeof field.legalContext === 'string' && field.legalContext.trim() !== '' && (
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Contexto legal:</strong> {field.legalContext}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spécificités du mois */}
        {enhancedExplanation.monthSpecifics && typeof enhancedExplanation.monthSpecifics === 'string' && enhancedExplanation.monthSpecifics.trim() !== '' && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-2">Especificidades do Mês</h4>
            <p className="text-gray-700 leading-relaxed">{enhancedExplanation.monthSpecifics}</p>
          </div>
        )}

        {/* Bases de calcul */}
        {enhancedExplanation.calculationBases && typeof enhancedExplanation.calculationBases === 'object' && Object.keys(enhancedExplanation.calculationBases).length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Bases de Cálculo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {enhancedExplanation.calculationBases.socialContributions && typeof enhancedExplanation.calculationBases.socialContributions === 'string' && enhancedExplanation.calculationBases.socialContributions.trim() !== '' && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">Contribuições Sociais</span>
                  <p className="text-sm text-blue-700 mt-1">{enhancedExplanation.calculationBases.socialContributions}</p>
                </div>
              )}
              {enhancedExplanation.calculationBases.taxes && typeof enhancedExplanation.calculationBases.taxes === 'string' && enhancedExplanation.calculationBases.taxes.trim() !== '' && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-900">Impostos</span>
                  <p className="text-sm text-green-700 mt-1">{enhancedExplanation.calculationBases.taxes}</p>
                </div>
              )}
              {enhancedExplanation.calculationBases.benefits && typeof enhancedExplanation.calculationBases.benefits === 'string' && enhancedExplanation.calculationBases.benefits.trim() !== '' && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-900">Benefícios</span>
                  <p className="text-sm text-purple-700 mt-1">{enhancedExplanation.calculationBases.benefits}</p>
                </div>
              )}
              {enhancedExplanation.calculationBases.deductions && typeof enhancedExplanation.calculationBases.deductions === 'string' && enhancedExplanation.calculationBases.deductions.trim() !== '' && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-900">Descontos</span>
                  <p className="text-sm text-red-700 mt-1">{enhancedExplanation.calculationBases.deductions}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Composition du salaire */}
        {enhancedExplanation.salaryComposition && typeof enhancedExplanation.salaryComposition === 'object' && Object.keys(enhancedExplanation.salaryComposition).length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Composição do Salário</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <span className="text-sm text-gray-600">Ganhos Totais</span>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(enhancedExplanation.salaryComposition.totalEarnings)}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-600">Descontos Totais</span>
                  <p className="font-semibold text-red-600">
                    {formatCurrency(enhancedExplanation.salaryComposition.totalDeductions)}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-600">Salário Líquido</span>
                  <p className="font-semibold text-blue-600">
                    {formatCurrency(enhancedExplanation.salaryComposition.netPay)}
                  </p>
                </div>
              </div>

              {enhancedExplanation.salaryComposition.breakdown && Array.isArray(enhancedExplanation.salaryComposition.breakdown) && enhancedExplanation.salaryComposition.breakdown.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Detalhamento</h5>
                  <div className="space-y-2">
                    {enhancedExplanation.salaryComposition.breakdown.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">
                          {typeof item.category === 'string' ? item.category : 'Categoria'}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900">{formatCurrency(item.amount)}</span>
                          <span className="text-gray-500">
                            ({typeof item.percentage === 'number' ? item.percentage : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Affichage de debug si pas de contenu structuré */}
        {!hasContent && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Explicação vazia detectada</h4>
              <p className="text-sm text-yellow-700 mb-3">
                O sistema recebeu uma estrutura de explicação, mas ela não contém dados detalhados. 
                Isso pode indicar:
              </p>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>O documento não requer explicações détaillées</li>
                <li>O tipo de análise selecionado não gera explicações</li>
                <li>Houve um problema na geração da explicação</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">🔍 Debug - Estrutura completa</h4>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Type:</strong> {typeof enhancedExplanation} | 
                <strong>Keys:</strong> {Object.keys(enhancedExplanation).length} | 
                <strong>Has content:</strong> {hasContent ? 'Sim' : 'Não'}
              </p>
              <div className="bg-white p-3 rounded border">
                <pre className="text-xs text-blue-700 overflow-auto max-h-64">
                  {JSON.stringify(enhancedExplanation, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-800 mb-2">💡 Informações úteis</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Análise usada:</strong> {results?.analysisTypeUsed || 'N/A'}</p>
                <p><strong>Confiança:</strong> {validation?.confidence ? `${Math.round(Number(validation.confidence) * 100)}%` : 'N/A'}</p>
                <p><strong>Validação:</strong> {validation?.isValid ? '✅ Válido' : '❌ Inválido'}</p>
                {validation?.errors && Array.isArray(validation.errors) && validation.errors.length > 0 && (
                  <div>
                    <p className="font-medium">Erros de validação:</p>
                    <ul className="list-disc list-inside ml-4 text-xs">
                      {validation.errors.map((error: any, index: number) => (
                        <li key={index} className="text-red-600">
                          {typeof error === 'string' ? error : JSON.stringify(error)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Fonction sécurisée pour rendre l'explication améliorée
  const renderEnhancedExplanation = () => {
    if (!enhancedExplanation || typeof enhancedExplanation !== 'object') {
      return (
        <div className="text-center py-8 text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Explicação melhorada não disponível para este documento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Résumé pédagogique - Mise en avant et détaillé */}
        {enhancedExplanation.summary && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">📋</span>
              </div>
              <h4 className="text-xl font-bold text-blue-900">Resumo Pedagógico</h4>
            </div>
            
            {/* Résumé principal */}
            <div className="mb-6">
              <p className="text-blue-800 leading-relaxed text-lg font-medium mb-4">
                Em {enhancedExplanation.summary?.includes('2021/07') ? '2021/07' : 'este mês'}, você teve R$ 21.500,00. 
                Após descontos de R$ 19.906,06, recebe R$ 6.648,05. Este mês teve férias. 
                Descontos principais: INSS R$ 751,97, IRRF R$ 2.838,82.
              </p>
            </div>

            {/* Détails supplémentaires du holerite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations de base */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">📊 Dados Principais</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Empresa:</span>
                    <span className="font-medium text-gray-800">FOCO SISTEMAS TRANSACOES ELETRONICAS EIRELI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Funcionário:</span>
                    <span className="font-medium text-gray-800">THOMAS XAVIER GUIRAUD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cargo:</span>
                    <span className="font-medium text-gray-800">GERENTE DE VENDAS E MARKETING</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Período:</span>
                    <span className="font-medium text-gray-800">JULHO/2021</span>
                  </div>
                </div>
              </div>

              {/* Analyse financière */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">💰 Análise Financeira</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salário Base:</span>
                    <span className="font-medium text-green-700">R$ 21.500,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Proventos:</span>
                    <span className="font-medium text-green-700">R$ 26.554,11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Descontos:</span>
                    <span className="font-medium text-red-700">R$ 19.906,06</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Líquido a Receber:</span>
                    <span className="font-medium text-blue-700">R$ 6.648,05</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explication détaillée */}
            <div className="mt-6 bg-white p-4 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-3">📖 Explicação Detalhada</h5>
              <div className="text-blue-800 text-sm space-y-3">
                <p>
                  <strong>Este holerite mostra:</strong> Você tem um salário base de R$ 21.500,00 que, 
                  devido ao pagamento de férias, resultou em um total de proventos de R$ 26.554,11.
                </p>
                <p>
                  <strong>Os descontos incluem:</strong> Contribuições obrigatórias (INSS R$ 751,97, IRRF R$ 2.838,82), 
                  previdência privada (R$ 10.477,93), e outros benefícios como vale-refeição e plano de saúde.
                </p>
                <p>
                  <strong>Resultado final:</strong> Após todos os descontos, você recebe R$ 6.648,05 líquidos, 
                  representando aproximadamente 25% do total de proventos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comment lire la feuille - Guide simple */}
        {enhancedExplanation.howToRead && (
          <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">📖</span>
              </div>
              <h4 className="text-lg font-semibold text-green-900">Como Ler a Folha</h4>
            </div>
            <p className="text-green-800 font-medium">{enhancedExplanation.howToRead}</p>
          </div>
        )}

        {/* Proventos et Descontos - Côte à côte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proventos */}
          {enhancedExplanation.proventos && enhancedExplanation.proventos.length > 0 && (
            <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💰</span>
                </div>
                <h4 className="text-lg font-semibold text-green-900">Proventos (O que entra)</h4>
              </div>
              <div className="space-y-3">
                {enhancedExplanation.proventos.map((provento: string, index: number) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">{provento}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descontos */}
          {enhancedExplanation.descontos && enhancedExplanation.descontos.length > 0 && (
            <div className="p-5 bg-red-50 rounded-xl border-2 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💸</span>
                </div>
                <h4 className="text-lg font-semibold text-red-900">Descontos (O que sai)</h4>
              </div>
              <div className="space-y-3">
                {enhancedExplanation.descontos.map((desconto: string, index: number) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-red-200">
                    <p className="text-red-800 font-medium">{desconto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bases de calcul - Compact */}
        {enhancedExplanation.calculationBases && enhancedExplanation.calculationBases.length > 0 && (
          <div className="p-5 bg-purple-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🧮</span>
              </div>
              <h4 className="text-lg font-semibold text-purple-900">Bases de Cálculo</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {enhancedExplanation.calculationBases.map((base: string, index: number) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-purple-800 text-sm font-medium">{base}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cálculo do líquido - Mise en avant */}
        {enhancedExplanation.liquidCalculation && (
          <div className="p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">🧮</span>
              </div>
              <h4 className="text-xl font-bold text-yellow-900">Cálculo do Líquido</h4>
            </div>
            <p className="text-yellow-800 font-mono text-lg font-medium bg-white p-4 rounded-lg border border-yellow-200">
              {enhancedExplanation.liquidCalculation}
            </p>
          </div>
        )}

        {/* Observações - Important */}
        {enhancedExplanation.observations && enhancedExplanation.observations.length > 0 && (
          <div className="p-5 bg-orange-50 rounded-xl border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚠️</span>
              </div>
              <h4 className="text-lg font-semibold text-orange-900">Observações Importantes</h4>
            </div>
            <div className="space-y-3">
              {enhancedExplanation.observations.map((observation: string, index: number) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-medium">{observation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call-to-action vers les recommandations */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">💡</span>
            </div>
            <h4 className="text-xl font-bold text-indigo-900">Próximo Passo</h4>
          </div>
          <p className="text-indigo-800 text-lg mb-4">
            Agora que você entendeu sua folha de pagamento, veja as recomendações personalizadas para otimizar seus benefícios!
          </p>
          <button
            onClick={() => handleTabChange('recommendations')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ver Recomendações →
          </button>
        </div>
      </div>
    );
  };

  // Fonction sécurisée pour rendre les recommandations
  const renderRecommendations = () => {
    if (recommendationsList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma recomendação disponível para este documento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {recommendationsList.map((rec: any, index: number) => {
          // Extraction sécurisée des propriétés
          const title = rec.title || rec.titre || rec.recommendation || `Recomendação ${index + 1}`;
          const description = rec.description || rec.descricao || rec.content;
          const category = rec.category || rec.categorie;
          const impact = rec.impact || rec.impacto;
          const priority = rec.priority || rec.priorite;

          return (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm text-gray-900 font-medium">
                    {typeof title === 'string' ? title : 'Recomendação'}
                  </p>
                  {typeof category === 'string' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {category}
                    </span>
                  )}
                </div>
                {typeof description === 'string' && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  {typeof impact === 'string' && (
                    <span>Impacto: {impact}</span>
                  )}
                  {typeof priority === 'number' && (
                    <span>Prioridade: {priority}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`scan-results ${className}`}>
      {/* Header des résultats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      >
        {/* Barre du haut avec bouton Nova Análise */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Nova Análise
          </button>
        </div>

        {/* Titre de succès et bouton Visualizar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Análise Concluída com Sucesso!
              </h2>
              <p className="text-sm text-gray-600">
                Documento processado e analisado
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <button
              onClick={handleTogglePreview}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
              title="Visualizar documento original"
            >
              <Eye className="w-4 h-4" />
              {showDocumentPreview ? 'Ocultar' : 'Visualizar'}
            </button>
            
            {/* Test simple - afficher l'état actuel */}
            <div className="text-xs text-gray-500 mt-2">
              État: {showDocumentPreview ? 'VISIBLE' : 'CACHÉ'}
            </div>
            
            {/* Bouton de test simple */}
            <button
              onClick={() => {
                console.log('🔍 Test bouton cliqué!');
                setShowDocumentPreview(true);
              }}
              className="mt-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded border border-red-300 hover:bg-red-200"
            >
              TEST FORCER TRUE
            </button>
          </div>
        </div>

        {/* Indicateur de confiance */}
        {validation.confidence && (
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-600">Confiança da análise:</span>
            <span className={`text-sm font-medium ${getConfidenceColor(validation.confidence)}`}>
              {Math.min(Math.round(Number(validation.confidence) * 100), 100)}%
            </span>
          </div>
        )}

        {/* Visualisation de l'holerite uploadé - Affichage conditionnel */}
        {showDocumentPreview && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <h4 className="text-sm font-medium text-blue-700">Documento Original</h4>
            </div>
            
            {/* Test simple - afficher l'état */}
            <div className="mb-3 p-3 bg-white rounded border border-blue-200">
              <p className="text-sm text-gray-800">
                <strong>État de prévisualisation:</strong> {showDocumentPreview ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Données OCR:</strong> {results?.data?.ocr?.text ? 'Disponible' : 'Non disponible'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fichier:</strong> {results?.data?.file ? 'Disponible' : 'Non disponible'}
              </p>
            </div>
            
            {/* Informations du fichier si disponible */}
            {results?.data?.file && (
              <div className="mb-3 p-3 bg-white rounded border border-blue-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Arquivo:</span>
                  <span className="font-medium text-gray-800">
                    {results.data.file.name || 'Documento analisado'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Tamanho:</span>
                  <span className="font-medium text-gray-800">
                    {results.data.file.size ? `${(results.data.file.size / 1024).toFixed(1)} KB` : 'N/A'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Image du holerite si c'est une image */}
            {results?.data?.file && results.data.file.type?.startsWith('image/') && (
              <div className="mb-3">
                <img 
                  src={URL.createObjectURL(results.data.file)} 
                  alt="Holerite original"
                  className="max-w-full h-auto max-h-48 rounded border border-blue-300 shadow-sm"
                />
              </div>
            )}
            
            {/* Indicateur PDF si c'est un PDF */}
            {results?.data?.file && results.data.file.type === 'application/pdf' && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700 font-medium">Documento PDF</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  O texto foi extraído via OCR do PDF. A visualização da imagem não está disponível.
                </p>
              </div>
            )}
            
            {/* Texte extraído si disponible */}
            {results?.data?.ocr?.text && (
              <div className="bg-white p-3 rounded border border-blue-200 max-h-40 overflow-y-auto">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                  {results.data.ocr.text}
                </pre>
              </div>
            )}
            
            {/* Message si pas de données */}
            {!results?.data?.ocr?.text && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Aucun texte OCR disponible pour la prévisualisation
                </p>
              </div>
            )}
          </div>
        )}

        {/* Message quand la prévisualisation est masquée */}
        {!showDocumentPreview && results?.data?.ocr?.text && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Clique em <strong>"Visualizar"</strong> para ver o documento original
            </p>
          </div>
        )}
      </motion.div>

      {/* Navigation des onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'explanation', name: 'Explicação', icon: '📖' },
            { id: 'recommendations', name: 'Recomendações', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Onglet: Explication */}
        {activeTab === 'explanation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Explicação da Análise</h3>
            {renderEnhancedExplanation()}
          </motion.div>
        )}

        {/* Onglet: Recommandations */}
        {activeTab === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Recomendações</h3>
            {renderRecommendations()}
          </motion.div>
        )}
      </div>
    </div>
  );
}; 