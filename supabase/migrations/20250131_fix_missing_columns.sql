-- Migration pour corriger les colonnes manquantes
-- Date: 2025-01-31

-- 1. Ajouter la colonne explanation à scan_results si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scan_results' AND column_name = 'explanation'
    ) THEN
        ALTER TABLE scan_results ADD COLUMN explanation JSONB;
        RAISE NOTICE 'Coluna explanation adicionada à scan_results';
    ELSE
        RAISE NOTICE 'Coluna explanation já existe em scan_results';
    END IF;
END $$;

-- 2. Ajouter la colonne company_name à holerites si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerites' AND column_name = 'company_name'
    ) THEN
        ALTER TABLE holerites ADD COLUMN company_name TEXT;
        RAISE NOTICE 'Coluna company_name adicionada à holerites';
    ELSE
        RAISE NOTICE 'Coluna company_name já existe em holerites';
    END IF;
END $$;

-- 3. Vérifier et créer les colonnes manquantes dans holerites
DO $$ 
BEGIN
    -- Ajouter employee_name si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerites' AND column_name = 'employee_name'
    ) THEN
        ALTER TABLE holerites ADD COLUMN employee_name TEXT;
        RAISE NOTICE 'Coluna employee_name adicionada à holerites';
    END IF;

    -- Ajouter period si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerites' AND column_name = 'period'
    ) THEN
        ALTER TABLE holerites ADD COLUMN period TEXT;
        RAISE NOTICE 'Coluna period adicionada à holerites';
    END IF;

    -- Ajouter scan_id si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerites' AND column_name = 'scan_id'
    ) THEN
        ALTER TABLE holerites ADD COLUMN scan_id UUID REFERENCES scan_results(id);
        RAISE NOTICE 'Coluna scan_id adicionada à holerites';
    END IF;

    -- Ajouter country si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerites' AND column_name = 'country'
    ) THEN
        ALTER TABLE holerites ADD COLUMN country TEXT DEFAULT 'br';
        RAISE NOTICE 'Coluna country adicionada à holerites';
    END IF;
END $$;

-- 4. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_scan_results_user_id ON scan_results(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at);
CREATE INDEX IF NOT EXISTS idx_holerites_user_id ON holerites(user_id);
CREATE INDEX IF NOT EXISTS idx_holerites_scan_id ON holerites(scan_id);

-- 5. Vérifier que toutes les colonnes nécessaires existent
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('scan_results', 'holerites')
ORDER BY table_name, column_name;
