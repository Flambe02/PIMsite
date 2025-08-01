"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  TrendingUp, 
  FileText, 
  Upload, 
  Brain,
  Lightbulb,
  ArrowLeft,
  Download,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';
import { EnhancedScanNewPIM } from '@/components/scan-new-pim/EnhancedScanNewPIM';
import { ExplanationReportDisplay } from '@/components/dashboard/ExplanationReport';
import { RecommendationsReportDisplay } from '@/components/dashboard/RecommendationsReport';
import { EnhancedAnalysisResult } from '@/lib/ia/enhancedPayslipAnalysisService';
import { useRouter } from 'next/navigation';

export default function EnhancedDashboardPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EnhancedAnalysisResult | null>(null);
  const [holeriteId, setHoleriteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showExplanation, setShowExplanation] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const router = useRouter();

  const handleAnalysisComplete = (result: EnhancedAnalysisResult, holeriteId?: string) => {
    setAnalysisResult(result);
    setHoleriteId(holeriteId || null);
    setShowUploadModal(false);
    setActiveTab('analysis');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleDownloadReport = (type: 'explanation' | 'recommendations' | 'full') => {
    // Implementation for downloading reports
    console.log(`Downloading ${type} report...`);
  };

  const handleShareReport = () => {
    // Implementation for sharing reports
    console.log('Sharing report...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Análise Avançada de Holerite
                </h1>
                <p className="text-sm text-gray-600">
                  Explicação detalhada e recomendações personalizadas
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Novo Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisResult ? (
          /* Welcome State */
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Análise Avançada de Holerite
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Obtenha uma explicação detalhada de cada campo do seu holerite e 
                receba recomendações personalizadas para otimizar sua remuneração.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="text-left">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Explicação Detalhada</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Entenda cada campo do seu holerite com explicações pedagógicas, 
                      contexto legal e métodos de cálculo.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-left">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Recomendações Personalizadas</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Receba sugestões específicas para otimizar impostos, benefícios 
                      e planejamento financeiro baseadas no seu perfil.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={() => setShowUploadModal(true)}
                size="lg"
                className="flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Começar Análise
              </Button>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-6">
            {/* Analysis Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Análise {analysisResult.version.type === 'enhanced' ? 'Avançada' : 'Standard'} v{analysisResult.version.version}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Concluída em {new Date(analysisResult.version.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Confiança: {Math.round(analysisResult.validation.confidence * 100)}%
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport('full')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareReport}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Toggle Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={showExplanation ? "default" : "outline"}
                size="sm"
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2"
              >
                {showExplanation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Explicação
              </Button>
              
              <Button
                variant={showRecommendations ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="flex items-center gap-2"
              >
                {showRecommendations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Recomendações
              </Button>
            </div>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="explanation" disabled={!showExplanation}>
                  Explicação
                </TabsTrigger>
                <TabsTrigger value="recommendations" disabled={!showRecommendations}>
                  Recomendações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Explanation Preview */}
                  {showExplanation && analysisResult.explanation && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          Explicação do Holerite
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {analysisResult.explanation.summary}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab('explanation')}
                            className="w-full"
                          >
                            Ver Explicação Completa
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations Preview */}
                  {showRecommendations && analysisResult.recommendations && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          Recomendações Personalizadas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-2">
                              <div className="text-lg font-bold text-emerald-900">
                                {analysisResult.recommendations.optimizationScore}
                              </div>
                            </div>
                            <p className="text-xs text-emerald-700">Score de Otimização</p>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {analysisResult.recommendations.profileAnalysis}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab('recommendations')}
                            className="w-full"
                          >
                            Ver Recomendações Completas
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="explanation">
                {analysisResult.explanation ? (
                  <ExplanationReportDisplay 
                    explanation={analysisResult.explanation}
                    holeriteId={holeriteId || undefined}
                    analysisVersion={analysisResult.version}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Explicação não disponível para esta versão de análise.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="recommendations">
                {analysisResult.recommendations ? (
                  <RecommendationsReportDisplay 
                    recommendations={analysisResult.recommendations}
                    holeriteId={holeriteId || undefined}
                    analysisVersion={analysisResult.version}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Recomendações não disponíveis para esta versão de análise.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Upload de Holerite
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  ✕
                </Button>
              </div>
              
              <EnhancedScanNewPIM
                onAnalysisComplete={handleAnalysisComplete}
                onClose={() => setShowUploadModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 