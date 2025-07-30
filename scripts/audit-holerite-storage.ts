/**
 * Script d'audit complet du processus de stockage des données du holerite
 * Identifie les problèmes dans le flux scan → stockage → récupération → affichage
 */

import { createClient } from '@/lib/supabase/server';
import { PayslipAnalysisService } from '@/lib/ia/payslipAnalysisService';
import { extractBenefitsFromParsedData } from '@/lib/benefits';

async function auditHoleriteStorage() {
  console.log('🔍 AUDIT COMPLET DU PROCESSUS DE STOCKAGE DES HOLERITES\n');
  
  const supabase = await createClient();
  
  // 1. Vérifier la structure des tables
  console.log('📋 1. VÉRIFICATION DE LA STRUCTURE DES TABLES');
  console.log('================================================');
  
  try {
    // Vérifier la table holerites
    const { data: holeritesStructure, error: holeritesError } = await supabase
      .from('holerites')
      .select('*')
      .limit(1);
    
    if (holeritesError) {
      console.log('❌ Erreur accès table holerites:', holeritesError);
    } else {
      console.log('✅ Table holerites accessible');
      if (holeritesStructure && holeritesStructure.length > 0) {
        console.log('📊 Structure des données holerites:', Object.keys(holeritesStructure[0]));
      }
    }
    
    // Vérifier la table scan_results
    const { data: scanStructure, error: scanError } = await supabase
      .from('scan_results')
      .select('*')
      .limit(1);
    
    if (scanError) {
      console.log('❌ Erreur accès table scan_results:', scanError);
    } else {
      console.log('✅ Table scan_results accessible');
      if (scanStructure && scanStructure.length > 0) {
        console.log('📊 Structure des données scan_results:', Object.keys(scanStructure[0]));
      }
    }
  } catch (error) {
    console.log('❌ Erreur vérification structure:', error);
  }
  
  // 2. Analyser les données existantes
  console.log('\n📊 2. ANALYSE DES DONNÉES EXISTANTES');
  console.log('=====================================');
  
  try {
    // Récupérer tous les holerites
    const { data: allHolerites, error: holeritesError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (holeritesError) {
      console.log('❌ Erreur récupération holerites:', holeritesError);
    } else {
      console.log(`📈 Nombre total de holerites: ${allHolerites?.length || 0}`);
      
      if (allHolerites && allHolerites.length > 0) {
        console.log('\n🔍 ANALYSE DU DERNIER HOLERITE:');
        const lastHolerite = allHolerites[0];
        console.log('ID:', lastHolerite.id);
        console.log('User ID:', lastHolerite.user_id);
        console.log('Créé le:', lastHolerite.created_at);
        console.log('Nom:', lastHolerite.nome);
        console.log('Entreprise:', lastHolerite.empresa);
        console.log('Salário Bruto:', lastHolerite.salario_bruto);
        console.log('Salário Líquido:', lastHolerite.salario_liquido);
        
        // Analyser structured_data
        if (lastHolerite.structured_data) {
          console.log('\n📋 STRUCTURED_DATA:');
          console.log('Clés disponibles:', Object.keys(lastHolerite.structured_data));
          
          // Vérifier les chemins critiques
          const paths = [
            'final_data.salario_bruto',
            'final_data.salario_liquido',
            'final_data.employee_name',
            'final_data.company_name',
            'recommendations.recommendations',
            'analysis_result.finalData.salario_bruto'
          ];
          
          paths.forEach(path => {
            const keys = path.split('.');
            let value = lastHolerite.structured_data;
            for (const key of keys) {
              value = value?.[key];
            }
            console.log(`${path}:`, value);
          });
        }
      }
    }
    
    // Récupérer tous les scan_results
    const { data: allScans, error: scansError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (scansError) {
      console.log('❌ Erreur récupération scan_results:', scansError);
    } else {
      console.log(`\n📈 Nombre total de scan_results: ${allScans?.length || 0}`);
      
      if (allScans && allScans.length > 0) {
        console.log('\n🔍 ANALYSE DU DERNIER SCAN:');
        const lastScan = allScans[0];
        console.log('ID:', lastScan.id);
        console.log('User ID:', lastScan.user_id);
        console.log('Créé le:', lastScan.created_at);
        console.log('File name:', lastScan.file_name);
        console.log('Confidence score:', lastScan.confidence_score);
        
        if (lastScan.structured_data) {
          console.log('\n📋 STRUCTURED_DATA (scan_results):');
          console.log('Clés disponibles:', Object.keys(lastScan.structured_data));
        }
      }
    }
  } catch (error) {
    console.log('❌ Erreur analyse données:', error);
  }
  
  // 3. Vérifier la cohérence entre les tables
  console.log('\n🔄 3. VÉRIFICATION DE LA COHÉRENCE ENTRE TABLES');
  console.log('================================================');
  
  try {
    // Comparer les données entre holerites et scan_results
    const { data: holerites, error: hError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    const { data: scans, error: sError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (!hError && !sError && holerites && scans) {
      console.log(`\n📊 Comparaison des 5 derniers enregistrements:`);
      console.log(`Holerites: ${holerites.length}, Scans: ${scans.length}`);
      
      // Vérifier si les données correspondent
      holerites.forEach((holerite, index) => {
        const correspondingScan = scans.find(scan => 
          scan.user_id === holerite.user_id && 
          Math.abs(new Date(scan.created_at).getTime() - new Date(holerite.created_at).getTime()) < 60000 // 1 minute
        );
        
        if (correspondingScan) {
          console.log(`✅ Holerite ${index + 1}: Correspondance trouvée avec scan`);
        } else {
          console.log(`⚠️ Holerite ${index + 1}: Aucune correspondance avec scan`);
        }
      });
    }
  } catch (error) {
    console.log('❌ Erreur vérification cohérence:', error);
  }
  
  // 4. Test de simulation du processus complet
  console.log('\n🧪 4. TEST DE SIMULATION DU PROCESSUS COMPLET');
  console.log('=============================================');
  
  try {
    // Simuler les données d'un holerite
    const testData = {
      employee_name: 'João Silva Test',
      company_name: 'Empresa Test Ltda',
      position: 'Desenvolvedor',
      statut: 'CLT',
      salario_bruto: 8500.00,
      salario_liquido: 7200.00,
      descontos: 1300.00,
      period: '2024/01'
    };
    
    console.log('📝 Données de test:', testData);
    
    // Simuler l'insertion comme dans process-payslip
    const { data: testInsert, error: insertError } = await supabase
      .from('holerites')
      .insert({
        user_id: 'test-audit-user',
        structured_data: {
          final_data: testData,
          recommendations: {
            recommendations: ['Test recommendation 1', 'Test recommendation 2'],
            resume_situation: 'Test situation',
            score_optimisation: 85
          },
          analysis_result: {
            finalData: testData,
            validation: {
              confidence: 0.95,
              warnings: []
            }
          }
        },
        nome: testData.employee_name,
        empresa: testData.company_name,
        perfil: testData.statut,
        salario_bruto: testData.salario_bruto,
        salario_liquido: testData.salario_liquido,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    
    if (insertError) {
      console.log('❌ Erreur insertion test:', insertError);
    } else {
      console.log('✅ Insertion test réussie, ID:', testInsert.id);
      
      // Simuler la récupération comme dans le dashboard
      const { data: retrievedData, error: retrieveError } = await supabase
        .from('holerites')
        .select('*')
        .eq('id', testInsert.id)
        .single();
      
      if (retrieveError) {
        console.log('❌ Erreur récupération test:', retrieveError);
      } else {
        console.log('✅ Récupération test réussie');
        
        // Extraire les données comme dans le dashboard
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
        
        const extractedSalarioBruto = extractValue(retrievedData.structured_data, 'final_data.salario_bruto') ||
                                    extractValue(retrievedData.structured_data, 'salario_bruto') ||
                                    extractValue(retrievedData, 'salario_bruto') ||
                                    0;
        
        const extractedSalarioLiquido = extractValue(retrievedData.structured_data, 'final_data.salario_liquido') ||
                                      extractValue(retrievedData.structured_data, 'salario_liquido') ||
                                      extractValue(retrievedData, 'salario_liquido') ||
                                      0;
        
        console.log('📊 Données extraites:');
        console.log('Salário Bruto (original):', testData.salario_bruto);
        console.log('Salário Bruto (extraite):', extractedSalarioBruto);
        console.log('Salário Líquido (original):', testData.salario_liquido);
        console.log('Salário Líquido (extraite):', extractedSalarioLiquido);
        
        if (extractedSalarioBruto === testData.salario_bruto && extractedSalarioLiquido === testData.salario_liquido) {
          console.log('✅ Extraction correcte');
        } else {
          console.log('❌ Problème d\'extraction détecté');
        }
      }
      
      // Nettoyer les données de test
      await supabase.from('holerites').delete().eq('id', testInsert.id);
      console.log('🧹 Données de test nettoyées');
    }
  } catch (error) {
    console.log('❌ Erreur test simulation:', error);
  }
  
  // 5. Recommandations
  console.log('\n💡 5. RECOMMANDATIONS');
  console.log('=====================');
  
  console.log('1. Vérifier que les deux API (/api/scan-new-pim et /api/process-payslip) utilisent la même structure de données');
  console.log('2. S\'assurer que les données sont insérées dans la bonne table (holerites vs scan_results)');
  console.log('3. Vérifier la cohérence des chemins d\'extraction dans le dashboard');
  console.log('4. Ajouter des logs détaillés pour tracer le flux des données');
  console.log('5. Implémenter une validation des données avant insertion');
  
  console.log('\n🎯 AUDIT TERMINÉ');
}

// Exécuter l'audit
auditHoleriteStorage().catch(console.error); 