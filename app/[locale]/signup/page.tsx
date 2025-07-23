"use client"
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSupabase } from "@/components/supabase-provider";
import { OAuthLoginButton } from "@/components/OAuthLoginButton";
// import useAuthRedirect from "@/hooks/useAuthRedirect"; // On ne redirige plus tant que l'email n'est pas validé

function SignupContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [oauthError, setOauthError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");
  const [alreadyValidated, setAlreadyValidated] = useState(false);
  const [googleOnly, setGoogleOnly] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = typeof params!.locale === 'string' ? params!.locale : Array.isArray(params!.locale) ? params!.locale[0] : 'br';
  const { supabase } = useSupabase();

  // useAuthRedirect(user); // Désactivé pour attendre la validation email

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    setEmailSent(false);
    setAlreadyValidated(false);
    setGoogleOnly(false);
    // Vérifier la correspondance des mots de passe
    if (password !== passwordConfirm) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/${locale}/auth/callback` : undefined
      }
    });
    if (error) {
      // Cas où l'utilisateur existe déjà via Google
      if (error.message && error.message.toLowerCase().includes("already registered")) {
        setError("Ce compte existe déjà via Google. Utilisez le bouton Google pour vous connecter.");
        setGoogleOnly(true);
      } else {
        setError(error.message || "Erro ao criar conta.");
      }
      setLoading(false);
    } else if (data?.user && (data.user as any).identities?.length === 0) {
      // Cas où l'email existe déjà via Google (identities vide)
      setError("Ce compte existe déjà via Google. Utilisez le bouton Google pour vous connecter.");
      setGoogleOnly(true);
      setLoading(false);
    } else {
      // Tentative de connexion pour détecter si l'utilisateur est déjà validé
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (!loginError) {
        setAlreadyValidated(true);
        setLoading(false);
      } else {
        setEmailSent(true);
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendError("");
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    });
    if (error) {
      setResendError(error.message || "Erreur lors de la réexpédition de l'email.");
    }
    setResendLoading(false);
  };

  const handleGoogleSignup = async () => {
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

  if (alreadyValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 p-8 items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Este e-mail já está em uso e validado.</h2>
          <p className="text-gray-700 text-center mb-4">Por favor, faça login com sua senha ou utilize a recuperação de senha.</p>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full mt-2"
            onClick={() => router.push(`/${locale}/login`)}
          >Entrar</button>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 p-8 items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Confirme seu email</h2>
          <p className="text-gray-700 text-center mb-4">Enviamos um link de confirmação para <span className="font-semibold">{email}</span>.<br/>Clique no link para ativar sua conta.</p>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full mt-2"
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading ? "Reenviando..." : "Reenviar email"}
          </button>
          {resendError && <div className="text-red-600 text-sm text-center mt-2">{resendError}</div>}
          <button
            className="text-sm text-emerald-600 hover:text-emerald-500 mt-6"
            onClick={() => router.push(`/${locale}/login`)}
          >Já tem uma conta? Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Crie sua conta</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Ou <button type="button" className="font-medium text-emerald-600 hover:text-emerald-500 underline bg-transparent border-none p-0 m-0" onClick={() => router.push(`/${locale}/login`)}>já tem uma conta? Entrar</button>
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={e => { e.preventDefault(); handleSignup(); }}
        >
          <input
            type="email"
            className="border rounded px-4 py-3"
            placeholder="Digite seu email"
            value={email}
            onChange={e => { setEmail(e.target.value); setGoogleOnly(false); setError(""); }}
            required
            // disabled={googleOnly} // <-- On laisse l'email éditable même si googleOnly
          />
          <input
            type="password"
            className="border rounded px-4 py-3"
            placeholder="Crie uma senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={googleOnly}
          />
          <input
            type="password"
            className="border rounded px-4 py-3"
            placeholder="Confirme sua senha"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            required
            disabled={googleOnly}
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full mt-2"
            disabled={loading || googleOnly}
          >
            {loading ? "Criando..." : "Criar minha conta"}
          </button>
        </form>
        <div className="my-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <OAuthLoginButton provider="google" label="Criar conta com Google" onClick={handleGoogleSignup} loading={loading} />
        {oauthError && <div className="text-red-600 text-sm text-center mt-2">{oauthError}</div>}
      </div>
    </div>
  );
}

export default function SignupPage() {
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
    <Suspense fallback={<div>Carregando...</div>}>
      <SignupContent />
    </Suspense>
  );
} 