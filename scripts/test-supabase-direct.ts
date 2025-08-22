/**
 * Test direct de Supabase - Vérification des données
 */

import { createClient } from '@supabase/supabase-js';

// Configuration directe pour le test
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseDirect() {
  console.log('🔍 TEST DIRECT SUPABASE\n');
  
  try {
    // 1. Vérifier la connexion
    console.log('1️⃣ Test de connexion...');
    const { data, error } = await supabase.from('holerites').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erreur connexion:', error);
      return;
    }
    
    console.log('✅ Connexion réussie');
    
    // 2. Lister tous les holerites (sans filtre user)
    console.log('\n2️⃣ Liste de tous les holerites:');
    const { data: allHolerites, error: listError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (listError) {
      console.log('❌ Erreur liste:', listError);
      return;
    }
    
    console.log(`📊 ${allHolerites?.length || 0} holerites trouvés`);
    
    if (allHolerites && allHolerites.length > 0) {
      allHolerites.forEach((holerite, index) => {
        console.log(`\n📋 Holerite ${index + 1}:`);
        console.log('   ID:', holerite.id);
        console.log('   User ID:', holerite.user_id);
        console.log('   Créé le:', holerite.created_at);
        console.log('   Nom:', holerite.nome);
        console.log('   Salário Bruto:', holerite.salario_bruto);
        console.log('   Salário Líquido:', holerite.salario_liquido);
        
        if (holerite.structured_data) {
          console.log('   ✅ structured_data présent');
          
          // Vérifier la structure
          if (holerite.structured_data.final_data) {
            const finalData = holerite.structured_data.final_data;
            console.log('   ✅ final_data présent');
            console.log('      gross_salary:', finalData.gross_salary);
            console.log('      net_salary:', finalData.net_salary);
          }
          
          if (holerite.structured_data.recommendations) {
            console.log('   ✅ recommendations présent');
            console.log('      Nombre:', holerite.structured_data.recommendations.recommendations?.length || 0);
          }
        } else {
          console.log('   ❌ structured_data manquant');
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testSupabaseDirect().catch(console.error);
