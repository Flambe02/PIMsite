import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { projectId, dataset, apiVersion } from '../../sanity/env';

// Configuration pour la production (lecture publique)
export const configProduction = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Utilise le CDN pour de meilleures performances
};

// Configuration pour le développement (avec token)
export const configDevelopment = {
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
};

// Client de production (lecture publique)
export const sanityClientProduction = createClient(configProduction);

// Client de développement (avec token pour écriture)
export const sanityClientDevelopment = createClient(configDevelopment);

// Client à utiliser selon l'environnement
export const sanityClient = process.env.NODE_ENV === 'production' 
  ? sanityClientProduction 
  : sanityClientDevelopment;

// Create an image builder
const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => {
  return builder.image(source);
};

// GROQ queries optimisées pour la production
export const queries = {
  // Get all published articles for a specific country
  getArticlesByCountry: `
    *[_type == "post" && publishedAt != null && country == $country] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": mainImage.asset->url,
      publishedAt,
      metaTitle,
      metaDescription,
      "ogImage": ogImage.asset->url,
      tags,
      country
    }
  `,

  // Get a single article by slug
  getArticleBySlug: `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      body,
      excerpt,
      "image": mainImage.asset->url,
      publishedAt,
      metaTitle,
      metaDescription,
      "ogImage": ogImage.asset->url,
      tags,
      country,
      "author": author->name
    }
  `,

  // Get all articles for sitemap
  getAllArticles: `
    *[_type == "post" && publishedAt != null] {
      "slug": slug.current,
      publishedAt,
      country
    }
  `,

  // Get articles for RSS feed
  getArticlesForRSS: `
    *[_type == "post" && publishedAt != null && country == $country] | order(publishedAt desc)[0...20] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "author": author->name,
      "image": mainImage.asset->url
    }
  `
}; 