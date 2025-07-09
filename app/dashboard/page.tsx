import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { CalendarWidget } from "@/components/calendar/CalendarWidget";
import { EducationWidget } from "@/components/education/EducationWidget";
import { PimChatWidget } from "@/components/chatbot/PimChatWidget";

// Placeholder pour le graphique
function GraficoPlaceholder() {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center min-h-[200px] mb-6">
      <span className="text-gray-400">[Gráfico de evolução salarial e benefícios]</span>
    </div>
  );
}

export default function Dashboard() {
  // Données mockées pour l'exemple
  const salarioLiquido = "R$ 4.500";
  const beneficios = "R$ 1.200";
  const proximaDeadline = "07/05/2025";

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Olá, João 👋</h1>
        {/* Résumé visuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center shadow">
            <span className="text-xs text-emerald-700 font-bold uppercase">Salário Líquido</span>
            <span className="text-2xl font-bold text-emerald-900">{salarioLiquido}</span>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow">
            <span className="text-xs text-blue-700 font-bold uppercase">Benefícios</span>
            <span className="text-2xl font-bold text-blue-900">{beneficios}</span>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center shadow">
            <span className="text-xs text-yellow-700 font-bold uppercase">Próxima Deadline</span>
            <span className="text-lg font-bold text-yellow-900">{proximaDeadline}</span>
          </div>
        </div>
        {/* Graphique d'évolution */}
        <GraficoPlaceholder />
        {/* Actions rapides */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition">Analisar novo holerite</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">Simular aumento</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition">Comparar benefícios</button>
        </div>
        {/* Alerte positive */}
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          <p className="font-bold">Parabéns!</p>
          <p>Você está acima da média do mercado em benefícios.</p>
        </div>
        {/* Widgets dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <CalendarWidget
            vacations={[{ start: "2025-07-10", end: "2025-07-20", label: "Férias de julho" }]}
            deadlines={[
              { date: "2025-05-07", label: "Envio Holerite", type: "holerite" },
              { date: "2025-04-30", label: "Imposto de Renda", type: "fiscal" },
            ]}
          />
          <EducationWidget />
        </div>
        <PimChatWidget />
      </main>
    </div>
  );
}
