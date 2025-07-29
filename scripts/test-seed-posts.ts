import 'dotenv/config';
import { descontosFolhaPagamento } from '../seeds/posts/descontos-folha-pagamento';
import { inssImpactoSalario } from '../seeds/posts/inss-impacto-salario';
import { irrfImpostoRendaHolerite } from '../seeds/posts/irrf-imposto-renda-holerite';
import { beneficiosCorporativosHolerite } from '../seeds/posts/beneficios-corporativos-holerite';
import { cltPjEstagioFolhaPagamento } from '../seeds/posts/clt-pj-estagio-folha-pagamento';

console.log('🧪 Test des articles avant insertion');
console.log('===================================\n');

const articles = [
  descontosFolhaPagamento,
  inssImpactoSalario,
  irrfImpostoRendaHolerite,
  beneficiosCorporativosHolerite,
  cltPjEstagioFolhaPagamento
];

function testArticles() {
  console.log(`📊 Test de ${articles.length} articles...\n`);

  articles.forEach((article, index) => {
    console.log(`📄 Article ${index + 1}: ${article.title}`);
    console.log(`🔗 Slug: ${article.slug}`);
    console.log(`📝 Excerpt: ${article.excerpt.substring(0, 100)}...`);
    console.log(`🌍 Country: ${article.country}`);
    console.log(`🗣️ Language: ${article.language}`);
    console.log(`📅 Published: ${article.publishedAt}`);
    console.log(`🏷️ Tags: ${article.tags?.join(', ')}`);
    console.log(`📖 Body blocks: ${article.body.length}`);
    
    // Calculer la longueur du contenu
    const contentLength = article.body
      .filter(block => block._type === 'block')
      .reduce((total, block) => {
        if (block.children) {
          return total + block.children.reduce((sum, child) => sum + (child.text?.length || 0), 0);
        }
        return total;
      }, 0);
    
    console.log(`📊 Contenu: ${contentLength} caractères`);
    console.log(`⏱️ Temps de lecture estimé: ${Math.ceil(contentLength / 200)} minutes`);
    
    // Vérifications
    const checks = [];
    
    if (article.title && article.title.length > 0) checks.push('✅ Titre présent');
    else checks.push('❌ Titre manquant');
    
    if (article.slug && article.slug.length > 0) checks.push('✅ Slug présent');
    else checks.push('❌ Slug manquant');
    
    if (article.excerpt && article.excerpt.length <= 200) checks.push('✅ Excerpt valide');
    else checks.push('❌ Excerpt trop long ou manquant');
    
    if (article.body && article.body.length > 0) checks.push('✅ Contenu présent');
    else checks.push('❌ Contenu manquant');
    
    if (article.country === 'br') checks.push('✅ Pays BR');
    else checks.push('❌ Pays incorrect');
    
    if (article.language === 'pt-BR') checks.push('✅ Langue pt-BR');
    else checks.push('❌ Langue incorrecte');
    
    console.log(`🔍 Vérifications: ${checks.join(' | ')}`);
    
    console.log(''); // Ligne vide
  });

  console.log('===================================');
  console.log('📋 Résumé des tests:');
  console.log(`✅ Articles testés: ${articles.length}`);
  console.log(`📊 Total de contenu: ${articles.reduce((total, article) => {
    return total + article.body
      .filter(block => block._type === 'block')
      .reduce((sum, block) => {
        if (block.children) {
          return sum + block.children.reduce((childSum, child) => childSum + (child.text?.length || 0), 0);
        }
        return sum;
      }, 0);
  }, 0)} caractères`);
  
  console.log('\n🎯 Prêt pour l\'insertion !');
  console.log('💡 Exécutez: pnpm tsx scripts/seedPosts.ts');
}

testArticles(); 