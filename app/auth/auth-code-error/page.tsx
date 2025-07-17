"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/supabase-provider";

export default function AuthCodeErrorPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    if (!email) {
      setMessage("Merci de renseigner votre email.");
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
    if (error) setMessage("Erreur lors de l'envoi : " + error.message);
    else setMessage("Email de confirmation renvoyé !");
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Lien invalide ou expiré</h2>
        <p className="mb-4 text-gray-700">
          Le lien de confirmation est invalide, a déjà été utilisé ou a expiré.<br />
          Merci de demander un nouvel email de confirmation ou de vous connecter.
        </p>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Votre email"
            className="border rounded px-4 py-2 w-full mb-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full w-full"
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? "Envoi..." : "Renvoyer l'email"}
          </Button>
        </div>
        {message && <div className="mt-2 text-emerald-700">{message}</div>}
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => router.push("/login")}
        >
          Retour à la connexion
        </Button>
      </div>
    </div>
  );
} 