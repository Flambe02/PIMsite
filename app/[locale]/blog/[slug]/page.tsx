import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService } from '@/lib/blog/blogService';
import Link from 'next/link';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { marked } from 'marked';

// Can be imported from a shared config
const locales = ['br', 'fr', 'en', 'fr-ca', 'pt-pt', 'en-gb'];

// Articles de démonstration temporaires
const demoArticles = [
  {
    id: '1',
    title: 'Entenda seu holerite: Guia completo para funcionários CLT',
    slug: 'entenda-seu-holerite-guia-completo-funcionarios-clt',
    content: `# Entenda seu holerite: Guia completo para funcionários CLT

Receber o holerite parece simples, mas muitos trabalhadores têm dúvidas sobre seus detalhes. Neste artigo, explicamos os principais elementos que compõem sua folha de pagamento e como interpretá-los corretamente.

## O que é o holerite?

O holerite (ou contracheque) é o documento que detalha todos os valores recebidos e descontados do seu salário no mês. É um direito do trabalhador receber este documento mensalmente.

## Principais seções do holerite

### 1. Cabeçalho
- **Nome do funcionário**: Seu nome completo
- **Cargo**: Sua função na empresa
- **Período**: Mês/ano de referência
- **Empresa**: Nome da empresa contratante

### 2. Proventos (Vencimentos)
São os valores que você recebe:

- **Salário base**: Valor do seu salário contratado
- **Adicionais**: Horas extras, comissões, bonificações
- **Benefícios**: Vale refeição, vale transporte, plano de saúde

### 3. Descontos
Valores descontados do seu salário:

- **INSS**: Previdência Social (7,5% a 14%)
- **IRRF**: Imposto de Renda Retido na Fonte
- **Outros**: Plano de saúde, vale refeição, etc.

### 4. Totais
- **Base de cálculo**: Valor usado para calcular impostos
- **Líquido**: Valor que você recebe efetivamente

## Como calcular seu salário líquido

\`\`\`
Salário Líquido = Proventos - Descontos
\`\`\`

## Dicas importantes

1. **Guarde sempre**: Mantenha todos os seus holerites organizados
2. **Verifique os valores**: Confirme se os descontos estão corretos
3. **Consulte dúvidas**: Em caso de divergências, procure o RH
4. **Use ferramentas**: Aproveite o PIM para analisar seu holerite automaticamente

## Conclusão

Entender seu holerite é fundamental para ter controle sobre suas finanças. Com o PIM, você pode analisar automaticamente sua folha de pagamento e receber recomendações personalizadas para otimizar seus ganhos.

**Quer analisar seu holerite agora?** [Faça o upload da sua folha de pagamento](/br/scan-new-pim) e receba insights personalizados!`,
    excerpt: 'Receber o holerite parece simples, mas muitos trabalhadores têm dúvidas sobre seus detalhes. Neste artigo, explicamos os principais elementos que compõem sua folha de pagamento e como interpretá-los corretamente.',
    country: 'br',
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Vale refeição: Tudo que você precisa saber sobre este benefício',
    slug: 'vale-refeicao-tudo-que-voce-precisa-saber-beneficio',
    content: `# Vale refeição: Tudo que você precisa saber sobre este benefício

O vale refeição é um dos benefícios mais valorizados pelos trabalhadores brasileiros. Mas você sabe como ele funciona e quais são seus direitos? Vamos esclarecer todas as dúvidas.

## O que é o vale refeição?

O vale refeição é um benefício oferecido pelas empresas para ajudar os funcionários com as despesas de alimentação durante o trabalho. Pode ser fornecido em dinheiro ou através de cartões específicos.

## Tipos de vale refeição

### 1. Vale Refeição (VR)
- **Objetivo**: Cobrir o custo da refeição principal
- **Valor médio**: R$ 20 a R$ 30 por dia
- **Isenção de impostos**: Até R$ 26,55 por dia (2024)

### 2. Vale Alimentação (VA)
- **Objetivo**: Compras em supermercados e estabelecimentos
- **Valor médio**: R$ 15 a R$ 25 por dia
- **Isenção de impostos**: Até R$ 26,55 por dia (2024)

## Como funciona o desconto?

### Para o funcionário
- **VR**: Desconto de até 20% do valor
- **VA**: Desconto de até 20% do valor
- **Exemplo**: VR de R$ 30 = desconto de R$ 6

### Para a empresa
- **Deduções fiscais**: Redução do imposto de renda
- **Benefício social**: Melhora a qualidade de vida do funcionário

## Valor facial vs. valor recebido

### Valor facial
- **Definição**: Preço real da refeição no mercado
- **Média nacional**: R$ 51,61 por refeição (2024)
- **Variação regional**: R$ 45 a R$ 55 dependendo da região

### Valor recebido
- **Definição**: Valor que você recebe do vale
- **Cálculo**: Valor facial - desconto do funcionário

## Como otimizar seu vale refeição

1. **Compare valores**: Verifique se está recebendo um valor adequado
2. **Analise a rede**: Confirme se o cartão é aceito em bons restaurantes
3. **Negocie**: Solicite reajustes baseados no custo de vida
4. **Use ferramentas**: O PIM analisa automaticamente se seu vale está adequado

## Direitos e obrigações

### Direitos do funcionário
- Receber o benefício mensalmente
- Escolher onde usar (rede credenciada)
- Solicitar reajustes baseados na inflação

### Obrigações
- Usar apenas para alimentação
- Não transferir para terceiros
- Respeitar as regras da empresa

## Conclusão

O vale refeição é um benefício importante que pode representar uma economia significativa no seu orçamento. É fundamental entender como funciona e garantir que está recebendo um valor adequado ao mercado.

**Quer analisar se seu vale refeição está adequado?** [Faça o upload do seu holerite](/br/scan-new-pim) e receba uma análise detalhada!`,
    excerpt: 'O vale refeição é um dos benefícios mais valorizados pelos trabalhadores brasileiros. Mas você sabe como ele funciona e quais são seus direitos? Vamos esclarecer todas as dúvidas.',
    country: 'br',
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

interface BlogArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  // Chercher l'article dans les articles de démonstration
  const demoArticle = demoArticles.find(article => article.slug === slug && article.country === country);
  
  if (!demoArticle) {
    notFound();
  }

  const publishedDate = new Date(demoArticle.published_at).toISOString();
  const modifiedDate = new Date(demoArticle.updated_at).toISOString();

  return {
    title: `${demoArticle.title} | Blog PIM`,
    description: demoArticle.excerpt,
    keywords: 'folha de pagamento, holerite, benefícios, impostos, salário, carreira, CLT',
    authors: [{ name: 'PIM' }],
    openGraph: {
      title: demoArticle.title,
      description: demoArticle.excerpt,
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: ['PIM'],
      locale: locale,
      url: `https://pimsite.com/${country}/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: demoArticle.title,
      description: demoArticle.excerpt,
    },
    alternates: {
      canonical: `https://pimsite.com/${country}/blog/${slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { locale, slug } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  // Chercher l'article dans les articles de démonstration
  let article: any = demoArticles.find(article => article.slug === slug && article.country === country);
  let useDemoArticle = false;
  
  if (!article) {
    // Essayer de récupérer depuis la base de données
    try {
      const dbArticle = await blogService.getArticleBySlug(slug, country);
      if (dbArticle) {
        article = dbArticle;
      } else {
        notFound();
      }
    } catch (error) {
      console.log('Article non trouvé dans la base de données');
      notFound();
    }
  } else {
    useDemoArticle = true;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Convertir le contenu Markdown en HTML
  const contentHtml = marked(article.content);

  // JSON-LD Schema pour SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.published_at,
    "dateModified": article.updated_at,
    "author": {
      "@type": "Organization",
      "name": "PIM"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PIM",
      "url": "https://pimsite.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pimsite.com/${country}/blog/${slug}`
    },
    "url": `https://pimsite.com/${country}/blog/${slug}`
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href={`/${country}/blog`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao blog
            </Link>

            {useDemoArticle && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  🎯 Mode de démonstration : Article de test affiché
                </p>
              </div>
            )}

            {/* Article Meta */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={article.published_at}>
                {formatDate(article.published_at)}
              </time>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Article Excerpt */}
            <p className="text-xl text-gray-600 mb-6">
              {article.excerpt}
            </p>

            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  // Vous pouvez ajouter une notification de succès ici
                }
              }}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Quer analisar sua folha de pagamento?
              </h2>
              <p className="text-blue-100 mb-6">
                Faça o upload do seu holerite e receba insights personalizados sobre seus benefícios, 
                impostos e oportunidades de otimização.
              </p>
              <Link
                href={`/${country}/scan-new-pim`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Analisar meu holerite
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 