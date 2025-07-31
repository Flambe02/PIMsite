/**
 * Script de test pour vérifier les données holerites dans Supabase
 * Usage: npx tsx scripts/test-holerites-data.ts
 */

import { createClient } from '@/lib/supabase/server';

async function testHoleritesData() {
  console.log('🔍 TEST DES DONNÉES HOLERITES DANS SUPABASE\n');
  
  const supabase = await createClient();
  
  try {
    // 1. Vérifier la structure de la table
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
    
    // 3. Lister tous les holerites avec leurs user_id
    console.log('\n👥 3. LISTE DES HOLERITES PAR UTILISATEUR');
    console.log('==========================================');
    
    const { data: allHolerites, error: listError } = await supabase
      .from('holerites')
      .select('id, created_at, user_id, period, nome, empresa, salario_bruto')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (listError) {
      console.log('❌ Erreur liste:', listError);
    } else {
      console.log('✅ Holerites trouvés:', allHolerites?.length || 0);
      
      if (allHolerites && allHolerites.length > 0) {
        // Grouper par user_id
        const groupedByUser = allHolerites.reduce((acc, holerite) => {
          const userId = holerite.user_id || 'NO_USER_ID';
          if (!acc[userId]) {
            acc[userId] = [];
          }
          acc[userId].push(holerite);
          return acc;
        }, {} as Record<string, any[]>);
        
        Object.entries(groupedByUser).forEach(([userId, holerites]) => {
          console.log(`\n👤 Utilisateur: ${userId}`);
          console.log(`   📄 Nombre de holerites: ${holerites.length}`);
          holerites.forEach((h, index) => {
            console.log(`   ${index + 1}. ID: ${h.id} | Date: ${h.created_at} | Période: ${h.period || 'N/A'} | Nom: ${h.nome || 'N/A'} | Entreprise: ${h.empresa || 'N/A'} | Salaire: ${h.salario_bruto || 'N/A'}`);
          });
        });
      }
    }
    
    // 4. Vérifier les politiques RLS
    console.log('\n🔒 4. VÉRIFICATION DES POLITIQUES RLS');
    console.log('=====================================');
    
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'holerites' })
      .catch(() => ({ data: null, error: { message: 'Fonction get_policies non disponible' } }));
    
    if (policiesError) {
      console.log('❌ Erreur politiques:', policiesError.message);
      console.log('💡 Vérifiez manuellement les politiques RLS dans Supabase Dashboard');
    } else {
      console.log('✅ Politiques RLS:', policies);
    }
    
    // 5. Test avec un user_id spécifique (si des données existent)
    if (allHolerites && allHolerites.length > 0) {
      const testUserId = allHolerites[0].user_id;
      if (testUserId) {
        console.log('\n🧪 5. TEST AVEC UN USER_ID SPÉCIFIQUE');
        console.log('=====================================');
        console.log(`Test avec user_id: ${testUserId}`);
        
        const { data: userHolerites, error: userError } = await supabase
          .from('holerites')
          .select('*')
          .eq('user_id', testUserId)
          .order('created_at', { ascending: false });
        
        if (userError) {
          console.log('❌ Erreur test user:', userError);
        } else {
          console.log(`✅ Holerites pour cet utilisateur: ${userHolerites?.length || 0}`);
          if (userHolerites && userHolerites.length > 0) {
            userHolerites.forEach((h, index) => {
              console.log(`   ${index + 1}. ${h.id} | ${h.created_at} | ${h.period || 'N/A'}`);
            });
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
  
  console.log('\n✅ Test terminé');
}

// Exécuter le test
testHoleritesData().catch(console.error); 