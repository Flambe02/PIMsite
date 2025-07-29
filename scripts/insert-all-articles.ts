#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

// Importer les articles depuis les fichiers existants
import { descontosFolhaPagamento } from '../seeds/posts/descontos-folha-pagamento';
import { inssImpactoSalario } from '../seeds/posts/inss-impacto-salario';
import { irrfImpostoRendaHolerite } from '../seeds/posts/irrf-imposto-renda-holerite';
import { beneficiosCorporativosHolerite } from '../seeds/posts/beneficios-corporativos-holerite';
import { cltPjEstagioFolhaPagamento } from '../seeds/posts/clt-pj-estagio-folha-pagamento';

console.log('🚀 Insertion Automatique des Articles de Blog');
console.log('=============================================\n');

// Configuration Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Vérifier la configuration
console.log('📋 Vérification de la configuration:');
console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ Manquant'}`);
console.log(`   Token: ${process.env.SANITY_API_TOKEN ? '✅ Présent' : '❌ Manquant'}`);
console.log(`   Dataset: production`);
console.log('');

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
  console.log('❌ Configuration incomplète. Vérifiez votre fichier .env.local');
  process.exit(1);
}

// Préparer les articles pour Sanity
const articles = [
  {
    ...descontosFolhaPagamento,
    _type: 'post',
    slug: {
      _type: 'slug',
      current: descontosFolhaPagamento.slug
    }
  },
  {
    ...inssImpactoSalario,
    _type: 'post',
    slug: {
      _type: 'slug',
      current: inssImpactoSalario.slug
    }
  },
  {
    ...irrfImpostoRendaHolerite,
    _type: 'post',
    slug: {
      _type: 'slug',
      current: irrfImpostoRendaHolerite.slug
    }
  },
  {
    ...beneficiosCorporativosHolerite,
    _type: 'post',
    slug: {
      _type: 'slug',
      current: beneficiosCorporativosHolerite.slug
    }
  },
  {
    ...cltPjEstagioFolhaPagamento,
    _type: 'post',
    slug: {
      _type: 'slug',
      current: cltPjEstagioFolhaPagamento.slug
    }
  }
];

async function insertAllArticles() {
  try {
    console.log(`📝 Préparation de l'insertion de ${articles.length} articles...\n`);

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      console.log(`📄 Article ${i + 1}/${articles.length}: ${article.title}`);
      
      try {
        // Vérifier si l'article existe déjà
        const existingArticle = await client.fetch(
          `*[_type == "post" && slug.current == $slug][0]`,
          { slug: article.slug.current }
        );

        if (existingArticle) {
          console.log(`🔄 Article existant trouvé, mise à jour...`);
          
          // Mise à jour de l'article existant
          const updatedArticle = await client
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
          results.push({
            action: 'updated',
            id: updatedArticle._id,
            title: updatedArticle.title,
            slug: updatedArticle.slug.current
          });
        } else {
          console.log(`➕ Création d'un nouvel article...`);
          
          // Création d'un nouvel article
          const newArticle = await client.create(article);

          console.log(`✅ Article créé: ${newArticle.title}`);
          results.push({
            action: 'created',
            id: newArticle._id,
            title: newArticle.title,
            slug: newArticle.slug.current
          });
        }

        successCount++;
        
      } catch (error: any) {
        console.log(`❌ Erreur lors de l'insertion de "${article.title}":`);
        console.log(`   ${error.message}`);
        errorCount++;
      }

      console.log(''); // Ligne vide pour séparer les articles
    }

    // Résumé final
    console.log('==========================================');
    console.log('📊 Résumé:');
    console.log(`✅ Articles insérés/mis à jour: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log(`⚠️ Certains articles n'ont pas pu être insérés. Vérifiez les erreurs ci-dessus.`);
    } else {
      console.log(`🎉 Tous les articles ont été insérés avec succès !`);
    }

    console.log('');
    console.log('🔗 URLs de test:');
    console.log('📚 Blog: http://localhost:3001/br/blog');
    console.log('📄 Articles individuels:');
    results.forEach(result => {
      console.log(`   - ${result.title}: http://localhost:3001/br/blog/${result.slug}`);
    });

  } catch (error: any) {
    console.log('❌ Erreur générale:', error.message);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('1. Allez sur https://www.sanity.io/manage');
      console.log('2. Sélectionnez votre projet');
      console.log('3. Allez dans "Settings" > "API"');
      console.log('4. Trouvez votre token et cliquez "Edit"');
      console.log('5. Sélectionnez "Editor" permissions');
      console.log('6. Sauvegardez');
      console.log('');
      console.log('🔄 Puis relancez: npx tsx scripts/insert-all-articles.ts');
    }
  }
}

// Lancer l'insertion
insertAllArticles(); 