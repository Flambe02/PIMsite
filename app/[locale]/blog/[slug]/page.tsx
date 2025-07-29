import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Globe, User } from 'lucide-react';
import { sanityClient, queries } from '@/lib/sanity/config';
import { urlFor } from '@/lib/sanity/config';
import { BlogArticleDetail } from '@/hooks/useSanityBlog';
import { PortableText } from '@portabletext/react';

// Can be imported from a shared config
const locales = ['br', 'fr', 'en', 'fr-ca', 'pt-pt', 'en-gb'];

interface BlogArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  // Récupérer l'article pour les métadonnées
  const article = await sanityClient.fetch(queries.getArticleBySlug, { slug });
  
  if (!article) {
    return {
      title: 'Article non trouvé',
      description: 'L\'article que vous recherchez n\'existe pas.',
    };
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt;
  const ogImage = article.ogImage || article.image;

  return {
    title: `${title} | Blog PIM`,
    description: description,
    keywords: article.tags?.join(', ') || 'blog, folha de pagamento, holerite, benefícios',
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      locale: locale,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [],
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author] : [],
      tags: article.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

async function getArticleBySlug(slug: string): Promise<BlogArticleDetail | null> {
  try {
    const article = await sanityClient.fetch(queries.getArticleBySlug, { slug });
    return article || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return null;
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { locale, slug } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  // Récupérer l'article depuis Sanity
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Composants pour PortableText avec styles améliorés
  const components = {
    types: {
      image: ({ value }: any) => {
        try {
          const imageUrl = urlFor(value).url();
          return (
            <div className="my-8">
              <img
                src={imageUrl}
                alt={value.alt || 'Image'}
                className="w-full h-auto rounded-xl shadow-lg"
              />
              {value.caption && (
                <p className="text-sm text-gray-500 mt-3 text-center italic">
                  {value.caption}
                </p>
              )}
            </div>
          );
        } catch (error) {
          console.warn('Impossible de résoudre l\'image:', error);
          return null;
        }
      },
      code: ({ value }: any) => {
        return (
          <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto my-6 font-mono text-sm shadow-lg">
            <code>{value.code}</code>
          </pre>
        );
      },
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-4xl font-bold text-gray-900 mt-12 mb-6 leading-tight border-b-2 border-blue-500 pb-2">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-4 leading-tight">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3 leading-tight">
          {children}
        </h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-2 leading-tight">
          {children}
        </h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-700 my-8 bg-blue-50 p-6 rounded-r-lg">
          <div className="text-lg leading-relaxed">{children}</div>
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-2 mb-6 text-lg text-gray-700">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside space-y-2 mb-6 text-lg text-gray-700">
          {children}
        </ol>
      ),
    },
    listItem: ({ children }: any) => (
      <li className="leading-relaxed">{children}</li>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Article Content unifié */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header intégré dans l'article */}
          <div className="p-8 md:p-12 pb-6">
            <Link
              href={`/${country}/blog`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-medium">Retour au blog</span>
            </Link>
            
            <div className="flex items-center text-sm text-gray-500 mb-6 flex-wrap gap-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                <span className="font-medium">{article.country.toUpperCase()}</span>
              </div>
              {article.author && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span className="font-medium">{article.author}</span>
                  </div>
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Trait de séparation */}
            <div className="border-t border-gray-200 mb-0"></div>
          </div>

          {/* Image principale si présente */}
          {article.image && (
            <div className="w-full h-64 md:h-96 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          )}

          {/* Contenu de l'article */}
          <div className="p-8 md:p-12 pt-0">
            <div className="article-content">
              <PortableText value={article.body} components={components} />
            </div>
          </div>
        </article>
      </div>

      {/* CTA Section amélioré */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Quer analisar sua folha de pagamento?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Faça o upload do seu holerite e receba insights personalizados sobre seus benefícios, 
              impostos e oportunidades de otimização.
            </p>
            <Link
              href={`/${country}/scan-new-pim`}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-blue-600 bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Analisar meu holerite
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 