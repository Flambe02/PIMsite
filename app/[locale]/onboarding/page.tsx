"use client"

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Step1Profile from "@/components/onboarding/Step1Profile";
import Step2Checkup from "@/components/onboarding/Step2Checkup";
import Step3Payslip from "@/components/onboarding/Step3Payslip";

const steps = [
  { key: 1, label: "Informações Pessoais e Profissionais" },
  { key: 2, label: "Check-up Financeiro (em breve)" },
  { key: 3, label: "Análise de Holerite" },
];

function OnboardingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'br';

  const [currentStep, setCurrentStep] = useState(1);

  // Synchronize current step with URL parameter
  useEffect(() => {
    const stepFromUrl = searchParams.get('step');
    if (stepFromUrl && !isNaN(Number(stepFromUrl))) {
      const stepNum = Math.min(Math.max(Number(stepFromUrl), 1), 3);
      if (stepNum !== currentStep) {
        setCurrentStep(stepNum);
      }
    }
  }, [searchParams, currentStep]);

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleFinish = () => {
    router.replace(`/${locale}/dashboard`);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
        <div className="w-full h-2.5 bg-gray-200 rounded-full mb-6">
          <div className="h-2.5 bg-emerald-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">{steps[currentStep - 1].label}</h1>
        
        {currentStep === 1 && (
          <Step1Profile onNext={() => goToStep(2)} />
        )}
        {currentStep === 2 && (
          <Step2Checkup onNext={() => goToStep(3)} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <Step3Payslip onBack={handleBack} onFinish={handleFinish} />
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Carregando...</div>}>
      <OnboardingPageContent />
    </Suspense>
  );
} 