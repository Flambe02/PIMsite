import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Globe } from 'lucide-react';
// import { sanityClient, queries } from '@/lib/sanity/config';
// import { BlogArticle } from '@/hooks/useSanityBlog';

// Temporary interface while Sanity is disabled
interface BlogArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  author: {
    name: string;
  };
  mainImage?: {
    asset: {
      _ref: string;
    };
  };
  country: string;
}
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
  // Temporary: return empty array while Sanity is disabled
  console.log('Blog temporarily disabled - Sanity integration paused');
  return [];
  
  // Original code (commented out):
  // try {
  //   const articles = await sanityClient.fetch(queries.getArticlesByCountry, { country });
  //   return articles || [];
  // } catch (error) {
  //   console.error('Erreur lors de la récupération des articles:', error);
  //   return [];
  // }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  // Récupérer les articles depuis Sanity
  const articles = await getArticlesByCountry(country);

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
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Globe className="w-4 h-4 mr-2" />
              <span>Pays: {country.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogList articles={articles} locale={locale} country={country} />
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