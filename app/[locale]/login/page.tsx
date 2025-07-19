"use client"

export const dynamic = 'force-dynamic';

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Facebook, Apple, Mail, Eye, EyeOff } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import CreateAccount from "@/components/CreateAccount"
import { useSupabase } from "@/components/supabase-provider";

function LoginPageContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const redirectTo = searchParams.get("redirectTo")
  const [showPassword, setShowPassword] = useState(false)
  const [tab, setTab] = useState<'login' | 'register'>("login")
  const router = useRouter()
  const { supabase } = useSupabase();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message && message.toLowerCase().includes("usuário não cadastrado")) {
      setTab("register")
    }
  }, [message])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message || "Email ou senha inválidos.");
      setLoading(false);
    } else {
      // Vérifier ou initialiser la ligne user_onboarding
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let { data, error: onboardingError } = await supabase
          .from('user_onboarding')
          .select('profile_completed, checkup_completed, holerite_uploaded')
          .eq('user_id', user.id)
          .single();
        if (!data) {
          // Créer la ligne si elle n'existe pas
          const { error: insertError } = await supabase
            .from('user_onboarding')
            .upsert({
              user_id: user.id,
              profile_completed: false,
              checkup_completed: false,
              holerite_uploaded: false
            });
          if (insertError) console.error('Erreur insert user_onboarding:', insertError.message);
          data = { profile_completed: false, checkup_completed: false, holerite_uploaded: false };
        }
        const onboardingComplete = data.profile_completed && data.checkup_completed && data.holerite_uploaded;
        if (onboardingComplete) {
          window.location.href = redirectTo || "/dashboard";
          return;
        }
      }
      window.location.href = "/onboarding";
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLoginError("");
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? 'https://pimsite-prod.supabase.co/auth/v1/callback' : undefined
      }
    });
    setLoading(false);
  };

  const textos = {
    login: "Entrar",
    criarConta: "Criar Conta",
    esqueceuSenha: "Esqueceu sua senha?",
    email: "Email",
    senha: "Senha",
    digiteEmail: "Digite seu email",
    digiteSenha: "Digite sua senha",
    ou: "ou",
    proximaConquista: "Sua próxima conquista começa aqui",
    descricao: "Descubra o melhor da gestão de carreira, benefícios e oportunidades para sua vida profissional.",
    rhDigital: "RH Digital",
    beneficios: "Benefícios",
    carreira: "Carreira",
    bemEstar: "Bem-estar",
    carregando: "Entrando...",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-emerald-50 py-6 px-2">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        {/* Colonne gauche : formulaire */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
          <div className="flex items-center justify-between mb-6">
            <button className="text-gray-400 hover:text-gray-700" aria-label="Fermer" onClick={() => router.push("/") }><span className="text-2xl font-bold">&times;</span></button>
            <span className="text-xs text-gray-500">Brasil 🇧🇷</span>
          </div>
          <div className="mb-8 text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🌶️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo ao PIM</h2>
            <p className="text-gray-500 text-sm">O primeiro passo para otimizar sua carreira.</p>
          </div>
          <div className="flex justify-center mb-6 gap-2 bg-gray-100 rounded-full p-1 w-full max-w-xs mx-auto">
            <button onClick={() => setTab('register')} className={`flex-1 py-2 rounded-full font-semibold transition ${tab==='register' ? 'bg-black text-white shadow' : 'text-gray-700'}`}>{textos.criarConta}</button>
            <button onClick={() => setTab('login')} className={`flex-1 py-2 rounded-full font-semibold transition ${tab==='login' ? 'bg-black text-white shadow' : 'text-gray-700'}`}>{textos.login}</button>
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <Button variant="outline" size="icon" className="rounded-full border-gray-300"><Facebook className="w-5 h-5 text-blue-600" /></Button>
            <Button variant="outline" size="icon" className="rounded-full border-gray-300"><Apple className="w-5 h-5 text-gray-900" /></Button>
            <Button variant="outline" size="icon" className="rounded-full border-gray-300" onClick={handleGoogleLogin} disabled={loading}>
              {/* Icône Google stylisé */}
              <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.09c-1.09-3.25-1.09-6.74 0-9.99l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 36.11l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.54-5.54l-7.19-5.6c-2.01 1.35-4.58 2.14-8.35 2.14-6.38 0-11.87-3.59-14.33-8.84l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">{textos.ou}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          {tab === 'register' ? (
            <>
              {message && message.toLowerCase().includes("usuário não cadastrado") && (
                <Alert className="mb-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <CreateAccount />
            </>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {redirectTo && (
                <input type="hidden" name="redirectTo" value={redirectTo} />
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{textos.email}</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder={textos.digiteEmail} />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password">{textos.senha}</Label>
                <Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder={textos.digiteSenha} />
                <button type="button" className="absolute right-3 top-8 text-gray-400 hover:text-gray-700" tabIndex={-1} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {loginError && (
                <Alert className="mb-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full rounded-full px-6 py-3 font-semibold text-lg mt-2" disabled={loading}>
                {loading ? textos.carregando : textos.login}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center">
            {tab==='login' ? (
              <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-500">
                {textos.esqueceuSenha}
              </Link>
            ) : null}
          </div>
        </div>
        {/* Colonne droite : image/vidéo + overlay */}
        <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-emerald-700 to-emerald-400">
          {/* Illustration locale ou fond dégradé à la place des médias manquants */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <span className="text-6xl mb-4">🌶️</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{textos.proximaConquista}</h2>
            <p className="text-lg text-white/80 mb-6">{textos.descricao}</p>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-semibold">{textos.rhDigital}</span>
              <span className="bg-yellow-400 text-gray-900 text-xs px-3 py-1 rounded-full font-semibold">{textos.beneficios}</span>
              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">{textos.carreira}</span>
              <span className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold">{textos.bemEstar}</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0 rounded-tr-3xl rounded-br-3xl" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginPageContent />
    </Suspense>
  )
} 