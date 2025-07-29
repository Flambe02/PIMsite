import 'dotenv/config';
import { sanityClient, queries } from '@/lib/sanity/config';

console.log('🎨 Test de la présentation de l\'article');
console.log('=====================================\n');

async function testBlogPresentation() {
  try {
    // Test 1: Vérifier que l'article a du contenu
    console.log('📝 Test 1: Contenu de l\'article');
    const slug = 'entenda-seu-holerite';
    const article = await sanityClient.fetch(queries.getArticleBySlug, { slug });
    
    if (article && article.body) {
      console.log('✅ Article trouvé avec contenu');
      console.log(`📄 Titre: ${article.title}`);
      console.log(`📖 Nombre de blocs dans le body: ${article.body.length}`);
      
      // Analyser la structure du contenu
      const contentTypes = article.body.map((block: any) => block._type);
      const uniqueTypes = [...new Set(contentTypes)];
      console.log(`🔍 Types de contenu: ${uniqueTypes.join(', ')}`);
      
      // Compter les paragraphes et titres
      const paragraphs = article.body.filter((block: any) => block._type === 'block' && block.style === 'normal').length;
      const headings = article.body.filter((block: any) => block._type === 'block' && block.style?.startsWith('h')).length;
      
      console.log(`📝 Paragraphes: ${paragraphs}`);
      console.log(`🏷️ Titres: ${headings}`);
      
      // Vérifier la longueur du contenu
      const totalTextLength = article.body
        .filter((block: any) => block._type === 'block')
        .reduce((total: number, block: any) => {
          if (block.children) {
            return total + block.children.reduce((sum: number, child: any) => sum + (child.text?.length || 0), 0);
          }
          return total;
        }, 0);
      
      console.log(`📊 Longueur totale du texte: ${totalTextLength} caractères`);
      console.log(`⏱️ Temps de lecture estimé: ${Math.ceil(totalTextLength / 200)} minutes`);
      
    } else {
      console.log('❌ Article non trouvé ou body vide');
    }
    
    console.log('\n');

    // Test 2: Vérifier les métadonnées
    console.log('🏷️ Test 2: Métadonnées');
    if (article) {
      console.log(`📅 Date: ${article.publishedAt}`);
      console.log(`🌍 Pays: ${article.country}`);
      console.log(`✍️ Auteur: ${article.author || 'Non défini'}`);
      console.log(`📄 Extrait: ${article.excerpt?.substring(0, 100)}...`);
      console.log(`🏷️ Tags: ${article.tags?.join(', ') || 'Aucun'}`);
    }
    
    console.log('\n');

    // Test 3: Vérifier la structure SEO
    console.log('🔍 Test 3: Structure SEO');
    if (article) {
      console.log(`📝 Meta Title: ${article.metaTitle || 'Non défini'}`);
      console.log(`📄 Meta Description: ${article.metaDescription || 'Non défini'}`);
      console.log(`🖼️ OG Image: ${article.ogImage ? 'Présente' : 'Non définie'}`);
      console.log(`🔗 Slug: ${article.slug}`);
    }
    
    console.log('\n');

    // Test 4: Recommandations d'amélioration
    console.log('💡 Test 4: Recommandations d\'amélioration');
    if (article) {
      const recommendations = [];
      
      if (!article.metaTitle) {
        recommendations.push('❌ Ajouter un titre SEO personnalisé');
      }
      
      if (!article.metaDescription) {
        recommendations.push('❌ Ajouter une description SEO');
      }
      
      if (!article.ogImage) {
        recommendations.push('❌ Ajouter une image Open Graph');
      }
      
      if (!article.tags || article.tags.length === 0) {
        recommendations.push('❌ Ajouter des tags pour le référencement');
      }
      
      if (article.body.length < 5) {
        recommendations.push('⚠️ Le contenu semble court, considérer l\'ajout de plus de contenu');
      }
      
      if (recommendations.length === 0) {
        console.log('✅ Article bien optimisé !');
      } else {
        recommendations.forEach(rec => console.log(rec));
      }
    }
    
    console.log('\n🎉 Test terminé !');
    console.log('\n📱 URLs de test:');
    console.log(`   • Article: http://localhost:3001/br/blog/${slug}`);
    console.log(`   • Blog: http://localhost:3001/br/blog`);
    console.log(`   • Sanity Studio: http://localhost:3001/studio`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testBlogPresentation(); 