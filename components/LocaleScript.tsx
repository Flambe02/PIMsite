'use client';

import { useEffect } from 'react';

export function LocaleScript() {
  useEffect(() => {
    // Définir la langue basée sur l'URL (côté client uniquement)
    const path = window.location.pathname;
    const localeMatch = path.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
    const locale = localeMatch ? localeMatch[1] : 'br';
    document.documentElement.lang = locale;
  }, []);

  return null;
} 