#!/usr/bin/env tsx

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🚀 Insertion des Articles de Blog');
console.log('==================================\n');

// Configuration Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-07-29',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Article 1: Descontos na folha de pagamento
const article1 = {
  _type: 'post',
  title: 'Descontos na folha de pagamento: o que são e como verificar se estão corretos?',
  slug: {
    _type: 'slug',
    current: 'descontos-folha-pagamento-verificar-corretos'
  },
  excerpt: 'Entenda os principais descontos que aparecem na sua folha de pagamento e aprenda a verificar se estão sendo calculados corretamente.',
  country: 'BR',
  language: 'pt-BR',
  publishedAt: new Date().toISOString(),
  metaTitle: 'Descontos na Folha de Pagamento: Como Verificar se Estão Corretos',
  metaDescription: 'Guia completo sobre os descontos na folha de pagamento brasileira. Aprenda a identificar e verificar INSS, IRRF e outros descontos.',
  tags: ['descontos', 'folha de pagamento', 'INSS', 'IRRF', 'salário'],
  body: [
    {
      _type: 'block',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'O que são os descontos na folha de pagamento?'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Os descontos na folha de pagamento são valores retidos do seu salário bruto para pagar impostos, contribuições sociais e outros benefícios obrigatórios. Os principais descontos incluem:'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• INSS (Instituto Nacional do Seguro Social)'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• IRRF (Imposto de Renda Retido na Fonte)'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Vale-transporte (se solicitado)'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Vale-refeição (se solicitado)'
        }
      ]
    }
  ]
};

// Article 2: INSS
const article2 = {
  _type: 'post',
  title: 'O que é INSS e como ele impacta seu salário líquido?',
  slug: {
    _type: 'slug',
    current: 'inss-impacto-salario-liquido'
  },
  excerpt: 'Descubra como o INSS funciona, suas alíquotas e como calcular o impacto no seu salário líquido.',
  country: 'BR',
  language: 'pt-BR',
  publishedAt: new Date().toISOString(),
  metaTitle: 'INSS: Como Funciona e Impacta seu Salário Líquido',
  metaDescription: 'Entenda o INSS, suas alíquotas e como calcular o impacto no seu salário líquido. Guia completo sobre a contribuição previdenciária.',
  tags: ['INSS', 'previdência social', 'salário líquido', 'contribuições'],
  body: [
    {
      _type: 'block',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'O que é o INSS?'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'O INSS (Instituto Nacional do Seguro Social) é a autarquia responsável pela administração da Previdência Social no Brasil. É através dele que os trabalhadores contribuem para garantir benefícios como:'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Aposentadoria'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Auxílio-doença'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Salário-maternidade'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Pensão por morte'
        }
      ]
    }
  ]
};

// Article 3: IRRF
const article3 = {
  _type: 'post',
  title: 'Entenda o IRRF: por que o imposto de renda vem descontado no holerite?',
  slug: {
    _type: 'slug',
    current: 'irrf-imposto-renda-descontado-holerite'
  },
  excerpt: 'Saiba como o IRRF é calculado, suas faixas de tributação e por que aparece descontado na sua folha de pagamento.',
  country: 'BR',
  language: 'pt-BR',
  publishedAt: new Date().toISOString(),
  metaTitle: 'IRRF: Como é Calculado e Por que Aparece no Holerite',
  metaDescription: 'Entenda o IRRF, suas faixas de tributação e como é calculado o desconto no holerite. Guia completo sobre o imposto de renda.',
  tags: ['IRRF', 'imposto de renda', 'holerite', 'tributação'],
  body: [
    {
      _type: 'block',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'O que é o IRRF?'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'O IRRF (Imposto de Renda Retido na Fonte) é o desconto do Imposto de Renda Pessoa Física que é feito diretamente na folha de pagamento. Este desconto é obrigatório para trabalhadores que recebem acima de um determinado valor.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [
        {
          _type: 'span',
          text: 'Como é calculado?'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'O cálculo do IRRF considera:'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Salário bruto'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Deduções permitidas (INSS, dependentes, etc.)'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Faixas de tributação progressivas'
        }
      ]
    }
  ]
};

// Article 4: Benefícios corporativos
const article4 = {
  _type: 'post',
  title: 'Benefícios corporativos: quais são e como valorizá-los no seu holerite?',
  slug: {
    _type: 'slug',
    current: 'beneficios-corporativos-valorizar-holerite'
  },
  excerpt: 'Descubra os principais benefícios corporativos e como eles podem aumentar significativamente o valor total da sua remuneração.',
  country: 'BR',
  language: 'pt-BR',
  publishedAt: new Date().toISOString(),
  metaTitle: 'Benefícios Corporativos: Como Valorizar no seu Holerite',
  metaDescription: 'Conheça os principais benefícios corporativos e como eles aumentam o valor total da sua remuneração. Guia completo sobre benefícios.',
  tags: ['benefícios', 'corporativo', 'remuneração', 'vale-refeição', 'plano de saúde'],
  body: [
    {
      _type: 'block',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'O que são benefícios corporativos?'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Benefícios corporativos são vantagens oferecidas pelas empresas além do salário base. Eles podem representar uma parte significativa da remuneração total e incluem:'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Vale-refeição'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Vale-transporte'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Plano de saúde'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Plano odontológico'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Participação nos lucros'
        }
      ]
    }
  ]
};

// Article 5: CLT, PJ, Estágio
const article5 = {
  _type: 'post',
  title: 'CLT, PJ ou estágio: como a estrutura da folha muda conforme o tipo de contrato?',
  slug: {
    _type: 'slug',
    current: 'clt-pj-estagio-estrutura-folha-pagamento'
  },
  excerpt: 'Entenda as diferenças na estrutura da folha de pagamento entre CLT, PJ e estágio, e como isso afeta seus direitos e benefícios.',
  country: 'BR',
  language: 'pt-BR',
  publishedAt: new Date().toISOString(),
  metaTitle: 'CLT, PJ ou Estágio: Diferenças na Folha de Pagamento',
  metaDescription: 'Compare a estrutura da folha de pagamento entre CLT, PJ e estágio. Entenda os direitos, benefícios e diferenças de cada modalidade.',
  tags: ['CLT', 'PJ', 'estágio', 'contrato', 'direitos trabalhistas'],
  body: [
    {
      _type: 'block',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'Principais diferenças entre os tipos de contrato'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Cada tipo de contrato tem uma estrutura diferente na folha de pagamento, afetando direitos, benefícios e obrigações:'
        }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [
        {
          _type: 'span',
          text: 'CLT (Consolidação das Leis do Trabalho)'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Salário base + benefícios obrigatórios'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• FGTS obrigatório'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Férias e 13º salário'
        }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [
        {
          _type: 'span',
          text: 'PJ (Pessoa Jurídica)'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Valor bruto sem descontos obrigatórios'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Responsabilidade própria com impostos'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: '• Sem benefícios obrigatórios'
        }
      ]
    }
  ]
};

const articles = [article1, article2, article3, article4, article5];

async function insertArticles() {
  try {
    console.log(`📝 Insertion de ${articles.length} articles...\n`);

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      console.log(`📄 Article ${i + 1}: ${article.title}`);
      
      try {
        const result = await client.create(article);
        console.log(`✅ Article créé: ${result.title}`);
        console.log(`   ID: ${result._id}`);
        console.log(`   Slug: ${result.slug.current}`);
      } catch (error: any) {
        console.log(`❌ Erreur: ${error.message}`);
      }
      
      console.log(''); // Ligne vide
    }

    console.log('🎉 Insertion terminée !');
    console.log('');
    console.log('🔗 URLs de test:');
    console.log('   Blog: http://localhost:3001/br/blog');
    console.log('   Articles individuels:');
    articles.forEach(article => {
      console.log(`   - ${article.title}: http://localhost:3001/br/blog/${article.slug.current}`);
    });

  } catch (error: any) {
    console.log('❌ Erreur générale:', error.message);
  }
}

insertArticles(); 