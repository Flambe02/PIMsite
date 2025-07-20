"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  UserCheck, 
  Calculator, 
  TrendingUp, 
  Shield,
  Info,
  ExternalLink,
  Euro
} from "lucide-react";

interface RetraiteItem {
  id: string;
  title: string;
  description: string;
  type: 'Régime Général' | 'Complémentaire' | 'Épargne Retraite' | 'PER';
  contribution: string;
  benefits: string[];
  requirements: string[];
  icon: React.ReactNode;
}

const RETRAITE_ITEMS: RetraiteItem[] = [
  {
    id: 'regime-general',
    title: 'Régime Général de la Sécurité Sociale',
    description: 'Régime obligatoire de retraite de base',
    type: 'Régime Général',
    contribution: '15,5% du salaire (part employeur + salarié)',
    benefits: [
      'Retraite à taux plein à 62 ans (ou 67 ans pour taux plein automatique)',
      'Calcul basé sur les 25 meilleures années',
      'Pension de réversion pour le conjoint',
      'Revalorisation annuelle'
    ],
    requirements: [
      'Travail en France',
      'Affiliation obligatoire',
      'Trimestres validés (172 pour taux plein)',
      'Âge légal de départ'
    ],
    icon: <Building2 className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'complementaire',
    title: 'Retraite Complémentaire (AGIRC-ARRCO)',
    description: 'Régime complémentaire obligatoire',
    type: 'Complémentaire',
    contribution: '8,55% du salaire (part employeur + salarié)',
    benefits: [
      'Complément à la retraite de base',
      'Points convertis en pension',
      'Flexibilité dans l\'âge de départ',
      'Réversion possible'
    ],
    requirements: [
      'Affiliation automatique avec le régime général',
      'Cotisations versées',
      'Âge de départ flexible'
    ],
    icon: <TrendingUp className="w-6 h-6 text-emerald-600" />
  },
  {
    id: 'epargne-retraite',
    title: 'Épargne Retraite',
    description: 'Épargne volontaire pour compléter la retraite',
    type: 'Épargne Retraite',
    contribution: 'Flexible, selon vos capacités',
    benefits: [
      'Complément libre à la retraite',
      'Fiscalité avantageuse',
      'Flexibilité dans les versements',
      'Diverses options d\'investissement'
    ],
    requirements: [
      'Majorité légale',
      'Capacité d\'épargne',
      'Choix du support d\'investissement'
    ],
    icon: <Euro className="w-6 h-6 text-purple-600" />
  },
  {
    id: 'per',
    title: 'Plan d\'Épargne Retraite (PER)',
    description: 'Nouveau dispositif d\'épargne retraite',
    type: 'PER',
    contribution: 'Flexible, avec avantages fiscaux',
    benefits: [
      'Déduction fiscale immédiate',
      'Croissance en capitalisation',
      'Flexibilité dans l\'utilisation',
      'Transmission facilitée'
    ],
    requirements: [
      'Ouverture d\'un contrat PER',
      'Versements réguliers ou ponctuels',
      'Respect des règles de sortie'
    ],
    icon: <Shield className="w-6 h-6 text-orange-600" />
  }
];

export function GuideRetraite() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Guide Complet de la Retraite Française
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprenez les différents régimes de retraite en France et optimisez votre stratégie de préparation à la retraite.
        </p>
      </div>

      {/* Cards de régimes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RETRAITE_ITEMS.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge className="mt-1" variant="secondary">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600">{item.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">
                    Cotisation:
                  </h4>
                  <p className="text-sm text-gray-600">{item.contribution}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">
                    Avantages:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">
                    Conditions:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Simuler une action de calcul
                    console.log(`Calculer ${item.title}`);
                  }}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculer Ma Retraite
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section d'informations importantes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Info className="w-5 h-5" />
            Informations Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Réforme des Retraites</h4>
              <p className="text-sm text-blue-800">
                La réforme de 2023 modifie l'âge de départ et les conditions. Restez informé des évolutions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Stratégie Multi-Piliers</h4>
              <p className="text-sm text-blue-800">
                Combinez retraite de base, complémentaire et épargne pour une retraite optimale.
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-blue-200">
            <Button 
              variant="outline" 
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Consulter les Règles Officielles
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section simulateur */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Calculator className="w-5 h-5" />
            Simulateur de Retraite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-emerald-800 mb-4">
            Utilisez notre simulateur pour estimer votre retraite selon votre situation actuelle.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Calculator className="w-4 h-4 mr-2" />
            Lancer le Simulateur
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 