import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const locale = searchParams.get('locale') || 'fr';

  if (!code) {
    return NextResponse.redirect(new URL(`/${locale}/auth/auth-code-error?message=Código de confirmação não encontrado`, request.url));
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Erro exchangeCodeForSession:', error);
      
      if (error.message?.includes('already been used') || error.message?.includes('expired')) {
        return NextResponse.redirect(new URL(`/${locale}/auth/auth-code-error?message=Link já foi utilizado ou expirou`, request.url));
      } else {
        return NextResponse.redirect(new URL(`/${locale}/auth/auth-code-error?message=${encodeURIComponent(error.message)}`, request.url));
      }
    }

    // Récupérer l'utilisateur
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // Détection de la langue cible
    const detectUserLocale = (): string => {
      // Priorité 1: Locale depuis les paramètres de l'URL
      if (locale && ['fr', 'br', 'en'].includes(locale)) {
        return locale;
      }

      // Fallback: français par défaut
      return 'fr';
    };

    const detectedLocale = detectUserLocale();
    
    // Vérifier l'état d'onboarding dans la table profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erreur récupération profil:', profileError);
    }

    // Créer ou mettre à jour le profil avec la locale détectée
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        locale: detectedLocale,
        onboarding_completed: profile?.onboarding_completed || false,
        onboarding_step: profile?.onboarding_step || 0,
        profile_completed: profile?.profile_completed || false,
        preferences_completed: profile?.preferences_completed || false,
        goals_completed: profile?.goals_completed || false
      });

    if (upsertError) {
      console.error('Erreur upsert profil:', upsertError);
    }

    // Redirection intelligente selon l'état d'onboarding
    if (profile?.onboarding_completed) {
      return NextResponse.redirect(new URL(`/${detectedLocale}/dashboard`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/${detectedLocale}/onboarding`, request.url));
    }

  } catch (err) {
    console.error('Erro inesperado:', err);
    return NextResponse.redirect(new URL(`/${locale}/auth/auth-code-error?message=Erro inesperado durante a confirmação`, request.url));
  }
} 