"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Shield, PiggyBank } from "lucide-react";
import { useCountry } from "@/lib/geo";

interface FinancialTip {
  id: string;
  title: string;
  description: string;
  category: 'saving' | 'investment' | 'tax' | 'insurance';
  priority: 'high' | 'medium' | 'low';
  applicableCountries: ('br' | 'fr')[];
}

const COMMON_TIPS: FinancialTip[] = [
  {
    id: 'emergency-fund',
    title: 'Fonds d\'urgence',
    description: 'Épargnez 3-6 mois de dépenses pour les urgences',
    category: 'saving',
    priority: 'high',
    applicableCountries: ['br', 'fr']
  },
  {
    id: 'diversification',
    title: 'Diversification',
    description: 'Répartissez vos investissements pour réduire les risques',
    category: 'investment',
    priority: 'high',
    applicableCountries: ['br', 'fr']
  },
  {
    id: 'tax-optimization',
    title: 'Optimisation fiscale',
    description: 'Profitez des déductions fiscales disponibles',
    category: 'tax',
    priority: 'medium',
    applicableCountries: ['br', 'fr']
  },
  {
    id: 'insurance-review',
    title: 'Révision assurance',
    description: 'Vérifiez vos couvertures d\'assurance annuellement',
    category: 'insurance',
    priority: 'medium',
    applicableCountries: ['br', 'fr']
  }
];

const getCategoryIcon = (category: FinancialTip['category']) => {
  switch (category) {
    case 'saving':
      return <PiggyBank className="w-5 h-5" />;
    case 'investment':
      return <TrendingUp className="w-5 h-5" />;
    case 'tax':
      return <Shield className="w-5 h-5" />;
    case 'insurance':
      return <Shield className="w-5 h-5" />;
    default:
      return <Lightbulb className="w-5 h-5" />;
  }
};

const getPriorityColor = (priority: FinancialTip['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getCategoryColor = (category: FinancialTip['category']) => {
  switch (category) {
    case 'saving':
      return 'bg-emerald-100 text-emerald-800';
    case 'investment':
      return 'bg-blue-100 text-blue-800';
    case 'tax':
      return 'bg-purple-100 text-purple-800';
    case 'insurance':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function FinancialTips() {
  const currentCountry = useCountry();
  
  // Filtrer les conseils applicables au pays actuel
  const applicableTips = COMMON_TIPS.filter(tip => 
    tip.applicableCountries.includes(currentCountry)
  );

  if (applicableTips.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
            Conseils financiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Aucun conseil disponible pour votre pays actuel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-emerald-600" />
          {currentCountry === 'br' ? 'Dicas Financeiras' : 'Conseils Financiers'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applicableTips.map((tip) => (
            <div 
              key={tip.id} 
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(tip.category)}
                  <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                </div>
                <Badge className={`text-xs ${getPriorityColor(tip.priority)}`}>
                  {tip.priority === 'high' ? 'Priorité' : 
                   tip.priority === 'medium' ? 'Moyenne' : 'Faible'}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-3">{tip.description}</p>
              
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getCategoryColor(tip.category)}`}>
                  {tip.category === 'saving' ? 'Épargne' :
                   tip.category === 'investment' ? 'Investissement' :
                   tip.category === 'tax' ? 'Fiscalité' : 'Assurance'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 