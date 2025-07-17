import { NextRequest, NextResponse } from "next/server"

// Ce route handler ne gère plus l'échange de code Supabase (fait côté client dans page.tsx)
// Il peut servir à afficher une page d'erreur ou à d'autres callbacks API si besoin.

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  // Redirige vers une page d'erreur explicite
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 