"use client";
import { UserCircle } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
  netSalary: string;
  nextPayrollDate: string;
  nextPayrollAmount: string;
}

export function WelcomeHeader({
  userName,
  netSalary,
  nextPayrollDate,
  nextPayrollAmount,
}: WelcomeHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <UserCircle className="w-12 h-12 text-emerald-500" />
        <div>
          <div className="text-lg font-bold text-emerald-900">Olá, {userName}! 👋</div>
          <div className="text-sm text-gray-500">Bem-vindo ao seu painel financeiro</div>
        </div>
      </div>
      <div className="flex flex-col md:items-end mt-4 md:mt-0">
        <div className="text-xs text-gray-500">Salário Líquido Atual</div>
        <div className="text-2xl font-bold text-emerald-700">{netSalary}</div>
        <div className="text-xs text-gray-500 mt-1">
          Próximo pagamento: <span className="font-semibold text-emerald-700">{nextPayrollDate}</span> • Valor estimado: <span className="font-semibold text-emerald-700">{nextPayrollAmount}</span>
        </div>
      </div>
    </div>
  );
} 