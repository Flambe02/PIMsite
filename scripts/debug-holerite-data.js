// Script simple pour déboguer les données holerite
// Exécuter avec: node scripts/debug-holerite-data.js

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase (remplacer par vos vraies clés)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Variables d\'environnement Supabase manquantes');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugHoleriteData() {
  try {
    console.log('🔍 Début du debug des données holerite...\n');
    
    // 1. Lister tous les utilisateurs (pour voir qui est connecté)
    console.log('1️⃣ Vérification des utilisateurs...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.log('❌ Erreur lors de la récupération des utilisateurs:', usersError.message);
    } else {
      console.log(`✅ ${users.users.length} utilisateurs trouvés`);
      users.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (ID: ${user.id}) - Créé: ${user.created_at}`);
      });
    }
    
    console.log('\n2️⃣ Vérification de la table holerites...');
    
    // 2. Lister tous les holerites
    const { data: holerites, error: holeritesError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (holeritesError) {
      console.log('❌ Erreur lors de la récupération des holerites:', holeritesError.message);
    } else {
      console.log(`✅ ${holerites.length} holerites trouvés dans la base`);
      
      holerites.forEach((holerite, index) => {
        console.log(`\n   📊 Holerite ${index + 1}:`);
        console.log(`      ID: ${holerite.id}`);
        console.log(`      User ID: ${holerite.user_id}`);
        console.log(`      Nom: ${holerite.nome}`);
        console.log(`      Empresa: ${holerite.empresa}`);
        console.log(`      Salário Bruto: R$ ${holerite.salario_bruto}`);
        console.log(`      Salário Líquido: R$ ${holerite.salario_liquido}`);
        console.log(`      Créé le: ${holerite.created_at}`);
        
        if (holerite.structured_data) {
          console.log(`      Structured Data: Présent (${Object.keys(holerite.structured_data).length} clés)`);
          
          // Vérifier les données importantes
          const sd = holerite.structured_data;
          if (sd.final_data) {
            console.log(`         - final_data: Présent`);
            if (sd.final_data.employee_name) console.log(`           * employee_name: ${sd.final_data.employee_name}`);
            if (sd.final_data.period) console.log(`           * period: ${sd.final_data.period}`);
          }
          if (sd.recommendations) {
            console.log(`         - recommendations: Présent`);
            if (sd.recommendations.recommendations) {
              console.log(`           * ${sd.recommendations.recommendations.length} recommandations`);
            }
          }
        } else {
          console.log(`      Structured Data: ❌ Absent`);
        }
      });
    }
    
    console.log('\n3️⃣ Vérification des permissions RLS...');
    
    // 3. Tester les permissions RLS
    const { data: rlsTest, error: rlsError } = await supabase
      .from('holerites')
      .select('count')
      .limit(1);
    
    if (rlsError) {
      console.log('❌ Erreur RLS:', rlsError.message);
    } else {
      console.log('✅ Permissions RLS OK');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le debug
debugHoleriteData().then(() => {
  console.log('\n🏁 Debug terminé');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
