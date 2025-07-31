import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Globe } from 'lucide-react';
import { useSanityBlog, BlogArticle } from '@/hooks/useSanityBlog';
import { getDictionary } from '@/lib/getDictionary';

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
  const dict = await getDictionary(locale);
  
  return {
    title: `${dict.blog.title} - ${dict.blog.subtitle} | ${country.toUpperCase()}`,
    description: dict.blog.subtitle,
    keywords: 'blog, folha de pagamento, holerite, benefícios, impostos, salário, carreira, CLT',
    openGraph: {
      title: `${dict.blog.title} - ${dict.blog.subtitle}`,
      description: dict.blog.subtitle,
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.blog.title} - ${dict.blog.subtitle}`,
      description: dict.blog.subtitle,
    },
  };
}

async function getArticlesByCountry(country: string): Promise<BlogArticle[]> {
  try {
    const { getArticlesByCountry } = useSanityBlog();
    const articles = await getArticlesByCountry(country);
    
    // Validation supplémentaire côté page
    const validArticles = articles.filter((article: any) => {
      const isValid = article && article.title && article.slug;
      if (!isValid) {
        console.warn('🚨 Article invalide filtré côté page:', article);
      }
      return isValid;
    });

    console.log(`✅ Articles valides pour ${country}:`, validArticles.length);
    return validArticles;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des articles:', error);
    return [];
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  try {
    const { locale } = await params;
    
    if (!locales.includes(locale as any)) notFound();

    const country = locale as string;
    const dict = await getDictionary(locale);
    
    // Récupérer les articles depuis Sanity
    const articles = await getArticlesByCountry(country);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header compact et optimisé */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            {/* Icône plus petite */}
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full mb-4 md:mb-6">
              <Globe className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            
            {/* Titre plus compact */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              {dict.blog.title}
            </h1>
            
            {/* Sous-titre plus court */}
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4 md:mb-6">
              {dict.blog.subtitle}
            </p>
            
            {/* Badge pays plus discret */}
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium">
              <Globe className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              <span>{dict.country.currentCountry}: {country.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List avec espacement optimisé */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <BlogList articles={articles as any} locale={locale} country={country} dict={dict} />
      </div>

      {/* CTA Section compact */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
              {dict.blog.analyzePayslip}
            </h2>
            <p className="text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              {dict.blog.analyzePayslipDescription}
            </p>
            <Link
              href={`/${country}/scan-new-pim`}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 border border-transparent text-base md:text-lg font-semibold rounded-xl text-blue-600 bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {dict.blog.analyzeMyPayslip}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('❌ Erreur critique dans BlogPage:', error);
    
    // Fallback en cas d'erreur - page avec message d'erreur mais pas de crash
    const { locale } = await params;
    const dict = await getDictionary(locale);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
            {dict.blog.blogUnavailable}
          </h1>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
            {dict.blog.technicalDifficulties}
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            {dict.blog.backToHome}
          </a>
        </div>
      </div>
    );
  }
} 