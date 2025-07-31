import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration directe pour éviter les problèmes de variables d'environnement
export const config = {
  projectId: 'y5sty7n2',
  dataset: 'production',
  apiVersion: '2025-07-29',
  useCdn: process.env.NODE_ENV === 'production', // `false` if you want to ensure fresh data
};

// Create a Sanity client
export const sanityClient = createClient(config);

// Create an image builder
const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => {
  return builder.image(source);
};

// GROQ queries SÉCURISÉES - Ne récupère que les articles valides
export const queries = {
  // Get all published articles for a specific country (SÉCURISÉ)
  getArticlesByCountry: `
    *[_type == "post" 
      && defined(slug.current) 
      && defined(title) 
      && publishedAt != null 
      && publishedAt < now() 
      && (country == $country || country == lower($country))
    ] | order(publishedAt desc) {
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

  // Get a single article by slug (SÉCURISÉ)
  getArticleBySlug: `
    *[_type == "post" 
      && slug.current == $slug 
      && defined(slug.current) 
      && defined(title) 
      && publishedAt != null 
      && publishedAt < now()
    ][0] {
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

  // Get all articles for sitemap (SÉCURISÉ)
  getAllArticles: `
    *[_type == "post" 
      && defined(slug.current) 
      && defined(title) 
      && publishedAt != null 
      && publishedAt < now()
    ] {
      "slug": slug.current,
      publishedAt,
      country
    }
  `,

  // Get articles for RSS feed (SÉCURISÉ)
  getArticlesForRSS: `
    *[_type == "post" 
      && defined(slug.current) 
      && defined(title) 
      && publishedAt != null 
      && publishedAt < now() 
      && (country == $country || country == lower($country))
    ] | order(publishedAt desc)[0...20] {
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