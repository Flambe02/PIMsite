"use client"

import { useEffect } from "react"
import { FAB } from "./FAB"
import { BottomTabBar } from "./BottomTabBar"

interface MobilePageWrapperProps {
  title?: string
  children: React.ReactNode
  showFAB?: boolean
  fabAction?: () => void
  fabIcon?: React.ReactNode
  fabLabel?: string
}

export function MobilePageWrapper({ 
  title, 
  children, 
  showFAB = true,
  fabAction,
  fabIcon,
  fabLabel = "Diagnóstico"
}: MobilePageWrapperProps) {
  
  // Mise à jour du titre de la page
  useEffect(() => {
    if (title) {
      document.title = `${title} - PIM`
    }
  }, [title])

  return (
    <div className="md:hidden min-h-screen flex flex-col justify-between bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Contenu principal scrollable */}
      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-28">
        {children}
      </main>
      
      {/* Floating Action Button */}
      {showFAB && (
        <FAB 
          action={fabAction}
          icon={fabIcon}
          label={fabLabel}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomTabBar />
    </div>
  )
} 