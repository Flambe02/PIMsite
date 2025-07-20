"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from "@/components/supabase-provider";

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase } = useSupabase();
  const [_loading, setLoading] = useState(true)
  const [error, _setError] = useState<string | null>(null)

  // Détection de la langue cible
  const detectUserLocale = (): string => {
    // Priorité 1: Locale depuis les paramètres de l'URL
    const urlLocale = searchParams.get('locale');
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

  useEffect(() => {
    async function handleAuth() {
      const code = searchParams.get('code')
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (!error) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              // Détecter la locale
              const detectedLocale = detectUserLocale();
              
              // Vérifier l'état d'onboarding dans la table profiles
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

              if (profileError && profileError.code !== 'PGRST116') {
                console.error('Erreur récupération profil:', profileError);
              }

              // Créer ou mettre à jour le profil avec la locale détectée
              const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({
                  id: user.id,
                  email: user.email,
                  locale: detectedLocale,
                  onboarding_completed: profile?.onboarding_completed || false,
                  onboarding_step: profile?.onboarding_step || 0,
                  profile_completed: profile?.profile_completed || false,
                  preferences_completed: profile?.preferences_completed || false,
                  goals_completed: profile?.goals_completed || false
                });

              if (upsertError) {
                console.error('Erreur upsert profil:', upsertError);
              }

              // Redirection intelligente selon l'état d'onboarding
              if (profile?.onboarding_completed) {
                router.replace(`/${detectedLocale}/dashboard`);
              } else {
                router.replace(`/${detectedLocale}/onboarding`);
              }
            } else {
              router.replace(`/${detectedLocale}/login`);
            }
          } else {
            console.error('Erro exchangeCodeForSession:', error)
            const detectedLocale = detectUserLocale();
            if (error.message?.includes('already been used') || error.message?.includes('expired')) {
              router.replace(`/${detectedLocale}/auth/auth-code-error?message=Link já foi utilizado ou expirou`)
            } else {
              router.replace(`/${detectedLocale}/auth/auth-code-error?message=${encodeURIComponent(error.message)}`)
            }
          }
        } catch (err) {
          console.error('Erro inesperado:', err)
          const detectedLocale = detectUserLocale();
          router.replace(`/${detectedLocale}/auth/auth-code-error?message=Erro inesperado durante a confirmação`)
        }
      } else {
        const detectedLocale = detectUserLocale();
        router.replace(`/${detectedLocale}/auth/auth-code-error?message=Código de confirmação não encontrado`)
      }
      setLoading(false)
    }
    handleAuth()
    // eslint-disable-next-line
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-700 text-lg font-semibold">
        Erro: {error}
      </div>
    )
  }

  return <div className="flex items-center justify-center min-h-screen text-emerald-700 text-lg font-semibold">Conectando... Aguarde um instante.</div>
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthCallbackContent />
    </Suspense>
  )
} 