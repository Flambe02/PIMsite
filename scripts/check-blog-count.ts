import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

async function checkBlogArticles() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variables d\'environnement Supabase manquantes');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer tous les articles
    const { data: allArticles, error: allError } = await supabase
      .from('blog_articles')
      .select('*');

    if (allError) {
      console.error('❌ Erreur lors de la récupération de tous les articles:', allError);
      return;
    }

    console.log(`📊 Total d'articles dans la base: ${allArticles?.length || 0}`);

    // Récupérer les articles par pays
    const countries = ['br', 'fr', 'en'];
    
    for (const country of countries) {
      const { data: articles, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('country', country);

      if (error) {
        console.error(`❌ Erreur pour ${country}:`, error);
      } else {
        console.log(`📰 Articles pour ${country.toUpperCase()}: ${articles?.length || 0}`);
        if (articles && articles.length > 0) {
          articles.forEach(article => {
            console.log(`  - ${article.title} (${article.slug})`);
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

checkBlogArticles(); 