/**
 * Script de test pour vérifier la sauvegarde des holerites via l'API enhanced
 * Usage: npx tsx scripts/test-holerite-save-enhanced.ts
 */

import { createClient } from '@/lib/supabase/client';

async function testHoleriteSaveEnhanced() {
  console.log('🧪 TEST DE LA SAUVEGARDE ENHANCED DES HOLERITES\n');
  
  const supabase = createClient();
  
  try {
    // 1. Vérifier la connexion utilisateur
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Erreur authentification:', authError);
      return;
    }
    
    if (!user) {
      console.log('⚠️ Aucun utilisateur connecté');
      return;
    }
    
    console.log('👤 Utilisateur connecté:', user.id);
    
    // 2. Vérifier la structure de la table holerites
    console.log('\n📋 1. VÉRIFICATION DE LA STRUCTURE DE LA TABLE');
    console.log('================================================');
    
    const { data: structure, error: structureError } = await supabase
      .from('holerites')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.log('❌ Erreur accès table holerites:', structureError);
      return;
    }
    
    console.log('✅ Table holerites accessible');
    if (structure && structure.length > 0) {
      console.log('📊 Colonnes disponibles:', Object.keys(structure[0]));
    } else {
      console.log('📊 Aucune donnée dans la table');
    }
    
    // 3. Compter le nombre total de holerites
    console.log('\n📊 2. COMPTAGE DES HOLERITES');
    console.log('=============================');
    
    const { count, error: countError } = await supabase
      .from('holerites')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Erreur comptage:', countError);
    } else {
      console.log(`✅ Nombre total de holerites: ${count}`);
    }
    
    // 4. Lister les derniers holerites avec leurs données
    console.log('\n📊 3. DERNIERS HOLERITES AJOUTÉS');
    console.log('==================================');
    
    const { data: recentHolerites, error: listError } = await supabase
      .from('holerites')
      .select('id, created_at, user_id, nome, empresa, perfil, salario_bruto, salario_liquido, period, scan_id')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (listError) {
      console.log('❌ Erreur liste:', listError);
    } else if (recentHolerites && recentHolerites.length > 0) {
      console.log(`✅ ${recentHolerites.length} holerites trouvés`);
      
      recentHolerites.forEach((holerite, index) => {
        console.log(`\n--- Holerite ${index + 1} ---`);
        console.log('ID:', holerite.id);
        console.log('User ID:', holerite.user_id);
        console.log('Scan ID:', holerite.scan_id);
        console.log('Nome:', holerite.nome);
        console.log('Empresa:', holerite.empresa);
        console.log('Perfil:', holerite.perfil);
        console.log('Salário Bruto:', holerite.salario_bruto);
        console.log('Salário Líquido:', holerite.salario_liquido);
        console.log('Period:', holerite.period);
        console.log('Created:', holerite.created_at);
      });
    } else {
      console.log('⚠️ Aucun holerite trouvé');
    }
    
    // 5. Vérifier la structure des données structurées
    if (recentHolerites && recentHolerites.length > 0) {
      console.log('\n🔍 4. STRUCTURE DES DONNÉES STRUCTURÉES');
      console.log('==========================================');
      
      const { data: structuredData, error: structuredError } = await supabase
        .from('holerites')
        .select('structured_data')
        .eq('id', recentHolerites[0].id)
        .single();
      
      if (structuredError) {
        console.log('❌ Erreur récupération données structurées:', structuredError);
      } else if (structuredData?.structured_data) {
        console.log('✅ Données structurées trouvées');
        console.log('📊 Clés disponibles:', Object.keys(structuredData.structured_data));
        
        if (structuredData.structured_data.final_data) {
          console.log('📋 Final Data Keys:', Object.keys(structuredData.structured_data.final_data));
        }
        
        if (structuredData.structured_data.recommendations) {
          console.log('💡 Recommendations Keys:', Object.keys(structuredData.structured_data.recommendations));
        }
        
        if (structuredData.structured_data.enhancedExplanation) {
          console.log('📚 Enhanced Explanation Keys:', Object.keys(structuredData.structured_data.enhancedExplanation));
        }
      } else {
        console.log('⚠️ Aucune donnée structurée trouvée');
      }
    }
    
    // 6. Test de récupération pour le dashboard
    console.log('\n🔄 5. TEST DE RÉCUPÉRATION DASHBOARD');
    console.log('=====================================');
    
    if (recentHolerites && recentHolerites.length > 0) {
      const testUserId = recentHolerites[0].user_id;
      console.log('👤 Test avec user_id:', testUserId);
      
      const { data: dashboardData, error: dashboardError } = await supabase
        .from('holerites')
        .select('*')
        .eq('user_id', testUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (dashboardError) {
        console.log('❌ Erreur récupération dashboard:', dashboardError);
      } else if (dashboardData) {
        console.log('✅ Données dashboard récupérées');
        console.log('📊 Salário Bruto:', dashboardData.salario_bruto);
        console.log('📊 Salário Líquido:', dashboardData.salario_liquido);
        console.log('📊 Nome:', dashboardData.nome);
        console.log('📊 Empresa:', dashboardData.empresa);
        console.log('📊 Perfil:', dashboardData.perfil);
        console.log('📊 Period:', dashboardData.period);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testHoleriteSaveEnhanced();
