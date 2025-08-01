"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Facebook, Apple, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CreateAccount from "@/components/CreateAccount"
import { useSupabase } from "@/components/supabase-provider";

function LoginModalContent({ open, onOpenChange, message = "", redirectTo = "" }: { open: boolean, onOpenChange: (v: boolean) => void, message?: string, redirectTo?: string }) {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>("login");
  const [emailValue, setEmailValue] = useState("");
  const urlEmail = searchParams.get("email") || "";
  const urlMessage = searchParams.get("message") || message;
  const [loginError, setLoginError] = useState("");
  const { supabase } = useSupabase();

  useEffect(() => {
    if (urlEmail) setEmailValue(urlEmail);
    if (urlMessage && urlMessage.toLowerCase().includes("já possui uma conta")) setTab("login");
    if (urlMessage && urlMessage.toLowerCase().includes("usuário não cadastrado")) setTab("register");
  }, [urlEmail, urlMessage]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem("email");
    const passwordInput = form.elements.namedItem("password");
    const email = (emailInput && (emailInput as HTMLInputElement).value) || "";
    const password = (passwordInput && (passwordInput as HTMLInputElement).value) || "";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message || "Email ou senha inválidos.");
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let { data, error: onboardingError } = await supabase
          .from('user_onboarding')
          .select('profile_completed, checkup_completed, holerite_uploaded')
          .eq('user_id', user.id)
          .single();
        if (!data) {
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
        onOpenChange(false);
        if (redirectTo) window.location.href = redirectTo;
        else if (onboardingComplete) window.location.href = "/dashboard";
        else window.location.href = "/onboarding";
        return;
      }
      window.location.reload();
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? 'https://pimsite-prod.supabase.co/auth/v1/callback' : undefined
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">Bem-vindo ao PIM</DialogTitle>
        <div className="w-full bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
          <button className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-700 text-2xl font-bold" aria-label="Fermer" onClick={() => onOpenChange(false)}>&times;</button>
          <div className="flex-1 flex flex-col justify-center p-8 md:p-12 min-h-[440px] md:min-h-[440px]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-gray-500">Brasil 🇧🇷</span>
            </div>
            <div className="mb-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 overflow-hidden bg-emerald-100">
                <img src="/images/SuperDog.jpg" alt="SuperDog" className="w-12 h-12 object-cover rounded-full" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo ao PIM</h2>
              <p className="text-gray-500 text-sm">O primeiro passo para otimizar sua carreira.</p>
            </div>
            <div className="flex justify-center mb-6 gap-2 bg-gray-100 rounded-full p-1 w-full max-w-xs mx-auto">
              <button onClick={() => setTab('register')} className={`flex-1 py-2 rounded-full font-semibold transition ${tab==='register' ? 'bg-black text-white shadow' : 'text-gray-700'}`}>Criar Conta</button>
              <button onClick={() => setTab('login')} className={`flex-1 py-2 rounded-full font-semibold transition ${tab==='login' ? 'bg-black text-white shadow' : 'text-gray-700'}`}>Entrar</button>
            </div>
            <div className="flex justify-center gap-4 mb-6">
              <Button variant="outline" size="icon" className="rounded-full border-gray-300"><Facebook className="w-5 h-5 text-blue-600" /></Button>
              <Button variant="outline" size="icon" className="rounded-full border-gray-300"><Apple className="w-5 h-5 text-gray-900" /></Button>
              <Button variant="outline" size="icon" className="rounded-full border-gray-300" onClick={handleGoogleLogin}>
                <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.09c-1.09-3.25-1.09-6.74 0-9.99l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 36.11l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.54-5.54l-7.19-5.6c-2.01 1.35-4.58 2.14-8.35 2.14-6.38 0-11.87-3.59-14.33-8.84l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {tab === 'register' ? (
              <>
                {urlMessage && urlMessage.toLowerCase().includes("usuário não cadastrado") && (
                  <Alert className="mb-4" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{urlMessage}</AlertDescription>
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
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" required placeholder="Digite seu email" value={emailValue} onChange={e => setEmailValue(e.target.value)} />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Digite sua senha" />
                  <button type="button" className="absolute right-3 top-8 text-gray-400 hover:text-gray-700" tabIndex={-1} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
                {loginError && (
                  <Alert className="mb-4" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full rounded-full px-6 py-3 font-semibold text-lg mt-2">
                  Entrar
                </Button>
              </form>
            )}
            <div className="mt-4 text-center">
              {tab==='login' ? (
                <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-500">
                  Esqueceu sua senha?
                </Link>
              ) : null}
            </div>
          </div>
          <div className="hidden md:block md:w-1/2 relative bg-black/80">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
              poster="/images/pim-login-bg.jpg"
            >
              <source src="/images/Login.mp4" type="video/mp4" />
            </video>
            <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white" style={{ minHeight: 600 }}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold text-sm">Otimização de Carreira PIM</span>
                </div>
                <div className="flex gap-2 mb-4">
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Sua próxima conquista<br />começa <span className="bg-white/80 text-emerald-700 px-2 rounded">aqui</span></h2>
                <p className="text-lg text-white/80 mb-6">Descubra o melhor da gestão de carreira, benefícios e oportunidades para sua vida profissional.</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-semibold">RH Digital</span>
                  <span className="bg-yellow-400 text-gray-900 text-xs px-3 py-1 rounded-full font-semibold">Benefícios</span>
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Carreira</span>
                  <span className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold">Bem-estar</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0 rounded-tr-3xl rounded-br-3xl" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LoginModal(props: { open: boolean, onOpenChange: (v: boolean) => void, message?: string, redirectTo?: string }) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginModalContent {...props} />
    </Suspense>
  );
}

export default LoginModal; 