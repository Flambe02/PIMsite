'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function LocaleHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Définir la langue basée sur l'URL de manière sûre côté client
    if (pathname) {
      const localeMatch = pathname.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
      const locale = localeMatch ? localeMatch[1] : 'br';
      
      // Mettre à jour l'attribut lang du document
      document.documentElement.lang = locale;
      
      // Optionnel : Mettre à jour le titre de la page avec la langue
      const htmlElement = document.querySelector('html');
      if (htmlElement) {
        htmlElement.setAttribute('lang', locale);
      }
    }
  }, [pathname]);

  return null; // Ce composant ne rend rien
} 