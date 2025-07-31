import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Globe } from 'lucide-react';
import { useSanityBlog, BlogArticle } from '@/hooks/useSanityBlog';

import BlogList from '@/components/blog/BlogList';

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

async function getArticlesByCountry(country: string): Promise<BlogArticle[]> {
  try {
    const { getArticlesByCountry } = useSanityBlog();
    const articles = await getArticlesByCountry(country);
    console.log(`Articles récupérés pour ${country}:`, articles.length);
    return articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  // Récupérer les articles depuis Sanity
  const articles = await getArticlesByCountry(country);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header amélioré */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Blog PIM
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Découvrez des articles spécialisés sur la paie, les avantages sociaux, 
              les impôts et l'optimisation salariale. Conseils pratiques pour maximiser vos revenus.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Globe className="w-4 h-4 mr-2" />
              <span>Pays: {country.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List avec meilleur espacement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BlogList articles={articles} locale={locale} country={country} />
      </div>

      {/* CTA Section amélioré */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Voulez-vous analyser votre bulletin de paie ?
            </h2>
            <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              Téléchargez votre bulletin de paie et recevez des insights personnalisés sur vos avantages, 
              impôts et opportunités d'optimisation.
            </p>
            <Link
              href={`/${country}/scan-new-pim`}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-blue-600 bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Analyser mon bulletin de paie
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 