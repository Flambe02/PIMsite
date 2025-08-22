/**
 * Script de test pour vérifier la sauvegarde des holerites
 * Usage: npx tsx scripts/test-holerite-save.ts
 */

import { createClient } from '@/lib/supabase/server';

async function testHoleriteSave() {
  console.log('🧪 TEST DE LA SAUVEGARDE DES HOLERITES\n');
  
  const supabase = await createClient();
  
  try {
    // 1. Vérifier la structure de la table holerites
    console.log('📋 1. VÉRIFICATION DE LA STRUCTURE DE LA TABLE');
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
    
    // 2. Compter le nombre total de holerites
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
    
    // 3. Lister les derniers holerites avec leurs données
    console.log('\n📊 3. DERNIERS HOLERITES AJOUTÉS');
    console.log('==================================');
    
    const { data: recentHolerites, error: listError } = await supabase
      .from('holerites')
      .select('id, created_at, user_id, nome, empresa, salario_bruto, salario_liquido, period')
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
        console.log('Nome:', holerite.nome);
        console.log('Empresa:', holerite.empresa);
        console.log('Salário Bruto:', holerite.salario_bruto);
        console.log('Salário Líquido:', holerite.salario_liquido);
        console.log('Period:', holerite.period);
        console.log('Created:', holerite.created_at);
      });
    } else {
      console.log('⚠️ Aucun holerite trouvé');
    }
    
    // 4. Vérifier la structure des données structurées
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
          console.log('📋 Final Data:', structuredData.structured_data.final_data);
        }
        
        if (structuredData.structured_data.recommendations) {
          console.log('💡 Recommendations:', structuredData.structured_data.recommendations);
        }
      } else {
        console.log('⚠️ Aucune donnée structurée trouvée');
      }
    }
    
    // 5. Test de récupération pour le dashboard
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
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testHoleriteSave();
