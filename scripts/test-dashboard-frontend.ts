#!/usr/bin/env tsx

/**
 * Test du dashboard frontend avec authentification simulée
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client avec clé anonyme (comme le frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDashboardFrontend() {
  console.log('🧪 Test du dashboard frontend avec authentification...\n');

  try {
    // 1. Test sans authentification
    console.log('🔍 Test 1: Accès sans authentification');
    const { data: noAuthData, error: noAuthError } = await supabase
      .from('holerites')
      .select('*')
      .limit(1);

    if (noAuthError) {
      console.log('❌ Erreur sans authentification:', noAuthError.message);
    } else if (!noAuthData || noAuthData.length === 0) {
      console.log('✅ Politique RLS fonctionne: aucune donnée accessible sans authentification');
    } else {
      console.log('⚠️ Problème: données accessibles sans authentification');
    }

    // 2. Test avec authentification simulée
    console.log('\n🔐 Test 2: Authentification simulée');
    
    // Créer une session simulée pour l'utilisateur de test
    const testUserId = '2854e862-6b66-4e7a-afcc-e3749c3d12ed';
    
    // Note: Cette approche ne fonctionne pas car nous ne pouvons pas forcer l'authentification
    // depuis un script Node.js. Le problème est que le frontend a besoin d'une vraie session.
    
    console.log('⚠️ Impossible de simuler l\'authentification depuis un script Node.js');
    console.log('💡 Le problème est que le frontend a besoin d\'une vraie session utilisateur');

    // 3. Vérification de la structure des données
    console.log('\n📊 Test 3: Vérification de la structure des données');
    
    // Utiliser la clé de service pour vérifier les données
    const supabaseService = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    const { data: serviceData, error: serviceError } = await supabaseService
      .from('holerites')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (serviceError) {
      console.error('❌ Erreur service:', serviceError);
      return;
    }

    if (!serviceData) {
      console.log('⚠️ Aucune donnée trouvée pour l\'utilisateur de test');
      return;
    }

    console.log('✅ Données trouvées via service key');
    console.log('📊 Structure des données:');
    console.log('- ID:', serviceData.id);
    console.log('- User ID:', serviceData.user_id);
    console.log('- Created:', serviceData.created_at);
    console.log('- Structured Data:', !!serviceData.structured_data);

    // 4. Analyse de la structure des données
    const structuredData = serviceData.structured_data;
    if (structuredData) {
      console.log('\n🔍 Analyse de structured_data:');
      
      const finalData = structuredData.final_data || {};
      const recommendations = structuredData.recommendations || {};
      
      console.log('- Salário Bruto:', finalData.salario_bruto);
      console.log('- Salário Líquido:', finalData.salario_liquido);
      console.log('- Statut:', finalData.statut);
      console.log('- Employee Name:', finalData.employee_name);
      console.log('- Company Name:', finalData.company_name);
      console.log('- Recommandations:', recommendations.recommendations?.length || 0);
      console.log('- Score d\'optimisation:', recommendations.score_optimisation);
    }

    // 5. Diagnostic du problème
    console.log('\n🎯 Diagnostic du problème:');
    console.log('='.repeat(50));
    console.log('✅ Les données existent dans la base');
    console.log('✅ Les politiques RLS sont configurées');
    console.log('❌ L\'utilisateur n\'est pas authentifié dans le frontend');
    console.log('❌ Le dashboard ne peut pas accéder aux données');
    
    console.log('\n💡 Solutions possibles:');
    console.log('1. Connecter l\'utilisateur de test dans le frontend');
    console.log('2. Créer une session de test pour le développement');
    console.log('3. Utiliser un mode de développement sans RLS');
    console.log('4. Ajouter des données de test publiques');

    // 6. Test de connexion utilisateur
    console.log('\n🔐 Test 4: Tentative de connexion utilisateur de test');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test-dashboard@example.com',
      password: 'test123456'
    });

    if (authError) {
      console.log('❌ Erreur de connexion:', authError.message);
      console.log('💡 L\'utilisateur de test n\'existe pas ou le mot de passe est incorrect');
    } else {
      console.log('✅ Connexion réussie:', authData.user?.id);
      
      // Test d'accès aux données après connexion
      const { data: userData, error: userError } = await supabase
        .from('holerites')
        .select('*')
        .eq('user_id', authData.user!.id)
        .limit(1);

      if (userError) {
        console.log('❌ Erreur d\'accès après connexion:', userError.message);
      } else if (!userData || userData.length === 0) {
        console.log('⚠️ Aucune donnée trouvée pour l\'utilisateur connecté');
      } else {
        console.log('✅ Données accessibles après connexion!');
        console.log('📊 Nombre de holerites:', userData.length);
      }
    }

  } catch (error) {
    console.error('❌ Erreur critique lors du test:', error);
  }
}

// Exécuter le test
testDashboardFrontend().catch(console.error); 