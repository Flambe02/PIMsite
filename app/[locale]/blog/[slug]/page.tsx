import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService } from '@/lib/blog/blogService';
import Link from 'next/link';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { marked } from 'marked';

// Can be imported from a shared config
const locales = ['br', 'fr', 'en', 'fr-ca', 'pt-pt', 'en-gb'];

interface BlogArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const country = locale as string;
  
  // Récupérer l'article depuis la base de données
  const article = await blogService.getArticleBySlug(slug, country);
  
  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.published_at).toISOString();
  const modifiedDate = new Date(article.updated_at).toISOString();

  return {
    title: `${article.title} | Blog PIM`,
    description: article.excerpt,
    keywords: 'folha de pagamento, holerite, benefícios, impostos, salário, carreira, CLT',
    authors: [{ name: 'PIM' }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: ['PIM'],
      locale: locale,
      url: `https://pimsite.com/${country}/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
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
  
  // Récupérer l'article depuis la base de données
  const article = await blogService.getArticleBySlug(slug, country);
  
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