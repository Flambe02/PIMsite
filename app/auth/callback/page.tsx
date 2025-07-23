"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabase } from "@/components/supabase-provider";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useUserOnboarding from "@/hooks/useUserOnboarding";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // pas besoin de null check, jamais null
  const { supabase } = useSupabase();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Centralise la redirection post-auth
  const { onboarding } = useUserOnboarding(user?.id);
  useAuthRedirect(user);

  useEffect(() => {
    async function handleAuth() {
      const code = searchParams.get('code');
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
          } else {
            setError(error.message);
            setLoading(false);
          }
        } catch (err: any) {
          setError(err.message || 'Erro inesperado durante a confirmação');
          setLoading(false);
        }
      } else {
        setError('Código de confirmação não encontrado');
        setLoading(false);
      }
    }
    handleAuth();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-emerald-700 text-lg font-semibold">Conectando... Aguarde um instante.</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-700 text-lg font-semibold">Erro: {error}</div>;
  }
  return null;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
} 