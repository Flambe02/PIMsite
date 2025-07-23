"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function CountrySelector() {
  const router = useRouter()
  const pathname = usePathname()

  const getCurrentLocale = () => {
    const localeMatch = pathname?.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
    return localeMatch ? localeMatch[1] : 'br';
  };

  const currentLocale = getCurrentLocale();

  const switchCountry = (newCountry: string) => {
    // Supprimer le locale actuel du pathname
    const pathWithoutLocale = pathname?.replace(`/${currentLocale}`, '') || '/';
    
    // Construire le nouveau pathname avec le nouveau pays
    const newPathname = newCountry === 'br' ? pathWithoutLocale : `/${newCountry}${pathWithoutLocale}`;
    
    router.push(newPathname);
  };

  return (
    <div className="flex gap-1">
      <Button
        variant={currentLocale === 'br' ? "default" : "outline"}
        size="sm"
        onClick={() => switchCountry('br')}
        className={currentLocale === 'br' ? "bg-emerald-600 text-white" : "text-emerald-600 border-emerald-600"}
      >
        🇧🇷 Brasil
      </Button>
      <Button
        variant={currentLocale === 'en' ? "default" : "outline"}
        size="sm"
        onClick={() => switchCountry('en')}
        className={currentLocale === 'en' ? "bg-emerald-600 text-white" : "text-emerald-600 border-emerald-600"}
      >
        🇺🇸 USA
      </Button>
      <Button
        variant={currentLocale === 'fr' ? "default" : "outline"}
        size="sm"
        onClick={() => switchCountry('fr')}
        className={currentLocale === 'fr' ? "bg-emerald-600 text-white" : "text-emerald-600 border-emerald-600"}
      >
        🇫🇷 France
      </Button>
    </div>
  )
} 