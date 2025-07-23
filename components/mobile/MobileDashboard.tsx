import React from "react";

const summaryCards = [
  { label: "Salaire", value: "R$ 4.200,00", icon: "💰" },
  { label: "Avantages", value: "R$ 800,00", icon: "🎁" },
  { label: "Bien-être", value: "85%", icon: "🌱" },
  { label: "Investissements", value: "R$ 1.200,00", icon: "📈" },
];

export default function MobileDashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col px-4 pt-4" data-testid="mobile-dashboard">
      <h1 className="text-xl font-bold mb-4">Mon Dashboard</h1>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="min-w-[160px] bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow-sm"
            data-testid={`dashboard-card-${card.label.toLowerCase()}`}
          >
            <span className="text-3xl mb-2">{card.icon}</span>
            <span className="text-lg font-bold mb-1">{card.value}</span>
            <span className="text-xs text-gray-600">{card.label}</span>
          </div>
        ))}
      </div>
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Dernières recommandations</h2>
        <ul className="space-y-2">
          <li className="bg-gray-100 rounded p-3 text-sm">Optimisez votre plan d’épargne entreprise pour bénéficier d’un taux préférentiel.</li>
          <li className="bg-gray-100 rounded p-3 text-sm">Pensez à utiliser vos avantages VR avant la fin du mois.</li>
        </ul>
      </section>
    </div>
  );
} 