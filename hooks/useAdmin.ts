import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true)
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          setIsAdmin(false)
          setLoading(false)
          return
        }
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        if (profileError) {
          setError(profileError.message)
          setIsAdmin(false)
        } else {
          setIsAdmin(profile?.is_admin || false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }
    checkAdminStatus()
  }, [])

  return { isAdmin, loading, error }
} 