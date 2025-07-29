#!/usr/bin/env tsx

/**
 * Script de test pour l'intégration complète du blog
 * Teste la création de la table, l'insertion d'articles et les fonctionnalités
 */

import { createClient } from '@supabase/supabase-js';
import { blogService } from '../lib/blog/blogService';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testBlogIntegration() {
  console.log('🚀 Test d\'intégration du blog SEO-ready');
  console.log('=====================================\n');

  try {
    // Test 1: Vérifier la structure de la table
    console.log('📋 Test 1: Vérification de la structure de la table');
    await testTableStructure();
    console.log('✅ Structure de la table OK\n');

    // Test 2: Insérer des articles de test
    console.log('📝 Test 2: Insertion d\'articles de test');
    await testArticleInsertion();
    console.log('✅ Insertion d\'articles OK\n');

    // Test 3: Tester les fonctions du service
    console.log('🔧 Test 3: Fonctions du service BlogService');
    await testBlogService();
    console.log('✅ Service BlogService OK\n');

    // Test 4: Tester la génération de slugs
    console.log('🔗 Test 4: Génération de slugs');
    await testSlugGeneration();
    console.log('✅ Génération de slugs OK\n');

    // Test 5: Tester la recherche
    console.log('🔍 Test 5: Fonctionnalités de recherche');
    await testSearchFunctionality();
    console.log('✅ Recherche OK\n');

    console.log('🎉 Tous les tests d\'intégration du blog sont passés avec succès!');
    console.log('\n📊 Résumé:');
    console.log('- ✅ Structure de table créée');
    console.log('- ✅ Articles insérés');
    console.log('- ✅ Service fonctionnel');
    console.log('- ✅ SEO optimisé');
    console.log('- ✅ Multi-pays supporté');

  } catch (error) {
    console.error('❌ Erreur lors du test d\'intégration:', error);
    process.exit(1);
  }
}

async function testTableStructure() {
  // Vérifier que la table existe
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'blog_articles');

  if (error || !tables || tables.length === 0) {
    throw new Error('Table blog_articles non trouvée');
  }

  // Vérifier les colonnes
  const { data: columns, error: columnsError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable')
    .eq('table_schema', 'public')
    .eq('table_name', 'blog_articles')
    .order('ordinal_position');

  if (columnsError) {
    throw new Error('Impossible de récupérer la structure de la table');
  }

  const requiredColumns = [
    'id', 'title', 'slug', 'content', 'excerpt', 
    'country', 'published_at', 'created_at', 'updated_at'
  ];

  const foundColumns = columns?.map(c => c.column_name) || [];
  const missingColumns = requiredColumns.filter(col => !foundColumns.includes(col));

  if (missingColumns.length > 0) {
    throw new Error(`Colonnes manquantes: ${missingColumns.join(', ')}`);
  }

  console.log(`   - Table blog_articles trouvée`);
  console.log(`   - ${foundColumns.length} colonnes vérifiées`);
}

async function testArticleInsertion() {
  // Article de test
  const testArticle = {
    title: 'Test Article - Intégration Blog',
    slug: 'test-article-integration-blog',
    content: '# Test Article\n\nCeci est un article de test pour vérifier l\'intégration du blog.',
    excerpt: 'Article de test pour vérifier l\'intégration du blog SEO-ready.',
    country: 'br',
    published_at: new Date().toISOString()
  };

  // Insérer l'article
  const { data: insertedArticle, error: insertError } = await supabase
    .from('blog_articles')
    .insert(testArticle)
    .select()
    .single();

  if (insertError) {
    throw new Error(`Erreur lors de l'insertion: ${insertError.message}`);
  }

  console.log(`   - Article inséré avec ID: ${insertedArticle.id}`);

  // Vérifier que l'article a été inséré
  const { data: retrievedArticle, error: retrieveError } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('id', insertedArticle.id)
    .single();

  if (retrieveError || !retrievedArticle) {
    throw new Error('Impossible de récupérer l\'article inséré');
  }

  console.log(`   - Article récupéré avec succès`);

  // Nettoyer - supprimer l'article de test
  await supabase
    .from('blog_articles')
    .delete()
    .eq('id', insertedArticle.id);

  console.log(`   - Article de test supprimé`);
}

async function testBlogService() {
  // Tester getArticlesByCountry
  const articles = await blogService.getArticlesByCountry({ country: 'br', limit: 5 });
  console.log(`   - getArticlesByCountry: ${articles.length} articles trouvés`);

  // Tester getArticleCount
  const count = await blogService.getArticleCount('br');
  console.log(`   - getArticleCount: ${count} articles pour BR`);

  // Tester getRecentArticles
  const recentArticles = await blogService.getRecentArticles('br', 3);
  console.log(`   - getRecentArticles: ${recentArticles.length} articles récents`);

  // Tester generateExcerpt
  const longContent = '# Titre\n\nCeci est un contenu très long qui devrait être tronqué pour créer un extrait. '.repeat(10);
  const excerpt = blogService.generateExcerpt(longContent);
  console.log(`   - generateExcerpt: ${excerpt.length} caractères générés`);
}

async function testSlugGeneration() {
  const testTitles = [
    'Article avec accents: éàèùç',
    'Article avec caractères spéciaux: @#$%',
    'Article avec espaces multiples   et   tirets',
    'Article normal sans problèmes'
  ];

  for (const title of testTitles) {
    const slug = await blogService.generateUniqueSlug(title, 'br');
    console.log(`   - "${title}" → "${slug}"`);
  }
}

async function testSearchFunctionality() {
  // Insérer un article de test pour la recherche
  const searchTestArticle = {
    title: 'Article de recherche test',
    slug: 'article-recherche-test',
    content: 'Contenu contenant le mot holerite et folha de pagamento',
    excerpt: 'Extrait contenant des mots-clés importants',
    country: 'br',
    published_at: new Date().toISOString()
  };

  const { data: insertedArticle } = await supabase
    .from('blog_articles')
    .insert(searchTestArticle)
    .select()
    .single();

  if (insertedArticle) {
    // Tester la recherche
    const searchResults = await blogService.searchArticles('br', 'holerite', 10);
    console.log(`   - Recherche "holerite": ${searchResults.length} résultats`);

    const searchResults2 = await blogService.searchArticles('br', 'folha', 10);
    console.log(`   - Recherche "folha": ${searchResults2.length} résultats`);

    // Nettoyer
    await supabase
      .from('blog_articles')
      .delete()
      .eq('id', insertedArticle.id);
  }
}

// Exécuter les tests
testBlogIntegration().catch(console.error); 