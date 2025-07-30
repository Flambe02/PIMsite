"use client"

import React, { useState, useEffect } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { Gift, Plus, ArrowRight, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashBenefitsBlockProps {
  userId: string;
  holeriteData?: any;
}

interface Benefit {
  id: string;
  name: string;
  type: string;
  value: number;
  status: 'active' | 'missing' | 'pending';
  description?: string;
}

export default function DashBenefitsBlock({ userId, holeriteData }: DashBenefitsBlockProps) {
  const { supabase } = useSupabase();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        
        // Fetch from beneficios_usuario table
        const { data: userBenefits, error } = await supabase
          .from('beneficios_usuario')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching benefits:', error);
        }

        let allBenefits: Benefit[] = [];

        // Add user benefits
        if (userBenefits) {
          allBenefits.push(...userBenefits.map((benefit: any) => ({
            id: benefit.id,
            name: benefit.nome,
            type: benefit.tipo,
            value: benefit.valor,
            status: benefit.status || 'active',
            description: benefit.descricao
          })));
        }

        // Extract benefits from holerite data
        if (holeriteData?.structured_data?.final_data) {
          const rawData = holeriteData.structured_data.final_data;
          
          // Common benefits to look for
          const benefitFields = [
            'vale_refeicao', 'vale_alimentacao', 'vale_transporte', 'plano_saude',
            'plano_odontologico', 'gympass', 'auxilio_creche', 'participacao_lucros'
          ];

          benefitFields.forEach(field => {
            if (rawData[field] && rawData[field] > 0) {
              const benefitNames: { [key: string]: string } = {
                vale_refeicao: 'Vale Refeição',
                vale_alimentacao: 'Vale Alimentação',
                vale_transporte: 'Vale Transporte',
                plano_saude: 'Plano de Saúde',
                plano_odontologico: 'Plano Odontológico',
                gympass: 'Gympass',
                auxilio_creche: 'Auxílio Creche',
                participacao_lucros: 'Participação nos Lucros'
              };

              allBenefits.push({
                id: `holerite-${field}`,
                name: benefitNames[field] || field,
                type: 'beneficio',
                value: rawData[field],
                status: 'active',
                description: `Detectado no holerite: R$ ${rawData[field].toLocaleString('pt-BR')}`
              });
            }
          });
        }

        setBenefits(allBenefits);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBenefits();
    }
  }, [userId, holeriteData, supabase]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'missing': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'missing': return <XCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <CardHeader className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl animate-pulse"></div>
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

  const activeBenefits = benefits.filter(b => b.status === 'active');
  const missingBenefits = benefits.filter(b => b.status === 'missing');

  return (
    <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Avantages & Assurances
              </CardTitle>
              <p className="text-gray-600">
                Bénéfices détectés et recommandations
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
            <Gift className="w-4 h-4 mr-1" />
            {benefits.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {/* Active Benefits */}
        {activeBenefits.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              Avantages Actifs ({activeBenefits.length})
            </h4>
            <div className="space-y-3">
              {activeBenefits.slice(0, 3).map((benefit, index) => (
                <motion.div
                  key={`active-benefit-${benefit.id}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{benefit.name}</p>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(benefit.value)}
                    </p>
                    <Badge className={`text-xs ${getStatusColor(benefit.status)}`}>
                      {benefit.status === 'active' ? 'Actif' : benefit.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Benefits */}
        {missingBenefits.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              Avantages Manquants ({missingBenefits.length})
            </h4>
            <div className="space-y-3">
              {missingBenefits.slice(0, 2).map((benefit, index) => (
                <motion.div
                  key={`missing-benefit-${benefit.id}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{benefit.name}</p>
                      <p className="text-sm text-gray-600">Recommandé pour optimiser</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(benefit.status)}`}>
                    Manquant
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No Benefits State */}
        {benefits.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun avantage détecté
            </h3>
            <p className="text-gray-600 mb-4">
              Ajoutez vos avantages pour une analyse complète
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline"
            className="flex-1 py-3 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
          <Button 
            variant="outline"
            className="flex-1 py-3 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            Comparer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 