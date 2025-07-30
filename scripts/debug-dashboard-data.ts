/**
 * Script de débogage pour les données du dashboard
 * Identifie pourquoi les données analysées ne s'affichent pas
 */

import { createClient } from '@/lib/supabase/client';

async function debugDashboardData() {
  console.log('🔍 DÉBOGAGE DES DONNÉES DU DASHBOARD\n');
  
  const supabase = createClient();
  
  try {
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
    
    // 2. Récupérer les données de holerites
    console.log('\n📊 RÉCUPÉRATION DES DONNÉES HOLERITES');
    console.log('=====================================');
    
    const { data: holerites, error: holeritesError } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (holeritesError) {
      console.log('❌ Erreur récupération holerites:', holeritesError);
      return;
    }
    
    console.log(`📈 Nombre de holerites trouvés: ${holerites?.length || 0}`);
    
    if (holerites && holerites.length > 0) {
      const latestHolerite = holerites[0];
      console.log('\n🔍 ANALYSE DU DERNIER HOLERITE:');
      console.log('ID:', latestHolerite.id);
      console.log('Créé le:', latestHolerite.created_at);
      console.log('Nom:', latestHolerite.nome);
      console.log('Entreprise:', latestHolerite.empresa);
      console.log('Salário Bruto:', latestHolerite.salario_bruto);
      console.log('Salário Líquido:', latestHolerite.salario_liquido);
      
      // 3. Analyser la structure structured_data
      console.log('\n📋 ANALYSE DE STRUCTURED_DATA:');
      if (latestHolerite.structured_data) {
        console.log('Clés disponibles:', Object.keys(latestHolerite.structured_data));
        
        // Vérifier final_data
        if (latestHolerite.structured_data.final_data) {
          console.log('\n🔍 FINAL_DATA:');
          console.log('Clés:', Object.keys(latestHolerite.structured_data.final_data));
          console.log('Salário Bruto:', latestHolerite.structured_data.final_data.salario_bruto);
          console.log('Salário Líquido:', latestHolerite.structured_data.final_data.salario_liquido);
          console.log('Employee Name:', latestHolerite.structured_data.final_data.employee_name);
          console.log('Company Name:', latestHolerite.structured_data.final_data.company_name);
        }
        
        // Vérifier les données directes
        console.log('\n🔍 DONNÉES DIRECTES:');
        console.log('Employee Name:', latestHolerite.structured_data.employee_name);
        console.log('Company Name:', latestHolerite.structured_data.company_name);
        console.log('Gross Salary:', latestHolerite.structured_data.gross_salary);
        console.log('Net Salary:', latestHolerite.structured_data.net_salary);
      }
      
      // 4. Simuler l'extraction comme dans le dashboard
      console.log('\n🧪 SIMULATION D\'EXTRACTION DASHBOARD:');
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
        const numValue = Number(value);
        return isNaN(numValue) ? defaultValue : numValue;
      };
      
      // Extraction des données
      const salarioBruto = extractValue(latestHolerite.structured_data, 'final_data.salario_bruto') ||
                          extractValue(latestHolerite.structured_data, 'gross_salary') ||
                          extractValue(latestHolerite.structured_data, 'salario_bruto') ||
                          extractValue(latestHolerite, 'salario_bruto') ||
                          0;
      
      const salarioLiquido = extractValue(latestHolerite.structured_data, 'final_data.salario_liquido') ||
                            extractValue(latestHolerite.structured_data, 'net_salary') ||
                            extractValue(latestHolerite.structured_data, 'salario_liquido') ||
                            extractValue(latestHolerite, 'salario_liquido') ||
                            0;
      
      const employeeName = latestHolerite.structured_data?.final_data?.employee_name ||
                          latestHolerite.structured_data?.employee_name ||
                          latestHolerite.nome ||
                          '';
      
      const companyName = latestHolerite.structured_data?.final_data?.company_name ||
                         latestHolerite.structured_data?.company_name ||
                         latestHolerite.empresa ||
                         '';
      
      console.log('📊 RÉSULTATS D\'EXTRACTION:');
      console.log('Salário Bruto:', salarioBruto);
      console.log('Salário Líquido:', salarioLiquido);
      console.log('Employee Name:', employeeName);
      console.log('Company Name:', companyName);
      
      // 5. Vérifier les filtres de test
      console.log('\n🔍 VÉRIFICATION DES FILTRES:');
      console.log('============================');
      
      const isTestData = employeeName === 'Test User' || 
                        companyName === 'Test Company Ltda' || 
                        salarioBruto === 5000;
      
      console.log('Est-ce des données de test?', isTestData);
      console.log('Employee Name === "Test User":', employeeName === 'Test User');
      console.log('Company Name === "Test Company Ltda":', companyName === 'Test Company Ltda');
      console.log('Salário Bruto === 5000:', salarioBruto === 5000);
      
      // 6. Vérifier si les données seraient rejetées
      if (isTestData) {
        console.log('⚠️ ATTENTION: Ces données seraient rejetées par le dashboard !');
      } else {
        console.log('✅ Ces données seraient acceptées par le dashboard');
      }
      
      // 7. Vérifier les données de scan_results
      console.log('\n📊 RÉCUPÉRATION DES DONNÉES SCAN_RESULTS');
      console.log('========================================');
      
      const { data: scanResults, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (scanError) {
        console.log('❌ Erreur récupération scan_results:', scanError);
      } else {
        console.log(`📈 Nombre de scan_results trouvés: ${scanResults?.length || 0}`);
        
        if (scanResults && scanResults.length > 0) {
          const latestScan = scanResults[0];
          console.log('\n🔍 DERNIER SCAN:');
          console.log('ID:', latestScan.id);
          console.log('File Name:', latestScan.file_name);
          console.log('Confidence Score:', latestScan.confidence_score);
          
          if (latestScan.structured_data) {
            console.log('Clés structured_data:', Object.keys(latestScan.structured_data));
          }
        }
      }
      
    } else {
      console.log('❌ Aucun holerite trouvé pour cet utilisateur');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le débogage
debugDashboardData().catch(console.error); 