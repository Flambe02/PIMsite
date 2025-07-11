import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface UserOnboardingState {
  profile_completed: boolean;
  checkup_completed: boolean;
  holerite_uploaded: boolean;
  onboarding_complete: boolean;
  progress: number;
}

export function useUserOnboarding(userId?: string): UserOnboardingState | null {
  const [state, setState] = useState<UserOnboardingState | null>(null);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClientComponentClient();
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