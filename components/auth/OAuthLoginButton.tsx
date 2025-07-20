"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/components/supabase-provider"

type OAuthProvider = "google" | "github" | "apple"

interface OAuthLoginButtonProps {
  provider: OAuthProvider
  className?: string
  children?: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

const PROVIDER_CONFIG = {
  google: {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <g>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/>
          <path fill="#FBBC05" d="M9.67 28.09c-1.09-3.25-1.09-6.74 0-9.99l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 36.11l7.98-6.2z"/>
          <path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.54-5.54l-7.19-5.6c-2.01 1.35-4.58 2.14-8.35 2.14-6.38 0-11.87-3.59-14.33-8.84l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </g>
      </svg>
    ),
    label: "Continuer avec Google"
  },
  github: {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    label: "Continuer avec GitHub"
  },
  apple: {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    label: "Continuer avec Apple"
  }
}

export default function OAuthLoginButton({ 
  provider,
  className = "", 
  children,
  variant = "outline",
  size = "default",
  disabled = false
}: OAuthLoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()
  const config = PROVIDER_CONFIG[provider]

  const handleOAuthLogin = async () => {
    setLoading(true)
    
    try {
      // Détection de la langue cible
      const detectUserLocale = (): string => {
        // Priorité 1: Locale de l'URL actuelle
        const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
        const urlLocale = pathname.split('/')[1];
        if (urlLocale && ['fr', 'br', 'en'].includes(urlLocale)) {
          return urlLocale;
        }

        // Priorité 2: Locale du navigateur
        if (typeof window !== 'undefined') {
          const browserLang = navigator.language.toLowerCase();
          if (browserLang.startsWith('pt') || browserLang.startsWith('pt-br')) {
            return 'br';
          }
          if (browserLang.startsWith('fr')) {
            return 'fr';
          }
          if (browserLang.startsWith('en')) {
            return 'en';
          }
        }

        // Fallback: français par défaut
        return 'fr';
      };

      const detectedLocale = detectUserLocale();
      
      // Configuration dynamique selon l'environnement
      const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : window.location.origin;

      // Redirection vers le callback auth
      const redirectTo = `${baseUrl}/auth/callback?locale=${detectedLocale}`;

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            locale: detectedLocale
          }
        }
      })
    } catch (error) {
      console.error(`Erreur connexion ${provider}:`, error)
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
      onClick={handleOAuthLogin}
      disabled={disabled || loading}
      data-testid={`${provider}-login-button`}
    >
      {loading ? (
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        config.icon
      )}
      
      {children || (loading ? "Connexion..." : config.label)}
    </Button>
  )
} 