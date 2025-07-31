import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

async function testAllCountries() {
  const countries = ['br', 'fr', 'en'];
  
  console.log('🌍 Test du blog sur tous les pays');
  console.log('=====================================\n');

  for (const country of countries) {
    try {
      const url = `http://localhost:3000/${country}/blog`;
      console.log(`📋 Test: Blog ${country.toUpperCase()}`);
      console.log(`🔗 URL: ${url}`);
      
      const response = await fetch(url);
      const html = await response.text();
      
      if (response.ok) {
        // Vérifier la présence d'articles
        const hasArticles = html.includes('Blog PIM') && html.includes('article');
        
        if (hasArticles) {
          console.log('   ✅ Page accessible et articles présents');
          
          // Compter les articles (approximatif)
          const articleCount = (html.match(/article/g) || []).length;
          console.log(`   📊 Nombre d'articles détectés: ${articleCount}`);
          
        } else {
          console.log('   ⚠️ Page accessible mais pas d\'articles détectés');
        }
      } else {
        console.log(`   ❌ Erreur HTTP: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎉 Test terminé !');
}

testAllCountries(); 