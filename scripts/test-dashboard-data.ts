import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDashboardData() {
  console.log('🔍 Test de récupération des données du Dashboard...');
  
  try {
    // Récupérer tous les holerites pour analyse
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des holerites:', error);
      return;
    }
    
    console.log(`📊 ${holerites.length} holerites trouvés`);
    
    holerites.forEach((holerite, index) => {
      console.log(`\n--- Holerite ${index + 1} ---`);
      console.log('ID:', holerite.id);
      console.log('User ID:', holerite.user_id);
      console.log('Nome:', holerite.nome);
      console.log('Empresa:', holerite.empresa);
      console.log('Perfil:', holerite.perfil);
      console.log('Salário Bruto:', holerite.salario_bruto);
      console.log('Salário Líquido:', holerite.salario_liquido);
      console.log('Structured Data Keys:', holerite.structured_data ? Object.keys(holerite.structured_data) : 'null');
      
      if (holerite.structured_data) {
        console.log('Identificação:', holerite.structured_data.Identificação);
        console.log('Salários:', holerite.structured_data.Salários);
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testDashboardData(); 