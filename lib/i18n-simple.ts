import br from '../locales/br.json';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

export const locales = ['br', 'fr', 'en'] as const;
export type Locale = typeof locales[number];

export const messages = {
  br,
  fr,
  en,
};

export function getMessages(locale: string) {
  return messages[locale as Locale] || messages.br;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
} 