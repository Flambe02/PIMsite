import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginModal } from "@/components/LoginModal"
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";

export default function CreateAccount() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { supabase } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password || !passwordConfirm) {
      setError("Veuillez remplir tous les champs.")
      return
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.")
      return
    }
    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    setLoading(true)
    const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
      }
    })
    setLoading(false)
    // Cas 1 : erreur renvoyée (email déjà confirmé)
    if (signUpError) {
      if (signUpError.message && signUpError.message.toLowerCase().includes("already registered")) {
        setError("Este email já possui conta. Faça login ou recupere sua senha.")
      } else {
        setError(signUpError.message)
      }
      return
    } else {
      // Cas 2 : pas d'erreur MAIS user.identities est vide → email existe mas não confirmado
      if (signUpData?.user && (signUpData.user as any).identities?.length === 0) {
        setError("Este email já foi cadastrado. Verifique sua caixa de entrada para confirmar ou faça login.")
        return
      }
      setSent(true)
      router.push(`/signup/verify?email=${encodeURIComponent(email)}`)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? 'https://pimsite-prod.supabase.co/auth/v1/callback' : undefined
      }
    });
    setLoading(false);
  };

  // Textos centralizados para facilitar tradução futura
  const textos = {
    email: "Email",
    senha: "Senha",
    confirmarSenha: "Confirme sua senha",
    criarConta: "Criar minha conta",
    criando: "Criando...",
    placeholderEmail: "Digite seu email",
    placeholderSenha: "Crie uma senha",
    placeholderConfirmarSenha: "Repita a senha",
    avisoEmail: "Você receberá um e-mail de confirmação para ativar sua conta.",
    erroEmail: "Este email já está em uso. Faça login ou use o Google.",
    loginGoogle: "Entrar com Google",
    loginExistente: "Entrar",
    verificaEmail: "Verifique sua caixa de entrada: um e-mail de confirmação foi enviado.",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Bouton Google au-dessus du formulaire, seulement si !sent */}
      {!sent && (
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 mb-2"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.09c-1.09-3.25-1.09-6.74 0-9.99l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 36.11l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.54-5.54l-7.19-5.6c-2.01 1.35-4.58 2.14-8.35 2.14-6.38 0-11.87-3.59-14.33-8.84l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          {loading ? "Connexion Google..." : "Continuer avec Google"}
        </Button>
      )}
      {/* Formulaire classique */}
      {!sent ? (
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">{textos.email}</label>
            <input
              id="email"
              type="email"
              required
              placeholder={textos.placeholderEmail}
              className="border rounded px-4 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">{textos.senha}</label>
            <input
              id="password"
              type="password"
              required
              placeholder={textos.placeholderSenha}
              className="border rounded px-4 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="passwordConfirm" className="font-medium">{textos.confirmarSenha}</label>
            <input
              id="passwordConfirm"
              type="password"
              required
              placeholder={textos.placeholderConfirmarSenha}
              className="border rounded px-4 py-2"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full mt-2"
            disabled={loading}
          >
            {loading ? textos.criando : textos.criarConta}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            {textos.avisoEmail}
          </p>
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error.includes("utilisé") ? textos.erroEmail : error}
              {error.includes("utilisé") && (
                <Button
                  type="button"
                  variant="link"
                  className="ml-2 underline text-emerald-700 hover:text-emerald-900"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  {textos.loginGoogle}
                </Button>
              )}
              {error.includes("utilisé") && (
                <button
                  type="button"
                  className="ml-2 underline text-emerald-700 hover:text-emerald-900"
                  onClick={() => setShowLogin(true)}
                >
                  {textos.loginExistente}
                </button>
              )}
            </div>
          )}
          {showLogin && <LoginModal open={showLogin} onOpenChange={setShowLogin} message={"Entre com seu email existente."} />}
        </>
      ) : (
        <div className="text-center">
          <p className="text-emerald-700 font-semibold mb-2">{textos.verificaEmail}</p>
        </div>
      )}
    </form>
  )
} 