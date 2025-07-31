"use client"

import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { CheckupResult } from "@/types/financial-checkup";
import { useRouter } from "next/navigation";

interface FinancialCheckupSummaryCardProps {
  checkup: CheckupResult;
  locale: string | null;
}

const blockConfig = {
  resilience: { label: "Résilience", color: "blue" },
  income: { label: "Revenus", color: "green" },
  wellbeing: { label: "Bien-être", color: "pink" },
  future: { label: "Futur", color: "purple" },
  budget: { label: "Budget", color: "orange" },
};

export default function FinancialCheckupSummaryCard({
  checkup,
  locale,
}: FinancialCheckupSummaryCardProps) {
  const router = useRouter();

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Bon";
    if (percentage >= 40) return "Moyen";
    return "À améliorer";
  };

  const getGlobalScoreColor = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-yellow-400 to-yellow-600";
    if (score >= 40) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const worstBlock = checkup.scores.reduce((worst: any, current: any) => 
    current.percentage < worst.percentage ? current : worst
  );

  const bestBlock = checkup.scores.reduce((best: any, current: any) => 
    current.percentage > best.percentage ? current : best
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Financial Check-up 360°</h3>
            <p className="text-sm text-gray-600">
              {locale === 'fr' ? 'Dernier diagnostic' : 'Último diagnóstico'}: {formatDate(checkup.checkupDate)}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/${locale}/financial-checkup`)}
          className="text-purple-600 hover:text-purple-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Global Score */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={`url(#gradient-${checkup.globalScore})`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={314}
              strokeDashoffset={314 - (314 * checkup.globalScore) / 100}
              initial={{ strokeDashoffset: 314 }}
              animate={{ strokeDashoffset: 314 - (314 * checkup.globalScore) / 100 }}
              transition={{ duration: 1 }}
            />
            <defs>
              <linearGradient id={`gradient-${checkup.globalScore}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={`${getGlobalScoreColor(checkup.globalScore).split('-')[1]}-400`} />
                <stop offset="100%" className={`${getGlobalScoreColor(checkup.globalScore).split('-')[3]}-600`} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-900">{checkup.globalScore}</div>
            <div className="text-xs text-gray-600">/100</div>
          </div>
        </div>
        <div className={`text-sm font-semibold ${getScoreColor(checkup.globalScore)} mt-2`}>
          {getScoreLabel(checkup.globalScore)}
        </div>
      </div>

      {/* Block Scores */}
      <div className="space-y-3 mb-6">
        {checkup.scores.map((score: any) => {
          const config = blockConfig[score.block as keyof typeof blockConfig];
          return (
            <div key={score.block} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${config.color}-500`} />
                <span className="text-sm font-medium text-gray-700">{config.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      score.percentage >= 80 ? 'bg-green-500' :
                      score.percentage >= 60 ? 'bg-yellow-500' :
                      score.percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                <span className={`text-xs font-semibold ${getScoreColor(score.percentage)}`}>
                  {score.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">
              {locale === 'fr' ? 'Point fort' : 'Ponto forte'}
            </p>
                          <p className="text-xs text-green-700">
                {blockConfig[bestBlock.block as keyof typeof blockConfig].label}: {bestBlock.percentage}%
              </p>
          </div>
        </div>

        {worstBlock.percentage < 60 && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {locale === 'fr' ? 'À améliorer' : 'A melhorar'}
              </p>
              <p className="text-xs text-red-700">
                {blockConfig[worstBlock.block as keyof typeof blockConfig].label}: {worstBlock.percentage}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => router.push(`/${locale}/financial-checkup`)}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        {locale === 'fr' ? 'Refaire le diagnostic' : 'Refazer o diagnóstico'}
      </button>
    </motion.div>
  );
} 