"use client";

import { FileText, Upload, FileEdit, BarChart2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardClientProps {
  user: any;
  payslips: any[];
}

export default function DashboardClient({ user, payslips }: DashboardClientProps) {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-indigo-900 mb-2">Dashboard de Holerites</h1>
      <p className="text-gray-600 mb-8">
        Acompanhe suas análises de holerite, otimize sua remuneração e descubra recomendações personalizadas.
      </p>

      {payslips.length === 0 ? (
        <section className="bg-white rounded-xl shadow p-8 flex flex-col items-center mb-10">
          <span className="text-6xl mb-4">📄</span>
          <h2 className="text-xl font-semibold mb-2">Nenhum holerite enviado ainda</h2>
          <p className="text-gray-500 mb-6 text-center">
            Envie seu primeiro holerite para começar a analisar sua folha de pagamento e receber recomendações personalizadas.
          </p>
          <div className="flex gap-4">
            <Link href="/calculadora?tab=upload">
              <Button className="bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg">
                <Upload size={20} /> Upload de Holerite
              </Button>
            </Link>
            <Link href="/calculadora?tab=manual">
              <Button variant="outline" className="px-6 py-3 rounded-lg flex items-center gap-2 text-lg">
                <FileEdit size={20} /> Entrada Manual
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Seus Holerites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payslips.map((p: any) => (
              <div key={p.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-700">
                  <FileText size={20} />
                  <span className="font-medium">{p.periodo}</span>
                </div>
                <div className="text-gray-700">Salário Líquido: <span className="font-bold">R$ {p.salarioLiquido}</span></div>
                <div className="text-gray-500 text-sm">Enviado em {p.dataEnvio}</div>
                <Link href={`/holerite/${p.id}`}>
                  <Button variant="outline" className="mt-2 w-full">Ver detalhes</Button>
                </Link>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            <Link href="/calculadora?tab=upload">
              <Button className="bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg">
                <Upload size={20} /> Upload de Holerite
              </Button>
            </Link>
            <Link href="/calculadora?tab=manual">
              <Button variant="outline" className="px-6 py-3 rounded-lg flex items-center gap-2 text-lg">
                <FileEdit size={20} /> Entrada Manual
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Section Análise e Recomendações */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-indigo-900 mb-2">Análise e Recomendações</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold mb-2">Situação Atual</h3>
            <ul className="space-y-2 text-blue-900">
              <li className="flex items-start gap-2"><BarChart2 size={18} /> <span>Regime de Contratação: <b>CLT</b></span></li>
              <li className="flex items-start gap-2"><BarChart2 size={18} /> <span>Carga Tributária: <b>18,9%</b></span></li>
              <li className="flex items-start gap-2"><BarChart2 size={18} /> <span>Relação Líquido/Bruto: <b>81,1%</b></span></li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="font-semibold mb-2">Recomendações Personalizadas</h3>
            <ul className="space-y-2 text-green-900">
              <li className="flex items-start gap-2"><CheckCircle2 size={18} /> <span>Otimize seus benefícios</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 size={18} /> <span>Considere Previdência Privada</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 size={18} /> <span>Avalie CLT vs PJ</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cartes de synthèse */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-2xl font-bold text-indigo-700">0</div>
          <div className="text-gray-500">Análises Anteriores</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-2xl font-bold text-emerald-700">R$ 0</div>
          <div className="text-gray-500">Economia Potencial</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-2xl font-bold text-indigo-700">N/A</div>
          <div className="text-gray-500">Pontuação de Otimização</div>
        </div>
      </section>
    </main>
  );
} 