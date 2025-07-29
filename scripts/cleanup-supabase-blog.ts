/**
 * Script de nettoyage complet du module blog Supabase
 * Supprime la table blog_articles et toutes les références
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupSupabaseBlog() {
  console.log('🧹 Nettoyage complet du module blog Supabase...');
  console.log('=' .repeat(60));

  try {
    // 1. Vérifier si la table existe
    console.log('\n📋 Étape 1: Vérification de la table blog_articles');
    
    const { data: testData, error: testError } = await supabase
      .from('blog_articles')
      .select('id')
      .limit(1);

    if (testError && testError.message.includes('relation "blog_articles" does not exist')) {
      console.log('✅ Table blog_articles n\'existe pas - déjà supprimée');
    } else if (testError) {
      console.error('❌ Erreur lors de la vérification:', testError);
      return;
    } else {
      console.log('⚠️ Table blog_articles existe - suppression...');
      
      // 2. Supprimer tous les articles
      console.log('\n🗑️ Étape 2: Suppression de tous les articles');
      
      const { error: deleteError } = await supabase
        .from('blog_articles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Supprimer tous les articles

      if (deleteError) {
        console.error('❌ Erreur lors de la suppression des articles:', deleteError);
      } else {
        console.log('✅ Tous les articles supprimés');
      }

      // 3. Supprimer la table
      console.log('\n🗑️ Étape 3: Suppression de la table blog_articles');
      
      const dropTableSQL = `
        DROP TABLE IF EXISTS blog_articles CASCADE;
        DROP INDEX IF EXISTS idx_blog_articles_country;
        DROP INDEX IF EXISTS idx_blog_articles_published_at;
        DROP INDEX IF EXISTS idx_blog_articles_slug;
      `;

      const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropTableSQL });
      
      if (dropError) {
        console.error('❌ Erreur lors de la suppression de la table:', dropError);
        console.log('💡 Veuillez supprimer manuellement la table blog_articles dans Supabase');
      } else {
        console.log('✅ Table blog_articles supprimée');
      }
    }

    // 4. Vérifier les politiques RLS
    console.log('\n🔒 Étape 4: Nettoyage des politiques RLS');
    
    const cleanupPoliciesSQL = `
      DROP POLICY IF EXISTS "Public read access" ON blog_articles;
      DROP POLICY IF EXISTS "Admin write access" ON blog_articles;
    `;

    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: cleanupPoliciesSQL });
    
    if (policiesError) {
      console.log('⚠️ Impossible de supprimer les politiques (table déjà supprimée)');
    } else {
      console.log('✅ Politiques RLS supprimées');
    }

    console.log('\n✅ Nettoyage Supabase terminé!');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécution principale
async function main() {
  console.log('🚀 Démarrage du nettoyage du module blog Supabase');
  console.log('=' .repeat(60));
  
  await cleanupSupabaseBlog();
  
  console.log('\n✨ Nettoyage terminé!');
  console.log('\n📝 Prochaines étapes:');
  console.log('1. Supprimer les fichiers de code blog Supabase');
  console.log('2. Installer Sanity.io');
  console.log('3. Configurer le nouveau système de blog');
}

// Exécuter si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

export { cleanupSupabaseBlog }; 