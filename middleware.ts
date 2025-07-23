// Middleware :
// Ne jamais rediriger vers /desktop ou /mobile dans l'URL !
// Les segments (desktop) et (mobile) servent uniquement à organiser le code.
// Next.js choisit automatiquement le bon layout/page selon la structure du dossier et la logique côté client (useIsMobile, etc).
// Ce middleware ne fait plus aucune redirection d'URL.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/dashboard", "/calculadora"];
const ADMIN_ROUTES = ["/admin"];

// Fonction pour extraire le locale de la pathname
const getLocale = (pathname: string) => {
  const localeMatch = pathname.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
  return localeMatch ? localeMatch[1] : 'br'; // fallback 'br'
}

export function middleware(request: NextRequest) {
  // Ici, on ne fait plus aucune redirection vers /desktop ou /mobile
  // On peut éventuellement poser un cookie ou un header pour le device, mais on laisse Next.js router normalement
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/login',
    '/signup',
    '/calculadora/upload-holerite',
    '/results',
  ],
}; 