// ATTENTION : Ce composant est côté client. N'utiliser que BlogServiceClient (jamais BlogService/server) ici !
// BlogServiceClient utilise lib/supabase/client.ts et est sûr pour le client.

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/hooks/useCountry';
import { BlogServiceClient, type BlogArticle } from '@/lib/blog/blogServiceClient';
import { CountrySelector } from './CountrySelector';
import { ArrowRight, Search, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface BlogListProps {
  className?: string;
}

export function BlogList({ className = '' }: BlogListProps) {
  const { currentCountry, getCurrentLanguage } = useCountry();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Charger les articles du pays actuel
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const countryArticles = await BlogServiceClient.getArticles(currentCountry);
        setArticles(countryArticles);
        setFilteredArticles(countryArticles);
      } catch (error) {
        console.error('Erro ao carregar artigos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [currentCountry]);

  // Filtrer les articles
  useEffect(() => {
    let filtered = articles;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content_markdown.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie (basé sur le contenu)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => {
        const content = article.content_markdown.toLowerCase();
        switch (selectedCategory) {
          case 'holerite':
            return content.includes('holerite') || content.includes('fiche de paie') || content.includes('nómina');
          case 'finances':
            return content.includes('finança') || content.includes('finance') || content.includes('finanza');
          case 'taxes':
            return content.includes('imposto') || content.includes('impôt') || content.includes('impuesto');
          case 'benefits':
            return content.includes('benefício') || content.includes('avantage') || content.includes('beneficio');
          case 'tips':
            return content.includes('dica') || content.includes('conseil') || content.includes('consejo');
          default:
            return true;
        }
      });
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const language = getCurrentLanguage();
    
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTranslations = () => {
    const language = getCurrentLanguage();
    const translations = {
      pt: {
        noArticles: 'Nenhum artigo disponível no momento',
        loading: 'Carregando artigos...',
        error: 'Erreur lors du chargement des articles',
        searchPlaceholder: 'Buscar artigos...',
        allCategories: 'Todas as categorias',
        holerite: 'Holerite',
        finances: 'Finanças',
        taxes: 'Impostos',
        benefits: 'Benefícios',
        tips: 'Dicas'
      },
      fr: {
        noArticles: 'Aucun article disponible pour le moment',
        loading: 'Chargement des articles...',
        error: 'Erreur lors du chargement des articles',
        searchPlaceholder: 'Rechercher des articles...',
        allCategories: 'Toutes les catégories',
        holerite: 'Fiche de paie',
        finances: 'Finances',
        taxes: 'Impôts',
        benefits: 'Avantages',
        tips: 'Conseils'
      },
      es: {
        noArticles: 'No hay artículos disponibles en este momento',
        loading: 'Cargando artículos...',
        error: 'Error al cargar artículos',
        searchPlaceholder: 'Buscar artículos...',
        allCategories: 'Todas las categorías',
        holerite: 'Nómina',
        finances: 'Finanzas',
        taxes: 'Impuestos',
        benefits: 'Beneficios',
        tips: 'Consejos'
      },
      en: {
        noArticles: 'No articles available at the moment',
        loading: 'Loading articles...',
        error: 'Error loading articles',
        searchPlaceholder: 'Search articles...',
        allCategories: 'All categories',
        holerite: 'Payslip',
        finances: 'Finances',
        taxes: 'Taxes',
        benefits: 'Benefits',
        tips: 'Tips'
      }
    };
    
    return translations[language as keyof typeof translations] || translations.en;
  };

  const t = getTranslations();

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog PIM</h1>
            <p className="text-gray-600 mt-2">Artigos e guias sobre holerites e finanças</p>
          </div>
          <CountrySelector />
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog PIM</h1>
          <p className="text-gray-600 mt-2">Artigos e guias sobre holerites e finanças</p>
        </div>
        <CountrySelector />
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">{t.allCategories}</option>
            <option value="holerite">{t.holerite}</option>
            <option value="finances">{t.finances}</option>
            <option value="taxes">{t.taxes}</option>
            <option value="benefits">{t.benefits}</option>
            <option value="tips">{t.tips}</option>
          </select>
        </div>
      </div>

      {/* Liste d'articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'Nenhum resultado encontrado' : t.noArticles}
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Tente ajustar os filtros de pesquisa' 
              : 'Volte mais tarde para novos artigos'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.country.toUpperCase()}
                  </Badge>
                  {article.featured_image_url && (
                    <Badge variant="outline" className="text-xs">
                      Com imagem
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2 text-lg">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.published_at || article.created_at || '')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{article.author || 'PIM Team'}</span>
                  </div>
                </div>
                
                <Link href={`/blog/${article.slug}`}>
                  <Button className="w-full" variant="outline">
                    Ler mais
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="text-center text-sm text-gray-500 mt-8">
        {filteredArticles.length} artigo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
        {searchTerm && ` para "${searchTerm}"`}
        {selectedCategory !== 'all' && ` na categoria "${selectedCategory}"`}
      </div>
    </div>
  );
} 