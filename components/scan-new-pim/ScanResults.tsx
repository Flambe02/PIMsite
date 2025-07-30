/**
 * Composant ScanResults pour afficher les résultats du scan
 * Affichage structuré des données extraites et recommandations
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Lightbulb, RefreshCw, FileText, User, Building, GraduationCap, Briefcase, Info, Edit3, BarChart3 } from 'lucide-react';
import { ScanResults as ScanResultsType } from '@/hooks/useScanNewPIM';
import { DataEditModal } from './DataEditModal';
import { payslipEditService } from '@/lib/services/payslipEditService';
import { useSupabase } from '@/components/supabase-provider';
import { useToast } from '@/hooks/use-toast';

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
  const [isSaving, setIsSaving] = useState(false);
  const { analysis } = results;
  const { structuredData, recommendations } = analysis;
  const { session } = useSupabase();
  const { toast } = useToast();

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
    if (!session?.user?.id) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour sauvegarder les modifications.",
        variant: "destructive"
      });
      return;
    }

    if (!results.data?.scanId) {
      toast({
        title: "Erreur de données",
        description: "Impossible de récupérer l'ID du scan. Veuillez réessayer.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      console.log('💾 Sauvegarde des données éditées...', {
        scanId: results.data.scanId,
        editedData,
        customFields,
        userId: session.user.id
      });

      // Utiliser le vrai service de sauvegarde
      const savedData = await payslipEditService.saveEditedPayslip(
        results.data.scanId,
        editedData,
        customFields,
        session.user.id
      );

      console.log('✅ Données sauvegardées avec succès:', savedData);

      // Déterminer le message selon le type de modification
      const hasNumericChanges = Object.keys(editedData).some(key => 
        ['gross_salary', 'net_salary', 'salario_bruto', 'salario_liquido', 'total_deductions', 'descontos'].includes(key) ||
        (key === 'impostos' && Array.isArray(editedData[key]))
      );

      const message = hasNumericChanges 
        ? "Les données ont été sauvegardées et la réanalyse IA a été déclenchée pour les nouvelles valeurs."
        : "Les données ont été sauvegardées avec succès.";

      toast({
        title: "Sauvegarde réussie",
        description: message,
        variant: "default"
      });

      // Fermer le modal
      setIsEditModalOpen(false);

      // Optionnel : recharger les données ou afficher un indicateur de mise à jour
      // onReset(); // Si on veut recharger complètement

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      
      toast({
        title: "Erreur de sauvegarde",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // DEBUG: Afficher la structure des recommandations
  console.log('🔍 DEBUG ScanResults - Structure des recommandations:', {
    recommendations: recommendations,
    recommendationsList: recommendationsList,
    recommendationsListLength: recommendationsList.length,
    firstRecommendation: recommendationsList[0]
  });

  // DEBUG: Afficher la structure complète des données reçues
  console.log('🔍 DEBUG ScanResults - Données complètes reçues:', {
    results: results,
    structuredData: structuredData,
    analysis: analysis,
    scanId: results.data?.scanId
  });

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
        </div>
      </motion.div>

      {/* Grille principale */}
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
            {/* Informations de base */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Funcionário</p>
                <p className="font-medium">{structuredData.employee_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p className="font-medium">{structuredData.company_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cargo</p>
                <p className="font-medium">{structuredData.position || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Período</p>
                <p className="font-medium">{structuredData.period || structuredData.periodo || 'N/A'}</p>
              </div>
            </div>

            {/* Salaires */}
            <div className="border-t pt-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Salário Bruto</p>
                  <p className="font-semibold text-lg text-green-600">
                    {structuredData.salary_bruto ? formatCurrency(structuredData.salary_bruto) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salário Líquido</p>
                  <p className="font-semibold text-lg text-blue-600">
                    {structuredData.salary_liquido ? formatCurrency(structuredData.salary_liquido) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Déductions */}
            <div className="border-t pt-3">
              <div>
                <p className="text-sm text-gray-500">Descontos</p>
                <p className="font-semibold text-lg text-red-600">
                  {calculatedDescontos ? formatCurrency(calculatedDescontos) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Type de contrat */}
            <div className="border-t pt-3">
              <div>
                <p className="text-sm text-gray-500 mb-2">Tipo de Contrato</p>
                {(() => {
                  const statusInfo = getStatusInfo(structuredData.statut || structuredData.profile_type);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                      <StatusIcon className="w-4 h-4 mr-2" />
                      {statusInfo.label}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommandations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Recomendações IA
            </h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                Score: {scoreOptimisation}%
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {recommendationsList.length > 0 ? (
              recommendationsList.map((recommendation: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {recommendation.title || recommendation.titulo || `Recomendação ${index + 1}`}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {recommendation.description || recommendation.descricao || recommendation.content || 'Descrição não disponível'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Nenhuma recomendação disponível no momento</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex justify-center space-x-4"
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/br/dashboard'}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Dashboard</span>
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