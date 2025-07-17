"use client"
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from "@/components/supabase-provider";

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function handleAuth() {
      const code = searchParams.get('code')
      if (code) {
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
              if (insertError) console.error('Erreur insert user_onboarding:', insertError.message)
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
          console.error('Erreur exchangeCodeForSession:', error)
          alert('Erreur exchangeCodeForSession: ' + (error.message || 'Erreur inconnue'));
          const params = new URLSearchParams({ message: error.message || 'Erreur inconnue' })
          router.replace(`/auth/auth-code-error?${params.toString()}`)
        }
      } else {
        router.replace('/auth/auth-code-error?message=Code manquant')
      }
      setLoading(false)
    }
    handleAuth()
    // eslint-disable-next-line
  }, [])

  return <div>Connexion en cours...</div>
} 