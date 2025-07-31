"use client"

import React, { useState, useEffect } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { FileText, Upload, TrendingUp, AlertCircle, CheckCircle, Lightbulb, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashHoleriteBlockProps {
  userId: string;
  holeriteResult?: any; // Ajouter les données déjà traitées
}

export default function DashHoleriteBlock({ userId, holeriteResult }: DashHoleriteBlockProps) {
  const { supabase } = useSupabase();
  const [holeriteData, setHoleriteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Utiliser les données déjà traitées si disponibles
  useEffect(() => {
    if (holeriteResult && holeriteResult.salarioBruto > 0) {
      console.log('🔍 DashHoleriteBlock: Utilisation des données déjà traitées:', holeriteResult);
      setHoleriteData(holeriteResult);
      setLoading(false);
      return;
    }

    // Sinon, faire la requête Supabase
    const fetchHoleriteData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('holerites')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching holerite:', error);
        } else if (data) {
          setHoleriteData(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHoleriteData();
    }
  }, [userId, supabase, holeriteResult]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const getOptimizationScore = () => {
    if (!holeriteData?.structured_data?.recommendations?.score_optimisation) {
      return null;
    }
    return holeriteData.structured_data.recommendations.score_optimisation;
  };

  const getRecommendations = () => {
    if (!holeriteData?.structured_data?.recommendations?.recommendations) {
      return [];
    }
    return holeriteData.structured_data.recommendations.recommendations.slice(0, 3);
  };

  if (loading) {
    return (
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <CardHeader className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl animate-pulse"></div>
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

  if (!holeriteData) {
    return (
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <CardHeader className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Analyse de Bulletin
              </CardTitle>
              <p className="text-gray-600">
                Upload et analyse automatique
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Aucun bulletin analysé
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Faites l'upload de votre bulletin pour commencer l'analyse
            </p>
            <Button 
              onClick={() => window.location.href = '/br/scan-new-pim'}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg px-8 py-3 text-lg font-semibold"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Bulletin
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const optimizationScore = getOptimizationScore();
  const recommendations = getRecommendations();
  // Fonction d'extraction robuste des valeurs
  const extractValue = (obj: any, path: string, defaultValue: any = 0) => {
    if (!obj) return defaultValue;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    
    if (typeof value === 'object' && value !== null && 'valor' in value) {
      value = value.valor;
    }
    
    if (typeof value === 'object' && value !== null && 'value' in value) {
      value = value.value;
    }
    
    if (typeof value === 'string') {
      const cleanedValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
      const numValue = Number(cleanedValue);
      return isNaN(numValue) ? defaultValue : numValue;
    }
    
    const numValue = Number(value);
    return isNaN(numValue) ? defaultValue : numValue;
  };

  // Extraire les salaires avec la même logique que le dashboard principal
  const salarioBruto = extractValue(holeriteData, 'salario_bruto') || 
                      extractValue(holeriteData.structured_data, 'final_data.salario_bruto') ||
                      extractValue(holeriteData.structured_data, 'final_data.gross_salary') ||
                      extractValue(holeriteData.structured_data, 'salario_bruto') ||
                      extractValue(holeriteData.structured_data, 'gross_salary') ||
                      0;

  const salarioLiquido = extractValue(holeriteData, 'salario_liquido') || 
                        extractValue(holeriteData.structured_data, 'final_data.salario_liquido') ||
                        extractValue(holeriteData.structured_data, 'final_data.net_salary') ||
                        extractValue(holeriteData.structured_data, 'salario_liquido') ||
                        extractValue(holeriteData.structured_data, 'net_salary') ||
                        0;

  const rawData = holeriteData.structured_data?.final_data || holeriteData;

  return (
    <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Analyse de Bulletin
              </CardTitle>
              <p className="text-gray-600">
                {rawData.company_name || 'Entreprise'} • {rawData.period || 'Période'}
              </p>
            </div>
          </div>
          {optimizationScore && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
              <TrendingUp className="w-4 h-4 mr-1" />
              {optimizationScore}% optimisation
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {/* Salary Summary */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
            <p className="text-sm text-gray-600 mb-2">Salaire Brut</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(salarioBruto)}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <p className="text-sm text-gray-600 mb-2">Salaire Net</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(salarioLiquido)}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
              </div>
              Recommandations IA
            </h4>
            <div className="space-y-3">
              {recommendations.map((rec: any, index: number) => (
                <motion.div
                  key={`holerite-rec-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {rec.description || rec.titre || rec}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => window.location.href = '/br/scan-new-pim'}
          variant="outline"
          className="w-full py-4 text-lg font-semibold border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <Upload className="w-5 h-5 mr-2" />
          Nouveau Upload
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
} 