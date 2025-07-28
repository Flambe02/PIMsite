// ATTENTION : Ce service est réservé au serveur (API routes, Server Components, scripts Node). Ne jamais l'importer dans un composant client !
// Utilise lib/supabase/server.ts et next/headers.

import { createClient } from '@/lib/supabase/server';

export interface BlogArticle {
  id?: string;
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

export class BlogService {
  /**
   * Récupère tous les articles de blog par pays
   */
  static async getArticles(country?: string): Promise<BlogArticle[]> {
    const supabase = await createClient();
    
    let query = supabase
      .from('blog_articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (country) {
      query = query.eq('country', country);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Erreur lors de la récupération des articles:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Récupère un article par son slug
   */
  static async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('❌ Erreur lors de la récupération de l\'article:', error);
      return null;
    }

    return data;
  }

  /**
   * Récupère les articles par pays
   */
  static async getArticlesByCountry(country: string): Promise<BlogArticle[]> {
    return this.getArticles(country);
  }

  /**
   * Crée un nouvel article (admin seulement)
   */
  static async createArticle(article: Omit<BlogArticle, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('blog_articles')
      .insert(article)
      .select('id')
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de l\'article:', error);
      throw new Error('Impossible de créer l\'article');
    }

    console.log('✅ Article créé avec succès:', data.id);
    return data.id;
  }

  /**
   * Met à jour un article (admin seulement)
   */
  static async updateArticle(id: string, updates: Partial<BlogArticle>): Promise<void> {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('blog_articles')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'article:', error);
      throw new Error('Impossible de mettre à jour l\'article');
    }

    console.log('✅ Article mis à jour avec succès:', id);
  }

  /**
   * Supprime un article (admin seulement)
   */
  static async deleteArticle(id: string): Promise<void> {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('blog_articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erreur lors de la suppression de l\'article:', error);
      throw new Error('Impossible de supprimer l\'article');
    }

    console.log('✅ Article supprimé avec succès:', id);
  }

  /**
   * Génère un slug à partir du titre
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Récupère les statistiques du blog
   */
  static async getBlogStats(): Promise<{ [country: string]: number }> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('blog_articles')
      .select('country');

    if (error) {
      console.error('❌ Erreur lors de la récupération des stats du blog:', error);
      return {};
    }

    const stats: { [country: string]: number } = {};
    data?.forEach(article => {
      stats[article.country] = (stats[article.country] || 0) + 1;
    });

    return stats;
  }
} 