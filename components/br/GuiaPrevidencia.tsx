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
  ExternalLink
} from "lucide-react";

interface PrevidenciaItem {
  id: string;
  title: string;
  description: string;
  type: 'INSS' | 'Previdência Privada' | 'PGBL' | 'VGBL';
  contribution: string;
  benefits: string[];
  requirements: string[];
  icon: React.ReactNode;
}

const PREVIDENCIA_ITEMS: PrevidenciaItem[] = [
  {
    id: 'inss',
    title: 'INSS - Previdência Social',
    description: 'Sistema público de aposentadoria brasileiro',
    type: 'INSS',
    contribution: '8% a 11% do salário',
    benefits: [
      'Aposentadoria por idade (65 anos homens, 62 anos mulheres)',
      'Aposentadoria por tempo de contribuição (35 anos homens, 30 anos mulheres)',
      'Auxílio-doença',
      'Pensão por morte'
    ],
    requirements: [
      'Contribuição mínima de 15 anos',
      'Idade mínima de 65 anos (homens) ou 62 anos (mulheres)',
      'Tempo mínimo de contribuição para aposentadoria por tempo'
    ],
    icon: <Building2 className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'previdencia-privada',
    title: 'Previdência Privada',
    description: 'Complemento à aposentadoria pública',
    type: 'Previdência Privada',
    contribution: 'Flexível, conforme sua capacidade',
    benefits: [
      'Complemento à aposentadoria do INSS',
      'Flexibilidade na escolha do valor',
      'Possibilidade de resgate antecipado',
      'Diversas opções de investimento'
    ],
    requirements: [
      'Idade mínima de 18 anos',
      'CPF válido',
      'Capacidade financeira para contribuição'
    ],
    icon: <TrendingUp className="w-6 h-6 text-emerald-600" />
  },
  {
    id: 'pgbl',
    title: 'PGBL - Plano Gerador de Benefício Livre',
    description: 'Plano de previdência com benefício fiscal',
    type: 'PGBL',
    contribution: 'Até 12% da renda tributável',
    benefits: [
      'Dedução no Imposto de Renda',
      'Crescimento com juros compostos',
      'Flexibilidade na forma de recebimento',
      'Proteção patrimonial'
    ],
    requirements: [
      'Renda tributável para aproveitar a dedução',
      'Contribuição dentro do limite de 12%',
      'Declaração anual do IR'
    ],
    icon: <Calculator className="w-6 h-6 text-purple-600" />
  },
  {
    id: 'vgbl',
    title: 'VGBL - Vida Gerador de Benefício Livre',
    description: 'Seguro de vida com componente de previdência',
    type: 'VGBL',
    contribution: 'Flexível, sem limite fiscal',
    benefits: [
      'Sem tributação sobre os rendimentos',
      'Flexibilidade total na contribuição',
      'Proteção de vida incluída',
      'Resgate a qualquer momento'
    ],
    requirements: [
      'Idade mínima de 18 anos',
      'CPF válido',
      'Aceitação do risco do seguro'
    ],
    icon: <Shield className="w-6 h-6 text-orange-600" />
  }
];

export function GuiaPrevidencia() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Guia Completo da Previdência Brasileira
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Entenda as opções de aposentadoria disponíveis no Brasil e escolha a melhor estratégia para seu futuro financeiro.
        </p>
      </div>

      {/* Cards de opções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PREVIDENCIA_ITEMS.map((item) => (
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
                    Contribuição:
                  </h4>
                  <p className="text-sm text-gray-600">{item.contribution}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">
                    Benefícios:
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
                    Requisitos:
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
                  Calcular Benefícios
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
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Reforma da Previdência</h4>
              <p className="text-sm text-blue-800">
                A reforma de 2019 alterou as regras de aposentadoria. Consulte as novas regras antes de planejar.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Diversificação</h4>
              <p className="text-sm text-blue-800">
                Considere combinar INSS com previdência privada para uma aposentadoria mais segura.
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-blue-200">
            <Button 
              variant="outline" 
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Consultar Regras Oficiais
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 