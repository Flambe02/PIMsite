/**
 * Script de diagnostic pour vérifier les données dans Supabase
 * Usage: pnpm tsx scripts/debug-supabase-data.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSupabaseData() {
  console.log('🔍 DIAGNOSTIC DES DONNÉES SUPABASE');
  console.log('=====================================');

  try {
    // 1. Vérifier la table scan_results
    console.log('\n📊 1. VÉRIFICATION TABLE scan_results');
    const { data: scanResults, error: scanError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (scanError) {
      console.error('❌ Erreur scan_results:', scanError);
    } else {
      console.log('✅ scan_results trouvés:', scanResults?.length || 0);
      if (scanResults && scanResults.length > 0) {
        const latest = scanResults[0];
        console.log('📄 Dernier scan_result:');
        console.log('  - ID:', latest.id);
        console.log('  - User ID:', latest.user_id);
        console.log('  - File:', latest.file_name);
        console.log('  - Structured Data Keys:', Object.keys(latest.structured_data || {}));
        
        // Vérifier la structure des données
        if (latest.structured_data) {
          console.log('  - Gross Salary:', latest.structured_data.gross_salary);
          console.log('  - Net Salary:', latest.structured_data.net_salary);
          console.log('  - Employee Name:', latest.structured_data.employee_name);
          console.log('  - Company Name:', latest.structured_data.company_name);
        }
      }
    }

    // 2. Vérifier la table holerites
    console.log('\n📊 2. VÉRIFICATION TABLE holerites');
    const { data: holerites, error: holeriteError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (holeriteError) {
      console.error('❌ Erreur holerites:', holeriteError);
    } else {
      console.log('✅ holerites trouvés:', holerites?.length || 0);
      if (holerites && holerites.length > 0) {
        const latest = holerites[0];
        console.log('📄 Dernier holerite:');
        console.log('  - ID:', latest.id);
        console.log('  - User ID:', latest.user_id);
        console.log('  - Salário Bruto:', latest.salario_bruto);
        console.log('  - Salário Líquido:', latest.salario_liquido);
        console.log('  - Nome:', latest.nome);
        console.log('  - Empresa:', latest.empresa);
        console.log('  - Structured Data Keys:', Object.keys(latest.structured_data || {}));
        
        // Vérifier la structure des données
        if (latest.structured_data) {
          console.log('  - Final Data Keys:', Object.keys(latest.structured_data.final_data || {}));
          if (latest.structured_data.final_data) {
            console.log('  - Final Data Salário Bruto:', latest.structured_data.final_data.salario_bruto);
            console.log('  - Final Data Salário Líquido:', latest.structured_data.final_data.salario_liquido);
            console.log('  - Final Data Employee Name:', latest.structured_data.final_data.employee_name);
            console.log('  - Final Data Company Name:', latest.structured_data.final_data.company_name);
          }
        }
      }
    }

    // 3. Vérifier les utilisateurs
    console.log('\n📊 3. VÉRIFICATION UTILISATEURS');
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Erreur utilisateurs:', userError);
    } else {
      console.log('✅ Utilisateurs trouvés:', users?.length || 0);
      if (users && users.length > 0) {
        console.log('👤 Utilisateurs:');
        users.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.email} (${user.id})`);
        });
      }
    }

    // 4. Test avec un user_id spécifique
    console.log('\n📊 4. TEST AVEC USER_ID SPÉCIFIQUE');
    if (users && users.length > 0) {
      const testUserId = users[0].id;
      console.log('🧪 Test avec user_id:', testUserId);
      
      const { data: userHolerites, error: userHoleriteError } = await supabase
        .from('holerites')
        .select('*')
        .eq('user_id', testUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (userHoleriteError) {
        console.error('❌ Erreur holerites pour user:', userHoleriteError);
      } else if (userHolerites) {
        console.log('✅ Holerite trouvé pour user:');
        console.log('  - Salário Bruto:', userHolerites.salario_bruto);
        console.log('  - Salário Líquido:', userHolerites.salario_liquido);
        console.log('  - Structured Data:', userHolerites.structured_data ? 'Présent' : 'Absent');
      } else {
        console.log('⚠️ Aucun holerite trouvé pour cet utilisateur');
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le diagnostic
debugSupabaseData().then(() => {
  console.log('\n✅ Diagnostic terminé');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erreur lors du diagnostic:', error);
  process.exit(1);
}); 