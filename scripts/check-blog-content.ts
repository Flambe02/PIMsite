#!/usr/bin/env tsx

/**
 * Script pour vérifier le contenu HTML de la page du blog
 */

import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

async function checkBlogContent() {
  console.log('🔍 Vérification du contenu de la page du blog...');

  try {
    const response = await fetch('http://localhost:3000/br/blog');
    
    if (!response.ok) {
      console.error(`❌ Erreur HTTP: ${response.status}`);
      return;
    }

    const html = await response.text();
    
    // Vérifications
    console.log('\n📋 Vérifications du contenu HTML:');
    
    // 1. Vérifier si la page contient le titre du blog
    if (html.includes('Blog PIM')) {
      console.log('✅ Titre "Blog PIM" trouvé');
    } else {
      console.log('❌ Titre "Blog PIM" non trouvé');
    }

    // 2. Vérifier si les articles sont présents
    const articles = [
      'Entenda seu holerite: Guia completo para funcionários CLT',
      'Vale refeição: Tudo que você precisa saber sobre este benefício'
    ];

    articles.forEach(article => {
      if (html.includes(article)) {
        console.log(`✅ Article trouvé: "${article}"`);
      } else {
        console.log(`❌ Article non trouvé: "${article}"`);
      }
    });

    // 3. Vérifier s'il y a des liens vers les articles
    if (html.includes('entenda-seu-holerite-guia-completo-funcionarios-clt')) {
      console.log('✅ Lien vers l\'article 1 trouvé');
    } else {
      console.log('❌ Lien vers l\'article 1 non trouvé');
    }

    if (html.includes('vale-refeicao-tudo-que-voce-precisa-saber-beneficio')) {
      console.log('✅ Lien vers l\'article 2 trouvé');
    } else {
      console.log('❌ Lien vers l\'article 2 non trouvé');
    }

    // 4. Vérifier s'il y a des extraits d'articles
    if (html.includes('Receber o holerite parece simples')) {
      console.log('✅ Extrait de l\'article 1 trouvé');
    } else {
      console.log('❌ Extrait de l\'article 1 non trouvé');
    }

    if (html.includes('O vale refeição é um dos benefícios')) {
      console.log('✅ Extrait de l\'article 2 trouvé');
    } else {
      console.log('❌ Extrait de l\'article 2 non trouvé');
    }

    // 5. Vérifier s'il y a un message "aucun article trouvé"
    if (html.includes('Nenhum artigo encontrado') || html.includes('aucun article trouvé')) {
      console.log('⚠️ Message "aucun article trouvé" détecté');
    } else {
      console.log('✅ Pas de message "aucun article trouvé"');
    }

    console.log('\n🎉 Vérification terminée!');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  checkBlogContent();
} 