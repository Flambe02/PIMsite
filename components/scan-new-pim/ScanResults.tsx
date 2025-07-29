/**
 * Composant ScanResults pour afficher les résultats du scan
 * Affichage structuré des données extraites et recommandations
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Lightbulb, RefreshCw, FileText, User, Building, GraduationCap, Briefcase, Info, Edit3 } from 'lucide-react';
import { ScanResults as ScanResultsType } from '@/hooks/useScanNewPIM';
import { DataEditModal } from './DataEditModal';
import { payslipEditService } from '@/lib/services/payslipEditService';

export interface ScanResultsProps {
  results: ScanResultsType;
  onReset: () => void;
  className?: string;
}

export const ScanResults: React.FC<ScanResultsProps> = ({
  results,
  onReset,
  className = ''
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { analysis } = results;
  const { structuredData, recommendations } = analysis;

  // Calcul automatique des déductions si non fourni
  const calculatedDescontos = structuredData.descontos || 
    (structuredData.salary_bruto && structuredData.salary_liquido ? 
      structuredData.salary_bruto - structuredData.salary_liquido : 0);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Fonction pour obtenir l'icône et la couleur du statut
  const getStatusInfo = (statut: string) => {
    const statusMap = {
      'CLT': {
        icon: User,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        label: 'CLT'
      },
      'PJ': {
        icon: Building,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        label: 'PJ'
      },
      'ESTAGIARIO': {
        icon: GraduationCap,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Estagiário'
      }
    };

    const status = statut?.toUpperCase();
    return statusMap[status as keyof typeof statusMap] || {
      icon: Briefcase,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      label: statut || 'N/A'
    };
  };

  // Fonction pour extraire les recommandations de manière sécurisée
  const getRecommendationsList = () => {
    // Structure attendue: recommendations.recommendations[]
    if (recommendations && recommendations.recommendations && Array.isArray(recommendations.recommendations)) {
      return recommendations.recommendations;
    }
    // Fallback: si recommendations est directement un tableau
    if (Array.isArray(recommendations)) {
      return recommendations;
    }
    // Fallback: si recommendations est un objet avec une propriété array
    if (recommendations && typeof recommendations === 'object') {
      const possibleArrays = Object.values(recommendations).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      }
    }
    return [];
  };

  const recommendationsList = getRecommendationsList();
  const scoreOptimisation = recommendations?.score_optimisation || 75;

  // Fonctions pour gérer l'édition
  const handleEditData = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEditedData = async (editedData: any, customFields: any[]) => {
    try {
      // Pour l'instant, on simule la sauvegarde sans ID
      // TODO: Implémenter la récupération de l'ID depuis le contexte ou les props
      console.log('Données éditées:', editedData);
      console.log('Champs personnalisés:', customFields);
      
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Données éditées sauvegardées avec succès');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  // DEBUG: Afficher la structure des recommandations
  console.log('🔍 DEBUG ScanResults - Structure des recommandations:', {
    recommendations: recommendations,
    recommendationsList: recommendationsList,
    recommendationsListLength: recommendationsList.length,
    firstRecommendation: recommendationsList[0]
  }); // Valeur par défaut

  return (
    <div className={`scan-results ${className}`}>
      {/* Header avec succès */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Scan concluído com sucesso !
        </h2>
        <p className="text-gray-600 mb-3">
          Sua folha de pagamento foi analisada e as recomendações estão prontas
        </p>
        
        {/* Indicateur de confiance discret */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <span>Confiança da extração:</span>
          <span className={`font-medium ${getConfidenceColor(analysis.confidence)}`}>
            {Math.round(analysis.confidence * 100)}%
          </span>
          <button
            onClick={() => {
              alert(`Índice de Confiança da Extração:

Este indicador mostra a fiabilidade da extração dos dados da sua folha de pagamento pela nossa IA.

• 80-100%: Extração muito confiável
• 60-79%: Extração confiável com algumas incertezas
• 40-59%: Extração moderada, verificação recomendada
• 0-39%: Extração baixa, análise manual necessária

Fatores que influenciam a confiança:
- Qualidade da imagem escaneada
- Clareza do texto
- Formato padrão da folha
- Presença de todos os campos obrigatórios`);
            }}
            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Clique para mais informações sobre o índice de confiança"
          >
            <Info className="w-3 h-3 text-gray-600" />
          </button>
        </div>
        
        {/* Information sur les pages dupliquées */}
        {results.ocr.duplicateInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-700 font-medium">
                {results.ocr.duplicateInfo}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Données extraites */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Dados extraídos
            </h3>
            <button
              onClick={handleEditData}
              className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Editar dados extraídos"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="space-y-3">
            {structuredData.employee_name && structuredData.employee_name.trim() !== '' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Funcionário</span>
                <span className="font-medium">{structuredData.employee_name}</span>
              </div>
            )}

            {structuredData.company_name && structuredData.company_name.trim() !== '' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Empresa</span>
                <span className="font-medium">{structuredData.company_name}</span>
              </div>
            )}

            {structuredData.position && structuredData.position.trim() !== '' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cargo</span>
                <span className="font-medium">{structuredData.position}</span>
              </div>
            )}

            {structuredData.period && structuredData.period.trim() !== '' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Período</span>
                <span className="font-medium">{structuredData.period}</span>
              </div>
            )}

            {structuredData.salary_bruto && structuredData.salary_bruto > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Salário bruto</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(structuredData.salary_bruto)}
                </span>
              </div>
            )}

            {structuredData.salary_liquido && structuredData.salary_liquido > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Salário líquido</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(structuredData.salary_liquido)}
                </span>
              </div>
            )}

            {calculatedDescontos > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Descontos</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(calculatedDescontos)}
                </span>
              </div>
            )}

            {structuredData.statut && structuredData.statut.trim() !== '' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tipo de contrato</span>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const statusInfo = getStatusInfo(structuredData.statut);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}



            {/* Déductions détaillées */}
            {structuredData.descontos > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 border-b pb-2">
                  Deduções Detalhadas
                </h4>
                
                {/* Impostos */}
                {structuredData.impostos && structuredData.impostos.length > 0 && (
                  <div>
                    <h5 className="font-medium text-red-600 mb-2">💰 Impostos</h5>
                    <div className="space-y-1">
                      {structuredData.impostos.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.nome}</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(item.valor)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefícios */}
                {structuredData.beneficios && structuredData.beneficios.length > 0 && (
                  <div>
                    <h5 className="font-medium text-blue-600 mb-2">🎁 Benefícios</h5>
                    <div className="space-y-1">
                      {structuredData.beneficios.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.label || item.nome}</span>
                          <span className="font-medium text-blue-600">
                            {formatCurrency(item.value || item.valor)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seguros */}
                {structuredData.seguros && structuredData.seguros.length > 0 && (
                  <div>
                    <h5 className="font-medium text-green-600 mb-2">🛡️ Seguros</h5>
                    <div className="space-y-1">
                      {structuredData.seguros.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.nome}</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(item.valor)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crédito */}
                {structuredData.credito && structuredData.credito.length > 0 && (
                  <div>
                    <h5 className="font-medium text-purple-600 mb-2">💳 Crédito</h5>
                    <div className="space-y-1">
                      {structuredData.credito.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.nome}</span>
                          <span className="font-medium text-purple-600">
                            {formatCurrency(item.valor)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outros */}
                {structuredData.outros && structuredData.outros.length > 0 && (
                  <div>
                    <h5 className="font-medium text-orange-600 mb-2">📋 Outros</h5>
                    <div className="space-y-1">
                      {structuredData.outros.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.nome}</span>
                          <span className="font-medium text-orange-600">
                            {formatCurrency(item.valor)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recommandations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Recomendações IA
          </h3>

          {/* Score d'optimisation */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Score de otimização</span>
              <span className="text-lg font-bold text-green-600">
                {scoreOptimisation}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${scoreOptimisation}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Liste des recommandations */}
          <div className="space-y-3">
            {recommendationsList.length > 0 ? (
              recommendationsList.map((rec: any, index: number) => (
                <motion.div
                  key={rec.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      w-2 h-2 rounded-full mt-2
                      ${rec.impact === 'high' ? 'bg-red-500' : 
                        rec.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                    `} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {rec.titre || rec.title || 'Recomendação'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {rec.description || rec.descricao || 'Descrição não disponível'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 text-center text-gray-500"
              >
                <p>Nenhuma recomendação disponível no momento.</p>
                <p className="text-sm mt-1">A análise foi concluída com sucesso.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Novo scan</span>
        </motion.button>
      </motion.div>

      {/* Modal d'édition des données */}
      <DataEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={structuredData}
        onSave={handleSaveEditedData}
        country="br"
      />
    </div>
  );
}; 