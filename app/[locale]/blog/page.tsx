import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService } from '@/lib/blog/blogService';
import { useCountry } from '@/hooks/useCountry';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

// Can be imported from a shared config
const locales = ['br', 'fr', 'en', 'fr-ca', 'pt-pt', 'en-gb'];

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
  
  // Récupérer les articles depuis la base de données
  const articles = await blogService.getArticlesByCountry({ 
    country, 
    limit: 20 
  });

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