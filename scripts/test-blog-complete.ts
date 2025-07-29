import 'dotenv/config';
import { sanityClient, queries } from '@/lib/sanity/config';

console.log('🧪 Test complet de la migration Sanity Blog');
console.log('============================================\n');

async function testCompleteMigration() {
  try {
    // Test 1: Connexion à Sanity
    console.log('📡 Test 1: Connexion à Sanity');
    const testConnection = await sanityClient.fetch('*[_type == "post"][0...1]');
    console.log('✅ Connexion réussie');
    console.log(`📊 Articles trouvés: ${testConnection?.length || 0}\n`);

    // Test 2: Test des requêtes GROQ
    console.log('🔍 Test 2: Requêtes GROQ');
    
    // Test requête articles par pays
    const articlesBR = await sanityClient.fetch(queries.getArticlesByCountry, { country: 'br' });
    console.log(`🇧🇷 Articles BR: ${articlesBR?.length || 0}`);
    
    const articlesFR = await sanityClient.fetch(queries.getArticlesByCountry, { country: 'fr' });
    console.log(`🇫🇷 Articles FR: ${articlesFR?.length || 0}`);
    
    // Test requête tous les articles
    const allArticles = await sanityClient.fetch(queries.getAllArticles);
    console.log(`📊 Total articles: ${allArticles?.length || 0}\n`);

    // Test 3: Vérification du schéma
    console.log('📋 Test 3: Vérification du schéma');
    const schemaTest = await sanityClient.fetch(`
      *[_type == "post"][0] {
        _id,
        title,
        slug,
        country,
        publishedAt,
        excerpt,
        tags
      }
    `);
    
    if (schemaTest) {
      console.log('✅ Schéma post accessible');
      console.log(`📝 Champs disponibles: ${Object.keys(schemaTest).join(', ')}`);
    } else {
      console.log('⚠️ Aucun article trouvé pour tester le schéma');
    }
    console.log('');

    // Test 4: Test des variables d'environnement
    console.log('🔧 Test 4: Variables d\'environnement');
    console.log(`📦 Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`🗄️ Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
    console.log(`🌐 API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-29'}`);
    console.log('');

    // Test 5: Recommandations
    console.log('💡 Recommandations:');
    if ((articlesBR?.length || 0) === 0 && (articlesFR?.length || 0) === 0) {
      console.log('📝 Créez des articles de test via Sanity Studio:');
      console.log('   1. Allez sur http://localhost:3000/studio');
      console.log('   2. Créez un "Post" avec pays "Brésil"');
      console.log('   3. Publiez l\'article');
      console.log('   4. Testez http://localhost:3000/br/blog');
    } else {
      console.log('✅ Articles trouvés ! Testez la page blog:');
      console.log('   http://localhost:3000/br/blog');
    }

    console.log('\n🎉 Test complet terminé !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testCompleteMigration(); 