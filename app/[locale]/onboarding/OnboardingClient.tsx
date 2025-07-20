"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle2, User as UserIcon, Settings, Target, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { useToast } from "@/components/ui/use-toast";

interface OnboardingClientProps {
  user: User;
  locale: string;
  messages: any;
}

const steps = [
  {
    key: 1,
    icon: <UserIcon className="w-5 h-5" />,
    section: 'profile' as const
  },
  {
    key: 2,
    icon: <Settings className="w-5 h-5" />,
    section: 'preferences' as const
  },
  {
    key: 3,
    icon: <Target className="w-5 h-5" />,
    section: 'goals' as const
  }
];

export default function OnboardingClient({ user, locale, messages }: OnboardingClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { onboardingState, loading, error, nextStep, completeSection, changeLocale } = useUserOnboarding(user);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    language: locale,
    currency: "EUR",
    timezone: "Europe/Paris",
    goals: [] as string[]
  });

  // Mettre à jour l'étape courante quand l'état change
  useEffect(() => {
    if (!loading && onboardingState) {
      setCurrentStep(onboardingState.currentStep + 1);
    }
  }, [onboardingState, loading]);

  const handleNext = async () => {
    try {
      // Marquer la section comme complétée
      const currentSection = steps[currentStep - 1]?.section;
      if (currentSection) {
        await completeSection(currentSection);
      }

      // Passer à l'étape suivante
      await nextStep();

      if (currentStep >= 3) {
        // Onboarding terminé, rediriger vers le dashboard
        toast({
          title: messages.onboarding.success,
          description: "Redirection vers le dashboard...",
        });
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      toast({
        title: messages.onboarding.error,
        description: "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLocaleChange = async (newLocale: string) => {
    try {
      await changeLocale(newLocale as any);
      // Rediriger vers la même étape dans la nouvelle locale
      router.push(`/${newLocale}/onboarding`);
    } catch (err) {
      toast({
        title: messages.onboarding.error,
        description: "Erreur lors du changement de langue",
        variant: "destructive"
      });
    }
  };

  const progress = (currentStep / steps.length) * 100;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-emerald-700 text-lg font-semibold animate-pulse">
          {messages.onboarding.loading}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {messages.onboarding.error}
          </h2>
          <p className="mb-4 text-gray-700">{error}</p>
          <Button onClick={() => router.push(`/${locale}/login`)}>
            Retour au login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar avec étapes */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PIM</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {messages.onboarding.welcome}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {messages.onboarding["welcome-subtitle"]}
          </p>
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
                  {messages.onboarding[step.section]}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {messages.onboarding[`${step.section}-subtitle`]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <button 
              onClick={() => router.push(`/${locale}`)}
              className="hover:text-gray-700 transition-colors"
            >
              ← {messages.onboarding.previous}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header avec progression */}
        <div className="border-b border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {messages.onboarding[steps[currentStep - 1]?.section]}
                </h1>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {messages.onboarding[`step-${currentStep}`]} de {steps.length}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={locale}
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="br">🇧🇷 Português</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-sm text-gray-500 font-medium">
                {Math.round(progress)}% {messages.onboarding.complete}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu de l'étape */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            {currentStep === 1 && (
              <ProfileStep 
                formData={formData}
                setFormData={setFormData}
                messages={messages}
              />
            )}
            {currentStep === 2 && (
              <PreferencesStep 
                formData={formData}
                setFormData={setFormData}
                messages={messages}
              />
            )}
            {currentStep === 3 && (
              <GoalsStep 
                formData={formData}
                setFormData={setFormData}
                messages={messages}
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
              {messages.onboarding.previous}
            </Button>
            
            {currentStep < steps.length && (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                {messages.onboarding.next}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            
            {currentStep === steps.length && (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                {messages.onboarding.complete}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants pour chaque étape
function ProfileStep({ formData, setFormData, messages }: any) {
  return (
    <Card className="p-8">
      <h2 className="text-xl font-semibold mb-6">
        {messages.onboarding["profile-title"]}
      </h2>
      <p className="text-gray-600 mb-6">
        {messages.onboarding["profile-subtitle"]}
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {messages.onboarding.form["first-name"]}
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {messages.onboarding.form["last-name"]}
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {messages.onboarding.form.country}
          </label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Sélectionner un pays</option>
            <option value="FR">France</option>
            <option value="BR">Brésil</option>
            <option value="US">États-Unis</option>
          </select>
        </div>
      </div>
    </Card>
  );
}

function PreferencesStep({ formData, setFormData, messages }: any) {
  return (
    <Card className="p-8">
      <h2 className="text-xl font-semibold mb-6">
        {messages.onboarding["preferences-title"]}
      </h2>
      <p className="text-gray-600 mb-6">
        {messages.onboarding["preferences-subtitle"]}
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {messages.onboarding.form.language}
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({...formData, language: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="fr">Français</option>
            <option value="br">Português</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {messages.onboarding.form.currency}
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="EUR">EUR (€)</option>
            <option value="BRL">BRL (R$)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>
    </Card>
  );
}

function GoalsStep({ formData, setFormData, messages }: any) {
  const goals = [
    { key: 'save-money', label: messages.onboarding.goals['save-money'] },
    { key: 'invest', label: messages.onboarding.goals.invest },
    { key: 'retirement', label: messages.onboarding.goals.retirement },
    { key: 'debt-free', label: messages.onboarding.goals['debt-free'] },
    { key: 'emergency-fund', label: messages.onboarding.goals['emergency-fund'] },
    { key: 'other', label: messages.onboarding.goals.other }
  ];

  const toggleGoal = (goal: string) => {
    const newGoals = formData.goals.includes(goal)
      ? formData.goals.filter((g: string) => g !== goal)
      : [...formData.goals, goal];
    setFormData({...formData, goals: newGoals});
  };

  return (
    <Card className="p-8">
      <h2 className="text-xl font-semibold mb-6">
        {messages.onboarding["goals-title"]}
      </h2>
      <p className="text-gray-600 mb-6">
        {messages.onboarding["goals-subtitle"]}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {goals.map((goal) => (
          <button
            key={goal.key}
            onClick={() => toggleGoal(goal.key)}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              formData.goals.includes(goal.key)
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{goal.label}</div>
          </button>
        ))}
      </div>
    </Card>
  );
} 