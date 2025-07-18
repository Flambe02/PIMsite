"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/supabase-provider";
import { useSearchParams } from "next/navigation";

export default function AuthCodeErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { supabase } = useSupabase();

  // Récupérer le message d'erreur depuis l'URL
  const errorMessage = searchParams.get('message');

  // Corriger l'erreur d'hydratation
  useEffect(() => {
    setMounted(true);
    // Vérifier si l'utilisateur est déjà connecté
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Si l'utilisateur est connecté, rediriger vers le dashboard
        router.replace('/dashboard');
      }
    };
    checkUser();
  }, [supabase, router]);

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    if (!email) {
      setMessage("Por favor, informe seu email.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
      }
    });
    if (error) setMessage("Erro ao enviar: " + error.message);
    else setMessage("Email de confirmação reenviado!");
    setLoading(false);
  };

  // Ne pas rendre avant que le composant soit monté côté client
  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen text-emerald-700 text-lg font-semibold">Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Link inválido ou expirado</h2>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}
        <p className="mb-4 text-gray-700">
          O link de confirmação é inválido, já foi utilizado ou expirou.<br />
          Se sua conta já está ativada, tente fazer login normalmente.<br />
          Caso contrário, solicite um novo email de confirmação abaixo.
        </p>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Seu email"
            className="border rounded px-4 py-2 w-full mb-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full w-full"
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Reenviar email de confirmação"}
          </Button>
        </div>
        {message && <div className="mt-2 text-emerald-700">{message}</div>}
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => router.push("/login")}
        >
          Voltar para o login
        </Button>
      </div>
    </div>
  );
} 