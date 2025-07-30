"use client"

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface DashHeroSectionProps {
  moneyScore?: number;
  hasHolerite: boolean;
  hasCheckup: boolean;
  onUploadHolerite: () => void;
  onStartCheckup: () => void;
  locale: string;
}

export default function DashHeroSection({
  moneyScore = 85,
  hasHolerite,
  hasCheckup,
  onUploadHolerite,
  onStartCheckup,
  locale
}: DashHeroSectionProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return "😊";
    if (score >= 60) return "😐";
    return "😟";
  };

  const getMainAction = () => {
    if (!hasHolerite) {
      return {
        title: locale === 'fr' ? "Télécharger un bulletin" : "Upload Holerite",
        action: onUploadHolerite,
        icon: Upload,
        color: "bg-blue-600 hover:bg-blue-700"
      };
    }
    if (!hasCheckup) {
      return {
        title: locale === 'fr' ? "Faire le check-up" : "Fazer Check-up",
        action: onStartCheckup,
        icon: TrendingUp,
        color: "bg-green-600 hover:bg-green-700"
      };
    }
    return {
      title: locale === 'fr' ? "Nouveau bulletin" : "Novo Upload",
      action: onUploadHolerite,
      icon: Upload,
      color: "bg-blue-600 hover:bg-blue-700"
    };
  };

  const getKeyAlert = () => {
    if (!hasHolerite) {
      return {
        message: locale === 'fr' ? "Commencez par télécharger votre bulletin de paie" : "Comece fazendo upload do seu holerite",
        type: "info" as const,
        icon: Upload
      };
    }
    if (!hasCheckup) {
      return {
        message: locale === 'fr' ? "N'oubliez pas votre check-up / Complétez le diagnostic financier" : "Não esqueça seu check-up / Complete o diagnóstico financeiro",
        type: "warning" as const,
        icon: Lightbulb
      };
    }
    return {
      message: locale === 'fr' ? "Votre santé financière est excellente !" : "Sua saúde financeira está excelente!",
      type: "success" as const,
      icon: CheckCircle
    };
  };

  const mainAction = getMainAction();
  const keyAlert = getKeyAlert();

  return (
    <div className="w-full mb-8">
      {/* Desktop Hero Section */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-6">
          {/* Money Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="col-span-1"
          >
            <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="relative inline-block">
                  {/* Circular Gauge */}
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Background circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(moneyScore / 100) * 339.292} 339.292`}
                        className={`${getScoreColor(moneyScore)} transition-all duration-1000 ease-out`}
                      />
                    </svg>
                    {/* Score Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreColor(moneyScore)}`}>
                        {moneyScore}
                      </span>
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl">{getScoreEmoji(moneyScore)}</span>
                    <span className={`text-lg font-semibold ${getScoreColor(moneyScore)}`}>
                      {locale === 'fr' ? 'Score Financier' : 'Money Score'}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {locale === 'fr' 
                      ? 'Votre santé financière globale' 
                      : 'Sua saúde financeira geral'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Action CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border-0 overflow-hidden">
              <CardContent className="p-8 flex flex-col justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <mainAction.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {locale === 'fr' ? 'Action Principale' : 'Ação Principal'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {locale === 'fr' 
                      ? 'Commencez par cette action pour améliorer votre situation' 
                      : 'Comece com esta ação para melhorar sua situação'
                    }
                  </p>
                  <Button 
                    onClick={mainAction.action}
                    className={`w-full py-4 text-lg font-semibold ${mainAction.color} shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                  >
                    {mainAction.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Key Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1"
          >
            <Card className={`rounded-2xl shadow-xl border-0 overflow-hidden ${
              keyAlert.type === 'warning' ? 'bg-gradient-to-br from-yellow-50 to-orange-50' :
              keyAlert.type === 'success' ? 'bg-gradient-to-br from-green-50 to-emerald-50' :
              'bg-gradient-to-br from-blue-50 to-cyan-50'
            }`}>
              <CardContent className="p-8 flex flex-col justify-center h-full">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    keyAlert.type === 'warning' ? 'bg-yellow-100' :
                    keyAlert.type === 'success' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    <keyAlert.icon className={`w-8 h-8 ${
                      keyAlert.type === 'warning' ? 'text-yellow-600' :
                      keyAlert.type === 'success' ? 'text-green-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {locale === 'fr' ? 'Rappel Important' : 'Lembrete Importante'}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {keyAlert.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                {/* Money Score */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 relative">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(moneyScore / 100) * 339.292} 339.292`}
                          className={`${getScoreColor(moneyScore)} transition-all duration-1000 ease-out`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-bold ${getScoreColor(moneyScore)}`}>
                          {moneyScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{getScoreEmoji(moneyScore)}</span>
                      <span className={`font-semibold ${getScoreColor(moneyScore)}`}>
                        {locale === 'fr' ? 'Score' : 'Score'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {locale === 'fr' ? 'Santé financière' : 'Saúde financeira'}
                    </p>
                  </div>
                </div>

                {/* Main Action Button */}
                <Button 
                  onClick={mainAction.action}
                  className={`${mainAction.color} shadow-lg px-6 py-3`}
                >
                  <mainAction.icon className="w-4 h-4 mr-2" />
                  {mainAction.title}
                </Button>
              </div>

              {/* Key Alert */}
              <div className={`p-4 rounded-xl ${
                keyAlert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                keyAlert.type === 'success' ? 'bg-green-50 border border-green-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <keyAlert.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    keyAlert.type === 'warning' ? 'text-yellow-600' :
                    keyAlert.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`} />
                  <p className="text-sm text-gray-700">
                    {keyAlert.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 