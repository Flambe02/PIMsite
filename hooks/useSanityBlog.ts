import { sanityClient, queries } from '@/lib/sanity/config';

export interface BlogArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  publishedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  tags?: string[];
  country: string;
  author?: string;
}

export interface BlogArticleDetail extends BlogArticle {
  body: any;
}

export const useSanityBlog = () => {
  const getArticlesByCountry = async (country: string): Promise<BlogArticle[]> => {
    try {
      const articles = await sanityClient.fetch(queries.getArticlesByCountry, { country });
      return articles || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }
  };

  const getArticleBySlug = async (slug: string): Promise<BlogArticleDetail | null> => {
    try {
      const article = await sanityClient.fetch(queries.getArticleBySlug, { slug });
      return article || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return null;
    }
  };

  const getAllArticles = async (): Promise<BlogArticle[]> => {
    try {
      const articles = await sanityClient.fetch(queries.getAllArticles);
      return articles || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les articles:', error);
      return [];
    }
  };

  const getArticlesForRSS = async (country: string): Promise<BlogArticle[]> => {
    try {
      const articles = await sanityClient.fetch(queries.getArticlesForRSS, { country });
      return articles || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des articles RSS:', error);
      return [];
    }
  };

  return {
    getArticlesByCountry,
    getArticleBySlug,
    getAllArticles,
    getArticlesForRSS,
  };
}; 