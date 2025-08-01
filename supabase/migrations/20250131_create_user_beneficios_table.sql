-- Create user_beneficios table
CREATE TABLE IF NOT EXISTS user_beneficios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL DEFAULT 0,
    tipo TEXT NOT NULL DEFAULT 'outros',
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_beneficios_user_id ON user_beneficios(user_id);
CREATE INDEX IF NOT EXISTS idx_user_beneficios_tipo ON user_beneficios(tipo);
CREATE INDEX IF NOT EXISTS idx_user_beneficios_created_at ON user_beneficios(created_at);

-- Enable Row Level Security
ALTER TABLE user_beneficios ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own beneficios" ON user_beneficios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own beneficios" ON user_beneficios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own beneficios" ON user_beneficios
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own beneficios" ON user_beneficios
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_beneficios_updated_at 
    BEFORE UPDATE ON user_beneficios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 