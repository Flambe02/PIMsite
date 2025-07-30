"use client"

import { CheckCircle2, ArrowRight, Shield, TrendingUp, Heart, Target, CreditCard } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface FinancialCheckupHeroProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
  onStart: () => void;
  onResume?: () => void;
  resumeAvailable?: boolean;
  country: string;
  language: string;
  onCountryChange: (c: string) => void;
  onLanguageChange: (l: string) => void;
}

const blocks = [
  { icon: Shield, color: "blue", labelFR: "Résilience", labelPT: "Resiliência" },
  { icon: TrendingUp, color: "green", labelFR: "Revenus", labelPT: "Renda" },
  { icon: Heart, color: "pink", labelFR: "Bien-être", labelPT: "Saúde" },
  { icon: Target, color: "purple", labelFR: "Futur", labelPT: "Futuro" },
  { icon: CreditCard, color: "orange", labelFR: "Budget", labelPT: "Dívidas" },
];

/*
  Mobile-first Hero completely simplified:
  – Header selectors toujours là (pays / langue)
  – Titre + sous-titre très courts
  – Grille 3 colonnes / 2 lignes de 5 cards maxi (icône + label)
  – CTA “Commencer”
  – Aucun scroll nécessaire (taille contrainte via min-h-screen / overflow-hidden)
*/



export default function FinancialCheckupHero({
  data,
  onStart,
  onResume,
  resumeAvailable = false,
  country,
  language,
  onCountryChange,
  onLanguageChange
}: FinancialCheckupHeroProps) {
  return (
    <div className="h-screen sm:min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-white overflow-hidden sm:overflow-auto">
      {/* Selectors */}
      <div className="flex w-full justify-between max-w-md mb-4">
        <select
          value={country}
          onChange={e => onCountryChange(e.target.value)}
          className="text-sm rounded-lg border px-3 py-1"
        >
          <option value="BR">🇧🇷 BR</option>
          <option value="FR">🇫🇷 FR</option>
        </select>
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className="text-sm rounded-lg border px-3 py-1"
        >
          <option value="pt">🇧🇷 Português</option>
          <option value="fr">🇫🇷 Français</option>
        </select>
      </div>

      {/* Badge */}
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg mb-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </div>

      {/* Big headline */}
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 max-w-xs mx-auto leading-snug">
          {language==='fr' ? 'Prêt pour un nouveau regard\nsur vos finances ?' : 'Pronto para um novo olhar\nsobre suas finanças?'}
        </h2>
        <h1 className="text-4xl font-extrabold text-gray-900 max-w-xs mx-auto leading-tight">
          {language==='fr' ? 'Votre Check-up Financier 360°' : 'Seu Check-up Financeiro 360°'}
        </h1>
        <p className="text-gray-700 text-sm max-w-xs mx-auto leading-snug">
          {language==='fr' ? '5 minutes pour tout comprendre.\n1 clic pour transformer votre vie financière.' : '5 minutos para entender tudo.\n1 clique para transformar sua vida financeira.'}
        </p>
      </div>

      {/* Wheel image */}
      <Image
        src="/images/Checkup.png"
        alt="Checkup wheel"
        width={280}
        height={280}
        priority
        className="mx-auto mt-6"
      />

      {/* Description (hidden on very small screens) */}
      <p className="hidden sm:block text-gray-600 text-center max-w-xs mx-auto leading-relaxed mt-6">
        {data.description}
      </p>

      {/* Desktop icon row */}
      <div className="hidden md:flex justify-center gap-10 mt-10">
        {blocks.map(b => (
          <div key={b.labelFR} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full bg-${b.color}-100 flex items-center justify-center`}>
              <b.icon className={`w-6 h-6 text-${b.color}-600`} />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              {language==='fr' ? b.labelFR : b.labelPT}
            </span>
          </div>
        ))}
      </div>

      {/* Features (show from md) */}
      <div className="hidden md:flex flex-wrap justify-center gap-4 mt-8">
        {language === 'fr' 
          ? ['5 blocs thématiques','Score personnalisé','Recommandations'].map(txt => (
              <span key={txt} className="text-xs bg-white px-3 py-1 rounded-full shadow-sm text-gray-600">
                {txt}
              </span>
            ))
          : ['5 blocos temáticos','Score personalizado','Recomendações'].map(txt => (
              <span key={txt} className="text-xs bg-white px-3 py-1 rounded-full shadow-sm text-gray-600">
                {txt}
              </span>
            ))
        }
      </div>

      {/* CTA / Resume */}
      <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={onStart}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
        >
          {language === "fr" ? "Commencer" : "Começar"}
          <ArrowRight className="w-4 h-4" />
        </button>
        {resumeAvailable && onResume && (
          <button
            onClick={onResume}
            className="bg-white text-blue-600 border border-blue-600 font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
          >
            {language === "fr" ? "Reprendre" : "Retomar"}
          </button>
        )}
      </div>
    </div>
  );
}
