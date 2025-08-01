-- Create feedback table for user ratings and comments on reports
CREATE TABLE IF NOT EXISTS public.report_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    holerite_id UUID REFERENCES public.holerites(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('explanation', 'recommendation')),
    analysis_version JSONB NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_report_feedback_user_id ON public.report_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_report_feedback_holerite_id ON public.report_feedback(holerite_id);
CREATE INDEX IF NOT EXISTS idx_report_feedback_report_type ON public.report_feedback(report_type);
CREATE INDEX IF NOT EXISTS idx_report_feedback_created_at ON public.report_feedback(created_at);

-- Add RLS policies
ALTER TABLE public.report_feedback ENABLE ROW LEVEL SECURITY;

-- Users can only see their own feedback
CREATE POLICY "Users can view own feedback" ON public.report_feedback
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback" ON public.report_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback" ON public.report_feedback
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback" ON public.report_feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Add comments
COMMENT ON TABLE public.report_feedback IS 'Stores user feedback on explanation and recommendation reports';
COMMENT ON COLUMN public.report_feedback.report_type IS 'Type of report: explanation or recommendation';
COMMENT ON COLUMN public.report_feedback.analysis_version IS 'Version of analysis that generated the report';
COMMENT ON COLUMN public.report_feedback.rating IS 'User rating from 1 to 5';
COMMENT ON COLUMN public.report_feedback.comment IS 'Optional free-text comment from user';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_report_feedback_updated_at
    BEFORE UPDATE ON public.report_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 