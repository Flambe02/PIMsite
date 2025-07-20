"use client"

import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import dynamic from "next/dynamic"

// Import dynamique des composants mobile et desktop
const MobileHome = dynamic(() => import("./home/mobile/MobileHome"), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement de la version mobile...</div>,
  ssr: false
})

const DesktopHome = dynamic(() => import("./home/desktop/DesktopHome"), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement de la version desktop...</div>,
  ssr: false
})

export default function Home() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  
  const getCurrentLocale = () => {
    const localeMatch = pathname.match(/^\/([a-z]{2}(-[a-z]{2})?)/)
    return localeMatch ? localeMatch[1] : 'br'
  }
  
  const currentLocale = getCurrentLocale()

  // Logique de sélection mobile/desktop
  if (isMobile) {
    return <MobileHome locale={currentLocale} />
  } else {
    return <DesktopHome locale={currentLocale} />
  }
}
