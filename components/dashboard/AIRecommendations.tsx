"use client";

import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import Image from "next/image";

interface AIRecommendation {
  categorie: "Salaires" | "Beneficios" | "Assurances" | "Optimisation";
  titre: string;
  description: string;
  impact: "Alto" | "Medio" | "Baixo";
  priorite: number;
}

interface AIRecommendationsProps {
  recommendations?: AIRecommendation[];
  resumeSituation?: string;
  scoreOptimisation?: number;
  isLoading?: boolean;
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Alto':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Medio':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Baixo':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'Alto':
      return <AlertTriangle className="w-4 h-4" />;
    case 'Medio':
      return <TrendingUp className="w-4 h-4" />;
    case 'Baixo':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Lightbulb className="w-4 h-4" />;
  }
};

export default function AIRecommendations({ 
  recommendations = [], 
  resumeSituation, 
  scoreOptimisation = 0,
  isLoading = false 
}: AIRecommendationsProps) {
  
  // DEBUG: Affichage des props reçues
  console.log('🤖 AIRecommendations - Props reçues:', {
    recommendationsCount: recommendations.length,
    resumeSituation: resumeSituation ? 'Présent' : 'Absent',
    scoreOptimisation,
    isLoading
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
            <Image 
              src="/images/pim-avatar.png" 
              alt="PIM" 
              width={20} 
              height={20}
              className="w-5 h-5"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Recomendações PIM</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
            <Image 
              src="/images/pim-avatar.png" 
              alt="PIM" 
              width={20} 
              height={20}
              className="w-5 h-5"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Recomendações PIM</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-700 mb-2">Análise em Andamento</p>
            <p className="text-sm text-gray-500">
              O sistema está analisando seu holerite para gerar recomendações personalizadas.
            </p>
            {/* DEBUG: Affichage des props pour debug */}
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left">
              <p><strong>DEBUG:</strong> recommendations.length = {recommendations?.length || 0}</p>
              <p><strong>DEBUG:</strong> resumeSituation = {resumeSituation ? 'PRÉSENT' : 'ABSENT'}</p>
              <p><strong>DEBUG:</strong> scoreOptimisation = {scoreOptimisation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
          <Image 
            src="/images/pim-avatar.png" 
            alt="PIM" 
            width={20} 
            height={20}
            className="w-5 h-5"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Recomendações PIM</h3>
        {scoreOptimisation > 0 && (
          <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            Score: {scoreOptimisation}%
          </span>
        )}
      </div>

      {resumeSituation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm">{resumeSituation}</p>
        </div>
      )}

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${getImpactColor(rec.impact)}`}>
                {getImpactIcon(rec.impact)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {rec.categorie}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${getImpactColor(rec.impact)}`}>
                    {rec.impact}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{rec.titre}</h4>
                <p className="text-gray-600 text-sm">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 