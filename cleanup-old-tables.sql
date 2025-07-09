-- Script de nettoyage des anciennes tables
-- À exécuter dans l'éditeur SQL de Supabase

-- Suppression des anciennes tables liées au système de parsing obsolète
DROP TABLE IF EXISTS public.payslip_items;
DROP TABLE IF EXISTS public.payslips;
DROP TYPE IF EXISTS public.payslip_item_type;

-- Vérification que les tables ont bien été supprimées
SELECT 
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('payslip_items', 'payslips');

-- Note: La table 'holerites' est conservée car elle sera utilisée par le nouveau système LLM 