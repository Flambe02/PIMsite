/**
 * Script pour insérer les articles de blog dans Sanity
 * Nécessite que Sanity Studio soit configuré et que les variables d'environnement soient définies
 */

import 'dotenv/config';
import { sanityClient } from '@/lib/sanity/config';

const articles = [
  {
    title: 'Entenda seu holerite: Guia completo para interpretar sua folha de pagamento',
    slug: 'entenda-seu-holerite',
    excerpt: 'Aprenda a decifrar todos os campos do seu holerite, desde salário bruto até benefícios e descontos. Um guia prático para entender exatamente o que você está recebendo.',
    content: [
      {
        _type: 'block',
        style: 'h1',
        children: [
          {
            _type: 'span',
            text: 'Entenda seu holerite: Guia completo para interpretar sua folha de pagamento'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'O holerite é um documento fundamental que detalha todos os componentes do seu salário. Entender cada campo é essencial para garantir que você está recebendo o que tem direito e identificar possíveis erros.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Principais seções do holerite'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '1. Cabeçalho: Dados do funcionário e da empresa\n2. Vencimentos: Salário base e adicionais\n3. Descontos: Impostos e benefícios descontados\n4. Total: Valor líquido a receber'
          }
        ]
      }
    ],
    country: 'br',
    publishedAt: '2024-01-15T10:00:00Z',
    metaTitle: 'Como entender seu holerite - Guia completo da folha de pagamento',
    metaDescription: 'Aprenda a interpretar seu holerite com nosso guia completo. Entenda salário bruto, líquido, impostos e benefícios de forma simples e prática.',
    tags: ['holerite', 'folha de pagamento', 'salário', 'impostos', 'benefícios']
  },
  {
    title: 'Benefícios Flexíveis: Como maximizar seu pacote de remuneração',
    slug: 'beneficios-flexiveis',
    excerpt: 'Descubra como os benefícios flexíveis podem aumentar seu poder de compra e melhorar sua qualidade de vida. Estratégias para otimizar seu pacote de remuneração.',
    content: [
      {
        _type: 'block',
        style: 'h1',
        children: [
          {
            _type: 'span',
            text: 'Benefícios Flexíveis: Como maximizar seu pacote de remuneração'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Os benefícios flexíveis permitem que você escolha como usar parte da sua remuneração, otimizando seu poder de compra e atendendo suas necessidades específicas.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Tipos de benefícios flexíveis'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '• Vale-refeição e vale-alimentação\n• Plano de saúde e odontológico\n• Vale-transporte\n• Gympass e benefícios de bem-estar\n• Educação e desenvolvimento profissional'
          }
        ]
      }
    ],
    country: 'br',
    publishedAt: '2024-01-20T10:00:00Z',
    metaTitle: 'Benefícios Flexíveis - Como otimizar seu pacote de remuneração',
    metaDescription: 'Aprenda a maximizar seus benefícios flexíveis e aumentar seu poder de compra. Estratégias práticas para otimizar seu pacote de remuneração.',
    tags: ['benefícios flexíveis', 'remuneração', 'vale-refeição', 'plano de saúde', 'otimização']
  },
  {
    title: 'CLT ou PJ? Como escolher o melhor regime para sua carreira',
    slug: 'clt-ou-pj',
    excerpt: 'Compare os regimes CLT e PJ, analisando vantagens, desvantagens e impactos financeiros. Descubra qual é a melhor opção para seu momento profissional.',
    content: [
      {
        _type: 'block',
        style: 'h1',
        children: [
          {
            _type: 'span',
            text: 'CLT ou PJ? Como escolher o melhor regime para sua carreira'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'A escolha entre CLT e PJ é uma das decisões mais importantes da sua carreira. Cada regime tem suas vantagens e desvantagens, e a escolha certa depende do seu perfil e objetivos.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Principais diferenças'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'CLT: Estabilidade, benefícios obrigatórios, férias remuneradas\nPJ: Flexibilidade, potencial de ganhos maiores, autonomia'
          }
        ]
      }
    ],
    country: 'br',
    publishedAt: '2024-01-25T10:00:00Z',
    metaTitle: 'CLT vs PJ - Como escolher o melhor regime para sua carreira',
    metaDescription: 'Compare CLT e PJ: vantagens, desvantagens e impactos financeiros. Descubra qual regime é melhor para seu momento profissional.',
    tags: ['CLT', 'PJ', 'regime trabalhista', 'carreira', 'empreendedorismo']
  },
  {
    title: 'Imposto de Renda 2025: Prepare-se para a declaração',
    slug: 'imposto-de-renda-2025',
    excerpt: 'Tudo que você precisa saber sobre a declaração do Imposto de Renda 2025. Prazos, deduções, restituições e dicas para otimizar sua declaração.',
    content: [
      {
        _type: 'block',
        style: 'h1',
        children: [
          {
            _type: 'span',
            text: 'Imposto de Renda 2025: Prepare-se para a declaração'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'A declaração do Imposto de Renda é uma obrigação anual que pode gerar restituições ou pagamentos adicionais. Conhecer as regras e deduções disponíveis é fundamental.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Principais deduções'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '• Gastos com saúde\n• Educação\n• Previdência privada\n• Doações\n• Dependentes'
          }
        ]
      }
    ],
    country: 'br',
    publishedAt: '2024-01-30T10:00:00Z',
    metaTitle: 'Imposto de Renda 2025 - Guia completo da declaração',
    metaDescription: 'Prepare-se para a declaração do IR 2025. Conheça prazos, deduções, restituições e dicas para otimizar sua declaração.',
    tags: ['imposto de renda', 'declaração', 'restituição', 'deduções', 'IR 2025']
  },
  {
    title: 'Tendências de RH 2025: O futuro do trabalho e dos benefícios',
    slug: 'tendencias-rh-2025',
    excerpt: 'Descubra as principais tendências de Recursos Humanos para 2025. Trabalho híbrido, benefícios digitais, bem-estar e novas formas de remuneração.',
    content: [
      {
        _type: 'block',
        style: 'h1',
        children: [
          {
            _type: 'span',
            text: 'Tendências de RH 2025: O futuro do trabalho e dos benefícios'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'O mercado de trabalho está em constante evolução. Conhecer as tendências de RH para 2025 pode ajudar você a se preparar para as mudanças e aproveitar as novas oportunidades.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Principais tendências'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '• Trabalho híbrido e remoto\n• Benefícios digitais e flexíveis\n• Foco em bem-estar mental\n• Remuneração por resultados\n• Desenvolvimento contínuo'
          }
        ]
      }
    ],
    country: 'br',
    publishedAt: '2024-02-05T10:00:00Z',
    metaTitle: 'Tendências de RH 2025 - O futuro do trabalho e benefícios',
    metaDescription: 'Descubra as principais tendências de RH para 2025: trabalho híbrido, benefícios digitais, bem-estar e novas formas de remuneração.',
    tags: ['tendências RH', 'futuro do trabalho', 'benefícios digitais', 'trabalho híbrido', 'bem-estar']
  }
];

async function insertArticles() {
  console.log('🚀 Début de l\'insertion des articles dans Sanity...');
  console.log('=' .repeat(60));

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        console.log(`\n📝 Insertion de l'article: ${article.title}`);
        
        // Vérifier si l'article existe déjà
        const existingArticle = await sanityClient.fetch(
          `*[_type == "article" && slug.current == $slug][0]`,
          { slug: article.slug }
        );

        if (existingArticle) {
          console.log(`⚠️ Article existant trouvé, mise à jour...`);
          
          const result = await sanityClient
            .patch(existingArticle._id)
            .set({
              title: article.title,
              excerpt: article.excerpt,
              content: article.content,
              country: article.country,
              publishedAt: article.publishedAt,
              metaTitle: article.metaTitle,
              metaDescription: article.metaDescription,
              tags: article.tags
            })
            .commit();
          
          console.log(`✅ Article mis à jour: ${result.title}`);
        } else {
          console.log(`➕ Création d'un nouvel article...`);
          
          const result = await sanityClient.create({
            _type: 'article',
            ...article,
            slug: {
              _type: 'slug',
              current: article.slug
            }
          });
          
          console.log(`✅ Article créé: ${result.title}`);
        }
        
        successCount++;
        
      } catch (error) {
        console.error(`❌ Erreur lors de l'insertion de "${article.title}":`, error);
        errorCount++;
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log(`📊 Résumé:`);
    console.log(`✅ Articles insérés/mis à jour: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 Tous les articles ont été insérés avec succès!');
    } else {
      console.log('\n⚠️ Certains articles n\'ont pas pu être insérés. Vérifiez les erreurs ci-dessus.');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécution principale
async function main() {
  console.log('🚀 Script d\'insertion des articles Sanity');
  console.log('=' .repeat(60));
  
  // Vérifier les variables d'environnement
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID non défini');
    console.log('💡 Veuillez définir vos variables d\'environnement Sanity');
    process.exit(1);
  }
  
  await insertArticles();
}

// Exécuter si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

export { insertArticles, articles }; 