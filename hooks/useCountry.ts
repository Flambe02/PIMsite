import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export type Country = 'br' | 'fr' | 'es' | 'autre';

export interface CountryConfig {
  code: Country;
  name: string;
  language: string;
  flag: string;
  currency: string;
}

export const COUNTRY_CONFIGS: Record<Country, CountryConfig> = {
  br: {
    code: 'br',
    name: 'Brasil',
    language: 'pt',
    flag: '🇧🇷',
    currency: 'R$'
  },
  fr: {
    code: 'fr',
    name: 'France',
    language: 'fr',
    flag: '🇫🇷',
    currency: '€'
  },
  es: {
    code: 'es',
    name: 'España',
    language: 'es',
    flag: '🇪🇸',
    currency: '€'
  },
  autre: {
    code: 'autre',
    name: 'Autre',
    language: 'en',
    flag: '🌍',
    currency: '$'
  }
};

export function useCountry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCountry, setCurrentCountry] = useState<Country>('br');
  const [isLoading, setIsLoading] = useState(true);

  // Détection initiale du pays
  useEffect(() => {
    const detectCountry = () => {
      // 1. Vérifier le paramètre URL
      const urlCountry = searchParams?.get('country') as Country;
      if (urlCountry && COUNTRY_CONFIGS[urlCountry]) {
        setCurrentCountry(urlCountry);
        return;
      }

      // 2. Vérifier le localStorage
      const storedCountry = localStorage.getItem('pim_country') as Country;
      if (storedCountry && COUNTRY_CONFIGS[storedCountry]) {
        setCurrentCountry(storedCountry);
        return;
      }

      // 3. Détection automatique basée sur la géolocalisation
      if (navigator.language) {
        const lang = navigator.language.toLowerCase();
        if (lang.startsWith('pt')) {
          setCurrentCountry('br');
        } else if (lang.startsWith('fr')) {
          setCurrentCountry('fr');
        } else if (lang.startsWith('es')) {
          setCurrentCountry('es');
        } else {
          setCurrentCountry('br'); // Par défaut
        }
      } else {
        setCurrentCountry('br'); // Par défaut
      }
    };

    detectCountry();
    setIsLoading(false);
  }, [searchParams]);

  // Changer de pays
  const changeCountry = (newCountry: Country) => {
    if (!COUNTRY_CONFIGS[newCountry]) return;

    setCurrentCountry(newCountry);
    localStorage.setItem('pim_country', newCountry);

    // Mettre à jour l'URL
    const newSearchParams = new URLSearchParams(searchParams || '');
    newSearchParams.set('country', newCountry);
    router.push(`?${newSearchParams.toString()}`);
  };

  // Obtenir la configuration du pays actuel
  const getCurrentCountryConfig = () => COUNTRY_CONFIGS[currentCountry];

  // Obtenir la langue du pays actuel
  const getCurrentLanguage = () => COUNTRY_CONFIGS[currentCountry].language;

  return {
    currentCountry,
    changeCountry,
    getCurrentCountryConfig,
    getCurrentLanguage,
    isLoading,
    availableCountries: Object.values(COUNTRY_CONFIGS)
  };
} 