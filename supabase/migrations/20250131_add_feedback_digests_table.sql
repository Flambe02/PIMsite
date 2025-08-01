-- Create feedback digests table for storing weekly reports
CREATE TABLE IF NOT EXISTS public.feedback_digests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    summary JSONB NOT NULL,
    insights JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    recipients TEXT[]
);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_feedback_digests_period ON public.feedback_digests(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_feedback_digests_generated_at ON public.feedback_digests(generated_at);

-- Add RLS policies
ALTER TABLE public.feedback_digests ENABLE ROW LEVEL SECURITY;

-- Only admins can view digests
CREATE POLICY "Admins can view feedback digests" ON public.feedback_digests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can insert digests
CREATE POLICY "Admins can insert feedback digests" ON public.feedback_digests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Add comments
COMMENT ON TABLE public.feedback_digests IS 'Stores weekly feedback digest reports for the product team';
COMMENT ON COLUMN public.feedback_digests.period_start IS 'Start date of the reporting period';
COMMENT ON COLUMN public.feedback_digests.period_end IS 'End date of the reporting period';
COMMENT ON COLUMN public.feedback_digests.summary IS 'Summary statistics for the period';
COMMENT ON COLUMN public.feedback_digests.insights IS 'Key insights and analysis from feedback';
COMMENT ON COLUMN public.feedback_digests.recommendations IS 'Actionable recommendations for improvement';
COMMENT ON COLUMN public.feedback_digests.sent_at IS 'Timestamp when the digest was sent to recipients';
COMMENT ON COLUMN public.feedback_digests.recipients IS 'List of email addresses that received the digest'; 