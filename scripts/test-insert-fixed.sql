-- Test d'insertion avec la structure réelle de la table holerites
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure actuelle
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'holerites' 
ORDER BY ordinal_position;

-- 2. Tester l'insertion avec la structure réelle
INSERT INTO holerites (
    user_id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    inss,
    irrf,
    data_pagamento
) VALUES (
    '505e01f5-8b95-4349-b709-ae2a95bd4ee1', -- Remplacer par un vrai user_id
    'TEST ARLEY G. VIEIRA',
    'TEST EMPRESA LTDA',
    '2500.00',
    '2170.17',
    '275.00',
    '54.83',
    '2024-01'
) RETURNING id, nome, salario_bruto, salario_liquido, created_at;

-- 3. Vérifier que l'insertion a fonctionné
SELECT 
    id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    inss,
    irrf,
    data_pagamento
FROM holerites 
WHERE nome = 'TEST ARLEY G. VIEIRA'
ORDER BY created_at DESC;

-- 4. Nettoyer le test
DELETE FROM holerites WHERE nome = 'TEST ARLEY G. VIEIRA';
