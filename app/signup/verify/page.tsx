"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button"

export default function VerifySignupPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase();

  const handleResend = async () => {
    setLoading(true)
    setMessage("")
    if (!email) {
      setMessage("Email manquant.")
      setLoading(false)
      return
    }
    // Supabase v2: resend confirmation email
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) setMessage("Erreur lors de l'envoi : " + error.message)
    else setMessage("Email de confirmation renvoyé !")
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Vérifie ta boîte mail</h2>
        <p className="mb-4">Nous avons envoyé un email de confirmation à <b>{email}</b>.</p>
        <p className="mb-4">Pas reçu ? Vérifie tes spams ou <Button onClick={handleResend} disabled={loading}>{loading ? "Envoi..." : "Renvoyer l'email"}</Button></p>
        {message && <div className="mt-2 text-emerald-700">{message}</div>}
      </div>
    </div>
  )
} 