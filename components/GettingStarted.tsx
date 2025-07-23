import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, ClipboardCheck, FileText, X } from "lucide-react";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

interface GettingStartedProps {
  userId: string;
  onStepClick?: (step: 'profile' | 'checkup' | 'holerite') => void;
  onDismiss: () => void;
}

const steps = [
  {
    key: 'profile',
    label: 'Perfil',
    description: 'Preencha suas informações pessoais',
    icon: <User className="w-5 h-5" />,
  },
  {
    key: 'checkup',
    label: 'Check-up financeiro',
    description: 'Responda ao quiz para avaliar sua saúde financeira',
    icon: <ClipboardCheck className="w-5 h-5" />,
  },
  {
    key: 'holerite',
    label: 'Enviar holerite',
    description: 'Faça upload do seu holerite para análise',
    icon: <FileText className="w-5 h-5" />,
  },
];

export function GettingStarted({ userId, onStepClick, onDismiss }: GettingStartedProps) {
  const { onboarding } = useUserOnboarding(userId);
  if (!onboarding) return null;

  const completedSteps = [
    onboarding.profile_completed,
    onboarding.checkup_completed,
    onboarding.holerite_uploaded,
  ].filter(Boolean).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="bg-emerald-50/80 rounded-2xl p-6 md:p-8 relative border-2 border-emerald-100 shadow-sm">
      <button 
        onClick={onDismiss} 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fermer la notification d'onboarding"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-emerald-900 mb-2 md:mb-0">Comece seu onboarding</h2>
        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
          <Progress value={progress} className="h-2 w-32 bg-emerald-200/60" />
          <span className="text-sm text-gray-600 ml-2">{progress}% completo</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col md:flex-row md:items-start md:gap-8">
        <ol className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const isCompleted = (onboarding as any)[`${step.key}_completed`];
            const isCurrent = !isCompleted && (idx === 0 || (onboarding as any)[`${steps[idx-1].key}_completed`]);
            return (
              <li key={step.key} className={`flex items-start gap-4 p-4 rounded-lg transition-all ${isCurrent ? 'bg-white shadow-md border border-gray-100' : 'opacity-60'}`}>
                <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-lg font-bold transition-all shrink-0
                  ${isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : ""}
                  ${isCurrent ? "bg-emerald-100 border-emerald-500 text-emerald-700" : ""}
                  ${!isCompleted && !isCurrent ? "bg-gray-100 border-gray-200 text-gray-400" : ""}
                `}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                </div>
                <div className="flex-grow">
                  <div className={`font-semibold text-base ${isCurrent ? "text-emerald-900" : "text-gray-700"}`}>{step.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{step.description}</div>
                  {isCurrent && (
                    <Button size="sm" className="mt-3" onClick={() => onStepClick?.(step.key as any)}>
                      {isCompleted ? 'Revisar' : 'Começar'}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
} 