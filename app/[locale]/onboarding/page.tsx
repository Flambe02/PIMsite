"use client"

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Dynamic from "next/dynamic";
import Image from "next/image"
import { useSupabase } from "@/components/supabase-provider";
import { CheckCircle2, User, ClipboardCheck, FileText, ArrowLeft, ArrowRight, Home } from "lucide-react"
import { LoginModal } from "@/components/LoginModal"

const OnboardingStep1 = Dynamic(() => import("@/components/onboarding/OnboardingStep1").then(m => m.default), {
  loading: () => <div className="py-12 text-center text-emerald-900">Chargement de l'étape 1...</div>,
  ssr: false
});
const OnboardingStep2 = Dynamic(() => import("@/components/onboarding/OnboardingStep2").then(m => m.default), {
  loading: () => <div className="py-12 text-center text-emerald-900">Chargement de l'étape 2...</div>,
  ssr: false
});
const OnboardingStep3 = Dynamic(() => import("@/components/onboarding/OnboardingStep3").then(m => m.default), {
  loading: () => <div className="py-12 text-center text-emerald-900">Chargement de l'étape 3...</div>,
  ssr: false
});

const steps = [
  {
    key: 1,
    label: "Seus dados",
    description: "Forneça suas informações pessoais",
    icon: <User className="w-5 h-5" />,
  },
  {
    key: 2,
    label: "Check-up financeiro",
    description: "Responda ao quiz para avaliar sua saúde financeira",
    icon: <ClipboardCheck className="w-5 h-5" />,
  },
  {
    key: 3,
    label: "Dados salariais",
    description: "Faça upload do holerite ou insira dados manualmente",
    icon: <FileText className="w-5 h-5" />,
  },
]

function OnboardingPageContent() {
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
      router.replace('/login?message=Faça login para continuar o onboarding')
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
        if (insertError) console.log('Erro insert user_onboarding:', insertError.message);
      }
      if (error && error.code !== 'PGRST116') console.log('Erro select user_onboarding:', error.message);
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
        <div className="text-emerald-700 text-lg font-semibold animate-pulse">Carregando...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-red-700 text-lg font-semibold">Sessão não encontrada! Redirecionando...</div>
      </div>
    )
  }

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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      window.location.href = "/dashboard"
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar avec étapes */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PIM</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Bem-vindo</span>
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep > step.key 
                  ? 'bg-emerald-600 text-white' 
                  : currentStep === step.key 
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-600' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step.key ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${
                  currentStep === step.key ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <button 
              onClick={() => router.push('/')}
              className="hover:text-gray-700 transition-colors"
            >
              ← Voltar para o início
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header avec progression intégrée */}
        <div className="border-b border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {steps[currentStep - 1].label}
                </h1>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Etapa {currentStep} de {steps.length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-sm text-gray-500 font-medium">
                {Math.round(progress)}% completo
              </span>
            </div>
          </div>
        </div>

        {/* Contenu de l'étape */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            {currentStep === 1 && (
              <OnboardingStep1 onNext={handleNext} />
            )}
            {currentStep === 2 && (
              <OnboardingStep2 
                userData={userData} 
                updateUserData={setUserData} 
                onNext={handleNext} 
                onBack={handleBack} 
              />
            )}
            {currentStep === 3 && (
              <OnboardingStep3 
                userData={userData} 
                updateUserData={setUserData} 
                onBack={handleBack} 
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            {currentStep < steps.length && (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            
            {currentStep === steps.length && (
              <Button
                onClick={() => window.location.href = "/dashboard"}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                Finalizar
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showLogin && <LoginModal open={showLogin} onOpenChange={setShowLogin} />}
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <OnboardingPageContent />
    </Suspense>
  )
} 