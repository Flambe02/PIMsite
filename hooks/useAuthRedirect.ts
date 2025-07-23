"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/supabase-provider';
import { useUserOnboarding } from './useUserOnboarding';
import { User } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

export function useAuthRedirect(user: User | null) {
    const router = useRouter();
    const { supabase } = useSupabase();
    const params = useParams();
    const locale = params?.locale || 'br';

    useEffect(() => {
        if (!user) return;

        const checkOnboardingAndRedirect = async () => {
            const { data: onboarding } = await supabase
                .from('user_onboarding')
                .select('profile_completed, checkup_completed, holerite_uploaded')
                .eq('user_id', user.id)
                .single();

            // L'utilisateur est toujours redirigé vers le dashboard.
            // La logique pour compléter l'onboarding est gérée SUR le dashboard.
            router.replace(`/${locale}/dashboard`);
        };

        checkOnboardingAndRedirect();

    }, [user, router, supabase, locale]);
} 