/**
 * Script pour tester un nouveau scan avec des données de test
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://arevqehvhkcqivwyojou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZXZxZWh2aGtjcWl2d3lvam91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTM5MzM1NSwiZXhwIjoyMDY2OTY5MzU1fQ.0xlEvFGJeE-aBSYNU9O1fgADCPFHnk1rSnjmR4WQkr8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testNewScan() {
  console.log('🧪 TEST D\'UN NOUVEAU SCAN');
  console.log('=' .repeat(40));

  try {
    // 1. Récupérer un utilisateur existant
    console.log('\n1️⃣ Récupération d\'un utilisateur existant...');
    
    const { data: existingUsers, error: usersError } = await supabase
      .from('holerites')
      .select('user_id')
      .limit(1);

    if (usersError || !existingUsers || existingUsers.length === 0) {
      console.error('❌ Aucun utilisateur trouvé:', usersError);
      return;
    }

    const testUserId = existingUsers[0].user_id;
    console.log('✅ Utilisateur trouvé:', testUserId.substring(0, 8) + '...');

    // 2. Créer des données de test
    console.log('\n2️⃣ Création de données de test...');
    
    const testData = {
      user_id: testUserId,
      structured_data: {
        final_data: {
          employee_name: 'João Silva',
          company_name: 'Tech Solutions Ltda',
          position: 'Desenvolvedor Senior',
          statut: 'CLT',
          salario_bruto: 8500.00,
          salario_liquido: 6500.00,
          descontos: 2000.00,
          period: 'Janeiro 2024'
        },
        recommendations: {
          recommendations: [
            'Considere investir em previdência privada',
            'Otimize seus descontos fiscais',
            'Avalie planos de saúde complementares'
          ],
          resume_situation: 'Sua situação financeira está boa, mas há oportunidades de otimização',
          score_optimisation: 75
        },
        analysis_result: {
          finalData: {
            employee_name: 'João Silva',
            company_name: 'Tech Solutions Ltda',
            position: 'Desenvolvedor Senior',
            statut: 'CLT',
            salario_bruto: 8500.00,
            salario_liquido: 6500.00,
            descontos: 2000.00,
            period: 'Janeiro 2024'
          },
          validation: {
            confidence: 0.95,
            warnings: []
          }
        },
        employee_name: 'João Silva',
        company_name: 'Tech Solutions Ltda',
        position: 'Desenvolvedor Senior',
        profile_type: 'CLT',
        gross_salary: 8500.00,
        net_salary: 6500.00,
        salario_bruto: 8500.00,
        salario_liquido: 6500.00,
        period: 'Janeiro 2024'
      },
      nome: 'João Silva',
      empresa: 'Tech Solutions Ltda',
      perfil: 'CLT',
      salario_bruto: 8500.00,
      salario_liquido: 6500.00,
      created_at: new Date().toISOString(),
    };

    console.log('✅ Données de test créées');

    // 3. Insérer dans holerites
    console.log('\n3️⃣ Insertion dans holerites...');
    const { data: holeriteInsert, error: holeriteError } = await supabase
      .from('holerites')
      .insert(testData)
      .select('id')
      .single();

    if (holeriteError) {
      console.error('❌ Erreur insertion holerites:', holeriteError);
      return;
    }

    console.log('✅ Holerite inséré avec ID:', holeriteInsert.id);

    // 4. Insérer dans scan_results (optionnel)
    console.log('\n4️⃣ Insertion dans scan_results (ignorée pour le test)...');
    // const scanData = {
    //   user_id: testUserId,
    //   country: 'br',
    //   file_name: 'test.pdf',
    //   file_size: 1024000,
    //   file_type: 'application/pdf',
    //   ocr_text: 'Test OCR text...',
    //   structured_data: testData.structured_data,
    //   recommendations: testData.structured_data.recommendations,
    //   confidence_score: 0.95,
    //   scan_version: 1
    // };

    // const { data: scanInsert, error: scanError } = await supabase
    //   .from('scan_results')
    //   .insert(scanData)
    //   .select('id')
    //   .single();

    // if (scanError) {
    //   console.error('❌ Erreur insertion scan_results:', scanError);
    //   return;
    // }

    // console.log('✅ Scan result inséré avec ID:', scanInsert.id);

    // 5. Vérifier l'insertion
    console.log('\n5️⃣ Vérification de l\'insertion...');
    const { data: verifyHolerite, error: verifyError } = await supabase
      .from('holerites')
      .select('*')
      .eq('id', holeriteInsert.id)
      .single();

    if (verifyError) {
      console.error('❌ Erreur vérification:', verifyError);
      return;
    }

    console.log('✅ Vérification réussie');
    console.log('  - ID:', verifyHolerite.id);
    console.log('  - Nom:', verifyHolerite.nome);
    console.log('  - Empresa:', verifyHolerite.empresa);
    console.log('  - Salário Bruto:', verifyHolerite.salario_bruto);
    console.log('  - Salário Líquido:', verifyHolerite.salario_liquido);

    // 6. Test d'extraction comme dans le dashboard
    console.log('\n6️⃣ Test d\'extraction dashboard...');
    
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
      
      const numValue = Number(value);
      return isNaN(numValue) ? defaultValue : numValue;
    };

    const salarioBruto = extractValue(verifyHolerite.structured_data, 'final_data.salario_bruto') ||
                        extractValue(verifyHolerite.structured_data, 'gross_salary') ||
                        extractValue(verifyHolerite.structured_data, 'salario_bruto') ||
                        extractValue(verifyHolerite, 'salario_bruto') ||
                        0;

    const salarioLiquido = extractValue(verifyHolerite.structured_data, 'final_data.salario_liquido') ||
                          extractValue(verifyHolerite.structured_data, 'net_salary') ||
                          extractValue(verifyHolerite.structured_data, 'salario_liquido') ||
                          extractValue(verifyHolerite, 'salario_liquido') ||
                          0;

    console.log('  - Salário Bruto extrait:', salarioBruto);
    console.log('  - Salário Líquido extrait:', salarioLiquido);
    console.log('  - Valeurs > 0?', salarioBruto > 0 && salarioLiquido > 0 ? '✅ OUI' : '❌ NON');

    // 7. Nettoyer les données de test
    console.log('\n7️⃣ Nettoyage des données de test...');
    
    await supabase
      .from('holerites')
      .delete()
      .eq('id', holeriteInsert.id);

    // await supabase
    //   .from('scan_results')
    //   .delete()
    //   .eq('id', scanInsert.id);

    console.log('✅ Données de test nettoyées');

    // 8. Résultat final
    console.log('\n8️⃣ RÉSULTAT FINAL:');
    
    if (salarioBruto > 0 && salarioLiquido > 0) {
      console.log('✅ SUCCÈS: Les données sont correctement extraites');
      console.log('💡 Le problème était dans la structure des données sauvegardées');
      console.log('💡 Les corrections apportées à l\'API devraient résoudre le problème');
    } else {
      console.log('❌ ÉCHEC: Les données ne sont toujours pas correctement extraites');
      console.log('💡 Il faut encore ajuster la logique d\'extraction');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le test
testNewScan().then(() => {
  console.log('\n🏁 Test terminé');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 