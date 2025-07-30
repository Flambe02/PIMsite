"use client"

import { motion } from "framer-motion";
import { 
  Shield, 
  TrendingUp, 
  Heart, 
  Target, 
  CreditCard,
  RefreshCw,
  Download,
  Share2,
  Star,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { CheckupScore, CheckupAnswer } from "@/types/financial-checkup";

interface FinancialCheckupSummaryProps {
  scores: CheckupScore[];
  globalScore: number;
  answers: CheckupAnswer[];
  data: any;
  language: string;
  onRestart: () => void;
  isLoading: boolean;
}

const blockConfig = {
  resilience: { icon: Shield, color: "blue", labelFR: "Résilience", labelPT: "Resiliência" },
  income: { icon: TrendingUp, color: "green", labelFR: "Revenus", labelPT: "Renda" },
  wellbeing: { icon: Heart, color: "pink", labelFR: "Bien-être", labelPT: "Saúde" },
  future: { icon: Target, color: "purple", labelFR: "Futur", labelPT: "Futuro" },
  budget: { icon: CreditCard, color: "orange", labelFR: "Budget", labelPT: "Dívidas" },
};

export default function FinancialCheckupSummary({
  scores,
  globalScore,
  answers,
  data,
  language,
  onRestart,
  isLoading,
}: FinancialCheckupSummaryProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    if (percentage >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (percentage: number) => {
    if(language==='fr'){
      if (percentage >= 80) return "Excellent";
      if (percentage >= 60) return "Bon";
      if (percentage >= 40) return "Moyen";
      return "À améliorer";
    } else {
      if (percentage >= 80) return "Excelente";
      if (percentage >= 60) return "Bom";
      if (percentage >= 40) return "Médio";
      return "A melhorar";
    }
  };

  const getGlobalScoreColor = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-yellow-400 to-yellow-600";
    if (score >= 40) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    scores.forEach(score => {
      if (score.percentage < 60) {
        const blockData = data.blocks[score.block];
        recommendations.push({
          block: score.block,
          title: blockData.title,
          percentage: score.percentage,
          priority: score.percentage < 40 ? 'high' : 'medium'
        });
      }
    });
    
    return recommendations.sort((a, b) => a.percentage - b.percentage);
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-8">
      {/* Loading state */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-600">{language==='fr' ? 'Sauvegarde des résultats...' : 'Salvando resultados...'}</span>
          </div>
        </motion.div>
      )}

      {/* Global score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {data.summary?.title || (language==='fr' ? 'Votre Diagnostic Financier' : 'Seu Diagnóstico Financeiro')}
        </h1>
        <p className="text-gray-600 mb-8">
          {data.summary?.subtitle || (language==='fr' ? "Voici votre score global et vos axes d'amélioration" : "Aqui está seu score global e áreas de melhoria") }
        </p>

        {/* Global score gauge */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={`url(#gradient-${globalScore})`}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={502.4}
                strokeDashoffset={502.4 - (502.4 * globalScore) / 100}
                initial={{ strokeDashoffset: 502.4 }}
                animate={{ strokeDashoffset: 502.4 - (502.4 * globalScore) / 100 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id={`gradient-${globalScore}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={`${getGlobalScoreColor(globalScore).split('-')[1]}-400`} />
                  <stop offset="100%" className={`${getGlobalScoreColor(globalScore).split('-')[3]}-600`} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-900">{globalScore}</div>
              <div className="text-lg text-gray-600">{language==='fr' ? 'sur 100' : 'de 100'}</div>
              <div className={`text-sm font-semibold ${getScoreColor(globalScore)} px-3 py-1 rounded-full mt-2`}>
                {getScoreLabel(globalScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Score interpretation */}
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-700 text-lg">
            {language==='fr' ? (
              globalScore >= 80
                ? 'Félicitations ! Votre santé financière est excellente. Continuez sur cette lancée !'
                : globalScore >= 60
                ? 'Votre situation financière est bonne, mais il y a encore des améliorations possibles.'
                : globalScore >= 40
                ? 'Votre santé financière nécessite quelques ajustements. Voici nos recommandations.'
                : 'Votre situation financière nécessite une attention particulière. Nous vous accompagnons.'
            ) : (
              globalScore >= 80
                ? 'Parabéns! Sua saúde financeira é excelente. Continue assim!'
                : globalScore >= 60
                ? 'Sua situação financeira é boa, mas ainda há melhorias possíveis.'
                : globalScore >= 40
                ? 'Sua saúde financeira precisa de alguns ajustes. Veja nossas recomendações.'
                : 'Sua situação financeira requer atenção especial. Estamos aqui para ajudar.'
            )}
          </p>
        </div>
      </motion.div>

      {/* Block scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {scores.map((score, index) => {
          const config = blockConfig[score.block];
          return (
            <motion.div
              key={score.block}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-${config.color}-100 flex items-center justify-center`}>
                  <config.icon className={`w-5 h-5 text-${config.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{language === 'fr' ? config.labelFR : config.labelPT}</h3>
                  <p className="text-sm text-gray-600">{score.percentage}%</p>
                </div>
              </div>
              
              {/* Mini gauge */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <motion.div
                  className={`h-2 rounded-full ${
                    score.percentage >= 80 ? 'bg-green-500' :
                    score.percentage >= 60 ? 'bg-yellow-500' :
                    score.percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                />
              </div>
              
              <div className={`text-sm font-medium ${getScoreColor(score.percentage)} px-2 py-1 rounded-full inline-block`}>
                {getScoreLabel(score.percentage)}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {language==='fr' ? "Axes d'amélioration prioritaires" : "Áreas de melhoria prioritárias"}
            </h2>
          </div>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.block}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high' 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-yellow-50 border-yellow-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600">
                      {language==='fr' ? 'Score actuel :' : 'Score atual :'} {rec.percentage}% - 
                      {rec.priority === 'high' ?  (language==='fr' ? ' Amélioration urgente' : ' Melhoria urgente') :  (language==='fr' ? ' Amélioration recommandée' : ' Melhoria recomendada')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {rec.priority === 'high' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <TrendingUpIcon className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          {data.summary?.restart || (language === 'fr' ? "Refaire le diagnostic" : "Refazer o diagnóstico")}
        </button>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300">
          <Download className="w-4 h-4" />
          {data.summary?.download || (language === 'fr' ? "Télécharger le rapport" : "Baixar relatório")}
        </button>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300">
          <Share2 className="w-4 h-4" />
          {data.summary?.share || (language === 'fr' ? "Partager les résultats" : "Compartilhar resultados")}
        </button>
      </motion.div>
    </div>
  );
} 