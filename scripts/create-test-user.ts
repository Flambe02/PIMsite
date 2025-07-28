#!/usr/bin/env tsx

/**
 * Script pour créer un utilisateur de test avec un vrai UUID
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Utiliser la clé de service pour contourner les politiques RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  console.log('👤 Création de l\'utilisateur de test...\n');

  try {
    const testUserEmail = "test-dashboard@example.com";
    const testUserPassword = "testpassword123";
    
    console.log('📧 Email:', testUserEmail);
    console.log('🔑 Mot de passe:', testUserPassword);

    // 1. Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUserEmail,
      password: testUserPassword,
      email_confirm: true,
      user_metadata: {
        name: 'Test User',
        role: 'test'
      }
    });

    if (authError) {
      console.error('❌ Erreur création utilisateur:', authError);
      return null;
    }

    const userId = authData.user.id;
    console.log('✅ Utilisateur créé avec succès');
    console.log('- User ID:', userId);
    console.log('- Email:', authData.user.email);

    // 2. Vérifier que l'utilisateur existe
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error('❌ Erreur récupération utilisateur:', userError);
    } else {
      console.log('✅ Utilisateur vérifié:', userData.user.email);
    }

    // 3. Instructions pour utiliser l'utilisateur
    console.log('\n🎯 Instructions pour utiliser l\'utilisateur de test:');
    console.log('='.repeat(60));
    console.log('1. Connectez-vous avec:');
    console.log(`   Email: ${testUserEmail}`);
    console.log(`   Mot de passe: ${testUserPassword}`);
    console.log('');
    console.log('2. Utilisez cet User ID dans les scripts:');
    console.log(`   const testUserId = "${userId}";`);
    console.log('');
    console.log('3. Testez le dashboard et l\'upload de holerites');

    return userId;

  } catch (error) {
    console.error('❌ Erreur critique lors de la création:', error);
    return null;
  }
}

// Exécuter la création
createTestUser().catch(console.error); 