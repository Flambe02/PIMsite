'use client';

import { useState, useEffect } from 'react';
import { Globe, Filter, Search } from 'lucide-react';
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
import BlogCard from './BlogCard';

interface BlogListProps {
  articles: BlogArticle[];
  locale: string;
  country: string;
  dict: any;
}

export default function BlogList({ articles, locale, country, dict }: BlogListProps) {
  // Validation des articles reçus
  const validArticles = articles.filter((article: any) => {
    if (!article || !article.title || !article.slug) {
      console.warn('🚨 Article invalide dans BlogList:', article);
      return false;
    }
    return true;
  });

  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>(validArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Extraire tous les tags uniques (seulement des articles valides)
  const allTags = Array.from(
    new Set(
      validArticles.flatMap(article => article.tags || [])
    )
  ).sort();

  // Filtrer les articles
  useEffect(() => {
    let filtered = validArticles;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (article.tags && article.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Filtre par tag
    if (selectedTag) {
      filtered = filtered.filter(article =>
        article.tags && article.tags.includes(selectedTag)
      );
    }

    setFilteredArticles(filtered);
  }, [validArticles, searchTerm, selectedTag]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header compact avec statistiques */}
      <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center">
            <Globe className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {dict.blog.title} - {country.toUpperCase()}
            </h2>
          </div>
          <div className="text-xs md:text-sm text-gray-500">
            {filteredArticles.length} {locale === 'br' ? 'de' : locale === 'fr' ? 'sur' : 'of'} {validArticles.length} {locale === 'br' ? 'artigos' : locale === 'fr' ? 'articles' : 'articles'}
          </div>
        </div>

        {/* Barre de recherche et filtres optimisés */}
        <div className="space-y-3 md:space-y-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={dict.blog.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          {/* Filtres par tags - optimisé mobile */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center">
                <Filter className="w-3 h-3 md:w-4 md:h-4 text-gray-500 mr-2" />
                <span className="text-xs md:text-sm font-medium text-gray-700">{dict.blog.filterByCategory}:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <button
                  onClick={clearFilters}
                  className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors ${
                    !selectedTag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dict.blog.allCategories}
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liste des articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 md:py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-400 mb-4 md:mb-6">
            <Search className="mx-auto h-12 w-12 md:h-16 md:w-16" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
            {dict.blog.noArticles}
          </h3>
          <p className="text-gray-600 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
            {searchTerm || selectedTag 
              ? (locale === 'br' ? 'Tente ajustar seus filtros de busca ou explore outras categorias.' :
                 locale === 'fr' ? 'Essayez d\'ajuster vos filtres de recherche ou explorez d\'autres catégories.' :
                 'Try adjusting your search filters or explore other categories.')
              : (locale === 'br' ? 'Em breve teremos artigos interessantes para você. Explore nossos recursos!' :
                 locale === 'fr' ? 'Bientôt nous aurons des articles intéressants pour vous. Explorez nos ressources !' :
                 'Soon we will have interesting articles for you. Explore our resources!')
            }
          </p>
          {(searchTerm || selectedTag) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 border border-transparent text-sm md:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              {locale === 'br' ? 'Limpar filtros' : locale === 'fr' ? 'Effacer les filtres' : 'Clear filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {/* Grille principale - optimisée mobile */}
          <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <BlogCard
                key={article._id}
                article={article}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
          
          {/* Statistiques compactes */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600">
                {locale === 'br' ? 'Exibindo' : locale === 'fr' ? 'Affichage de' : 'Showing'} <span className="font-semibold text-blue-600">{filteredArticles.length}</span> 
                {filteredArticles.length === 1 
                  ? (locale === 'br' ? ' artigo' : locale === 'fr' ? ' article' : ' article')
                  : (locale === 'br' ? ' artigos' : locale === 'fr' ? ' articles' : ' articles')
                } {locale === 'br' ? 'de' : locale === 'fr' ? 'sur' : 'of'} {articles.length} {locale === 'br' ? 'no total' : locale === 'fr' ? 'au total' : 'total'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pagination simple - optimisée mobile */}
      {filteredArticles.length > 9 && (
        <div className="flex justify-center pt-6 md:pt-8">
          <div className="flex items-center space-x-1 md:space-x-2">
            <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              {locale === 'br' ? 'Anterior' : locale === 'fr' ? 'Précédent' : 'Previous'}
            </button>
            <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700">
              {locale === 'br' ? 'Página' : locale === 'fr' ? 'Page' : 'Page'} 1 {locale === 'br' ? 'de' : locale === 'fr' ? 'sur' : 'of'} {Math.ceil(filteredArticles.length / 9)}
            </span>
            <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              {locale === 'br' ? 'Próxima' : locale === 'fr' ? 'Suivant' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 