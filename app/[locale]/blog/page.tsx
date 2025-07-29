import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService } from '@/lib/blog/blogService';
import { useCountry } from '@/hooks/useCountry';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

// Can be imported from a shared config
const locales = ['br', 'fr', 'en', 'fr-ca', 'pt-pt', 'en-gb'];

// Articles de démonstration temporaires
const demoArticles = [
  {
    id: '1',
    title: 'Entenda seu holerite: Guia completo para funcionários CLT',
    slug: 'entenda-seu-holerite-guia-completo-funcionarios-clt',
    excerpt: 'Receber o holerite parece simples, mas muitos trabalhadores têm dúvidas sobre seus detalhes. Neste artigo, explicamos os principais elementos que compõem sua folha de pagamento e como interpretá-los corretamente.',
    published_at: new Date().toISOString(),
    country: 'br'
  },
  {
    id: '2',
    title: 'Vale refeição: Tudo que você precisa saber sobre este benefício',
    slug: 'vale-refeicao-tudo-que-voce-precisa-saber-beneficio',
    excerpt: 'O vale refeição é um dos benefícios mais valorizados pelos trabalhadores brasileiros. Mas você sabe como ele funciona e quais são seus direitos? Vamos esclarecer todas as dúvidas.',
    published_at: new Date().toISOString(),
    country: 'br'
  },
  {
    id: '3',
    title: 'Impostos na folha de pagamento: INSS e IRRF explicados',
    slug: 'impostos-folha-pagamento-inss-irrf-explicados',
    excerpt: 'Os impostos descontados na folha de pagamento são uma das maiores dúvidas dos trabalhadores. Vamos explicar como funcionam o INSS e o IRRF, os principais impostos que afetam seu salário.',
    published_at: new Date().toISOString(),
    country: 'br'
  },
  {
    id: '4',
    title: 'Benefícios trabalhistas: Como maximizar seus ganhos',
    slug: 'beneficios-trabalhistas-como-maximizar-ganhos',
    excerpt: 'Os benefícios trabalhistas podem representar uma parte significativa da sua remuneração total. Vamos explorar os principais benefícios e como otimizá-los para maximizar seus ganhos.',
    published_at: new Date().toISOString(),
    country: 'br'
  },
  {
    id: '5',
    title: 'Planejamento de carreira: Como aumentar seu salário',
    slug: 'planejamento-carreira-como-aumentar-salario',
    excerpt: 'Aumentar o salário é um objetivo comum entre os profissionais. Mas como fazer isso de forma estratégica e sustentável? Vamos explorar as melhores práticas.',
    published_at: new Date().toISOString(),
    country: 'br'
  }
];

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  return {
    title: `Blog PIM - Artigos sobre folha de pagamento e benefícios | ${country.toUpperCase()}`,
    description: 'Descubra artigos especializados sobre folha de pagamento, benefícios trabalhistas, impostos e otimização salarial. Dicas práticas para maximizar seus ganhos.',
    keywords: 'blog, folha de pagamento, holerite, benefícios, impostos, salário, carreira, CLT',
    openGraph: {
      title: `Blog PIM - Artigos sobre folha de pagamento e benefícios`,
      description: 'Descubra artigos especializados sobre folha de pagamento, benefícios trabalhistas, impostos e otimização salarial.',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Blog PIM - Artigos sobre folha de pagamento e benefícios`,
      description: 'Descubra artigos especializados sobre folha de pagamento, benefícios trabalhistas, impostos e otimização salarial.',
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  // Essayer de récupérer les articles depuis la base de données
  let articles: any[] = [];
  let useDemoArticles = false;
  
  try {
    articles = await blogService.getArticlesByCountry({ 
      country, 
      limit: 20 
    });
  } catch (error) {
    console.log('Utilisation des articles de démonstration - Base de données non configurée');
    useDemoArticles = true;
    articles = demoArticles.filter(article => article.country === country);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog PIM
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra artigos especializados sobre folha de pagamento, benefícios trabalhistas, 
              impostos e otimização salarial. Dicas práticas para maximizar seus ganhos.
            </p>
            {useDemoArticles && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  🎯 Mode de démonstration : Articles de test affichés
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-500">
              Em breve teremos artigos interessantes para você.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Article Meta */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <time dateTime={article.published_at}>
                      {formatDate(article.published_at)}
                    </time>
                  </div>

                  {/* Article Title */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      href={`/${country}/blog/${article.slug}`}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {article.title}
                    </Link>
                  </h2>

                  {/* Article Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link 
                    href={`/${country}/blog/${article.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Ler mais
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Quer analisar sua folha de pagamento?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Faça o upload do seu holerite e receba insights personalizados sobre seus benefícios, 
              impostos e oportunidades de otimização.
            </p>
            <Link
              href={`/${country}/scan-new-pim`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Analisar meu holerite
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 