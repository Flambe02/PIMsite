import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface FeedbackDigest {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalFeedback: number;
    averageRating: number;
    newUsers: number;
  };
  insights: {
    topIssues: string[];
    improvementSuggestions: string[];
    userSatisfaction: {
      explanation: number;
      recommendations: number;
    };
  };
  recommendations: {
    immediate: string[];
    longTerm: string[];
  };
}

async function generateWeeklyDigest(): Promise<FeedbackDigest> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get feedback from the last week
  const { data: feedback, error } = await supabase
    .from('report_feedback')
    .select('*')
    .gte('created_at', weekAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch feedback: ${error.message}`);
  }

  // Get unique users who provided feedback
  const uniqueUsers = new Set(feedback?.map(f => f.user_id) || []);

  // Calculate summary statistics
  const totalFeedback = feedback?.length || 0;
  const totalRating = feedback?.reduce((sum, f) => sum + f.rating, 0) || 0;
  const averageRating = totalFeedback > 0 ? totalRating / totalFeedback : 0;

  // Calculate satisfaction by report type
  const explanationFeedback = feedback?.filter(f => f.report_type === 'explanation') || [];
  const recommendationFeedback = feedback?.filter(f => f.report_type === 'recommendation') || [];

  const explanationRating = explanationFeedback.length > 0 
    ? explanationFeedback.reduce((sum, f) => sum + f.rating, 0) / explanationFeedback.length 
    : 0;
  
  const recommendationRating = recommendationFeedback.length > 0 
    ? recommendationFeedback.reduce((sum, f) => sum + f.rating, 0) / recommendationFeedback.length 
    : 0;

  // Analyze comments for insights
  const comments = feedback?.filter(f => f.comment && f.comment.trim().length > 0) || [];
  
  // Simple keyword analysis for top issues
  const issueKeywords = {
    'confusion': ['confuso', 'confusão', 'não entendi', 'difícil', 'complicado'],
    'incomplete': ['incompleto', 'faltando', 'falta', 'mais informação', 'detalhes'],
    'accuracy': ['erro', 'incorreto', 'preciso', 'verificar', 'corrigir'],
    'usefulness': ['útil', 'ajudou', 'benefício', 'valor', 'importante'],
    'clarity': ['claro', 'clareza', 'entendi', 'compreensível', 'explicação']
  };

  const issueCounts: Record<string, number> = {};
  const positiveKeywords = ['útil', 'ajudou', 'bom', 'excelente', 'ótimo', 'claro', 'entendi'];
  const negativeKeywords = ['confuso', 'difícil', 'erro', 'incompleto', 'faltando', 'ruim'];

  comments.forEach(comment => {
    const text = comment.comment!.toLowerCase();
    
    // Count issues
    Object.entries(issueKeywords).forEach(([issue, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        issueCounts[issue] = (issueCounts[issue] || 0) + 1;
      }
    });
  });

  // Get top issues
  const topIssues = Object.entries(issueCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([issue]) => {
      const labels: Record<string, string> = {
        'confusion': 'Usuários encontram dificuldade para entender os relatórios',
        'incomplete': 'Informações incompletas ou faltando detalhes',
        'accuracy': 'Problemas de precisão ou erros nos dados',
        'usefulness': 'Questões sobre a utilidade dos relatórios',
        'clarity': 'Problemas de clareza na apresentação'
      };
      return labels[issue] || issue;
    });

  // Generate improvement suggestions based on feedback
  const improvementSuggestions = [];
  
  if (issueCounts.confusion) {
    improvementSuggestions.push('Melhorar a clareza e simplicidade da linguagem nos relatórios');
  }
  
  if (issueCounts.incomplete) {
    improvementSuggestions.push('Adicionar mais detalhes e contexto aos relatórios');
  }
  
  if (issueCounts.accuracy) {
    improvementSuggestions.push('Implementar verificações adicionais de precisão dos dados');
  }

  if (averageRating < 4.0) {
    improvementSuggestions.push('Revisar e melhorar a qualidade geral dos relatórios');
  }

  // Generate recommendations
  const immediate: string[] = [];
  const longTerm: string[] = [];

  if (topIssues.length > 0) {
    immediate.push(`Priorizar a resolução dos principais problemas identificados: ${topIssues.join(', ')}`);
  }

  if (explanationRating < recommendationRating) {
    immediate.push('Focar na melhoria dos relatórios de explicação');
  } else if (recommendationRating < explanationRating) {
    immediate.push('Focar na melhoria dos relatórios de recomendações');
  }

  if (totalFeedback < 10) {
    longTerm.push('Implementar estratégias para aumentar o engajamento com feedback');
  }

  if (averageRating >= 4.5) {
    longTerm.push('Considerar expandir funcionalidades baseadas no feedback positivo');
  }

  const digest: FeedbackDigest = {
    period: {
      start: weekAgo.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    },
    summary: {
      totalFeedback,
      averageRating: Math.round(averageRating * 100) / 100,
      newUsers: uniqueUsers.size
    },
    insights: {
      topIssues,
      improvementSuggestions,
      userSatisfaction: {
        explanation: Math.round(explanationRating * 100) / 100,
        recommendations: Math.round(recommendationRating * 100) / 100
      }
    },
    recommendations: {
      immediate,
      longTerm
    }
  };

  return digest;
}

async function saveDigest(digest: FeedbackDigest): Promise<void> {
  const { error } = await supabase
    .from('feedback_digests')
    .insert({
      period_start: digest.period.start,
      period_end: digest.period.end,
      summary: digest.summary,
      insights: digest.insights,
      recommendations: digest.recommendations,
      generated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Failed to save digest:', error);
  }
}

function formatDigestForEmail(digest: FeedbackDigest): string {
  return `
# Relatório Semanal de Feedback - Sistema de Análise de Holerites

**Período:** ${digest.period.start} a ${digest.period.end}

## Resumo Executivo

- **Total de feedback recebido:** ${digest.summary.totalFeedback}
- **Avaliação média:** ${digest.summary.averageRating}/5.0
- **Usuários únicos:** ${digest.summary.newUsers}

## Satisfação por Tipo de Relatório

- **Relatórios de Explicação:** ${digest.insights.userSatisfaction.explanation}/5.0
- **Relatórios de Recomendações:** ${digest.insights.userSatisfaction.recommendations}/5.0

## Principais Problemas Identificados

${digest.insights.topIssues.map(issue => `- ${issue}`).join('\n')}

## Sugestões de Melhoria

${digest.insights.improvementSuggestions.map(suggestion => `- ${suggestion}`).join('\n')}

## Recomendações

### Ações Imediatas
${digest.recommendations.immediate.map(rec => `- ${rec}`).join('\n')}

### Ações de Longo Prazo
${digest.recommendations.longTerm.map(rec => `- ${rec}`).join('\n')}

---
*Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}*
  `.trim();
}

async function main() {
  try {
    console.log('Gerando relatório semanal de feedback...');
    
    const digest = await generateWeeklyDigest();
    
    // Save to database
    await saveDigest(digest);
    
    // Format for email
    const emailContent = formatDigestForEmail(digest);
    
    // Output to console (in production, this would be sent via email)
    console.log('\n' + emailContent);
    
    console.log('\nRelatório gerado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { generateWeeklyDigest, formatDigestForEmail }; 