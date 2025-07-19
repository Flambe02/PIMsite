"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronUp } from 'lucide-react'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const getCurrentLocale = () => {
    const localeMatch = pathname.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
    return localeMatch ? localeMatch[1] : 'br';
  };

  const currentLocale = getCurrentLocale();

  const switchLanguage = (newLanguage: string) => {
    // Supprimer le locale actuel du pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    
    // Construire le nouveau pathname avec la nouvelle langue
    const newPathname = newLanguage === 'br' ? pathWithoutLocale : `/${newLanguage}${pathWithoutLocale}`;
    
    router.push(newPathname);
    setMenuOpen(false);
  };

  const getLanguageInfo = (locale: string) => {
    switch(locale) {
      case 'br':
        return { name: 'Português', code: 'PT' };
      case 'fr':
        return { name: 'Français', code: 'FR' };
      case 'en':
        return { name: 'English', code: 'EN' };
      default:
        return { name: 'Português', code: 'PT' };
    }
  };

  const currentLanguage = getLanguageInfo(currentLocale);

  const languages = [
    { code: 'br', name: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 transition-all duration-150"
      >
        <span className="text-sm font-medium">{currentLanguage.code}</span>
        <ChevronUp className={`w-3 h-3 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {menuOpen && (
        <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${
                currentLocale === lang.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{lang.name}</span>
                <span className="text-xs text-gray-500">{lang.code}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 