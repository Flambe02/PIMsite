"use client"

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RefreshCw, Eye, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { CheckupResult } from "@/types/financial-checkup";

interface DashFinancialCheckupBlockProps {
  latestCheckup?: CheckupResult | null;
  loading: boolean;
  onStartCheckup: () => void;
}

export default function DashFinancialCheckupBlock({
  latestCheckup,
  loading,
  onStartCheckup
}: DashFinancialCheckupBlockProps) {

  if (loading) {
    return (
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <CardHeader className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestCheckup) {
    return (
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <CardHeader className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Diagnostic Financier
              </CardTitle>
              <p className="text-gray-600">
                Évaluez votre santé financière
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Aucun diagnostic effectué
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Commencez par évaluer votre santé financière avec notre diagnostic complet
            </p>
            <Button 
              onClick={onStartCheckup}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg px-8 py-3 text-lg font-semibold"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Faire le Diagnostic
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const globalScore = latestCheckup.global_score;
  const topScores = latestCheckup.scores
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

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

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const blockNames: { [key: string]: string } = {
    resilience: 'Résilience',
    income: 'Revenus',
    wellbeing: 'Bien-être',
    future: 'Avenir',
    budget: 'Budget'
  };

  return (
    <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Diagnostic Financier
              </CardTitle>
              <p className="text-gray-600">
                Score global et axes d'amélioration
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
            <TrendingUp className="w-4 h-4 mr-1" />
            {globalScore}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {/* Global Score Gauge */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 relative">
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
                  strokeDasharray={`${(globalScore / 100) * 339.292} 339.292`}
                  className={`${getScoreColor(globalScore)} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(globalScore)}`}>
                  {globalScore}
                </span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Score de santé financière global
          </p>
        </div>

        {/* Top 3 Scores */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 mb-4">Meilleurs Axes</h4>
          {topScores.map((score, index) => (
            <motion.div
              key={`score-${score.block}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-purple-100"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getScoreBgColor(score.percentage)}`}>
                  {getScoreIcon(score.percentage)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {blockNames[score.block] || score.block}
                  </p>
                  <p className="text-sm text-gray-600">
                    {score.percentage}% - {score.interpretation}
                  </p>
                </div>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${getScoreColor(score.percentage).replace('text-', 'bg-')}`}
                  style={{ width: `${score.percentage}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onStartCheckup}
            variant="outline"
            className="flex-1 py-3 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refaire
          </Button>
          <Button 
            variant="outline"
            className="flex-1 py-3 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir Détails
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 