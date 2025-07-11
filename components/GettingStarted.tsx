import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, ClipboardCheck, FileText } from "lucide-react";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

interface GettingStartedProps {
  userId: string;
  onStepClick?: (step: 'profile' | 'checkup' | 'holerite') => void;
}

export function GettingStarted({ userId, onStepClick }: GettingStartedProps) {
  const onboarding = useUserOnboarding(userId);
  if (!onboarding || onboarding.onboarding_complete) return null;

  const steps = [
    {
      key: 'profile',
      label: 'Preencher perfil',
      completed: onboarding.profile_completed,
      icon: <User className="w-5 h-5 mr-2" />,
    },
    {
      key: 'checkup',
      label: 'Check-up financeiro',
      completed: onboarding.checkup_completed,
      icon: <ClipboardCheck className="w-5 h-5 mr-2" />,
    },
    {
      key: 'holerite',
      label: 'Enviar holerite',
      completed: onboarding.holerite_uploaded,
      icon: <FileText className="w-5 h-5 mr-2" />,
    },
  ];

  return (
    <div className="bg-white/90 rounded-2xl shadow-lg p-8 max-w-xl mx-auto border border-emerald-100">
      <h2 className="text-2xl font-bold mb-6 text-emerald-900">Comece por aqui</h2>
      <div className="mb-6">
        <Progress value={onboarding.progress} className="h-3" />
        <div className="text-right text-xs text-gray-500 mt-1">{onboarding.progress}% completo</div>
      </div>
      <ul className="space-y-4">
        {steps.map((step) => (
          <li key={step.key} className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3">
            <div className="flex items-center">
              {step.icon}
              <span className="font-medium text-gray-800">{step.label}</span>
            </div>
            {step.completed ? (
              <CheckCircle2 className="text-emerald-600 w-6 h-6" />
            ) : (
              <Button size="sm" className="rounded-full px-5" onClick={() => onStepClick?.(step.key as any)}>
                Começar
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 