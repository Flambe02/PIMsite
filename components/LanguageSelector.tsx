"use client"

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe } from 'lucide-react'

const languages = {
  br: { name: 'Português', flag: '🇧🇷' },
  fr: { name: 'Français', flag: '🇫🇷' },
  en: { name: 'English', flag: '🇺🇸' }
}

export function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    // Supprimer le locale actuel du pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    
    // Construire le nouveau pathname avec le nouveau locale
    const newPathname = newLocale === 'br' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`
    
    router.push(newPathname)
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[180px]">
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([code, lang]) => (
          <SelectItem key={code} value={code}>
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 