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
      {/* Header amélioré */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {dict.blog.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              {dict.blog.subtitle}
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Globe className="w-4 h-4 mr-2" />
              <span>{dict.country.currentCountry}: {country.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List avec meilleur espacement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BlogList articles={articles} locale={locale} country={country} dict={dict} />
      </div>

      {/* CTA Section amélioré */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              {locale === 'br' ? 'Quer analisar seu holerite?' : 
               locale === 'fr' ? 'Voulez-vous analyser votre bulletin de paie ?' :
               'Want to analyze your payslip?'}
            </h2>
            <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              {locale === 'br' ? 'Faça upload do seu holerite e receba insights personalizados sobre seus benefícios, impostos e oportunidades de otimização.' :
               locale === 'fr' ? 'Téléchargez votre bulletin de paie et recevez des insights personnalisés sur vos avantages, impôts et opportunités d\'optimisation.' :
               'Upload your payslip and receive personalized insights about your benefits, taxes and optimization opportunities.'}
            </p>
            <Link
              href={`/${country}/scan-new-pim`}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-blue-600 bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {locale === 'br' ? 'Analisar meu holerite' :
               locale === 'fr' ? 'Analyser mon bulletin de paie' :
               'Analyze my payslip'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('❌ Erreur critique dans BlogPage:', error);
    
    // Fallback en cas d'erreur - page avec message d'erreur mais pas de crash
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'br' ? 'Blog temporariamente indisponível' :
             locale === 'fr' ? 'Blog temporairement indisponible' :
             'Blog temporarily unavailable'}
          </h1>
          <p className="text-gray-600 mb-8">
            {locale === 'br' ? 'Estamos enfrentando dificuldades técnicas. Tente novamente mais tarde.' :
             locale === 'fr' ? 'Nous rencontrons des difficultés techniques. Veuillez réessayer plus tard.' :
             'We are experiencing technical difficulties. Please try again later.'}
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {locale === 'br' ? 'Voltar ao início' :
             locale === 'fr' ? 'Retour à l\'accueil' :
             'Back to home'}
          </a>
        </div>
      </div>
    );
  }
} 