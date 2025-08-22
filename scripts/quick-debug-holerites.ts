/**
 * Script de debug rapide pour vérifier la sauvegarde des holerites
 * Usage: npx tsx scripts/quick-debug-holerites.ts
 */

import { createClient } from '@/lib/supabase/client';

async function quickDebugHolerites() {
  console.log('🔍 DEBUG RAPIDE - VÉRIFICATION HOLERITES\n');
  
  try {
    const supabase = createClient();
    
    // 1. Vérifier l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Aucun utilisateur connecté');
      console.log('💡 Connectez-vous d\'abord sur l\'application web');
      return;
    }
    
    console.log('👤 Utilisateur:', user.email);
    
    // 2. Vérifier la table holerites
    const { data: holerites, error: tableError } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (tableError) {
      console.log('❌ Erreur table:', tableError.message);
      return;
    }
    
    if (!holerites || holerites.length === 0) {
      console.log('⚠️ AUCUN HOLERITE TROUVÉ pour cet utilisateur');
      console.log('💡 Cela explique pourquoi le dashboard affiche R$ 0');
      console.log('💡 Le scan ne sauvegarde pas en base');
      return;
    }
    
    console.log(`✅ ${holerites.length} holerite(s) trouvé(s)`);
    
    // 3. Analyser le dernier holerite
    const latest = holerites[0];
    console.log('\n📊 DERNIER HOLERITE:');
    console.log('   ID:', latest.id);
    console.log('   Created:', latest.created_at);
    console.log('   Nome:', latest.nome);
    console.log('   Empresa:', latest.empresa);
    console.log('   Salário Bruto:', latest.salario_bruto);
    console.log('   Salário Líquido:', latest.salario_liquido);
    
    // 4. Vérifier structured_data
    if (latest.structured_data) {
      console.log('\n🔍 STRUCTURED_DATA:');
      const sd = latest.structured_data;
      
      if (sd.final_data) {
        console.log('   Final Data:', {
          employee_name: sd.final_data.employee_name,
          salario_bruto: sd.final_data.salario_bruto,
          salario_liquido: sd.final_data.salario_liquido
        });
      }
      
      if (sd.recommendations) {
        console.log('   Recommendations:', Object.keys(sd.recommendations));
      }
    }
    
    // 5. Test d'extraction comme le dashboard
    console.log('\n🧪 TEST EXTRACTION DASHBOARD:');
    
    // Simuler l'extraction du dashboard
    let salarioBruto = latest.salario_bruto || 0;
    let salarioLiquido = latest.salario_liquido || 0;
    
    if (!salarioBruto && latest.structured_data) {
      salarioBruto = latest.structured_data.final_data?.salario_bruto || 0;
    }
    
    if (!salarioLiquido && latest.structured_data) {
      salarioLiquido = latest.structured_data.final_data?.salario_liquido || 0;
    }
    
    console.log('   Salário Bruto extrait:', salarioBruto);
    console.log('   Salário Líquido extrait:', salarioLiquido);
    
    if (salarioBruto > 0 && salarioLiquido > 0) {
      console.log('✅ EXTRACTION RÉUSSIE - Le dashboard devrait afficher les vraies valeurs');
    } else {
      console.log('❌ EXTRACTION ÉCHOUÉE - Le dashboard affichera R$ 0');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

quickDebugHolerites();
