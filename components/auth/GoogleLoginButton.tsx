"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/components/supabase-provider"

interface GoogleLoginButtonProps {
  className?: string
  children?: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

export default function GoogleLoginButton({ 
  className = "", 
  children,
  variant = "outline",
  size = "default",
  disabled = false
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()

  const handleGoogleLogin = async () => {
    setLoading(true)
    
    try {
      // Configuration dynamique selon l'environnement
      const redirectTo = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/dashboard'
        : `${window.location.origin}/dashboard`

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      })
    } catch (error) {
      console.error('Erreur connexion Google:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={`flex items-center justify-center gap-2 ${className}`}
      onClick={handleGoogleLogin}
      disabled={disabled || loading}
    >
      {/* Icône Google officielle */}
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <g>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/>
          <path fill="#FBBC05" d="M9.67 28.09c-1.09-3.25-1.09-6.74 0-9.99l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 36.11l7.98-6.2z"/>
          <path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.54-5.54l-7.19-5.6c-2.01 1.35-4.58 2.14-8.35 2.14-6.38 0-11.87-3.59-14.33-8.84l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </g>
      </svg>
      
      {children || (loading ? "Connexion..." : "Continuer avec Google")}
    </Button>
  )
} 