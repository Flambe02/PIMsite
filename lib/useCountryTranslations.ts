import br from '../locales/br.json';
import fr from '../locales/fr.json';

export function useCountryTranslations(country: 'br' | 'fr') {
  if (country === 'fr') return fr;
  return br;
} 