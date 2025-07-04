"use client";

import { User, Building2, GraduationCap, UserCheck } from "lucide-react";

export default function RecursosPage() {
  return (
    <main className="flex-1 min-h-screen bg-white">
      <section className="mt-16 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">Qual profissional você é?</h1>

        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          {/* Carte CLT en vedette */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
            <User className="h-10 w-10 text-green-600 mb-2" strokeWidth={2}/>
            <h2 className="text-2xl font-bold mb-1">Salariado (CLT)</h2>
            <p className="text-gray-600 mb-6">Para quem trabalha com carteira assinada e recebe holerite mensal.</p>
            <a
              href="/recursos/clt"
              className="inline-block rounded-md bg-green-600 text-white px-6 py-2 font-semibold text-base shadow-sm hover:bg-green-700 transition"
            >
              Ver Guia CLT →
            </a>
          </div>

          {/* Grille des autres profils */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PJ */}
            <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col items-center text-center">
              <Building2 className="h-8 w-8 text-blue-600 mb-2" strokeWidth={2}/>
              <h3 className="font-semibold text-lg mb-1 text-gray-900">Empresa (PJ)</h3>
              <p className="text-xs text-gray-500 mb-4">Para quem tem um CNPJ, emite notas fiscais ou é sócio de uma empresa.</p>
              <a
                href="/recursos/pj"
                className="inline-block rounded-md border border-blue-600 text-blue-600 px-4 py-2 font-medium text-sm hover:bg-blue-50 transition"
              >
                Ver Guia PJ →
              </a>
            </div>
            {/* Estagiário */}
            <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col items-center text-center">
              <GraduationCap className="h-8 w-8 text-violet-600 mb-2" strokeWidth={2}/>
              <h3 className="font-semibold text-lg mb-1 text-gray-900">Estagiário</h3>
              <p className="text-xs text-gray-500 mb-4">Para estudantes em um programa de estágio, regido por lei própria.</p>
              <a
                href="/recursos/estagiario"
                className="inline-block rounded-md border border-violet-600 text-violet-600 px-4 py-2 font-medium text-sm hover:bg-violet-50 transition"
              >
                Ver Guia Estagiário →
              </a>
            </div>
            {/* Autônomo */}
            <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col items-center text-center">
              <UserCheck className="h-8 w-8 text-orange-600 mb-2" strokeWidth={2}/>
              <h3 className="font-semibold text-lg mb-1 text-gray-900">Autônomo (CPF)</h3>
              <p className="text-xs text-gray-500 mb-4">Para quem presta serviços como pessoa física, sem CNPJ, e emite RPA.</p>
              <a
                href="/recursos/autonomo"
                className="inline-block rounded-md border border-orange-600 text-orange-600 px-4 py-2 font-medium text-sm hover:bg-orange-50 transition"
              >
                Ver Guia Autônomo →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
