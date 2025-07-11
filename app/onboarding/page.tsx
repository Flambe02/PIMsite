"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1"
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2"
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
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

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateUserData = (newData: any) => {
    setUserData(prev => ({ ...prev, ...newData }))
  }

  useEffect(() => {
    const supabase = createClientComponentClient();
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
    checkAndInit();
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 userData={userData} updateUserData={updateUserData} onNext={handleNext} />
      case 2:
        return <OnboardingStep2 userData={userData} updateUserData={updateUserData} onNext={handleNext} onBack={handleBack} />
      case 3:
        return <OnboardingStep3 userData={userData} updateUserData={updateUserData} onBack={handleBack} />
      default:
        return <OnboardingStep1 userData={userData} updateUserData={updateUserData} onNext={handleNext} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-md border-b">
        <div className="flex items-center space-x-3">
          <Image src="/images/pimentao-logo.png" alt="PIM Logo" width={40} height={40} className="h-10 w-auto" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">PIM</h1>
            <p className="text-sm text-gray-600">Otimização de Folha de Pagamento</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Etapa {currentStep} de {totalSteps}</p>
          <p className="text-xs text-gray-500">Configuração da sua conta</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {renderStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6 bg-white/80 backdrop-blur-md">
        <div className="flex items-center">
          <Image src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={32} height={32} className="h-8 w-auto mr-2" />
          <p className="text-xs text-gray-500">© 2025 The Pimentão Rouge Company. Todos os direitos reservados.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </a>
        </nav>
      </footer>
    </div>
  )
} 