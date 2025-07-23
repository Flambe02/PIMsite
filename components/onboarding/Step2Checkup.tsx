import React from "react";
import { Button } from "@/components/ui/button";

interface Step2CheckupProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Checkup({ onNext, onBack }: Step2CheckupProps) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 text-center">
      <h3 className="text-xl font-semibold text-gray-800">Check-up Financeiro</h3>
      <p className="text-gray-600">
        Esta funcionalidade está em desenvolvimento e será disponibilizada em breve. 
        Você poderá avaliar sua saúde financeira detalhadamente.
      </p>
      <div className="flex gap-4 mt-6 w-full">
        <Button variant="outline" onClick={onBack} className="w-full">
          Anterior
        </Button>
        <Button onClick={onNext} className="w-full">
          Pular e ir para a próxima etapa
        </Button>
      </div>
    </div>
  );
} 