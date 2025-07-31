import blogTranslations from '@/locales/blog.json';

export async function getDictionary(locale: string) {
  // Charger les traductions du blog selon la locale
  const blogDict = blogTranslations[locale as keyof typeof blogTranslations] || blogTranslations.br;
  
  return {
    blog: blogDict.blog,
    country: blogDict.country
  };
} 