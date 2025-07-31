import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
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
  image?: string;
  tags?: string[];
  country: string;
}

interface BlogCardProps {
  article: BlogArticle;
  locale: string;
  dict: any;
}

export default function BlogCard({ article, locale, dict }: BlogCardProps) {
  // Validation de l'article
  if (!article || !article.title || !article.slug) {
    console.warn('🚨 Article invalide dans BlogCard:', article);
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const localeMap: { [key: string]: string } = {
        'br': 'pt-BR',
        'fr': 'fr-FR',
        'en': 'en-US',
        'fr-ca': 'fr-CA',
        'pt-pt': 'pt-PT',
        'en-gb': 'en-GB'
      };
      
      return date.toLocaleDateString(localeMap[locale] || 'pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.warn('🚨 Date invalide dans BlogCard:', dateString);
      return locale === 'br' ? 'Data inválida' : locale === 'fr' ? 'Date invalide' : 'Invalid date';
    }
  };

  const getReadingTime = () => {
    try {
      // Estimation basée sur le nombre de mots dans l'excerpt
      const words = (article.excerpt || '').split(' ').length || 0;
      const readingTime = Math.ceil(words / 200); // 200 mots par minute
      return Math.max(1, readingTime); // Minimum 1 minute
    } catch (error) {
      console.warn('🚨 Erreur calcul temps de lecture:', error);
      return 1;
    }
  };

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2">
      {/* Image avec overlay - optimisée mobile */}
      {article.image && (
        <div className="aspect-video overflow-hidden relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      {/* Content - optimisé mobile */}
      <div className="p-4 md:p-6">
        {/* Meta avec pays - compact */}
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <time dateTime={article.publishedAt} className="text-xs md:text-sm">
                {formatDate(article.publishedAt)}
              </time>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span className="text-xs md:text-sm">{getReadingTime()} {locale === 'br' ? 'min' : locale === 'fr' ? 'min' : 'min'}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {article.country.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Title - optimisé mobile */}
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
          <Link href={`/${locale}/blog/${article.slug}`}>
            {article.title || (locale === 'br' ? 'Sem título' : locale === 'fr' ? 'Sans titre' : 'No title')}
          </Link>
        </h2>

        {/* Excerpt - optimisé mobile */}
        <p className="text-gray-600 mb-4 md:mb-6 line-clamp-3 leading-relaxed text-sm md:text-base">
          {article.excerpt || (locale === 'br' ? 'Nenhum resumo disponível' : locale === 'fr' ? 'Aucun résumé disponible' : 'No summary available')}
        </p>

        {/* Tags - optimisé mobile */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200"
              >
                <Tag className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-gray-500 flex items-center">
                +{article.tags.length - 3} {locale === 'br' ? 'outros' : locale === 'fr' ? 'autres' : 'more'}
              </span>
            )}
          </div>
        )}

        {/* Read More avec meilleur style - optimisé mobile */}
        <div className="border-t border-gray-100 pt-3 md:pt-4">
          <Link 
            href={`/${locale}/blog/${article.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 group/link text-sm md:text-base"
          >
            {dict.blog.readMore}
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1.5 md:ml-2 group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
} 