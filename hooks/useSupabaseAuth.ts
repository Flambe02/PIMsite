import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

export function useSupabaseMagicLink() {
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function sendMagicLink(email: string) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined
      }
    })
    setLoading(false)
    return { error }
  }

  return { sendMagicLink, loading }
} 