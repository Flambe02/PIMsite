"use client"

import React from "react";
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashRecommendationsBlockProps {
  holeriteData?: any;
  checkupData?: any;
  userId: string;
}

interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  priority: number;
  source: 'holerite' | 'checkup' | 'general';
}

export default function DashRecommendationsBlock({ 
  holeriteData, 
  checkupData, 
  userId 
}: DashRecommendationsBlockProps) {
  
  const getRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Recommendations from holerite analysis
    if (holeriteData?.structured_data?.recommendations?.recommendations) {
      const holeriteRecs = holeriteData.structured_data.recommendations.recommendations;
      holeriteRecs.slice(0, 3).forEach((rec: any, index: number) => {
        recommendations.push({
          id: `holerite-${index}`,
          category: 'Salaires',
          title: rec.titre || `Optimisation ${index + 1}`,
          description: rec.description || rec.titre || `Recommandation d'optimisation ${index + 1}`,
          impact: rec.impact === 'high' ? 'high' : rec.impact === 'medium' ? 'medium' : 'low',
          priority: rec.priorite || 1,
          source: 'holerite'
        });
      });
    }

    // Recommendations from financial checkup
    if (checkupData?.scores) {
      const lowScores = checkupData.scores.filter((score: any) => score.percentage < 60);
      lowScores.slice(0, 2).forEach((score: any, index: number) => {
        const blockNames: { [key: string]: string } = {
          resilience: 'Résilience',
          income: 'Revenus',
          wellbeing: 'Bien-être',
          future: 'Avenir',
          budget: 'Budget'
        };

        recommendations.push({
          id: `checkup-${score.block}`,
          category: 'Santé Financière',
          title: `Améliorer ${blockNames[score.block] || score.block}`,
          description: `Votre score de ${blockNames[score.block] || score.block} est de ${score.percentage}%. Considérez des actions pour améliorer.`,
          impact: score.percentage < 40 ? 'high' : 'medium',
          priority: 2,
          source: 'checkup'
        });
      });
    }

    // General recommendations if no specific ones
    if (recommendations.length === 0) {
      recommendations.push(
        {
          id: 'general-1',
          category: 'Éducation Financière',
          title: 'Commencer à Investir',
          description: 'Considérez commencer avec de petits investissements pour construire votre patrimoine.',
          impact: 'medium',
          priority: 3,
          source: 'general'
        },
        {
          id: 'general-2',
          category: 'Planification',
          title: 'Créer une Réserve d\'Urgence',
          description: 'Construisez une réserve de 3-6 mois de dépenses pour les imprévus.',
          impact: 'high',
          priority: 1,
          source: 'general'
        }
      );
    }

    return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 4);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'holerite': return 'bg-blue-100 text-blue-700';
      case 'checkup': return 'bg-purple-100 text-purple-700';
      case 'general': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const recommendations = getRecommendations();

  return (
    <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Recommandations IA
              </CardTitle>
              <p className="text-gray-600">
                {recommendations.length} recommandations personnalisées
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
            <Zap className="w-4 h-4 mr-1" />
            IA
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={`rec-${rec.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border-2 border-gray-100 rounded-xl hover:shadow-lg transition-all duration-200 hover:border-yellow-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${getImpactColor(rec.impact)}`}>
                    {getImpactIcon(rec.impact)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSourceColor(rec.source)}`}
                      >
                        {rec.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getImpactColor(rec.impact)}`}
                      >
                        {rec.impact === 'high' ? 'Haute' : rec.impact === 'medium' ? 'Moyenne' : 'Basse'} Priorité
                      </Badge>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">{rec.title}</h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">{rec.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs border-2 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50"
                    >
                      Voir détails
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Félicitations !
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Votre santé financière est excellente. Continuez comme ça !
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline"
            className="flex-1 py-3 border-2 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Voir Toutes
          </Button>
          <Button 
            variant="outline"
            className="flex-1 py-3 border-2 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Appliquer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 