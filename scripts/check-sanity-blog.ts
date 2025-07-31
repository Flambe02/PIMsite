import { config } from 'dotenv';
import { sanityClient, queries } from '@/lib/sanity/config';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

async function checkSanityBlog() {
  try {
    console.log('🔍 Vérification du blog Sanity...');
    console.log('=====================================\n');

    // Vérifier la connexion à Sanity
    console.log('📡 Test de connexion à Sanity...');
    
    // Récupérer tous les articles
    const allArticles = await sanityClient.fetch(queries.getAllArticles);
    console.log(`📊 Total d'articles dans Sanity: ${allArticles?.length || 0}`);

    if (allArticles && allArticles.length > 0) {
      console.log('\n📰 Articles trouvés:');
      allArticles.forEach((article: any, index: number) => {
        console.log(`  ${index + 1}. ${article.slug} (${article.country}) - ${article.publishedAt}`);
      });
    }

    // Tester par pays
    const countries = ['br', 'fr', 'en'];
    
    for (const country of countries) {
      console.log(`\n🌍 Test pour ${country.toUpperCase()}:`);
      
      try {
        const articles = await sanityClient.fetch(queries.getArticlesByCountry, { country });
        console.log(`  📰 Articles pour ${country.toUpperCase()}: ${articles?.length || 0}`);
        
        if (articles && articles.length > 0) {
          articles.forEach((article: any) => {
            console.log(`    - ${article.title} (${article.slug})`);
            if (article.tags && article.tags.length > 0) {
              console.log(`      Tags: ${article.tags.join(', ')}`);
            }
          });
        }
      } catch (error) {
        console.error(`  ❌ Erreur pour ${country}:`, error);
      }
    }

    // Test d'un article spécifique
    console.log('\n🔍 Test d\'un article spécifique...');
    if (allArticles && allArticles.length > 0) {
      const testSlug = allArticles[0].slug;
      try {
        const article = await sanityClient.fetch(queries.getArticleBySlug, { slug: testSlug });
        if (article) {
          console.log(`  ✅ Article trouvé: ${article.title}`);
          console.log(`     Contenu: ${article.body ? 'Présent' : 'Absent'}`);
          console.log(`     Image: ${article.image ? 'Présente' : 'Absente'}`);
          console.log(`     Tags: ${article.tags ? article.tags.join(', ') : 'Aucun'}`);
        } else {
          console.log(`  ❌ Article non trouvé: ${testSlug}`);
        }
      } catch (error) {
        console.error(`  ❌ Erreur lors de la récupération de l'article:`, error);
      }
    }

    console.log('\n🎉 Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

checkSanityBlog(); 