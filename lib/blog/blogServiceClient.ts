import { createClient } from '@/lib/supabase/client';

export interface BlogArticle {
  id: string;
  country: string;
  title: string;
  slug: string;
  content_markdown: string;
  excerpt?: string;
  featured_image_url?: string;
  author?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export class BlogServiceClient {
  static async getArticles(country: string): Promise<BlogArticle[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('country', country)
      .order('published_at', { ascending: false });
    if (error) {
      console.error('Erreur récupération articles:', error);
      return [];
    }
    return data || [];
  }

  static async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) {
      console.error('Erreur récupération article:', error);
      return null;
    }
    return data;
  }

  static async getArticlesByCountry(country: string): Promise<BlogArticle[]> {
    return this.getArticles(country);
  }

  // Les méthodes d'admin (create, update, delete) ne sont pas exposées côté client pour la sécurité
  // Si besoin, créer une API route dédiée

  static async getBlogStats(): Promise<{ [country: string]: number }> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_articles')
      .select('country');
    if (error) {
      console.error('Erreur stats blog:', error);
      return {};
    }
    const stats: { [country: string]: number } = {};
    data?.forEach((record: any) => {
      stats[record.country] = (stats[record.country] || 0) + 1;
    });
    return stats;
  }
} 