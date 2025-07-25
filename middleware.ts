// Middleware :
// Ne jamais rediriger vers /desktop ou /mobile dans l'URL !
// Les segments (desktop) et (mobile) servent uniquement à organiser le code.
// Next.js choisit automatiquement le bon layout/page selon la structure du dossier et la logique côté client (useIsMobile, etc).
// Ce middleware ne fait plus aucune redirection d'URL.

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  // Synchronise les cookies d'auth Supabase à chaque requête
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll().map(({ name, value }) => ({ name, value })),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options });
          });
        }
      }
    }
  );
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: [
    // Protéger toutes les routes sauf les assets statiques
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 