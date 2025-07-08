'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = createClient()

  // Déconnecte l'utilisateur
  await supabase.auth.signOut()

  // Redirige vers la page d'accueil après la déconnexion
  redirect('/')
} 