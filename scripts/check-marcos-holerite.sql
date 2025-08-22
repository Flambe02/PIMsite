-- Vérifier si le nouveau holerite "Marcos" a été sauvegardé
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Chercher le holerite "Marcos"
SELECT 
    id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    inss,
    irrf,
    data_pagamento,
    created_at
FROM holerites 
WHERE nome ILIKE '%Marcos%'
ORDER BY created_at DESC;

-- 2. Vérifier tous les holerites récents
SELECT 
    id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    inss,
    irrf,
    data_pagamento,
    created_at
FROM holerites 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Vérifier s'il y a des erreurs d'insertion
-- (chercher des holerites avec des données vides)
SELECT 
    id,
    nome,
    empresa,
    salario_bruto,
    salario_liquido,
    created_at
FROM holerites 
WHERE salario_bruto = '0' OR salario_liquido = '0'
ORDER BY created_at DESC;
