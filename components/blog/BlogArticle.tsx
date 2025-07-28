// ATTENTION : Ce composant est côté client. N'utiliser que BlogServiceClient (jamais BlogService/server) ici !
// BlogServiceClient utilise lib/supabase/client.ts et est sûr pour le client.

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/hooks/useCountry';
import { BlogServiceClient, type BlogArticle } from '@/lib/blog/blogServiceClient';
import { CountrySelector } from './CountrySelector';
import { ArrowLeft, Calendar, User, Share2, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface BlogArticleProps {
  slug?: string;
  className?: string;
}

export function BlogArticle({ slug, className = '' }: BlogArticleProps) {
  const params = useParams();
  const { currentCountry, getCurrentLanguage } = useCountry();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const articleSlug = slug || params?.slug as string;

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleSlug) return;

      setIsLoading(true);
      setError(null);

      try {
        const articleData = await BlogServiceClient.getArticleBySlug(articleSlug);
        
        if (!articleData) {
          setError('Artigo não encontrado');
          return;
        }

        // Vérifier que l'article correspond au pays actuel
        if (articleData.country !== currentCountry) {
          setError('Este artigo não está disponível para o seu país');
          return;
        }

        setArticle(articleData);
      } catch (err) {
        console.error('Erro ao carregar artigo:', err);
        setError('Erro ao carregar o artigo');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleSlug, currentCountry]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const language = getCurrentLanguage();
    
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const getTranslations = () => {
    const language = getCurrentLanguage();
    const translations = {
      pt: {
        backToList: 'Voltar à lista',
        publishedOn: 'Publicado em',
        readingTime: 'min de leitura',
        share: 'Compartilhar',
        notFound: 'Artigo não encontrado',
        notAvailable: 'Este artigo não está disponível para o seu país',
        error: 'Erro ao carregar o artigo',
        loading: 'Carregando artigo...'
      },
      fr: {
        backToList: 'Retour à la liste',
        publishedOn: 'Publié le',
        readingTime: 'min de lecture',
        share: 'Partager',
        notFound: 'Article non trouvé',
        notAvailable: 'Cet article n\'est pas disponible pour votre pays',
        error: 'Erreur lors du chargement de l\'article',
        loading: 'Chargement de l\'article...'
      },
      es: {
        backToList: 'Volver a la lista',
        publishedOn: 'Publicado el',
        readingTime: 'min de lectura',
        share: 'Compartir',
        notFound: 'Artículo no encontrado',
        notAvailable: 'Este artículo no está disponible para tu país',
        error: 'Error al cargar el artículo',
        loading: 'Cargando artículo...'
      },
      en: {
        backToList: 'Back to list',
        publishedOn: 'Published on',
        readingTime: 'min read',
        share: 'Share',
        notFound: 'Article not found',
        notAvailable: 'This article is not available for your country',
        error: 'Error loading article',
        loading: 'Loading article...'
      }
    };
    
    return translations[language as keyof typeof translations] || translations.en;
  };

  const t = getTranslations();

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <Link href="/blog">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.backToList}
            </Button>
          </Link>
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

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <Link href="/blog">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.backToList}
            </Button>
          </Link>
          <CountrySelector />
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t.notFound}</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/blog">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t.backToList}
          </Button>
        </Link>
        <CountrySelector />
      </div>

      {/* Article */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          {/* Métadonnées */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{t.publishedOn} {formatDate(article.published_at || article.created_at || '')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getReadingTime(article.content_markdown)} {t.readingTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author || 'PIM Team'}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {article.country.toUpperCase()}
            </Badge>
            {article.featured_image_url && (
              <Badge variant="outline">
                Com imagem
              </Badge>
            )}
          </div>

          {/* Titre */}
          <h1 className="text-4xl font-bold leading-tight">{article.title}</h1>

          {/* Extrait */}
          {article.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">{article.excerpt}</p>
          )}

          {/* Image de couverture */}
          {article.featured_image_url && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Contenu Markdown */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ 
                __html: renderMarkdown(article.content_markdown) 
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t.backToList}
              </Button>
            </Link>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              {t.share}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Fonction simple pour rendre le markdown (à remplacer par une lib comme marked)
function renderMarkdown(markdown: string): string {
  // Conversion basique du markdown en HTML
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
} 