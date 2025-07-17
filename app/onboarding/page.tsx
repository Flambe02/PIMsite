"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1"
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2"
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3"
import Image from "next/image"
import { useSupabase } from "@/components/supabase-provider";
import { CheckCircle2, User, ClipboardCheck, FileText } from "lucide-react"
import { LoginModal } from "@/components/LoginModal"

const steps = [
  {
    key: 1,
    label: "Perfil",
    description: "Preencha suas informações pessoais",
    icon: <User className="w-5 h-5 mr-2" />,
  },
  {
    key: 2,
    label: "Check-up financeiro",
    description: "Responda ao quiz para avaliar sua saúde financeira",
    icon: <ClipboardCheck className="w-5 h-5 mr-2" />,
  },
  {
    key: 3,
    label: "Enviar holerite",
    description: "Faça upload do seu holerite para análise",
    icon: <FileText className="w-5 h-5 mr-2" />,
  },
]

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  const stepParam = searchParams.get("step")
  const initialStep = stepParam ? parseInt(stepParam, 10) : 1
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    employmentStatus: "",
    hasChildren: false,
    financialHealthScore: 0,
    quizAnswers: {},
    payslipData: null
  })
  const [showLogin, setShowLogin] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const { supabase } = useSupabase();

  // Charger la session dès le début
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
    })
  }, [supabase])

  // Redirection automatique si pas de session
  useEffect(() => {
    if (!loadingSession && !session) {
      router.replace('/login?message=Veuillez vous connecter pour continuer l\'onboarding')
    }
  }, [loadingSession, session, router])

  // Initialisation de l'onboarding record
  useEffect(() => {
    async function ensureOnboardingRecord(userId: string) {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('user_id')
        .eq('user_id', userId)
        .single();
      if (!data) {
        const { error: insertError } = await supabase
          .from('user_onboarding')
          .upsert({
            user_id: userId,
            profile_completed: false,
            checkup_completed: false,
            holerite_uploaded: false
          });
        if (insertError) console.log('Erreur insert user_onboarding:', insertError.message);
      }
      if (error && error.code !== 'PGRST116') console.log('Erreur select user_onboarding:', error.message);
    }
    async function checkAndInit() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await ensureOnboardingRecord(user.id);
    }
    if (session) checkAndInit();
  }, [session, supabase])

  if (loadingSession) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-emerald-700 text-lg font-semibold animate-pulse">Chargement de la session...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-red-700 text-lg font-semibold">Auth session missing! Redirection...</div>
      </div>
    )
  }

  // Handler pour passer à la suite (redirige vers dashboard)
  const handleNext = () => {
    window.location.href = "/dashboard";
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro de autenticação</h2>
          <p className="mb-4 text-gray-700">{errorDescription || "O link de acesso expirou ou é inválido. Por favor, solicite um novo link para continuar."}</p>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full mt-2"
            onClick={() => setShowLogin(true)}
          >
            Voltar para o Login
          </button>
        </div>
        {showLogin && <LoginModal open={showLogin} onOpenChange={setShowLogin} />}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 items-center justify-center">
      <div className="w-full max-w-2xl transition-all duration-500 animate-fade-in-slide">
        <OnboardingStep1 onNext={handleNext} />
      </div>
    </div>
  )
} 