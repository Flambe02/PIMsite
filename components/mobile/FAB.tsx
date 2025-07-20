"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface FABProps {
  action?: () => void
  icon?: React.ReactNode
  label?: string
  href?: string
  variant?: "primary" | "secondary" | "success" | "warning"
}

export function FAB({ 
  action, 
  icon, 
  label = "Diagnóstico",
  href,
  variant = "primary"
}: FABProps) {
  const router = useRouter()

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
    <button
      onClick={handleClick}
      className={`fixed bottom-20 right-4 z-40 md:hidden w-14 h-14 rounded-full ${getVariantClasses()} text-white shadow-xl active:scale-95 transition-transform duration-200 flex items-center justify-center`}
      aria-label={label}
    >
      {icon || <Plus className="w-6 h-6" />}
    </button>
  )
} 