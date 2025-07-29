import 'dotenv/config';
import { sanityClient, queries } from '@/lib/sanity/config';

console.log('🔍 Test du contenu de l\'article');
console.log('================================\n');

async function testArticleContent() {
  try {
    // Test 1: Récupérer l'article par slug
    console.log('📡 Test 1: Récupération de l\'article par slug');
    const slug = 'entenda-seu-holerite';
    const article = await sanityClient.fetch(queries.getArticleBySlug, { slug });
    
    if (article) {
      console.log('✅ Article trouvé !');
      console.log(`📝 Titre: ${article.title}`);
      console.log(`🔗 Slug: ${article.slug}`);
      console.log(`🌍 Pays: ${article.country}`);
      console.log(`📅 Date: ${article.publishedAt}`);
      console.log(`✍️ Auteur: ${article.author || 'Non défini'}`);
      console.log(`📄 Extrait: ${article.excerpt}`);
      
      // Test du body
      console.log('\n📖 Test du body:');
      console.log(`   - Body présent: ${article.body ? 'Oui' : 'Non'}`);
      console.log(`   - Type du body: ${typeof article.body}`);
      console.log(`   - Body est un array: ${Array.isArray(article.body)}`);
      
      if (article.body) {
        console.log(`   - Longueur du body: ${article.body.length}`);
        console.log(`   - Premier élément:`, JSON.stringify(article.body[0], null, 2));
        
        // Analyser la structure du body
        if (Array.isArray(article.body)) {
          console.log('\n🔍 Structure du body:');
          article.body.forEach((block: any, index: number) => {
            console.log(`   [${index}] Type: ${block._type}`);
            if (block._type === 'block') {
              console.log(`       Style: ${block.style}`);
              console.log(`       Enfants: ${block.children?.length || 0}`);
              if (block.children && block.children.length > 0) {
                console.log(`       Premier enfant: ${JSON.stringify(block.children[0], null, 2)}`);
              }
            }
          });
        }
      } else {
        console.log('❌ Body est vide ou null !');
      }
      
      // Test des tags
      console.log('\n🏷️ Tags:');
      console.log(`   - Tags présents: ${article.tags ? 'Oui' : 'Non'}`);
      if (article.tags) {
        console.log(`   - Tags: ${article.tags.join(', ')}`);
      }
      
    } else {
      console.log('❌ Article non trouvé !');
    }
    
    console.log('\n');

    // Test 2: Vérifier la requête GROQ
    console.log('🔧 Test 2: Vérification de la requête GROQ');
    console.log('Requête utilisée:');
    console.log(queries.getArticleBySlug);
    console.log('');

    // Test 3: Test direct avec une requête simple
    console.log('🧪 Test 3: Requête directe');
    const directQuery = `*[_type == "post" && slug.current == "entenda-seu-holerite"][0] {
      _id,
      title,
      "slug": slug.current,
      body,
      excerpt,
      publishedAt,
      country,
      "author": author->name
    }`;
    
    const directResult = await sanityClient.fetch(directQuery);
    console.log('Résultat direct:', JSON.stringify(directResult, null, 2));
    
    console.log('\n✅ Test terminé !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testArticleContent(); 