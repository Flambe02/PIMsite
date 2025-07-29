import 'dotenv/config';
import { sanityClient } from '@/lib/sanity/config';

async function testSanityRead() {
  console.log('🧪 Test de lecture Sanity');
  console.log('=' .repeat(40));

  try {
    // Test 1: Vérifier la connexion
    console.log('\n📡 Test 1: Connexion à Sanity');
    const testQuery = await sanityClient.fetch('*[_type == "article"][0...1]');
    console.log('✅ Connexion réussie');
    console.log(`📊 Articles trouvés: ${testQuery.length}`);

    // Test 2: Récupérer tous les articles
    console.log('\n📋 Test 2: Récupération de tous les articles');
    const allArticles = await sanityClient.fetch('*[_type == "article"]');
    console.log(`📊 Total d'articles: ${allArticles.length}`);

    if (allArticles.length > 0) {
      console.log('\n📝 Articles disponibles:');
      allArticles.forEach((article: any, index: number) => {
        console.log(`${index + 1}. ${article.title} (${article.country})`);
      });
    }

    // Test 3: Articles par pays
    console.log('\n🌍 Test 3: Articles par pays');
    const brArticles = await sanityClient.fetch('*[_type == "article" && country == "br"]');
    const frArticles = await sanityClient.fetch('*[_type == "article" && country == "fr"]');
    
    console.log(`🇧🇷 Articles BR: ${brArticles.length}`);
    console.log(`🇫🇷 Articles FR: ${frArticles.length}`);

    // Test 4: Structure d'un article
    if (allArticles.length > 0) {
      console.log('\n🔍 Test 4: Structure d\'un article');
      const firstArticle = allArticles[0];
      console.log('Champs disponibles:', Object.keys(firstArticle));
      console.log('Exemple de titre:', firstArticle.title);
      console.log('Exemple de slug:', firstArticle.slug?.current);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécution
testSanityRead().catch(console.error); 