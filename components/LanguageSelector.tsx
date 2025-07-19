"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()

  const getCurrentLocale = () => {
    const localeMatch = pathname.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
    return localeMatch ? localeMatch[1] : 'br';
  };

  const currentLocale = getCurrentLocale();

  const switchLocale = (newLocale: string) => {
    // Supprimer le locale actuel du pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    
    // Construire le nouveau pathname avec le nouveau locale
    const newPathname = newLocale === 'br' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPathname);
  };

  return (
    <div className="flex gap-1">
      <Button
        variant={currentLocale === 'br' ? "default" : "outline"}
        size="sm"
        onClick={() => switchLocale('br')}
        className={currentLocale === 'br' ? "bg-emerald-600 text-white" : "text-emerald-600 border-emerald-600"}
      >
        🇧🇷 BR
      </Button>
      <Button
        variant={currentLocale === 'en' ? "default" : "outline"}
        size="sm"
        onClick={() => switchLocale('en')}
        className={currentLocale === 'en' ? "bg-emerald-600 text-white" : "text-emerald-600 border-emerald-600"}
      >
        🇺🇸 EN
      </Button>
      <Button
        variant={currentLocale === 'fr' ? "default" : "outline"}
        size="sm"
        onClick={() => switchLocale('fr')}
        className={currentLocale === 'fr' ? "bg-emerald-600 text-white" : "text-emerald-600 border-emerald-600"}
      >
        🇫🇷 FR
      </Button>
    </div>
  )
} 