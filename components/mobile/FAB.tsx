"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import dynamic from "next/dynamic"

const LoginModal = dynamic(() => import("@/components/LoginModal").then(m => m.LoginModal), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement du module de connexion...</div>,
  ssr: false
})

interface FABProps {
  action?: () => void
  icon?: React.ReactNode
  label?: string
  href?: string
  variant?: "primary" | "secondary" | "success" | "warning"
  requiresAuth?: boolean
}

export function FAB({ 
  action, 
  icon, 
  label = "Diagnóstico",
  href,
  variant = "primary",
  requiresAuth = false
}: FABProps) {
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

  // Classes de couleur selon la variante
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-slate-600 hover:bg-slate-700"
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700"
      case "warning":
        return "bg-orange-600 hover:bg-orange-700"
      default:
        return "bg-emerald-600 hover:bg-emerald-700"
    }
  }

  const handleClick = () => {
    // Si l'action nécessite une authentification et l'utilisateur n'est pas connecté
    if (requiresAuth && !session) {
      setLoginOpen(true)
      return
    }
    
    if (action) {
      action()
    } else if (href) {
      router.push(href)
    } else {
      // Action par défaut : navigation vers calculadora
      router.push('/calculadora')
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`fixed bottom-20 right-4 z-40 md:hidden w-14 h-14 rounded-full ${getVariantClasses()} text-white shadow-xl active:scale-95 transition-transform duration-200 flex items-center justify-center`}
        aria-label={label}
        disabled={loading}
      >
        {icon || <Plus className="w-6 h-6" />}
      </button>
      
      {/* Modal de connexion */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
} 