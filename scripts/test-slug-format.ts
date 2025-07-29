import 'dotenv/config';
import { sanityClient, queries } from '@/lib/sanity/config';

console.log('🧪 Test du format du slug');
console.log('========================\n');

async function testSlugFormat() {
  try {
    // Test 1: Récupérer un article pour vérifier le format du slug
    console.log('📡 Test 1: Format du slug');
    
    const articles = await sanityClient.fetch(queries.getArticlesByCountry, { country: 'br' });
    console.log(`📊 Articles trouvés: ${articles?.length || 0}`);
    
    if (articles && articles.length > 0) {
      const firstArticle = articles[0];
      console.log('📝 Premier article:');
      console.log(`   - Titre: ${firstArticle.title}`);
      console.log(`   - Slug: ${firstArticle.slug} (type: ${typeof firstArticle.slug})`);
      console.log(`   - Slug est une string: ${typeof firstArticle.slug === 'string'}`);
      
      if (typeof firstArticle.slug === 'string') {
        console.log('✅ Slug est bien une string !');
      } else {
        console.log('❌ Slug n\'est pas une string !');
        console.log('   Structure du slug:', JSON.stringify(firstArticle.slug, null, 2));
      }
    } else {
      console.log('⚠️ Aucun article trouvé pour tester le format du slug');
    }
    
    console.log('');

    // Test 2: Test de la requête getAllArticles
    console.log('📋 Test 2: Requête getAllArticles');
    const allArticles = await sanityClient.fetch(queries.getAllArticles);
    console.log(`📊 Total articles: ${allArticles?.length || 0}`);
    
    if (allArticles && allArticles.length > 0) {
      const firstSlug = allArticles[0].slug;
      console.log(`   - Premier slug: ${firstSlug} (type: ${typeof firstSlug})`);
    }
    
    console.log('');

    // Test 3: Instructions pour créer un article de test
    console.log('💡 Instructions pour tester:');
    console.log('   1. Allez sur http://localhost:3000/studio');
    console.log('   2. Créez un "Post" avec:');
    console.log('      - Titre: "Test Article"');
    console.log('      - Pays: "Brésil" (br)');
    console.log('      - Date de publication: Aujourd\'hui');
    console.log('      - Extrait: "Article de test"');
    console.log('   3. Publiez l\'article');
    console.log('   4. Relancez ce script pour vérifier le format');
    
    console.log('\n✅ Test terminé !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testSlugFormat(); 