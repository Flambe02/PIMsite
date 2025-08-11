-- Migration: Create extraction system database functions
-- Date: 2025-01-31
-- Description: Creates functions needed for the unified extraction system

-- Function to add columns if they don't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = $1 
    AND column_name = $2
    AND table_schema = 'public'
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s', $1, $2, $3);
    RAISE NOTICE 'Added column % to table %', $2, $1;
  ELSE
    RAISE NOTICE 'Column % already exists in table %', $2, $1;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create extraction_logs table
CREATE OR REPLACE FUNCTION create_extraction_logs_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.extraction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holerite_id UUID REFERENCES public.holerites(id) ON DELETE CASCADE,
    analysis_version JSONB NOT NULL,
    message TEXT NOT NULL,
    payload JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_extraction_logs_holerite_id ON public.extraction_logs(holerite_id);
  CREATE INDEX IF NOT EXISTS idx_extraction_logs_timestamp ON public.extraction_logs(timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_extraction_logs_analysis_version ON public.extraction_logs USING gin (analysis_version);

  -- Enable RLS
  ALTER TABLE public.extraction_logs ENABLE ROW LEVEL SECURITY;

  -- Create RLS policies
  CREATE POLICY "Users can view own extraction logs" ON public.extraction_logs
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.holerites 
        WHERE id = holerite_id 
        AND user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can insert own extraction logs" ON public.extraction_logs
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.holerites 
        WHERE id = holerite_id 
        AND user_id = auth.uid()
      )
    );

  RAISE NOTICE 'Created extraction_logs table with RLS policies';
END;
$$ LANGUAGE plpgsql;

-- Function to ensure all required columns exist in scan_results
CREATE OR REPLACE FUNCTION ensure_scan_results_schema()
RETURNS void AS $$
BEGIN
  -- Add all required columns for the unified extraction system
  PERFORM add_column_if_not_exists('scan_results', 'employer_name', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'employer_cnpj', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'employee_name', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'employee_cpf', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'job_title', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'admission_date', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'period_start', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'period_end', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'proventos_total', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'inss_contrib', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'irrf_contrib', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'fgts_base', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'fgts_mes', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'ferias_valor', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'ferias_terco', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'bonus', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'adiantamentos_total', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'vale_refeicao', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'auxilio_alimentacao', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'saude', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'odontologia', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'previdencia_privada', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('scan_results', 'extraction_confidence', 'integer');
  PERFORM add_column_if_not_exists('scan_results', 'extraction_method', 'text');
  PERFORM add_column_if_not_exists('scan_results', 'extracted_at', 'timestamp');

  RAISE NOTICE 'Ensured scan_results table has all required columns';
END;
$$ LANGUAGE plpgsql;

-- Function to ensure all required columns exist in holerites
CREATE OR REPLACE FUNCTION ensure_holerites_schema()
RETURNS void AS $$
BEGIN
  -- Add all required columns for the unified extraction system
  PERFORM add_column_if_not_exists('holerites', 'employer_name', 'text');
  PERFORM add_column_if_not_exists('holerites', 'employer_cnpj', 'text');
  PERFORM add_column_if_not_exists('holerites', 'employee_name', 'text');
  PERFORM add_column_if_not_exists('holerites', 'employee_cpf', 'text');
  PERFORM add_column_if_not_exists('holerites', 'job_title', 'text');
  PERFORM add_column_if_not_exists('holerites', 'admission_date', 'text');
  PERFORM add_column_if_not_exists('holerites', 'period_start', 'text');
  PERFORM add_column_if_not_exists('holerites', 'period_end', 'text');
  PERFORM add_column_if_not_exists('holerites', 'proventos_total', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'inss_contrib', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'irrf_contrib', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'fgts_base', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'fgts_mes', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'ferias_valor', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'ferias_terco', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'bonus', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'adiantamentos_total', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'vale_refeicao', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'auxilio_alimentacao', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'saude', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'odontologia', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'previdencia_privada', 'decimal(10,2)');
  PERFORM add_column_if_not_exists('holerites', 'extraction_confidence', 'integer');
  PERFORM add_column_if_not_exists('holerites', 'extraction_method', 'text');
  PERFORM add_column_if_not_exists('holerites', 'extracted_at', 'timestamp');

  RAISE NOTICE 'Ensured holerites table has all required columns';
END;
$$ LANGUAGE plpgsql;

-- Function to bootstrap the entire extraction system
CREATE OR REPLACE FUNCTION bootstrap_extraction_system()
RETURNS void AS $$
BEGIN
  RAISE NOTICE 'Starting extraction system bootstrap...';
  
  -- Ensure scan_results table has all required columns
  PERFORM ensure_scan_results_schema();
  
  -- Ensure holerites table has all required columns
  PERFORM ensure_holerites_schema();
  
  -- Create extraction_logs table if it doesn't exist
  PERFORM create_extraction_logs_table();
  
  -- Create additional indexes for performance
  CREATE INDEX IF NOT EXISTS idx_scan_results_extraction_confidence ON public.scan_results(extraction_confidence);
  CREATE INDEX IF NOT EXISTS idx_scan_results_extraction_method ON public.scan_results(extraction_method);
  CREATE INDEX IF NOT EXISTS idx_scan_results_extracted_at ON public.scan_results(extracted_at DESC);
  
  CREATE INDEX IF NOT EXISTS idx_holerites_extraction_confidence ON public.holerites(extraction_confidence);
  CREATE INDEX IF NOT EXISTS idx_holerites_extraction_method ON public.holerites(extraction_method);
  CREATE INDEX IF NOT EXISTS idx_holerites_extracted_at ON public.holerites(extracted_at DESC);
  
  -- Create composite indexes for common queries
  CREATE INDEX IF NOT EXISTS idx_scan_results_user_country_created ON public.scan_results(user_id, country, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_holerites_user_period_created ON public.holerites(user_id, period, created_at DESC);
  
  RAISE NOTICE 'Extraction system bootstrap completed successfully';
END;
$$ LANGUAGE plpgsql;

-- Execute the bootstrap function
SELECT bootstrap_extraction_system();

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION add_column_if_not_exists(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_extraction_logs_table() TO authenticated;
GRANT EXECUTE ON FUNCTION ensure_scan_results_schema() TO authenticated;
GRANT EXECUTE ON FUNCTION ensure_holerites_schema() TO authenticated;
GRANT EXECUTE ON FUNCTION bootstrap_extraction_system() TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION add_column_if_not_exists IS 'Adds a column to a table if it does not exist';
COMMENT ON FUNCTION create_extraction_logs_table IS 'Creates the extraction_logs table with proper indexes and RLS policies';
COMMENT ON FUNCTION ensure_scan_results_schema IS 'Ensures scan_results table has all required columns for unified extraction';
COMMENT ON FUNCTION ensure_holerites_schema IS 'Ensures holerites table has all required columns for unified extraction';
COMMENT ON FUNCTION bootstrap_extraction_system IS 'Bootstraps the entire extraction system by ensuring all required schema elements exist';
