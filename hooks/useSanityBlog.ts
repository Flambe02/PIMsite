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
      
      // Validation et filtrage des articles
      const validArticles = (articles || []).filter((article: any) => {
        if (!article.title || !article.slug) {
          console.warn('🚨 Article Sanity incomplet ignoré:', {
            _id: article._id,
            title: article.title,
            slug: article.slug,
            reason: !article.title ? 'Titre manquant' : 'Slug manquant'
          });
          return false;
        }
        return true;
      });

      console.log(`✅ Articles valides récupérés pour ${country}:`, validArticles.length);
      return validArticles;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des articles:', error);
      return [];
    }
  };

  const getArticleBySlug = async (slug: string): Promise<BlogArticleDetail | null> => {
    try {
      const article = await sanityClient.fetch(queries.getArticleBySlug, { slug });
      
      if (!article) {
        console.warn(`🚨 Article non trouvé pour le slug: ${slug}`);
        return null;
      }

      // Validation de l'article
      if (!article.title || !article.slug) {
        console.warn('🚨 Article Sanity incomplet ignoré:', {
          _id: article._id,
          title: article.title,
          slug: article.slug,
          reason: !article.title ? 'Titre manquant' : 'Slug manquant'
        });
        return null;
      }

      console.log(`✅ Article valide récupéré: ${article.slug}`);
      return article;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'article:', error);
      return null;
    }
  };

  const getAllArticles = async (): Promise<BlogArticle[]> => {
    try {
      const articles = await sanityClient.fetch(queries.getAllArticles);
      
      // Validation et filtrage des articles
      const validArticles = (articles || []).filter((article: any) => {
        if (!article.slug) {
          console.warn('🚨 Article Sanity incomplet ignoré (sitemap):', {
            _id: article._id,
            slug: article.slug,
            reason: 'Slug manquant'
          });
          return false;
        }
        return true;
      });

      console.log(`✅ Articles valides pour sitemap:`, validArticles.length);
      return validArticles;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de tous les articles:', error);
      return [];
    }
  };

  const getArticlesForRSS = async (country: string): Promise<BlogArticle[]> => {
    try {
      const articles = await sanityClient.fetch(queries.getArticlesForRSS, { country });
      
      // Validation et filtrage des articles
      const validArticles = (articles || []).filter((article: any) => {
        if (!article.title || !article.slug) {
          console.warn('🚨 Article Sanity incomplet ignoré (RSS):', {
            _id: article._id,
            title: article.title,
            slug: article.slug,
            reason: !article.title ? 'Titre manquant' : 'Slug manquant'
          });
          return false;
        }
        return true;
      });

      console.log(`✅ Articles valides pour RSS ${country}:`, validArticles.length);
      return validArticles;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des articles RSS:', error);
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