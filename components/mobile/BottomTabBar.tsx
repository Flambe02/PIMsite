"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Home, BarChart3, MessageSquare, User } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import dynamic from "next/dynamic"

const LoginModal = dynamic(() => import("@/components/auth/LoginModal"), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement du module de connexion...</div>,
  ssr: false
})

interface TabItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
  requiresAuth?: boolean
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
    label: "Score",
    requiresAuth: true
  },
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Chat",
    requiresAuth: true
  },
  {
    href: "/account",
    icon: User,
    label: "Moi",
    requiresAuth: true
  }
]

export function BottomTabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    let mounted = true
    async function fetchSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setSession(session)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
        if (mounted) setLoading(false)
      }
    }
    fetchSession()
    return () => { mounted = false }
  }, [supabase])

  const handleTabClick = (href: string, requiresAuth?: boolean) => {
    // Si l'onglet nécessite une authentification et l'utilisateur n'est pas connecté
    if (requiresAuth && !session) {
      setLoginOpen(true)
      return
    }
    
    // Sinon, navigation normale
    router.push(href)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-slate-200 px-6 py-2">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href
            
            return (
              <button
                key={tab.href}
                onClick={() => handleTabClick(tab.href, tab.requiresAuth)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors relative ${
                  isActive 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-500 hover:text-emerald-600'
                }`}
                aria-label={tab.label}
                disabled={loading}
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
      
      {/* Modal de connexion */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
} 