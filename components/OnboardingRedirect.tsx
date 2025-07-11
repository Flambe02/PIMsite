"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

interface OnboardingRedirectProps {
  children: React.ReactNode
}

export default function OnboardingRedirect({ children }: OnboardingRedirectProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsLoading(false)
          return
        }

        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, financial_health_score')
          .eq('id', user.id)
          .single()

        if (!profile || !profile.onboarding_completed) {
          setNeedsOnboarding(true)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        setIsLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [supabase])

  useEffect(() => {
    if (needsOnboarding) {
      router.push('/onboarding')
    }
  }, [needsOnboarding, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (needsOnboarding) {
    return null
  }

  return <>{children}</>
} 