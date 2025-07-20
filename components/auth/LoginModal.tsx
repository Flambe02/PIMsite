"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff, X } from "lucide-react"
import GoogleLoginButton from "./GoogleLoginButton"
import { useSupabase } from "@/components/supabase-provider"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  redirectTo?: string
}

export default function LoginModal({ 
  open, 
  onOpenChange, 
  title = "Connexion à PIM",
  description = "Connectez-vous pour accéder à votre espace personnel",
  redirectTo
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) {
        setLoginError(error.message || "Email ou mot de passe invalide")
      } else {
        // Vérifier l'onboarding et rediriger
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          let { data } = await supabase
            .from('user_onboarding')
            .select('profile_completed, checkup_completed, holerite_uploaded')
            .eq('user_id', user.id)
            .single()

          if (!data) {
            await supabase
              .from('user_onboarding')
              .upsert({
                user_id: user.id,
                profile_completed: false,
                checkup_completed: false,
                holerite_uploaded: false
              })
            data = { profile_completed: false, checkup_completed: false, holerite_uploaded: false }
          }

          const onboardingComplete = data.profile_completed && data.checkup_completed && data.holerite_uploaded
          onOpenChange(false)
          
          if (redirectTo) {
            window.location.href = redirectTo
          } else if (onboardingComplete) {
            window.location.href = "/dashboard"
          } else {
            window.location.href = "/onboarding"
          }
        }
      }
    } catch (error) {
      setLoginError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setPassword("")
    setLoginError("")
    setShowPassword(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none" data-testid="login-modal">
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header avec bouton fermer */}
          <div className="flex justify-between items-center p-6 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded-full"
              data-testid="modal-close-button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Contenu */}
          <div className="px-6 pb-6">
            {/* Bouton Google */}
            <div className="mb-6">
                          <GoogleLoginButton 
              className="w-full border-gray-300"
              disabled={loading}
              data-testid="google-login-button"
            >
              Continuer avec Google
            </GoogleLoginButton>
            </div>

            {/* Séparateur */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Formulaire email/mot de passe */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                  data-testid="email-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    required
                    disabled={loading}
                    data-testid="password-input"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {loginError && (
                <Alert variant="destructive" data-testid="login-error">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="email-login-button"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            {/* Liens utiles */}
            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-sm text-emerald-600 hover:text-emerald-500"
                onClick={() => {/* TODO: Implémenter récupération mot de passe */}}
              >
                Mot de passe oublié ?
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 