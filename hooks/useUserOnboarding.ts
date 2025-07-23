import { useEffect, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";

export interface UserOnboardingState {
  profile_completed: boolean;
  checkup_completed: boolean;
  holerite_uploaded: boolean;
}

export function useUserOnboarding(userId?: string) {
  const { supabase } = useSupabase();
  const [state, setState] = useState<UserOnboardingState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('user_onboarding')
      .select('profile_completed, checkup_completed, holerite_uploaded')
      .eq('user_id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setState(data as UserOnboardingState);
        setLoading(false);
      });
  }, [userId, supabase]);

  const updateFlags = async (flags: Partial<UserOnboardingState>) => {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase
      .from('user_onboarding')
      .update(flags)
      .eq('user_id', userId);
    if (error) setError(error.message);
    else setState(prev => ({ ...prev!, ...flags }));
    setLoading(false);
  };

  return { onboarding: state, loading, error, updateFlags };
}
export default useUserOnboarding;

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