import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function testHoleriteUpload() {
  console.log('🧪 Test de l\'upload de holerite...');
  
  // Configuration Supabase (utiliser les variables d'environnement)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement Supabase manquantes');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Vérifier les données existantes dans Supabase
    console.log('📊 Vérification des données existantes...');
    
    const { data: holerites, error: holeritesError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (holeritesError) {
      console.error('❌ Erreur récupération holerites:', holeritesError);
      return;
    }
    
    console.log(`✅ ${holerites?.length || 0} holerites trouvés`);
    
    // 2. Vérifier les analyses avec recommandations
    const { data: analyses, error: analysesError } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (analysesError) {
      console.error('❌ Erreur récupération analyses:', analysesError);
      return;
    }
    
    console.log(`✅ ${analyses?.length || 0} analyses trouvées`);
    
    // 3. Analyser les données pour vérifier les recommandations
    if (analyses && analyses.length > 0) {
      console.log('🔍 Analyse des recommandations IA...');
      
      analyses.forEach((analysis, index) => {
        console.log(`\n📋 Analyse ${index + 1}:`);
        console.log(`  - ID: ${analysis.id}`);
        console.log(`  - Date: ${analysis.created_at}`);
        
        if (analysis.data) {
          const data = analysis.data as any;
          
          // Vérifier les recommandations
          if (data.recommendations) {
            console.log(`  - Résumé: ${data.recommendations.resume_situation || 'Non disponible'}`);
            console.log(`  - Score d'optimisation: ${data.recommendations.score_optimisation || 0}%`);
            
            if (data.recommendations.recommendations && Array.isArray(data.recommendations.recommendations)) {
              console.log(`  - Nombre de recommandations: ${data.recommendations.recommendations.length}`);
              
              data.recommendations.recommendations.forEach((rec: any, recIndex: number) => {
                console.log(`    ${recIndex + 1}. ${rec.titre} (${rec.categorie}) - Impact: ${rec.impact}`);
              });
            } else {
              console.log('  - Aucune recommandation trouvée');
            }
          } else {
            console.log('  - Aucune donnée de recommandations');
          }
          
          // Vérifier les données d'extraction
          if (data.extraction) {
            console.log(`  - Salário Bruto: R$ ${data.extraction.salario_bruto || 0}`);
            console.log(`  - Salário Líquido: R$ ${data.extraction.salario_liquido || 0}`);
            console.log(`  - Statut: ${data.extraction.statut || 'Non détecté'}`);
          }
        }
      });
    }
    
    // 4. Vérifier les données d'apprentissage
    const { data: learnings, error: learningsError } = await supabase
      .from('ocr_learnings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (learningsError) {
      console.error('❌ Erreur récupération apprentissage:', learningsError);
    } else {
      console.log(`✅ ${learnings?.length || 0} données d'apprentissage trouvées`);
    }
    
    console.log('\n✅ Test terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécution du test
testHoleriteUpload().then(() => {
  console.log('🏁 Test terminé');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
}); 