import { usePathname } from 'next/navigation';

export type Country = 'br' | 'fr';

export interface CountryInfo {
  code: Country;
  name: string;
  flag: string;
  language: string;
  currency: string;
  timezone: string;
}

const COUNTRY_CONFIG: Record<Country, CountryInfo> = {
  br: {
    code: 'br',
    name: 'Brasil',
    flag: '🇧🇷',
    language: 'PT',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo'
  },
  fr: {
    code: 'fr',
    name: 'France',
    flag: '🇫🇷',
    language: 'FR',
    currency: 'EUR',
    timezone: 'Europe/Paris'
  }
};

/**
 * Hook pour détecter automatiquement le pays selon le path ou le contexte
 * @returns Le code du pays actuel ('br' ou 'fr')
 */
export function useCountry(): Country {
  const pathname = usePathname();
  
  // Détection basée sur le path (/fr/ ou /br/)
  const localeMatch = pathname.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
  const detectedLocale = localeMatch ? localeMatch[1] : 'br';
  
  // Validation et fallback
  if (detectedLocale === 'fr') {
    return 'fr';
  }
  
  // Par défaut, retourne 'br'
  return 'br';
}

/**
 * Hook pour obtenir les informations complètes du pays actuel
 * @returns Les informations du pays (nom, drapeau, langue, etc.)
 */
export function useCountryInfo(): CountryInfo {
  const country = useCountry();
  return COUNTRY_CONFIG[country];
}

/**
 * Hook pour obtenir la langue du pays actuel
 * @returns Le code de langue ('PT' pour Brésil, 'FR' pour France)
 */
export function useLanguage(): string {
  const countryInfo = useCountryInfo();
  return countryInfo.language;
}

/**
 * Hook pour obtenir la devise du pays actuel
 * @returns Le code de devise ('BRL' pour Brésil, 'EUR' pour France)
 */
export function useCurrency(): string {
  const countryInfo = useCountryInfo();
  return countryInfo.currency;
}

/**
 * Utilitaire pour valider si un pays est supporté
 * @param country - Le code du pays à valider
 * @returns true si le pays est supporté
 */
export function isSupportedCountry(country: string): country is Country {
  return country === 'br' || country === 'fr';
}

/**
 * Utilitaire pour obtenir la configuration d'un pays
 * @param country - Le code du pays
 * @returns La configuration du pays ou null si non supporté
 */
export function getCountryConfig(country: string): CountryInfo | null {
  if (!isSupportedCountry(country)) {
    return null;
  }
  return COUNTRY_CONFIG[country];
} 