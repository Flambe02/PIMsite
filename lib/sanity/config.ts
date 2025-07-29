import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { projectId, dataset, apiVersion } from '../../sanity/env';

export const config = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // `false` if you want to ensure fresh data
};

// Create a Sanity client
export const sanityClient = createClient(config);

// Create an image builder
const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => {
  return builder.image(source);
};

// GROQ queries
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