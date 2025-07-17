import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, ClipboardCheck, FileText } from "lucide-react";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

interface GettingStartedProps {
  userId: string;
  onStepClick?: (step: 'profile' | 'checkup' | 'holerite') => void;
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

export function GettingStarted({ userId, onStepClick }: GettingStartedProps) {
  const onboarding = useUserOnboarding(userId);
  if (!onboarding || onboarding.onboarding_complete) return null;

  const stepStatus = [
    onboarding.profile_completed,
    onboarding.checkup_completed,
    onboarding.holerite_uploaded,
  ];
  const currentIdx = stepStatus.findIndex((done) => !done);
  const progress = onboarding.progress;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto border border-emerald-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-emerald-900">Comece seu onboarding</h2>
        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
          <Progress value={progress} className="h-2 w-32 bg-emerald-100" />
          <span className="text-xs text-gray-500 ml-2">{progress}% completo</span>
        </div>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        <ol className="flex-1 flex flex-row md:flex-col gap-4 md:gap-6 justify-between md:justify-start">
          {steps.map((step, idx) => {
            const completed = stepStatus[idx];
            const isCurrent = idx === currentIdx;
            return (
              <li key={step.key} className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-lg font-bold transition-all
                  ${completed ? "bg-emerald-500 border-emerald-500 text-white" : ""}
                  ${isCurrent && !completed ? "bg-emerald-100 border-emerald-500 text-emerald-700 scale-110" : ""}
                  ${!completed && !isCurrent ? "bg-white border-emerald-200 text-emerald-300" : ""}
                `}>
                  {completed ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                </div>
                <div className="text-center md:text-left">
                  <div className={`font-semibold text-base ${isCurrent ? "text-emerald-900" : "text-gray-700"}`}>{step.label}</div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
                {!completed && isCurrent && (
                  <Button size="sm" className="rounded-full px-5 ml-0 md:ml-4 mt-2 md:mt-0" onClick={() => onStepClick?.(step.key as any)}>
                    Retomar
                  </Button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
} 