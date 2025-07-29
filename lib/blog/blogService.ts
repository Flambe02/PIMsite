// ATTENTION : Ce service est réservé au serveur (API routes, Server Components, scripts Node). Ne jamais l'importer dans un composant client !
// Utilise lib/supabase/server.ts et next/headers.

import { createClient } from '@/lib/supabase/server';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  country: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogArticleListParams {
  country: string;
  limit?: number;
  offset?: number;
}

export class BlogService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Récupère tous les articles publiés pour un pays donné
   */
  async getArticlesByCountry({ country, limit = 10, offset = 0 }: BlogArticleListParams): Promise<BlogArticle[]> {
    try {
      const supabase = await this.getSupabase();
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('country', country)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur BlogService.getArticlesByCountry:', error);
      return [];
    }
  }

  /**
   * Récupère un article par son slug et pays
   */
  async getArticleBySlug(slug: string, country: string): Promise<BlogArticle | null> {
    try {
      const supabase = await this.getSupabase();
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('country', country)
        .not('published_at', 'is', null)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur BlogService.getArticleBySlug:', error);
      return null;
    }
  }

  /**
   * Récupère les articles les plus récents pour un pays
   */
  async getRecentArticles(country: string, limit: number = 3): Promise<BlogArticle[]> {
    try {
      const supabase = await this.getSupabase();
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('country', country)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erreur lors de la récupération des articles récents:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur BlogService.getRecentArticles:', error);
      return [];
    }
  }

  /**
   * Recherche d'articles par mot-clé
   */
  async searchArticles(country: string, query: string, limit: number = 10): Promise<BlogArticle[]> {
    try {
      const supabase = await this.getSupabase();
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('country', country)
        .not('published_at', 'is', null)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erreur lors de la recherche d\'articles:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur BlogService.searchArticles:', error);
      return [];
    }
  }

  /**
   * Compte le nombre total d'articles pour un pays
   */
  async getArticleCount(country: string): Promise<number> {
    try {
      const supabase = await this.getSupabase();
      const { count, error } = await supabase
        .from('blog_articles')
        .select('*', { count: 'exact', head: true })
        .eq('country', country)
        .not('published_at', 'is', null);

      if (error) {
        console.error('Erreur lors du comptage des articles:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur BlogService.getArticleCount:', error);
      return 0;
    }
  }

  /**
   * Génère un slug unique à partir d'un titre
   */
  async generateUniqueSlug(title: string, country: string): Promise<string> {
    const baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingArticle = await this.getArticleBySlug(slug, country);
      if (!existingArticle) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Génère un slug à partir d'un titre
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
      .trim();
  }

  /**
   * Génère un extrait à partir du contenu
   */
  generateExcerpt(content: string, maxLength: number = 150): string {
    // Supprime les balises Markdown
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Supprime les titres
      .replace(/\*\*(.*?)\*\*/g, '$1') // Supprime le gras
      .replace(/\*(.*?)\*/g, '$1') // Supprime l'italique
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Supprime les liens
      .replace(/`([^`]+)`/g, '$1') // Supprime le code inline
      .replace(/```[\s\S]*?```/g, '') // Supprime les blocs de code
      .replace(/\n+/g, ' ') // Remplace les sauts de ligne par des espaces
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    // Coupe à la dernière phrase complète
    const truncated = plainText.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastPeriod > maxLength * 0.8) {
      return truncated.substring(0, lastPeriod + 1);
    }

    return truncated.substring(0, lastSpace) + '...';
  }
}

// Instance singleton
export const blogService = new BlogService(); 