/**
 * Script de debug pour vérifier les données des holerites dans le dashboard
 * Usage: npx tsx scripts/debug-holerite-dashboard.ts
 */

import { createClient } from '@/lib/supabase/server';

async function debugHoleriteDashboard() {
  console.log('🔍 DEBUG DES DONNÉES HOLERITE DASHBOARD\n');
  
  try {
    const supabase = await createClient();
    
    // 1. Vérifier l'utilisateur connecté
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
    console.log('📧 Email:', user.email);
    
    // 2. Vérifier la table holerites
    console.log('\n📋 1. VÉRIFICATION DE LA TABLE HOLERITES');
    console.log('============================================');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('holerites')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Erreur accès table holerites:', tableError);
      return;
    }
    
    console.log('✅ Table holerites accessible');
    if (tableInfo && tableInfo.length > 0) {
      console.log('📊 Colonnes disponibles:', Object.keys(tableInfo[0]));
    } else {
      console.log('📊 Aucune donnée dans la table');
    }
    
    // 3. Compter les holerites de l'utilisateur
    console.log('\n📊 2. COMPTAGE DES HOLERITES UTILISATEUR');
    console.log('==========================================');
    
    const { count, error: countError } = await supabase
      .from('holerites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (countError) {
      console.log('❌ Erreur comptage:', countError);
    } else {
      console.log(`✅ Nombre de holerites pour l'utilisateur: ${count}`);
    }
    
    // 4. Récupérer le dernier holerite
    console.log('\n📊 3. DERNIER HOLERITE UTILISATEUR');
    console.log('====================================');
    
    const { data: latestHolerite, error: latestError } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (latestError) {
      if (latestError.code === 'PGRST116') {
        console.log('⚠️ Aucun holerite trouvé pour cet utilisateur');
      } else {
        console.log('❌ Erreur récupération dernier holerite:', latestError);
      }
    } else if (latestHolerite) {
      console.log('✅ Dernier holerite trouvé:');
      console.log('   ID:', latestHolerite.id);
      console.log('   User ID:', latestHolerite.user_id);
      console.log('   Created:', latestHolerite.created_at);
      console.log('   Nome:', latestHolerite.nome);
      console.log('   Empresa:', latestHolerite.empresa);
      console.log('   Perfil:', latestHolerite.perfil);
      console.log('   Salário Bruto:', latestHolerite.salario_bruto);
      console.log('   Salário Líquido:', latestHolerite.salario_liquido);
      console.log('   Period:', latestHolerite.period);
      
      // 5. Analyser structured_data
      if (latestHolerite.structured_data) {
        console.log('\n🔍 4. ANALYSE STRUCTURED_DATA');
        console.log('==============================');
        
        const sd = latestHolerite.structured_data;
        console.log('📊 Clés disponibles:', Object.keys(sd));
        
        if (sd.final_data) {
          console.log('📋 Final Data Keys:', Object.keys(sd.final_data));
          console.log('   Salário Bruto:', sd.final_data.salario_bruto);
          console.log('   Salário Líquido:', sd.final_data.salario_liquido);
          console.log('   Employee Name:', sd.final_data.employee_name);
          console.log('   Company Name:', sd.final_data.company_name);
        }
        
        if (sd.recommendations) {
          console.log('💡 Recommendations Keys:', Object.keys(sd.recommendations));
        }
        
        if (sd.enhancedExplanation) {
          console.log('📚 Enhanced Explanation Keys:', Object.keys(sd.enhancedExplanation));
        }
      }
      
      // 6. Simuler l'extraction du dashboard
      console.log('\n🧪 5. SIMULATION EXTRACTION DASHBOARD');
      console.log('=====================================');
      
      const extractValue = (obj: any, path: string, defaultValue: any = 0) => {
        if (!obj) return defaultValue;
        
        const keys = path.split('.');
        let value = obj;
        
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            return defaultValue;
          }
        }
        
        if (value === null || value === undefined || value === '') {
          return defaultValue;
        }
        
        if (typeof value === 'object' && value !== null && 'valor' in value) {
          value = value.valor;
        }
        
        if (typeof value === 'object' && value !== null && 'value' in value) {
          value = value.value;
        }
        
        if (typeof value === 'string') {
          const cleanedValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
          const numValue = Number(cleanedValue);
          return isNaN(numValue) ? defaultValue : numValue;
        }
        
        const numValue = Number(value);
        return isNaN(numValue) ? defaultValue : numValue;
      };
      
      // Test d'extraction comme dans le dashboard
      let salarioBruto = extractValue(latestHolerite, 'salario_bruto') || 0;
      let salarioLiquido = extractValue(latestHolerite, 'salario_liquido') || 0;
      
      console.log('🔍 Extraction colonnes directes:');
      console.log('   Salário Bruto (direct):', salarioBruto);
      console.log('   Salário Líquido (direct):', salarioLiquido);
      
      if (!salarioBruto && latestHolerite.structured_data) {
        salarioBruto = extractValue(latestHolerite.structured_data, 'final_data.salario_bruto') ||
                      extractValue(latestHolerite.structured_data, 'final_data.gross_salary') ||
                      extractValue(latestHolerite.structured_data, 'salario_bruto') ||
                      extractValue(latestHolerite.structured_data, 'gross_salary') ||
                      0;
      }
      
      if (!salarioLiquido && latestHolerite.structured_data) {
        salarioLiquido = extractValue(latestHolerite.structured_data, 'final_data.salario_liquido') ||
                        extractValue(latestHolerite.structured_data, 'final_data.net_salary') ||
                        extractValue(latestHolerite.structured_data, 'salario_liquido') ||
                        extractValue(latestHolerite.structured_data, 'net_salary') ||
                        0;
      }
      
      console.log('🔍 Extraction structured_data:');
      console.log('   Salário Bruto (structured):', salarioBruto);
      console.log('   Salário Líquido (structured):', salarioLiquido);
      
      const descontos = extractValue(latestHolerite.structured_data, 'final_data.descontos') ||
                       extractValue(latestHolerite.structured_data, 'total_deductions') ||
                       (salarioBruto > 0 && salarioLiquido > 0 ? salarioBruto - salarioLiquido : 0);
      
      const eficiencia = salarioBruto > 0 && salarioLiquido > 0 ? 
        Number(((salarioLiquido / salarioBruto) * 100).toFixed(1)) : 0;
      
      console.log('🔍 Résultats finaux:');
      console.log('   Salário Bruto Final:', salarioBruto);
      console.log('   Salário Líquido Final:', salarioLiquido);
      console.log('   Descontos:', descontos);
      console.log('   Eficiência:', eficiencia + '%');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

debugHoleriteDashboard();
