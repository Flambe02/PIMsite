"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackAnalytics {
  summary: {
    totalFeedback: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  };
  byReportType: {
    explanation: {
      count: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
    };
    recommendation: {
      count: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
    };
  };
  byVersion: {
    legacy: {
      count: number;
      averageRating: number;
    };
    enhanced: {
      count: number;
      averageRating: number;
    };
  };
  adoptionRate: {
    legacy: number;
    enhanced: number;
  };
  recentComments: Array<{
    id: string;
    comment: string;
    rating: number;
    report_type: string;
    created_at: string;
  }>;
  commonThemes: Array<{
    theme: string;
    count: number;
    averageRating: number;
  }>;
}

export function FeedbackAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/feedback');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de analytics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = (distribution: Record<number, number>, total: number) => {
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-8">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getThemeLabel = (theme: string) => {
    const labels: Record<string, string> = {
      'clarity': 'Clareza',
      'usefulness': 'Utilidade',
      'accuracy': 'Precisão',
      'completeness': 'Completude',
      'suggestions': 'Sugestões'
    };
    return labels[theme] || theme;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Carregando analytics...</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Nenhum dado de feedback disponível.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics de Feedback
          </h1>
          <p className="text-sm text-gray-600">
            Insights sobre a qualidade e adoção dos relatórios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Feedback</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.summary.totalFeedback}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.summary.averageRating}
                  </p>
                  {renderStars(Math.round(analytics.summary.averageRating), 'sm')}
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Adoção Avançada</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.adoptionRate.enhanced.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.summary.totalFeedback > 0 ? 'Ativo' : 'N/A'}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reports">Por Relatório</TabsTrigger>
          <TabsTrigger value="versions">Por Versão</TabsTrigger>
          <TabsTrigger value="comments">Comentários</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Distribuição de Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderRatingDistribution(
                  analytics.summary.ratingDistribution,
                  analytics.summary.totalFeedback
                )}
              </CardContent>
            </Card>

            {/* Adoption Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Taxa de Adoção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Versão Padrão</span>
                    <Badge variant="outline">
                      {analytics.adoptionRate.legacy.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analytics.adoptionRate.legacy}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Versão Avançada</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {analytics.adoptionRate.enhanced.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analytics.adoptionRate.enhanced}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Themes */}
          {analytics.commonThemes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Temas Mais Comuns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.commonThemes.map((theme) => (
                    <div key={theme.theme} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {getThemeLabel(theme.theme)}
                        </h4>
                        <Badge variant="outline">{theme.count}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(theme.averageRating), 'sm')}
                        <span className="text-sm text-gray-600">
                          {theme.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Explanation Report Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Relatório de Explicação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total de Avaliações</span>
                  <Badge variant="outline">{analytics.byReportType.explanation.count}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Avaliação Média</span>
                  {renderStars(Math.round(analytics.byReportType.explanation.averageRating), 'sm')}
                  <span className="text-sm text-gray-600">
                    {analytics.byReportType.explanation.averageRating}
                  </span>
                </div>
                <div className="pt-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Distribuição</h5>
                  {renderRatingDistribution(
                    analytics.byReportType.explanation.ratingDistribution,
                    analytics.byReportType.explanation.count
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Report Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Relatório de Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total de Avaliações</span>
                  <Badge variant="outline">{analytics.byReportType.recommendation.count}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Avaliação Média</span>
                  {renderStars(Math.round(analytics.byReportType.recommendation.averageRating), 'sm')}
                  <span className="text-sm text-gray-600">
                    {analytics.byReportType.recommendation.averageRating}
                  </span>
                </div>
                <div className="pt-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Distribuição</h5>
                  {renderRatingDistribution(
                    analytics.byReportType.recommendation.ratingDistribution,
                    analytics.byReportType.recommendation.count
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Legacy Version Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  Versão Padrão (Legacy)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total de Avaliações</span>
                  <Badge variant="outline">{analytics.byVersion.legacy.count}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Avaliação Média</span>
                  {renderStars(Math.round(analytics.byVersion.legacy.averageRating), 'sm')}
                  <span className="text-sm text-gray-600">
                    {analytics.byVersion.legacy.averageRating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Taxa de Adoção</span>
                  <Badge variant="outline">
                    {analytics.adoptionRate.legacy.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Version Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Versão Avançada (Enhanced)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total de Avaliações</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {analytics.byVersion.enhanced.count}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Avaliação Média</span>
                  {renderStars(Math.round(analytics.byVersion.enhanced.averageRating), 'sm')}
                  <span className="text-sm text-gray-600">
                    {analytics.byVersion.enhanced.averageRating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Taxa de Adoção</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {analytics.adoptionRate.enhanced.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Comentários Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recentComments.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentComments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {comment.report_type === 'explanation' ? 'Explicação' : 'Recomendações'}
                          </Badge>
                          {renderStars(comment.rating, 'sm')}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum comentário disponível.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 