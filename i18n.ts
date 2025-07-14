import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
const locales = ['br', 'fr', 'en']

export const locales = ['br', 'fr', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'br';

export const localeNames: Record<Locale, string> = {
  br: 'Português (BR)',
  fr: 'Français',
  en: 'English',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  return {
    locale: locale as string,
    messages: (await import(`./locales/${locale}.json`)).default
  }
}) 