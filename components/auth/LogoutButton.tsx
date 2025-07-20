"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { logout } from "@/lib/logout"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
  redirectTo?: string
  showIcon?: boolean
}

export default function LogoutButton({
  variant = "outline",
  size = "default",
  className = "",
  children,
  redirectTo = "/",
  showIcon = true
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    
    try {
      await logout({ redirectTo })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={loading}
      data-testid="logout-button"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : showIcon ? (
        <LogOut className="w-4 h-4" />
      ) : null}
      
      {children || (loading ? "Déconnexion..." : "Se déconnecter")}
    </Button>
  )
} 