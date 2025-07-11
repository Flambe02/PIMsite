-- Script pour ajouter le rôle admin aux profils utilisateurs
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ========================================
-- 1. AJOUT DU CHAMP IS_ADMIN À LA TABLE PROFILES
-- ========================================

-- Vérifier si la colonne is_admin existe déjà
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Coluna is_admin adicionada à tabela profiles';
    ELSE
        RAISE NOTICE 'Coluna is_admin já existe na tabela profiles';
    END IF;
END $$;

-- ========================================
-- 2. CRÉATION D'UN INDEX POUR OPTIMISER LES REQUÊTES
-- ========================================

-- Créer un index sur is_admin pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- ========================================
-- 3. POLITIQUES RLS POUR LA GESTION ADMIN
-- ========================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Politique pour que les utilisateurs puissent voir leur propre profil
CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (auth.uid()::text = id);

-- Politique pour que les utilisateurs puissent modifier leur propre profil
CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid()::text = id);

-- Politique pour que les admins puissent voir tous les profils
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid()::text 
    AND is_admin = true
  )
);

-- Politique pour que les admins puissent modifier tous les profils
CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid()::text 
    AND is_admin = true
  )
);

-- ========================================
-- 4. FONCTION POUR VÉRIFIER LE STATUT ADMIN
-- ========================================

-- Créer une fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION is_user_admin(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 5. VÉRIFICATION ET TEST
-- ========================================

-- Vérifier la structure de la table profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS créées
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles' 
AND schemaname = 'public'
ORDER BY policyname;

-- ========================================
-- 6. EXEMPLE D'UTILISATION
-- ========================================

-- Pour définir un utilisateur comme admin (à exécuter manuellement)
-- UPDATE profiles SET is_admin = true WHERE id = 'user_id_here';

-- Pour vérifier si un utilisateur est admin
-- SELECT is_user_admin('user_id_here'); 