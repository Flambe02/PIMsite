"use client";
import { createClient } from "@/lib/supabase/client";
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";

interface SupabaseContextType {
  supabase: SupabaseClient;
  session: Session | null;
  loading: boolean;
}

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ initialSession, children }:{
  initialSession: Session | null; children: ReactNode
}) {
  const [supabaseClient] = useState(() => createClient());

  const [session, setSession] = useState(initialSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  const value = {
    supabase: supabaseClient,
    session,
    loading
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

// Hook utilitaire pour forcer la présence d'une session utilisateur
export function useRequireSession(redirectTo?: string) {
  const { session } = useSupabase();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'br';
  useEffect(() => {
    if (session === null) {
      router.replace(`/${locale}/login${redirectTo ? `?redirectTo=${redirectTo}` : ''}`);
    }
  }, [session, router, locale, redirectTo]);
  return session;
} 