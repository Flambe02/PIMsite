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
}

export default function BlogList({ articles, locale, country }: BlogListProps) {
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>(articles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Extraire tous les tags uniques
  const allTags = Array.from(
    new Set(
      articles.flatMap(article => article.tags || [])
    )
  ).sort();

  // Filtrer les articles
  useEffect(() => {
    let filtered = articles;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  }, [articles, searchTerm, selectedTag]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
  };

  return (
    <div className="space-y-8">
      {/* Header avec statistiques */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Globe className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Blog PIM - {country.toUpperCase()}
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            {filteredArticles.length} de {articles.length} artigos
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="space-y-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtres par tags */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Filtrar por tag:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={clearFilters}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    !selectedTag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Search className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum artigo encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedTag 
              ? 'Tente ajustar seus filtros de busca.'
              : 'Em breve teremos artigos interessantes para você.'
            }
          </p>
          {(searchTerm || selectedTag) && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <BlogCard
              key={article._id}
              article={article}
              locale={locale}
            />
          ))}
        </div>
      )}

      {/* Pagination simple */}
      {filteredArticles.length > 9 && (
        <div className="flex justify-center pt-8">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Anterior
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Página 1 de {Math.ceil(filteredArticles.length / 9)}
            </span>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 