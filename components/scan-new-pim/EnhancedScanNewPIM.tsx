"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Brain,
  Lightbulb,
  BookOpen,
  TrendingUp,
  Info
} from 'lucide-react';
import { useScanNewPIM } from '@/hooks/useScanNewPIM';
import { EnhancedAnalysisResult } from '@/lib/ia/enhancedPayslipAnalysisService';

interface EnhancedScanNewPIMProps {
  onAnalysisComplete?: (result: EnhancedAnalysisResult, holeriteId?: string) => void;
  onClose?: () => void;
  className?: string;
  country?: string;
}

export function EnhancedScanNewPIM({ 
  onAnalysisComplete, 
  onClose, 
  className = "",
  country = "br"
}: EnhancedScanNewPIMProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState<'legacy' | 'enhanced'>('legacy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<EnhancedAnalysisResult | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResults(null);
    }
  }, []);

  const handleAnalysisTypeChange = useCallback((type: 'legacy' | 'enhanced') => {
    setAnalysisType(type);
    setError(null);
    setResults(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('analysisType', analysisType);
      formData.append('country', country);

      setProgress(30);
      
      // Choose endpoint based on analysis type
      const endpoint = analysisType === 'enhanced' ? '/api/scan-new-pim-enhanced' : '/api/scan-new-pim';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      setProgress(70);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du scan');
      }

      setProgress(100);
      setResults(result.data.analysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result.data.analysis, result.data.holeriteId);
      }

      console.log('✅ Analyse terminée:', result.data.analysis);

    } catch (error) {
      console.error('❌ Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [selectedFile, analysisType, country, onAnalysisComplete]);

  const getAnalysisTypeDescription = (type: 'legacy' | 'enhanced') => {
    if (type === 'enhanced') {
      return {
        title: 'Analyse Avancée',
        description: 'Explication détaillée + Recommandations personnalisées',
        features: [
          'Explication pédagogique de chaque champ',
          'Recommandations actionnables et personnalisées',
          'Analyse comparative avec le marché',
          'Étapes d\'implémentation concrètes'
        ],
        icon: <Brain className="w-5 h-5" />
      };
    } else {
      return {
        title: 'Analyse Standard',
        description: 'Analyse classique avec recommandations générales',
        features: [
          'Extraction des données principales',
          'Recommandations générales',
          'Validation des données',
          'Compatibilité avec l\'ancien système'
        ],
        icon: <FileText className="w-5 h-5" />
      };
    }
  };

  const analysisTypeInfo = getAnalysisTypeDescription(analysisType);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sélection du type d'analyse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            Choisissez votre type d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option Legacy */}
            <Card 
              className={`cursor-pointer transition-all ${
                analysisType === 'legacy' 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleAnalysisTypeChange('legacy')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold">Analyse Standard</h3>
                  <Badge variant="secondary">Legacy</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Analyse classique avec recommandations générales
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Extraction des données principales</li>
                  <li>• Recommandations générales</li>
                  <li>• Validation des données</li>
                  <li>• Compatibilité avec l'ancien système</li>
                </ul>
              </CardContent>
            </Card>

            {/* Option Enhanced */}
            <Card 
              className={`cursor-pointer transition-all ${
                analysisType === 'enhanced' 
                  ? 'ring-2 ring-green-500 bg-green-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleAnalysisTypeChange('enhanced')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Analyse Avancée</h3>
                  <Badge variant="default" className="bg-green-600">Nouveau</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Explication détaillée + Recommandations personnalisées
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Explication pédagogique de chaque champ</li>
                  <li>• Recommandations actionnables et personnalisées</li>
                  <li>• Analyse comparative avec le marché</li>
                  <li>• Étapes d'implémentation concrètes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Zone de sélection de fichier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600" />
            Upload du holerite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sélection de fichier */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Cliquez pour sélectionner votre holerite
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG (max 2MB)
                </p>
              </label>
            </div>

            {/* Fichier sélectionné */}
            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-emerald-700">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  disabled={loading}
                >
                  ✕
                </Button>
              </div>
            )}

            {/* Barre de progression */}
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyse en cours...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Bouton d'analyse */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyser avec {analysisTypeInfo.title}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Analyse terminée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Informations sur l'analyse */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">
                    Version d'analyse: {results.version.type === 'enhanced' ? 'Avancée' : 'Standard'} v{results.version.version}
                  </p>
                  <p className="text-blue-700">
                    Confiance: {Math.round(results.validation.confidence * 100)}%
                  </p>
                </div>
              </div>

              {/* Données extraites */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Salário Bruto</p>
                  <p className="font-bold text-gray-900">
                    R$ {results.finalData.salario_bruto?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Salário Líquido</p>
                  <p className="font-bold text-gray-900">
                    R$ {results.finalData.salario_liquido?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Descontos</p>
                  <p className="font-bold text-gray-900">
                    R$ {results.finalData.descontos?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Perfil</p>
                  <p className="font-bold text-gray-900">
                    {results.finalData.statut || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setResults(null);
                    setSelectedFile(null);
                  }}
                >
                  Nouvelle analyse
                </Button>
                {onClose && (
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={onClose}
                  >
                    Fermer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 