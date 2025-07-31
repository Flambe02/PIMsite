// Définir les variables d'environnement directement
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'y5sty7n2';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
process.env.NEXT_PUBLIC_SANITY_API_VERSION = '2025-07-29';

import { createClient } from '@sanity/client';

// Configuration Sanity directe
const config = {
  projectId: 'y5sty7n2',
  dataset: 'production',
  apiVersion: '2025-07-29',
  useCdn: false, // Pour avoir des données fraîches
};

// Créer le client Sanity
const sanityClient = createClient(config);

// Requêtes GROQ
const queries = {
  // Récupérer tous les articles
  getAllArticles: `
    *[_type == "post" && publishedAt != null] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      country,
      tags
    }
  `,

  // Récupérer les articles par pays
  getArticlesByCountry: `
    *[_type == "post" && publishedAt != null && (country == $country || country == lower($country))] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      country,
      tags
    }
  `,

  // Récupérer un article par slug
  getArticleBySlug: `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      body,
      excerpt,
      publishedAt,
      country,
      tags,
      "author": author->name
    }
  `
};

async function testSanityDirect() {
  try {
    console.log('🔍 Test direct de Sanity...');
    console.log('=====================================\n');

    console.log('📡 Configuration:');
    console.log(`   Project ID: ${config.projectId}`);
    console.log(`   Dataset: ${config.dataset}`);
    console.log(`   API Version: ${config.apiVersion}\n`);

    // Test de connexion
    console.log('🔗 Test de connexion...');
    
    // Récupérer tous les articles
    const allArticles = await sanityClient.fetch(queries.getAllArticles);
    console.log(`📊 Total d'articles dans Sanity: ${allArticles?.length || 0}`);

    if (allArticles && allArticles.length > 0) {
      console.log('\n📰 Articles trouvés:');
      allArticles.forEach((article: any, index: number) => {
        console.log(`  ${index + 1}. ${article.title}`);
        console.log(`     Slug: ${article.slug}`);
        console.log(`     Pays: ${article.country}`);
        console.log(`     Date: ${article.publishedAt}`);
        if (article.tags && article.tags.length > 0) {
          console.log(`     Tags: ${article.tags.join(', ')}`);
        }
        console.log('');
      });
    } else {
      console.log('❌ Aucun article trouvé dans Sanity');
    }

    // Test par pays
    const countries = ['br', 'fr', 'en'];
    
    for (const country of countries) {
      console.log(`🌍 Test pour ${country.toUpperCase()}:`);
      
      try {
        const articles = await sanityClient.fetch(queries.getArticlesByCountry, { country });
        console.log(`  📰 Articles pour ${country.toUpperCase()}: ${articles?.length || 0}`);
        
        if (articles && articles.length > 0) {
          articles.forEach((article: any) => {
            console.log(`    - ${article.title} (${article.slug})`);
          });
        }
      } catch (error) {
        console.error(`  ❌ Erreur pour ${country}:`, error);
      }
      console.log('');
    }

    console.log('🎉 Test terminé !');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testSanityDirect(); 