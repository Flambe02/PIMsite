import { createClient } from '@supabase/supabase-js';

async function testRecommendationsStorage() {
  console.log('🧪 Test du stockage des recommandations IA...');
  
  // Configuration Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement Supabase manquantes');
    console.log('💡 Pour tester avec des variables d\'environnement:');
    console.log('   export NEXT_PUBLIC_SUPABASE_URL="votre_url"');
    console.log('   export NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_clé"');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Vérifier les données les plus récentes
    console.log('📊 Vérification des données récentes...');
    
    const { data: holerites, error: holeritesError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (holeritesError) {
      console.error('❌ Erreur récupération holerites:', holeritesError);
      return;
    }
    
    console.log(`✅ ${holerites?.length || 0} holerites trouvés`);
    
    // 2. Analyser la structure des données
    if (holerites && holerites.length > 0) {
      holerites.forEach((holerite, index) => {
        console.log(`\n📋 Holerite ${index + 1}:`);
        console.log(`  - ID: ${holerite.id}`);
        console.log(`  - Date: ${holerite.created_at}`);
        console.log(`  - Salário Bruto: R$ ${holerite.salario_bruto || 0}`);
        console.log(`  - Salário Líquido: R$ ${holerite.salario_liquido || 0}`);
        
        if (holerite.structured_data) {
          const data = holerite.structured_data as any;
          
          // Vérifier les recommandations
          console.log('  🔍 Structure des données:');
          console.log(`    - analysis_result: ${data.analysis_result ? 'Présent' : 'Absent'}`);
          console.log(`    - recommendations: ${data.recommendations ? 'Présent' : 'Absent'}`);
          console.log(`    - final_data: ${data.final_data ? 'Présent' : 'Absent'}`);
          
          if (data.recommendations) {
            console.log('  💡 Recommandations trouvées:');
            console.log(`    - Résumé: ${data.recommendations.resume_situation || 'Non disponible'}`);
            console.log(`    - Score: ${data.recommendations.score_optimisation || 0}%`);
            console.log(`    - Nombre de recommandations: ${data.recommendations.recommendations?.length || 0}`);
            
            if (data.recommendations.recommendations && Array.isArray(data.recommendations.recommendations)) {
              data.recommendations.recommendations.forEach((rec: any, recIndex: number) => {
                console.log(`      ${recIndex + 1}. ${rec.titre} (${rec.categorie}) - Impact: ${rec.impact}`);
              });
            }
          }
          
          if (data.analysis_result?.recommendations) {
            console.log('  🤖 Recommandations dans analysis_result:');
            console.log(`    - Résumé: ${data.analysis_result.recommendations.resume_situation || 'Non disponible'}`);
            console.log(`    - Score: ${data.analysis_result.recommendations.score_optimisation || 0}%`);
            console.log(`    - Nombre de recommandations: ${data.analysis_result.recommendations.recommendations?.length || 0}`);
          }
          
          // Vérifier les descontos
          console.log(`  💰 Descontos: R$ ${data.descontos || data.final_data?.descontos || 'Non disponible'}`);
        }
      });
    }
    
    // 3. Vérifier les analyses
    const { data: analyses, error: analysesError } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (analysesError) {
      console.error('❌ Erreur récupération analyses:', analysesError);
    } else {
      console.log(`\n📊 ${analyses?.length || 0} analyses trouvées`);
      
      if (analyses && analyses.length > 0) {
        analyses.forEach((analysis, index) => {
          console.log(`\n📋 Analyse ${index + 1}:`);
          if (analysis.data) {
            const data = analysis.data as any;
            console.log(`  - Recommandations: ${data.recommendations ? 'Présent' : 'Absent'}`);
            console.log(`  - Extraction: ${data.extraction ? 'Présent' : 'Absent'}`);
            console.log(`  - Validation: ${data.validation ? 'Présent' : 'Absent'}`);
          }
        });
      }
    }
    
    console.log('\n✅ Test terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécution du test
testRecommendationsStorage().then(() => {
  console.log('🏁 Test terminé');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
}); 