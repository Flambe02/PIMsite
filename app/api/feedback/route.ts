import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export interface FeedbackRequest {
  holerite_id: string;
  report_type: 'explanation' | 'recommendation';
  analysis_version: {
    type: 'legacy' | 'enhanced';
    version: string;
    timestamp: number;
  };
  rating: number;
  comment?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  feedback_id?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<FeedbackResponse>> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: FeedbackRequest = await request.json();
    
    // Validate required fields
    if (!body.holerite_id || !body.report_type || !body.analysis_version || !body.rating) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate report type
    if (!['explanation', 'recommendation'].includes(body.report_type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid report type' },
        { status: 400 }
      );
    }

    // Check if holerite exists and belongs to user
    const { data: holerite, error: holeriteError } = await supabase
      .from('holerites')
      .select('id')
      .eq('id', body.holerite_id)
      .eq('user_id', user.id)
      .single();

    if (holeriteError || !holerite) {
      return NextResponse.json(
        { success: false, message: 'Holerite not found or access denied' },
        { status: 404 }
      );
    }

    // Check if feedback already exists for this user, holerite, and report type
    const { data: existingFeedback } = await supabase
      .from('report_feedback')
      .select('id')
      .eq('user_id', user.id)
      .eq('holerite_id', body.holerite_id)
      .eq('report_type', body.report_type)
      .single();

    let feedbackId: string;

    if (existingFeedback) {
      // Update existing feedback
      const { data: updatedFeedback, error: updateError } = await supabase
        .from('report_feedback')
        .update({
          rating: body.rating,
          comment: body.comment || null,
          analysis_version: body.analysis_version,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingFeedback.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating feedback:', updateError);
        return NextResponse.json(
          { success: false, message: 'Failed to update feedback' },
          { status: 500 }
        );
      }

      feedbackId = updatedFeedback.id;
    } else {
      // Insert new feedback
      const { data: newFeedback, error: insertError } = await supabase
        .from('report_feedback')
        .insert({
          user_id: user.id,
          holerite_id: body.holerite_id,
          report_type: body.report_type,
          analysis_version: body.analysis_version,
          rating: body.rating,
          comment: body.comment || null
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error inserting feedback:', insertError);
        return NextResponse.json(
          { success: false, message: 'Failed to save feedback' },
          { status: 500 }
        );
      }

      feedbackId = newFeedback.id;
    }

    return NextResponse.json({
      success: true,
      message: existingFeedback ? 'Feedback updated successfully' : 'Feedback submitted successfully',
      feedback_id: feedbackId
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const holeriteId = searchParams.get('holerite_id');
    const reportType = searchParams.get('report_type');

    let query = supabase
      .from('report_feedback')
      .select('*')
      .eq('user_id', user.id);

    if (holeriteId) {
      query = query.eq('holerite_id', holeriteId);
    }

    if (reportType) {
      query = query.eq('report_type', reportType);
    }

    const { data: feedback, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback
    });

  } catch (error) {
    console.error('Feedback GET API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 