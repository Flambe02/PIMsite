"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, BarChart3, MessageSquare, User } from "lucide-react"

interface TabItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
}

const tabs: TabItem[] = [
  {
    href: "/",
    icon: Home,
    label: "Accueil"
  },
  {
    href: "/dashboard",
    icon: BarChart3,
    label: "Score"
  },
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Chat"
  },
  {
    href: "/account",
    icon: User,
    label: "Moi"
  }
]

export function BottomTabBar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleTabClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-slate-200 px-6 py-2">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href
          
          return (
            <button
              key={tab.href}
              onClick={() => handleTabClick(tab.href)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors relative ${
                isActive 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
              aria-label={tab.label}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
              
              {/* Badge de notification */}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
} 