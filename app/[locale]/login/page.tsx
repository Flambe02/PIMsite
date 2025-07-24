"use client"

export const dynamic = 'force-dynamic';

import { useState, Suspense, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { OAuthLoginButton } from "@/components/OAuthLoginButton";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useUserOnboarding from "@/hooks/useUserOnboarding";

function LoginPageContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oauthError, setOauthError] = useState("");
  const router = useRouter();
  const params = useParams();
  const locale = typeof params!.locale === 'string' ? params!.locale : Array.isArray(params!.locale) ? params!.locale[0] : 'br';
  const { supabase } = useSupabase();

  // Centralise la redirection post-auth
  const { onboarding } = useUserOnboarding(user?.id);
  useAuthRedirect(user);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message || "Email ou senha inválidos.");
      setLoading(false);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setOauthError("");
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/${locale}/auth/callback` : undefined
        }
      });
    } catch (err: any) {
      setOauthError(err.message || "Erro Google OAuth");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-emerald-50 py-6 px-2">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Entrar na sua conta</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={e => { e.preventDefault(); handleLogin(); }}
        >
          <input
            type="email"
            className="border rounded px-4 py-3"
            placeholder="Digite seu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="border rounded px-4 py-3"
            placeholder="Digite sua senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full mt-2"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <div className="my-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <OAuthLoginButton provider="google" label="Entrar com Google" onClick={handleGoogleLogin} loading={loading} />
        {oauthError && <div className="text-red-600 text-sm text-center mt-2">{oauthError}</div>}
        <button
          className="text-sm text-emerald-600 hover:text-emerald-500 mt-6"
          onClick={() => router.push(`/${locale}/signup`)}
        >Não tem uma conta? Criar conta</button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params!.locale === 'string' ? params!.locale : 'br';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(`/${locale}/dashboard`);
      }
    });
  }, [supabase, router, locale]);

  return (
    <>
      {/* Affiche la valeur réelle de NEXT_PUBLIC_SUPABASE_URL en haut de la page login */}
      <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>
        SUPABASE_URL = {process.env.NEXT_PUBLIC_SUPABASE_URL}
      </div>
      <Suspense fallback={<div>Chargement...</div>}>
        <LoginPageContent />
      </Suspense>
    </>
  );
} 