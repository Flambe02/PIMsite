-- Vérifier la structure réelle de la table holerites
-- Exécuter dans l'éditeur SQL de Supabase

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerites' 
ORDER BY ordinal_position;
