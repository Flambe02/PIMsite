"use client"

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { User, Briefcase, GraduationCap, UserCircle } from "lucide-react";
import { useCountry } from "@/lib/geo";
import { GuiaPrevidencia } from "@/components/br/GuiaPrevidencia";
import { GuideRetraite } from "@/components/fr/GuideRetraite";
import { FinancialTips } from "@/components/common/FinancialTips";

export default function RecursosPage() {
  const currentCountry = useCountry();

  // Contenu spécifique par pays
  const getCountryContent = () => {
    if (currentCountry === 'br') {
      return {
        title: "Qual profissional você é?",
        cltTitle: "Assalariado (CLT)",
        cltDescription: "Para quem trabalha com carteira assinada e recebe holerite mensal.",
        pjTitle: "Empresa (PJ)",
        pjDescription: "Para quem tem um CNPJ, emite notas fiscais ou é sócio de uma empresa.",
        estagiarioTitle: "Estagiário",
        estagiarioDescription: "Para estudantes em um programa de estágio, regido por lei própria.",
        autonomoTitle: "Autônomo (CPF)",
        autonomoDescription: "Para quem presta serviços como pessoa física, sem CNPJ, e emite RPA.",
        cltButton: "Ver Guia CLT",
        pjButton: "Ver Guia PJ",
        estagiarioButton: "Ver Guia Estagiário",
        autonomoButton: "Ver Guia Autônomo"
      };
    } else {
      return {
        title: "Quel type de professionnel êtes-vous ?",
        cltTitle: "Salarié (CDI/CDD)",
        cltDescription: "Pour ceux qui travaillent avec un contrat de travail et reçoivent une fiche de paie mensuelle.",
        pjTitle: "Entreprise (SAS/SARL)",
        pjDescription: "Pour ceux qui ont une entreprise, émettent des factures ou sont associés d'une société.",
        estagiarioTitle: "Stagiaire",
        estagiarioDescription: "Pour les étudiants en stage, régis par une loi spécifique.",
        autonomoTitle: "Freelance (Auto-entrepreneur)",
        autonomoDescription: "Pour ceux qui prestent des services en tant que personne physique.",
        cltButton: "Voir Guide Salarié",
        pjButton: "Voir Guide Entreprise",
        estagiarioButton: "Voir Guide Stagiaire",
        autonomoButton: "Voir Guide Freelance"
      };
    }
  };

  const content = getCountryContent();

  return (
    <main className="min-h-screen bg-white py-12 px-2 md:px-0">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
        {content.title}
      </h1>
      
      <div className="flex flex-col items-center gap-10">
        {/* Bloc principal CLT */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-gray-100 px-8 py-10 flex flex-col items-center mb-2">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-7 h-7 text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-900">{content.cltTitle}</span>
          </div>
          <div className="text-gray-700 text-center mb-6">{content.cltDescription}</div>
          <Link href={`/${currentCountry}/recursos/clt`}>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-8 py-3 shadow transition text-base flex items-center gap-2">
              {content.cltButton} <span className="ml-1">→</span>
            </button>
          </Link>
        </div>
        
        {/* Cartes secondaires */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* PJ */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-8 flex flex-col items-center">
            <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-lg font-bold text-blue-900 mb-1">{content.pjTitle}</div>
            <div className="text-gray-700 text-center mb-4 text-sm">{content.pjDescription}</div>
            <Link href={`/${currentCountry}/recursos/pj`}>
              <button className="border border-blue-400 text-blue-700 font-semibold rounded-full px-6 py-2 hover:bg-blue-50 transition text-sm">
                {content.pjButton}
              </button>
            </Link>
          </div>
          
          {/* Estagiário */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-8 flex flex-col items-center">
            <GraduationCap className="w-8 h-8 text-purple-500 mb-2" />
            <div className="text-lg font-bold text-purple-900 mb-1">{content.estagiarioTitle}</div>
            <div className="text-gray-700 text-center mb-4 text-sm">{content.estagiarioDescription}</div>
            <Link href={`/${currentCountry}/recursos/estagiario`}>
              <button className="border border-purple-400 text-purple-700 font-semibold rounded-full px-6 py-2 hover:bg-purple-50 transition text-sm">
                {content.estagiarioButton}
              </button>
            </Link>
          </div>
          
          {/* Autônomo */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-8 flex flex-col items-center">
            <UserCircle className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-lg font-bold text-orange-900 mb-1">{content.autonomoTitle}</div>
            <div className="text-gray-700 text-center mb-4 text-sm">{content.autonomoDescription}</div>
            <Link href={`/${currentCountry}/recursos/autonomo`}>
              <button className="border border-orange-400 text-orange-700 font-semibold rounded-full px-6 py-2 hover:bg-orange-50 transition text-sm">
                {content.autonomoButton}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Section conditionnelle selon le pays */}
      <div className="mt-16 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Guide spécifique au pays */}
          <div>
            {currentCountry === 'br' ? <GuiaPrevidencia /> : <GuideRetraite />}
          </div>
          
          {/* Conseils financiers communs */}
          <div>
            <FinancialTips />
          </div>
        </div>
      </div>
    </main>
  );
}
