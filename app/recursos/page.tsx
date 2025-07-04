"use client";

import Link from "next/link";
import { User, Briefcase, GraduationCap, UserCircle } from "lucide-react";

export default function RecursosPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-2 md:px-0">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Qual profissional você é?</h1>
      <div className="flex flex-col items-center gap-10">
        {/* Bloc principal CLT */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-gray-100 px-8 py-10 flex flex-col items-center mb-2">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-7 h-7 text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-900">Salariado (CLT)</span>
          </div>
          <div className="text-gray-700 text-center mb-6">Para quem trabalha com carteira assinada e recebe holerite mensal.</div>
          <Link href="/recursos/clt">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-8 py-3 shadow transition text-base flex items-center gap-2">
              Ver Guia CLT <span className="ml-1">→</span>
            </button>
          </Link>
        </div>
        {/* Cartes secondaires */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* PJ */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-8 flex flex-col items-center">
            <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-lg font-bold text-blue-900 mb-1">Empresa (PJ)</div>
            <div className="text-gray-700 text-center mb-4 text-sm">Para quem tem um CNPJ, emite notas fiscais ou é sócio de uma empresa.</div>
            <Link href="/recursos/pj">
              <button className="border border-blue-400 text-blue-700 font-semibold rounded-full px-6 py-2 hover:bg-blue-50 transition text-sm">Ver Guia PJ</button>
            </Link>
          </div>
          {/* Estagiário */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-8 flex flex-col items-center">
            <GraduationCap className="w-8 h-8 text-purple-500 mb-2" />
            <div className="text-lg font-bold text-purple-900 mb-1">Estagiário</div>
            <div className="text-gray-700 text-center mb-4 text-sm">Para estudantes em um programa de estágio, regido por lei própria.</div>
            <Link href="/recursos/estagiario">
              <button className="border border-purple-400 text-purple-700 font-semibold rounded-full px-6 py-2 hover:bg-purple-50 transition text-sm">Ver Guia Estagiário</button>
            </Link>
          </div>
          {/* Autônomo */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-8 flex flex-col items-center">
            <UserCircle className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-lg font-bold text-orange-900 mb-1">Autônomo (CPF)</div>
            <div className="text-gray-700 text-center mb-4 text-sm">Para quem presta serviços como pessoa física, sem CNPJ, e emite RPA.</div>
            <Link href="/recursos/autonomo">
              <button className="border border-orange-400 text-orange-700 font-semibold rounded-full px-6 py-2 hover:bg-orange-50 transition text-sm">Ver Guia Autônomo</button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
