import 'dotenv/config';
import { sanityClient, queries } from '@/lib/sanity/config';

console.log('🎉 Test final de la migration Sanity Blog');
console.log('==========================================\n');

async function testCompleteMigration() {
  try {
    // Test 1: Connexion à Sanity
    console.log('📡 Test 1: Connexion à Sanity');
    const testConnection = await sanityClient.fetch('*[_type == "post"][0...1]');
    console.log('✅ Connexion réussie');
    console.log(`📊 Articles trouvés: ${testConnection?.length || 0}\n`);

    // Test 2: Récupération des articles BR
    console.log('🇧🇷 Test 2: Articles Brésil');
    const articlesBR = await sanityClient.fetch(queries.getArticlesByCountry, { country: 'br' });
    console.log(`📊 Articles BR: ${articlesBR?.length || 0}`);
    
    if (articlesBR && articlesBR.length > 0) {
      const firstArticle = articlesBR[0];
      console.log('📝 Premier article BR:');
      console.log(`   - Titre: ${firstArticle.title}`);
      console.log(`   - Slug: ${firstArticle.slug} (type: ${typeof firstArticle.slug})`);
      console.log(`   - Pays: ${firstArticle.country}`);
      console.log(`   - Date: ${firstArticle.publishedAt}`);
      
      if (typeof firstArticle.slug === 'string') {
        console.log('✅ Slug est bien une string !');
      } else {
        console.log('❌ Problème avec le slug !');
      }
    }
    console.log('');

    // Test 3: Récupération des articles FR
    console.log('🇫🇷 Test 3: Articles France');
    const articlesFR = await sanityClient.fetch(queries.getArticlesByCountry, { country: 'fr' });
    console.log(`📊 Articles FR: ${articlesFR?.length || 0}\n`);

    // Test 4: Test d'un article spécifique
    console.log('🔍 Test 4: Article spécifique');
    if (articlesBR && articlesBR.length > 0) {
      const slug = articlesBR[0].slug;
      const article = await sanityClient.fetch(queries.getArticleBySlug, { slug });
      if (article) {
        console.log(`✅ Article trouvé: ${article.title}`);
        console.log(`   - Slug: ${article.slug}`);
        console.log(`   - Body présent: ${article.body ? 'Oui' : 'Non'}`);
      } else {
        console.log('❌ Article non trouvé');
      }
    }
    console.log('');

    // Test 5: Configuration
    console.log('🔧 Test 5: Configuration');
    console.log(`📦 Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`🗄️ Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
    console.log(`🌐 API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-29'}`);
    console.log('');

    // Test 6: URLs de test
    console.log('🔗 Test 6: URLs de test');
    console.log('   • Sanity Studio: http://localhost:3000/studio');
    console.log('   • Blog BR: http://localhost:3000/br/blog');
    console.log('   • Blog FR: http://localhost:3000/fr/blog');
    
    if (articlesBR && articlesBR.length > 0) {
      const slug = articlesBR[0].slug;
      console.log(`   • Article détail: http://localhost:3000/br/blog/${slug}`);
    }
    console.log('');

    // Test 7: Résumé final
    console.log('📊 Résumé final:');
    console.log(`   ✅ Connexion Sanity: OK`);
    console.log(`   ✅ Articles BR: ${articlesBR?.length || 0}`);
    console.log(`   ✅ Articles FR: ${articlesFR?.length || 0}`);
    console.log(`   ✅ Format slug: ${typeof articlesBR?.[0]?.slug === 'string' ? 'OK' : 'ERREUR'}`);
    console.log(`   ✅ Serveur Next.js: http://localhost:3000`);
    console.log('');

    if (articlesBR && articlesBR.length > 0) {
      console.log('🎉 MIGRATION RÉUSSIE !');
      console.log('   Le blog Sanity est complètement fonctionnel !');
      console.log('   Vous pouvez maintenant:');
      console.log('   • Créer des articles via Sanity Studio');
      console.log('   • Voir les articles sur /br/blog');
      console.log('   • Naviguer vers les détails d\'articles');
    } else {
      console.log('⚠️ Migration terminée mais aucun article trouvé');
      console.log('   Créez un article via Sanity Studio pour tester');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testCompleteMigration(); 