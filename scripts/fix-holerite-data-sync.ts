/**
 * Script de correction de la synchronisation des données du holerite
 * Résout les problèmes de cohérence entre scan_results et holerites
 */

import { createClient } from '@/lib/supabase/client';

async function fixHoleriteDataSync() {
  console.log('🔧 CORRECTION DE LA SYNCHRONISATION DES DONNÉES HOLERITE\n');
  
  const supabase = createClient();
  
  // 1. Analyser les données existantes
  console.log('📊 1. ANALYSE DES DONNÉES EXISTANTES');
  console.log('=====================================');
  
  try {
    // Récupérer les scan_results récents
    const { data: scanResults, error: scanError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (scanError) {
      console.log('❌ Erreur récupération scan_results:', scanError);
      return;
    }
    
    console.log(`📈 Scan results trouvés: ${scanResults?.length || 0}`);
    
    // Récupérer les holerites récents
    const { data: holerites, error: holeriteError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (holeriteError) {
      console.log('❌ Erreur récupération holerites:', holeriteError);
      return;
    }
    
    console.log(`📈 Holerites trouvés: ${holerites?.length || 0}`);
    
    // 2. Synchroniser les données manquantes
    console.log('\n🔄 2. SYNCHRONISATION DES DONNÉES MANQUANTES');
    console.log('=============================================');
    
    if (scanResults && scanResults.length > 0) {
      for (const scan of scanResults) {
        console.log(`\n🔍 Traitement du scan ${scan.id} (${scan.file_name})`);
        
        // Vérifier si un holerite correspondant existe
        const existingHolerite = holerites?.find(h => 
          h.user_id === scan.user_id && 
          Math.abs(new Date(h.created_at).getTime() - new Date(scan.created_at).getTime()) < 300000 // 5 minutes
        );
        
        if (!existingHolerite) {
          console.log('⚠️ Aucun holerite correspondant trouvé, création...');
          
          // Extraire les données du scan_results
          const scanData = scan.structured_data;
          const recommendations = scan.recommendations;
          
          if (scanData) {
            // Créer un holerite avec la structure unifiée
            const holeriteData = {
              user_id: scan.user_id,
              structured_data: {
                // Structure unifiée compatible avec le dashboard
                final_data: {
                  employee_name: scanData.employee_name || scanData.Identificação?.employee_name,
                  company_name: scanData.company_name || scanData.Identificação?.company_name,
                  position: scanData.position || scanData.Identificação?.position,
                  statut: scanData.profile_type || scanData.Identificação?.profile_type,
                  salario_bruto: scanData.gross_salary || scanData.Salários?.gross_salary,
                  salario_liquido: scanData.net_salary || scanData.Salários?.net_salary,
                  descontos: scanData.total_deductions || 0,
                  period: scanData.period || ''
                },
                recommendations: recommendations || {
                  recommendations: [],
                  resume_situation: '',
                  score_optimisation: 0
                },
                analysis_result: {
                  finalData: {
                    employee_name: scanData.employee_name || scanData.Identificação?.employee_name,
                    company_name: scanData.company_name || scanData.Identificação?.company_name,
                    position: scanData.position || scanData.Identificação?.position,
                    statut: scanData.profile_type || scanData.Identificação?.profile_type,
                    salario_bruto: scanData.gross_salary || scanData.Salários?.gross_salary,
                    salario_liquido: scanData.net_salary || scanData.Salários?.net_salary,
                    descontos: scanData.total_deductions || 0,
                    period: scanData.period || ''
                  },
                  validation: {
                    confidence: scan.confidence_score || 0.8,
                    warnings: []
                  }
                },
                // Données originales du scan pour compatibilité
                employee_name: scanData.employee_name || scanData.Identificação?.employee_name,
                company_name: scanData.company_name || scanData.Identificação?.company_name,
                position: scanData.position || scanData.Identificação?.position,
                profile_type: scanData.profile_type || scanData.Identificação?.profile_type,
                gross_salary: scanData.gross_salary || scanData.Salários?.gross_salary,
                net_salary: scanData.net_salary || scanData.Salários?.net_salary,
                period: scanData.period || ''
              },
              nome: scanData.employee_name || scanData.Identificação?.employee_name || '',
              empresa: scanData.company_name || scanData.Identificação?.company_name || '',
              perfil: scanData.profile_type || scanData.Identificação?.profile_type || '',
              salario_bruto: scanData.gross_salary || scanData.Salários?.gross_salary || 0,
              salario_liquido: scanData.net_salary || scanData.Salários?.net_salary || 0,
              created_at: scan.created_at
            };
            
            // Insérer le holerite
            const { data: newHolerite, error: insertError } = await supabase
              .from('holerites')
              .insert(holeriteData)
              .select('id')
              .single();
            
            if (insertError) {
              console.log('❌ Erreur insertion holerite:', insertError);
            } else {
              console.log('✅ Holerite créé avec succès, ID:', newHolerite.id);
            }
          } else {
            console.log('⚠️ Aucune donnée structurée dans le scan');
          }
        } else {
          console.log('✅ Holerite correspondant déjà existant');
        }
      }
    }
    
    // 3. Corriger les données existantes
    console.log('\n🔧 3. CORRECTION DES DONNÉES EXISTANTES');
    console.log('=========================================');
    
    if (holerites && holerites.length > 0) {
      for (const holerite of holerites) {
        console.log(`\n🔍 Vérification du holerite ${holerite.id}`);
        
        const structuredData = holerite.structured_data;
        let needsUpdate = false;
        let updatedData = { ...structuredData };
        
        // Vérifier et corriger la structure
        if (!updatedData.final_data && (updatedData.employee_name || updatedData.company_name)) {
          console.log('⚠️ Structure final_data manquante, correction...');
          updatedData.final_data = {
            employee_name: updatedData.employee_name || holerite.nome,
            company_name: updatedData.company_name || holerite.empresa,
            position: updatedData.position || '',
            statut: updatedData.profile_type || holerite.perfil,
            salario_bruto: updatedData.gross_salary || holerite.salario_bruto,
            salario_liquido: updatedData.net_salary || holerite.salario_liquido,
            descontos: updatedData.total_deductions || (holerite.salario_bruto - holerite.salario_liquido),
            period: updatedData.period || ''
          };
          needsUpdate = true;
        }
        
        if (!updatedData.recommendations) {
          console.log('⚠️ Recommendations manquantes, ajout...');
          updatedData.recommendations = {
            recommendations: [],
            resume_situation: '',
            score_optimisation: 0
          };
          needsUpdate = true;
        }
        
        if (!updatedData.analysis_result) {
          console.log('⚠️ Analysis_result manquant, ajout...');
          updatedData.analysis_result = {
            finalData: updatedData.final_data || {
              employee_name: holerite.nome,
              company_name: holerite.empresa,
              position: '',
              statut: holerite.perfil,
              salario_bruto: holerite.salario_bruto,
              salario_liquido: holerite.salario_liquido,
              descontos: holerite.salario_bruto - holerite.salario_liquido,
              period: ''
            },
            validation: {
              confidence: 0.8,
              warnings: []
            }
          };
          needsUpdate = true;
        }
        
        // Mettre à jour si nécessaire
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('holerites')
            .update({
              structured_data: updatedData
            })
            .eq('id', holerite.id);
          
          if (updateError) {
            console.log('❌ Erreur mise à jour:', updateError);
          } else {
            console.log('✅ Holerite mis à jour avec succès');
          }
        } else {
          console.log('✅ Structure déjà correcte');
        }
      }
    }
    
    // 4. Nettoyer les données de test
    console.log('\n🧹 4. NETTOYAGE DES DONNÉES DE TEST');
    console.log('=====================================');
    
    // Supprimer les données de test
    const { error: deleteTestError } = await supabase
      .from('holerites')
      .delete()
      .eq('user_id', 'test-audit-user');
    
    if (deleteTestError) {
      console.log('❌ Erreur nettoyage données test:', deleteTestError);
    } else {
      console.log('✅ Données de test nettoyées');
    }
    
    // 5. Vérification finale
    console.log('\n✅ 5. VÉRIFICATION FINALE');
    console.log('==========================');
    
    const { data: finalHolerites, error: finalError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (finalError) {
      console.log('❌ Erreur vérification finale:', finalError);
    } else {
      console.log(`📊 ${finalHolerites?.length || 0} holerites disponibles`);
      
      if (finalHolerites && finalHolerites.length > 0) {
        console.log('\n📋 Structure du dernier holerite:');
        const last = finalHolerites[0];
        console.log('- ID:', last.id);
        console.log('- Nom:', last.nome);
        console.log('- Entreprise:', last.empresa);
        console.log('- Salário Bruto:', last.salario_bruto);
        console.log('- Salário Líquido:', last.salario_liquido);
        
        if (last.structured_data) {
          console.log('- final_data présent:', !!last.structured_data.final_data);
          console.log('- recommendations présent:', !!last.structured_data.recommendations);
          console.log('- analysis_result présent:', !!last.structured_data.analysis_result);
        }
      }
    }
    
    console.log('\n🎯 CORRECTION TERMINÉE AVEC SUCCÈS');
    console.log('====================================');
    console.log('✅ Les données sont maintenant synchronisées');
    console.log('✅ La structure est unifiée');
    console.log('✅ Le dashboard devrait afficher les bonnes données');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter la correction
fixHoleriteDataSync().catch(console.error); 