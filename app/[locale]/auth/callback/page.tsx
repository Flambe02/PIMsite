"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'br';
  const { supabase } = useSupabase();
  const hasRun = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleAuth() {
      if (hasRun.current) return;
      hasRun.current = true;

      const code = searchParams!.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        const { data: { session } } = await supabase.auth.getSession();
        if (session && !error) {
          // Vérifie si l'onboarding est complet
          const { data: onboarding } = await supabase
            .from('user_onboarding')
            .select('profile_completed, checkup_completed, holerite_uploaded')
            .eq('user_id', session.user.id)
            .single();
          const onboardingComplete = onboarding && onboarding.profile_completed && onboarding.checkup_completed && onboarding.holerite_uploaded;
          if (!onboardingComplete) {
            router.replace(`/${locale}/onboarding?step=1`);
          } else {
            router.replace(`/${locale}/dashboard`);
          }
        } else {
          router.replace(`/${locale}/login`);
        }
      } else {
        router.replace(`/${locale}/login`);
      }
      setLoading(false);
    }
    handleAuth();
  }, [router, searchParams, supabase, locale]);

  return (
    <div className="flex items-center justify-center min-h-screen text-emerald-700 text-lg font-semibold">
      {loading ? "Connexion en cours..." : "Redirection..."}
    </div>
  );
} 