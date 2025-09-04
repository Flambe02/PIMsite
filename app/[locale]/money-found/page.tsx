"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ActionCard from "@/components/ActionCard";

export default function MoneyFound() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const found = Number(searchParams?.get("found") || 287);

  const actions = [
    {
      title: "Trocar VR",
      estValue: 110,
      estTime: "10 min",
      subtitle: "Plano com taxa menor",
      ctaLabel: "Gerar dossiê",
      onClick: () => router.push("/portabilidade")
    },
    {
      title: "Plano de saúde",
      estValue: 62,
      estTime: "8 min",
      subtitle: "Migrar para rede melhor",
      ctaLabel: "Solicitar migração",
      onClick: () => router.push("/portabilidade")
    },
    {
      title: "Ajuste IRRF",
      estValue: 115,
      estTime: "5 min",
      subtitle: "Carta pronta ao RH",
      ctaLabel: "Gerar carta ao RH",
      onClick: () => router.push("/explain/payslip")
    }
  ];

  return (
    <main className="p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Dinheiro na mesa</h1>
        <p className="text-sm text-muted-foreground">
          Você pode recuperar <b>R${found}</b> este mês.
        </p>
      </header>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            title={action.title}
            estValue={action.estValue}
            estTime={action.estTime}
            subtitle={action.subtitle}
            ctaLabel={action.ctaLabel}
            onClick={action.onClick}
          />
        ))}
      </div>

      <button
        className="w-full rounded-xl py-3 border font-medium hover:bg-muted/50 transition-colors"
        onClick={() => router.push("/portabilidade")}
      >
        Recuperar R${found} agora
      </button>
    </main>
  );
}
