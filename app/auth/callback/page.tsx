"use client"
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from "@/components/supabase-provider";

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleAuth() {
      const code = searchParams.get('code')
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (!error) {
            // Vérifie l'état d'onboarding et initialise si besoin
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              // Vérifier ou initialiser la ligne user_onboarding
              let { data, error: onboardingError } = await supabase
                .from('user_onboarding')
                .select('profile_completed, checkup_completed, holerite_uploaded')
                .eq('user_id', user.id)
                .single()
              if (!data) {
                // Créer la ligne si elle n'existe pas
                const { error: insertError } = await supabase
                  .from('user_onboarding')
                  .upsert({
                    user_id: user.id,
                    profile_completed: false,
                    checkup_completed: false,
                    holerite_uploaded: false
                  })
                if (insertError) console.error('Erro insert user_onboarding:', insertError.message)
                data = { profile_completed: false, checkup_completed: false, holerite_uploaded: false }
              }
              const onboardingComplete = data.profile_completed && data.checkup_completed && data.holerite_uploaded
              if (onboardingComplete) {
                router.replace('/dashboard')
                return
              }
            }
            router.replace('/onboarding')
          } else {
            console.error('Erro exchangeCodeForSession:', error)
            // Gérer spécifiquement le cas où le lien a déjà été utilisé
            if (error.message?.includes('already been used') || error.message?.includes('expired')) {
              router.replace('/auth/auth-code-error?message=Link já foi utilizado ou expirou')
            } else {
              router.replace(`/auth/auth-code-error?message=${encodeURIComponent(error.message)}`)
            }
          }
        } catch (err) {
          console.error('Erro inesperado:', err)
          router.replace('/auth/auth-code-error?message=Erro inesperado durante a confirmação')
        }
      } else {
        router.replace('/auth/auth-code-error?message=Código de confirmação não encontrado')
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