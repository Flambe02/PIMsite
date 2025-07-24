import { useState } from "react"
import { createClient } from "@/lib/supabase/client";

export function useSupabaseMagicLink() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient();

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