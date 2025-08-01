"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisVersion } from '@/lib/ia/enhancedPayslipAnalysisService';

interface ReportFeedbackProps {
  holeriteId: string;
  reportType: 'explanation' | 'recommendation';
  analysisVersion: AnalysisVersion;
  className?: string;
}

interface FeedbackData {
  rating: number;
  comment: string;
  submitted: boolean;
}

export function ReportFeedback({ 
  holeriteId, 
  reportType, 
  analysisVersion, 
  className = "" 
}: ReportFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    comment: '',
    submitted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const reportTypeLabel = reportType === 'explanation' ? 'Explicação' : 'Recomendações';

  const handleRatingChange = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (comment: string) => {
    setFeedback(prev => ({ ...prev, comment }));
  };

  const handleSubmit = async () => {
    if (feedback.rating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma avaliação antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          holerite_id: holeriteId,
          report_type: reportType,
          analysis_version: analysisVersion,
          rating: feedback.rating,
          comment: feedback.comment.trim() || undefined
        }),
      });

      const result = await response.json();

      if (result.success) {
        setHasSubmitted(true);
        toast({
          title: "Feedback enviado!",
          description: "Obrigado pelo seu feedback. Ele nos ajuda a melhorar nossos relatórios.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erro ao enviar feedback",
        description: "Ocorreu um erro ao enviar seu feedback. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className={`p-1 transition-colors ${
              star <= feedback.rating
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
            disabled={hasSubmitted}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const getRatingLabel = (rating: number) => {
    const labels: Record<number, string> = {
      1: 'Muito ruim',
      2: 'Ruim',
      3: 'Regular',
      4: 'Bom',
      5: 'Excelente'
    };
    return labels[rating] || '';
  };

  if (hasSubmitted) {
    return (
      <Card className={`${className}`}>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Feedback Enviado!
            </h3>
            <p className="text-sm text-gray-600">
              Obrigado pelo seu feedback sobre o relatório de {reportTypeLabel.toLowerCase()}.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= feedback.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {getRatingLabel(feedback.rating)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Avalie este relatório
        </CardTitle>
        <p className="text-sm text-gray-600">
          Como você avalia a utilidade do relatório de {reportTypeLabel.toLowerCase()}?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Avaliação *
          </label>
          <div className="flex items-center gap-3">
            {renderStars()}
            {feedback.rating > 0 && (
              <Badge variant="outline" className="ml-2">
                {getRatingLabel(feedback.rating)}
              </Badge>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Comentário (opcional)
          </label>
          <Textarea
            placeholder="Compartilhe sua opinião sobre este relatório..."
            value={feedback.comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={hasSubmitted}
          />
          <p className="text-xs text-gray-500">
            Seus comentários nos ajudam a melhorar a qualidade dos relatórios.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || feedback.rating === 0}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Feedback
              </>
            )}
          </Button>
        </div>

        {/* Analysis Version Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Versão da análise:</span>
            <Badge variant="outline" className="text-xs">
              {analysisVersion.type === 'enhanced' ? 'Avançada' : 'Padrão'} v{analysisVersion.version}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 