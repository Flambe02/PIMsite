/**
 * AUDIT COMPLET DU PROCESSUS HOLERITE
 * Vérifie : Scan → API → Supabase → Dashboard
 */

import { createClient } from '@/lib/supabase/client';

async function auditHoleriteComplete() {
  console.log('🔍 AUDIT COMPLET DU PROCESSUS HOLERITE\n');
  
  try {
    const supabase = createClient();
    
    // 1. VÉRIFIER L'UTILISATEUR CONNECTÉ
    console.log('1️⃣ VÉRIFICATION UTILISATEUR');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Aucun utilisateur connecté');
      console.log('💡 Connectez-vous d\'abord sur l\'application web');
      return;
    }
    
    console.log('✅ Utilisateur connecté:', user.email);
    console.log('   ID:', user.id);
    
    // 2. VÉRIFIER LA TABLE HOLERITES
    console.log('\n2️⃣ VÉRIFICATION TABLE HOLERITES');
    const { data: holerites, error: tableError } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (tableError) {
      console.log('❌ Erreur table holerites:', tableError);
      return;
    }
    
    console.log(`📊 ${holerites?.length || 0} holerites trouvés`);
    
    if (holerites && holerites.length > 0) {
      const latest = holerites[0];
      console.log('\n📋 DERNIER HOLERITE (le plus récent):');
      console.log('   ID:', latest.id);
      console.log('   Créé le:', latest.created_at);
      console.log('   Nom:', latest.nome);
      console.log('   Entreprise:', latest.empresa);
      console.log('   Profil:', latest.perfil);
      console.log('   Période:', latest.period);
      console.log('   Salário Bruto:', latest.salario_bruto);
      console.log('   Salário Líquido:', latest.salario_liquido);
      
      // 3. ANALYSER LA STRUCTURE DES DONNÉES
      console.log('\n3️⃣ ANALYSE STRUCTURE DONNÉES');
      if (latest.structured_data) {
        console.log('✅ structured_data présent');
        
        // Vérifier final_data
        if (latest.structured_data.final_data) {
          console.log('✅ final_data présent');
          const finalData = latest.structured_data.final_data;
          
          console.log('   gross_salary:', finalData.gross_salary);
          console.log('   net_salary:', finalData.net_salary);
          console.log('   employee_name:', finalData.employee_name);
        } else {
          console.log('❌ final_data manquant');
        }
        
        // Vérifier recommendations
        if (latest.structured_data.recommendations) {
          console.log('✅ recommendations présent');
          console.log('   Nombre de recos:', latest.structured_data.recommendations.recommendations?.length || 0);
        } else {
          console.log('❌ recommendations manquant');
        }
        
        // Vérifier enhancedExplanation
        if (latest.structured_data.enhancedExplanation) {
          console.log('✅ enhancedExplanation présent');
        } else {
          console.log('❌ enhancedExplanation manquant');
        }
      } else {
        console.log('❌ structured_data manquant');
      }
      
      // 4. SIMULER L'EXTRACTION DU DASHBOARD
      console.log('\n4️⃣ SIMULATION EXTRACTION DASHBOARD');
      
      // Extraire salário bruto
      let salarioBruto = latest.salario_bruto || 0;
      if (!salarioBruto && latest.structured_data) {
        salarioBruto = extractValue(latest.structured_data, 'final_data.gross_salary.valor') ||
                      extractValue(latest.structured_data, 'final_data.salario_bruto') ||
                      0;
      }
      
      // Extraire salário líquido
      let salarioLiquido = latest.salario_liquido || 0;
      if (!salarioLiquido && latest.structured_data) {
        salarioLiquido = extractValue(latest.structured_data, 'final_data.net_salary.valor') ||
                        extractValue(latest.structured_data, 'final_data.salario_liquido') ||
                        0;
      }
      
      // Extraire recommendations
      const aiRecommendations = latest.structured_data?.recommendations?.recommendations ||
                               latest.structured_data?.analysis_result?.recommendations?.recommendations ||
                               [];
      
      console.log('📊 RÉSULTATS EXTRACTION:');
      console.log('   Salário Bruto extrait:', salarioBruto);
      console.log('   Salário Líquido extrait:', salarioLiquido);
      console.log('   Recommendations extraites:', aiRecommendations.length);
      
      if (aiRecommendations.length > 0) {
        console.log('   Première reco:', aiRecommendations[0]?.title);
      }
      
      // 5. VÉRIFIER LA COHÉRENCE
      console.log('\n5️⃣ VÉRIFICATION COHÉRENCE');
      const expectedGross = 15345; // D'après les logs
      const expectedNet = 10767.28;
      
      if (salarioBruto === expectedGross) {
        console.log('✅ Salário Bruto cohérent:', salarioBruto);
      } else {
        console.log('❌ Salário Bruto INCOHÉRENT:', salarioBruto, 'vs attendu:', expectedGross);
      }
      
      if (salarioLiquido === expectedNet) {
        console.log('✅ Salário Líquido cohérent:', salarioLiquido);
      } else {
        console.log('❌ Salário Líquido INCOHÉRENT:', salarioLiquido, 'vs attendu:', expectedNet);
      }
      
    } else {
      console.log('❌ Aucun holerite trouvé pour cet utilisateur');
    }
    
  } catch (error) {
    console.error('❌ Erreur audit:', error);
  }
}

// Fonction utilitaire pour extraire les valeurs (copiée du dashboard)
function extractValue(data: any, path: string): any {
  if (!data || !path) return null;
  
  const keys = path.split('.');
  let current = data;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  
  return current;
}

// Exécuter l'audit
auditHoleriteComplete().catch(console.error);
