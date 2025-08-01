import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export interface FeedbackAnalytics {
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

export async function GET(request: NextRequest): Promise<NextResponse<FeedbackAnalytics>> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' } as any,
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' } as any,
        { status: 403 }
      );
    }

    // Get all feedback data
    const { data: allFeedback, error: feedbackError } = await supabase
      .from('report_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    interface FeedbackItem {
      id: string;
      user_id: string;
      holerite_id: string;
      report_type: 'explanation' | 'recommendation';
      analysis_version: {
        type: 'legacy' | 'enhanced';
        version: string;
        timestamp: number;
      };
      rating: number;
      comment: string | null;
      created_at: string;
      updated_at: string;
    }

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError);
      return NextResponse.json(
        { error: 'Failed to fetch feedback data' } as any,
        { status: 500 }
      );
    }

    const feedback = allFeedback as FeedbackItem[] || [];
    
    if (feedback.length === 0) {
      return NextResponse.json({
        summary: {
          totalFeedback: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        },
        byReportType: {
          explanation: { count: 0, averageRating: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
          recommendation: { count: 0, averageRating: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
        },
        byVersion: {
          legacy: { count: 0, averageRating: 0 },
          enhanced: { count: 0, averageRating: 0 }
        },
        adoptionRate: { legacy: 0, enhanced: 0 },
        recentComments: [],
        commonThemes: []
      });
    }

    // Calculate summary statistics
    const totalFeedback = feedback.length;
    const totalRating = feedback.reduce((sum: number, feedback: FeedbackItem) => sum + feedback.rating, 0);
    const averageRating = totalFeedback > 0 ? totalRating / totalFeedback : 0;

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedback.forEach((feedback: FeedbackItem) => {
      ratingDistribution[feedback.rating as keyof typeof ratingDistribution]++;
    });

    // Calculate by report type
    const explanationFeedback = feedback.filter((f: FeedbackItem) => f.report_type === 'explanation');
    const recommendationFeedback = feedback.filter((f: FeedbackItem) => f.report_type === 'recommendation');

    const explanationStats = {
      count: explanationFeedback.length,
      averageRating: explanationFeedback.length > 0 
        ? explanationFeedback.reduce((sum: number, f: FeedbackItem) => sum + f.rating, 0) / explanationFeedback.length 
        : 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    const recommendationStats = {
      count: recommendationFeedback.length,
      averageRating: recommendationFeedback.length > 0 
        ? recommendationFeedback.reduce((sum: number, f: FeedbackItem) => sum + f.rating, 0) / recommendationFeedback.length 
        : 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    explanationFeedback.forEach((feedback: FeedbackItem) => {
      explanationStats.ratingDistribution[feedback.rating as keyof typeof explanationStats.ratingDistribution]++;
    });

    recommendationFeedback.forEach((feedback: FeedbackItem) => {
      recommendationStats.ratingDistribution[feedback.rating as keyof typeof recommendationStats.ratingDistribution]++;
    });

    // Calculate by version
    const legacyFeedback = feedback.filter((f: FeedbackItem) => f.analysis_version?.type === 'legacy');
    const enhancedFeedback = feedback.filter((f: FeedbackItem) => f.analysis_version?.type === 'enhanced');

    const legacyStats = {
      count: legacyFeedback.length,
      averageRating: legacyFeedback.length > 0 
        ? legacyFeedback.reduce((sum: number, f: FeedbackItem) => sum + f.rating, 0) / legacyFeedback.length 
        : 0
    };

    const enhancedStats = {
      count: enhancedFeedback.length,
      averageRating: enhancedFeedback.length > 0 
        ? enhancedFeedback.reduce((sum: number, f: FeedbackItem) => sum + f.rating, 0) / enhancedFeedback.length 
        : 0
    };

    // Calculate adoption rate
    const totalAnalyses = legacyFeedback.length + enhancedFeedback.length;
    const adoptionRate = {
      legacy: totalAnalyses > 0 ? (legacyFeedback.length / totalAnalyses) * 100 : 0,
      enhanced: totalAnalyses > 0 ? (enhancedFeedback.length / totalAnalyses) * 100 : 0
    };

    // Get recent comments (last 10 with comments)
    const recentComments = feedback
      .filter((f: FeedbackItem) => f.comment && f.comment.trim().length > 0)
      .slice(0, 10)
      .map((f: FeedbackItem) => ({
        id: f.id,
        comment: f.comment!,
        rating: f.rating,
        report_type: f.report_type,
        created_at: f.created_at
      }));

    // Simple theme analysis (basic keyword matching)
    const themeKeywords = {
      'clarity': ['claro', 'clareza', 'entendi', 'compreensível', 'confuso', 'confusão'],
      'usefulness': ['útil', 'úteis', 'ajudou', 'ajuda', 'benefício', 'benefícios'],
      'accuracy': ['preciso', 'precisão', 'correto', 'incorreto', 'erro', 'erros'],
      'completeness': ['completo', 'completa', 'faltando', 'falta', 'incompleto'],
      'suggestions': ['sugestão', 'sugestões', 'melhorar', 'melhoria', 'adicionar']
    };

    const themeCounts: Record<string, { count: number; totalRating: number }> = {};
    
    feedback.forEach((feedback: FeedbackItem) => {
      if (feedback.comment) {
        const comment = feedback.comment.toLowerCase();
        Object.entries(themeKeywords).forEach(([theme, keywords]) => {
          if (keywords.some(keyword => comment.includes(keyword))) {
            if (!themeCounts[theme]) {
              themeCounts[theme] = { count: 0, totalRating: 0 };
            }
            themeCounts[theme].count++;
            themeCounts[theme].totalRating += feedback.rating;
          }
        });
      }
    });

    const commonThemes = Object.entries(themeCounts)
      .map(([theme, data]) => ({
        theme,
        count: data.count,
        averageRating: data.count > 0 ? data.totalRating / data.count : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const analytics: FeedbackAnalytics = {
      summary: {
        totalFeedback,
        averageRating: Math.round(averageRating * 100) / 100,
        ratingDistribution
      },
      byReportType: {
        explanation: {
          ...explanationStats,
          averageRating: Math.round(explanationStats.averageRating * 100) / 100
        },
        recommendation: {
          ...recommendationStats,
          averageRating: Math.round(recommendationStats.averageRating * 100) / 100
        }
      },
      byVersion: {
        legacy: {
          ...legacyStats,
          averageRating: Math.round(legacyStats.averageRating * 100) / 100
        },
        enhanced: {
          ...enhancedStats,
          averageRating: Math.round(enhancedStats.averageRating * 100) / 100
        }
      },
      adoptionRate,
      recentComments,
      commonThemes
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as any,
      { status: 500 }
    );
  }
} 