"use client"

import { Shield, TrendingUp, Heart, Target, CreditCard, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Props {
  language: "fr" | "pt";
  onStart: () => void;
}

const axes = [
  {
    icon: Shield,
    color: "bg-blue-100 text-blue-600",
    labelFR: "Résilience",
    labelPT: "Resiliência",
  },
  {
    icon: TrendingUp,
    color: "bg-green-100 text-green-600",
    labelFR: "Revenus",
    labelPT: "Renda",
  },
  {
    icon: Heart,
    color: "bg-gray-100 text-gray-700 dark:text-red-500",
    labelFR: "Bien-être",
    labelPT: "Saúde",
  },
  {
    icon: Target,
    color: "bg-purple-100 text-purple-600",
    labelFR: "Futur",
    labelPT: "Futuro",
  },
  {
    icon: CreditCard,
    color: "bg-orange-100 text-orange-600",
    labelFR: "Budget",
    labelPT: "Dívidas",
  },
];

export default function FinancialCheckupLanding({ language, onStart }: Props) {
  const t = {
    title: language === "fr" ? "Financial Check-up 360°" : "Financial Check-up 360°",
    subtitle:
      language === "fr"
        ? "Évaluez votre santé financière en 5 minutes"
        : "Avalie sua saúde financeira em 5 minutos",
    intro:
      language === "fr"
        ? "Notre diagnostic complet analyse vos finances selon 5 axes principaux pour identifier vos forces et vos axes d'amélioration."
        : "Nosso diagnóstico completo analisa suas finanças em 5 eixos principais para identificar seus pontos fortes e áreas de melhoria.",
    cta: language === "fr" ? "Commencer" : "Começar",
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center px-4 bg-white text-[#192042] overflow-hidden">
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-center">{t.title}</h1>

      {/* Subtitle */}
      <p className="mt-3 md:mt-4 text-base md:text-lg text-center text-gray-600">{t.subtitle}</p>

      {/* Intro */}
      <p className="mt-4 md:mt-8 max-w-xl text-center text-gray-700 text-sm md:text-base">{t.intro}</p>

      {/* Mobile: Checkup Image */}
      <div className="mt-6 md:hidden flex justify-center">
        <Image
          src="/images/Checkup.png"
          alt="Financial Check-up Wheel"
          width={200}
          height={200}
          priority
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Desktop: Axes Icons */}
      <div className="hidden md:grid mt-12 grid-cols-5 gap-x-10">
        {axes.map(({ icon: Icon, color, labelFR, labelPT }) => (
          <div key={labelFR} className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}> 
              <Icon className="w-7 h-7" />
            </div>
            <span className="mt-3 text-sm font-medium">
              {language === "fr" ? labelFR : labelPT}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="mt-6 md:mt-14 w-56 md:w-64 h-[48px] md:h-[54px] rounded-full bg-[#3366FF] hover:bg-[#2b59e6] text-white font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition text-sm md:text-base"
      >
        {t.cta}
        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </main>
  );
}
