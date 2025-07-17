import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import { useSupabase } from "@/components/supabase-provider";

interface UserOnboardingState {
  profile_completed: boolean;
  checkup_completed: boolean;
  holerite_uploaded: boolean;
  onboarding_complete: boolean;
  progress: number;
}

export function useUserOnboarding(userId?: string): UserOnboardingState | null {
  const [state, setState] = useState<UserOnboardingState | null>(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    async function fetchOnboarding() {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('profile_completed, checkup_completed, holerite_uploaded')
        .eq('user_id', userId)
        .single();
      if (error) {
        console.log('Erreur fetch user_onboarding:', error.message);
        if (isMounted) setState(null);
        return;
      }
      const steps = [data?.profile_completed, data?.checkup_completed, data?.holerite_uploaded];
      const completed = steps.filter(Boolean).length;
      const progress = Math.round((completed / steps.length) * 100);
      if (isMounted) setState({
        profile_completed: !!data?.profile_completed,
        checkup_completed: !!data?.checkup_completed,
        holerite_uploaded: !!data?.holerite_uploaded,
        onboarding_complete: steps.every(Boolean),
        progress
      });
    }
    fetchOnboarding();
    return () => { isMounted = false; };
  }, [userId]);

  return state;
}

export function useOnboardingPhase1() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { supabase } = useSupabase();

  useEffect(() => {
    async function fetchEmail() {
      setIsLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);
      if (!user) setError("Sessão não encontrada. Faça login novamente.");
      if (error) setError(error.message);
      setIsLoading(false);
    }
    fetchEmail();
  }, []);

  async function savePerfil({ firstName, lastName, password }: { firstName: string, lastName: string, password: string }) {
    setLoading(true); setError("");
    try {
      // 1. Update password in Auth
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) throw new Error(passError.message);
      // 2. Update profile (firstName, lastName)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', user.id);
      if (profileError) throw new Error(profileError.message);
      // 3. Mark onboarding phase 1 complete
      const { error: onboardingError } = await supabase
        .from('user_onboarding')
        .update({ profile_completed: true })
        .eq('user_id', user.id);
      if (onboardingError) throw new Error(onboardingError.message);
      setLoading(false);
      return true;
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
      setLoading(false);
      return false;
    }
  }

  return { email, loading, isLoading, error, savePerfil };
} 