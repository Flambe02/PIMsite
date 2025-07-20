import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { locales, type Locale } from '@/lib/i18n-simple';

export interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  profileCompleted: boolean;
  preferencesCompleted: boolean;
  goalsCompleted: boolean;
  locale: Locale;
}

export interface UserProfile {
  id: string;
  email: string;
  locale?: Locale;
  onboarding_completed?: boolean;
  onboarding_step?: number;
  profile_completed?: boolean;
  preferences_completed?: boolean;
  goals_completed?: boolean;
  created_at: string;
}

export function useUserOnboarding(user: User | null) {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isCompleted: false,
    currentStep: 0,
    profileCompleted: false,
    preferencesCompleted: false,
    goalsCompleted: false,
    locale: 'fr'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Détection de la langue cible
  const detectUserLocale = (): Locale => {
    // Priorité 1: Locale de l'utilisateur en session
    if (user?.user_metadata?.locale && locales.includes(user.user_metadata.locale as Locale)) {
      return user.user_metadata.locale as Locale;
    }

    // Priorité 2: Locale du navigateur
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('pt') || browserLang.startsWith('pt-br')) {
        return 'br';
      }
      if (browserLang.startsWith('fr')) {
        return 'fr';
      }
      if (browserLang.startsWith('en')) {
        return 'en';
      }
    }

    // Priorité 3: Locale de l'URL actuelle
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const urlLocale = pathname.split('/')[1];
    if (urlLocale && locales.includes(urlLocale as Locale)) {
      return urlLocale as Locale;
    }

    // Fallback: français par défaut
    return 'fr';
  };

  // Charger l'état de l'onboarding depuis Supabase
  const loadOnboardingState = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Détecter la locale
      const detectedLocale = detectUserLocale();

      // État par défaut
      const defaultState: OnboardingState = {
        isCompleted: false,
        currentStep: 0,
        profileCompleted: false,
        preferencesCompleted: false,
        goalsCompleted: false,
        locale: detectedLocale
      };

      if (profile) {
        // Utiliser les données du profil si disponibles
        setOnboardingState({
          isCompleted: profile.onboarding_completed || false,
          currentStep: profile.onboarding_step || 0,
          profileCompleted: profile.profile_completed || false,
          preferencesCompleted: profile.preferences_completed || false,
          goalsCompleted: profile.goals_completed || false,
          locale: profile.locale || detectedLocale
        });
      } else {
        // Créer un profil par défaut
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            locale: detectedLocale,
            onboarding_completed: false,
            onboarding_step: 0,
            profile_completed: false,
            preferences_completed: false,
            goals_completed: false
          });

        if (insertError) {
          console.error('Erreur création profil:', insertError);
        }

        setOnboardingState(defaultState);
      }
    } catch (err) {
      console.error('Erreur chargement onboarding:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour l'état de l'onboarding
  const updateOnboardingState = async (updates: Partial<OnboardingState>) => {
    if (!user) return;

    try {
      const newState = { ...onboardingState, ...updates };
      setOnboardingState(newState);

      // Mettre à jour en base
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: newState.isCompleted,
          onboarding_step: newState.currentStep,
          profile_completed: newState.profileCompleted,
          preferences_completed: newState.preferencesCompleted,
          goals_completed: newState.goalsCompleted,
          locale: newState.locale
        })
        .eq('id', user.id);

      if (error) {
        console.error('Erreur mise à jour onboarding:', error);
        throw error;
      }
    } catch (err) {
      console.error('Erreur mise à jour état:', err);
      setError(err instanceof Error ? err.message : 'Erreur mise à jour');
    }
  };

  // Changer de locale
  const changeLocale = async (newLocale: Locale) => {
    await updateOnboardingState({ locale: newLocale });
  };

  // Passer à l'étape suivante
  const nextStep = async () => {
    const nextStepNumber = onboardingState.currentStep + 1;
    const isCompleted = nextStepNumber >= 3; // 3 étapes totales

    await updateOnboardingState({
      currentStep: nextStepNumber,
      isCompleted
    });
  };

  // Marquer une section comme complétée
  const completeSection = async (section: 'profile' | 'preferences' | 'goals') => {
    const updates: Partial<OnboardingState> = {};
    
    switch (section) {
      case 'profile':
        updates.profileCompleted = true;
        break;
      case 'preferences':
        updates.preferencesCompleted = true;
        break;
      case 'goals':
        updates.goalsCompleted = true;
        break;
    }

    await updateOnboardingState(updates);
  };

  // Charger l'état au montage et quand l'utilisateur change
  useEffect(() => {
    loadOnboardingState();
  }, [user]);

  return {
    onboardingState,
    loading,
    error,
    updateOnboardingState,
    changeLocale,
    nextStep,
    completeSection,
    detectUserLocale
  };
} 