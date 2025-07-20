import { createBrowserClient } from '@supabase/ssr'

export interface LogoutOptions {
  redirectTo?: string
  showToast?: boolean
}

export async function logout(options: LogoutOptions = {}) {
  const { redirectTo = '/', showToast = true } = options
  
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Déconnexion de Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Erreur lors de la déconnexion:', error)
      throw error
    }

    // Nettoyer le localStorage si nécessaire
    if (typeof window !== 'undefined') {
      // Supprimer les données de session locales
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
    }

    // Redirection
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    
    // En cas d'erreur, forcer la redirection
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
    
    return { success: false, error }
  }
} 