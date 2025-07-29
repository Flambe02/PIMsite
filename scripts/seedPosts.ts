import 'dotenv/config';
import { createClient } from '@sanity/client';
import { descontosFolhaPagamento } from '../seeds/posts/descontos-folha-pagamento';
import { inssImpactoSalario } from '../seeds/posts/inss-impacto-salario';
import { irrfImpostoRendaHolerite } from '../seeds/posts/irrf-imposto-renda-holerite';
import { beneficiosCorporativosHolerite } from '../seeds/posts/beneficios-corporativos-holerite';
import { cltPjEstagioFolhaPagamento } from '../seeds/posts/clt-pj-estagio-folha-pagamento';

// Configuration Sanity
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-07-29',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Token avec permissions d'écriture
});

console.log('🚀 Script de création des articles de blog');
console.log('==========================================\n');

// Tous les articles à insérer
const articles = [
  descontosFolhaPagamento,
  inssImpactoSalario,
  irrfImpostoRendaHolerite,
  beneficiosCorporativosHolerite,
  cltPjEstagioFolhaPagamento
];

async function seedPosts() {
  try {
    console.log(`📝 Préparation de l'insertion de ${articles.length} articles...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      console.log(`📄 Insertion de l'article: ${article.title}`);
      
      try {
        // Vérifier si l'article existe déjà
        const existingArticle = await sanityClient.fetch(
          `*[_type == "post" && slug.current == $slug][0]`,
          { slug: article.slug }
        );

        if (existingArticle) {
          console.log(`🔄 Article existant trouvé, mise à jour...`);
          
          // Mise à jour de l'article existant
          const updatedArticle = await sanityClient
            .patch(existingArticle._id)
            .set({
              title: article.title,
              excerpt: article.excerpt,
              country: article.country,
              language: article.language,
              publishedAt: article.publishedAt,
              metaTitle: article.metaTitle,
              metaDescription: article.metaDescription,
              tags: article.tags,
              body: article.body
            })
            .commit();

          console.log(`✅ Article mis à jour: ${updatedArticle.title}`);
        } else {
          console.log(`➕ Création d'un nouvel article...`);
          
          // Création d'un nouvel article
          const newArticle = await sanityClient.create({
            _type: 'post',
            title: article.title,
            slug: {
              _type: 'slug',
              current: article.slug
            },
            excerpt: article.excerpt,
            country: article.country,
            language: article.language,
            publishedAt: article.publishedAt,
            metaTitle: article.metaTitle,
            metaDescription: article.metaDescription,
            tags: article.tags,
            body: article.body
          });

          console.log(`✅ Article créé: ${newArticle.title}`);
        }

        successCount++;
        
      } catch (error) {
        console.error(`❌ Erreur lors de l'insertion de "${article.title}":`, error);
        errorCount++;
      }

      console.log(''); // Ligne vide pour séparer les articles
    }

    console.log('==========================================');
    console.log('📊 Résumé:');
    console.log(`✅ Articles insérés/mis à jour: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log(`⚠️ Certains articles n'ont pas pu être insérés. Vérifiez les erreurs ci-dessus.`);
    } else {
      console.log(`🎉 Tous les articles ont été insérés avec succès !`);
    }

    console.log('\n🔗 URLs de test:');
    console.log(`📚 Blog: http://localhost:3001/br/blog`);
    articles.forEach(article => {
      console.log(`📄 ${article.title}: http://localhost:3001/br/blog/${article.slug}`);
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Vérification des variables d'environnement
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID non défini');
  console.log('💡 Veuillez définir vos variables d\'environnement Sanity');
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN non défini');
  console.log('💡 Veuillez définir votre token API Sanity avec permissions d\'écriture');
  process.exit(1);
}

// Exécution du script
seedPosts(); 