-- Script pour créer la table financial_checkups
-- À exécuter directement dans l'interface Supabase SQL Editor

-- Create financial_checkups table
CREATE TABLE IF NOT EXISTS financial_checkups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    checkup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answers JSONB NOT NULL DEFAULT '[]',
    scores JSONB NOT NULL DEFAULT '[]',
    global_score INTEGER NOT NULL DEFAULT 0,
    comments JSONB NOT NULL DEFAULT '{}',
    country TEXT NOT NULL DEFAULT 'FR',
    language TEXT NOT NULL DEFAULT 'fr',
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_checkups_user_id ON financial_checkups(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_checkups_date ON financial_checkups(checkup_date);
CREATE INDEX IF NOT EXISTS idx_financial_checkups_country ON financial_checkups(country);
CREATE INDEX IF NOT EXISTS idx_financial_checkups_language ON financial_checkups(language);

-- Enable RLS (Row Level Security)
ALTER TABLE financial_checkups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own checkups" ON financial_checkups
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkups" ON financial_checkups
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkups" ON financial_checkups
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkups" ON financial_checkups
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_financial_checkups_updated_at 
    BEFORE UPDATE ON financial_checkups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to table and columns
COMMENT ON TABLE financial_checkups IS 'Stores financial health checkup results for users';
COMMENT ON COLUMN financial_checkups.user_id IS 'Reference to the user who completed the checkup';
COMMENT ON COLUMN financial_checkups.answers IS 'JSON array of question answers with questionId, answer, and block';
COMMENT ON COLUMN financial_checkups.scores IS 'JSON array of block scores with block, score, maxScore, and percentage';
COMMENT ON COLUMN financial_checkups.global_score IS 'Overall financial health score (0-100)';
COMMENT ON COLUMN financial_checkups.comments IS 'JSON object for additional comments or notes';
COMMENT ON COLUMN financial_checkups.country IS 'Country code (FR, BR, etc.)';
COMMENT ON COLUMN financial_checkups.language IS 'Language code (fr, br, etc.)';
COMMENT ON COLUMN financial_checkups.version IS 'Version of the checkup format'; 