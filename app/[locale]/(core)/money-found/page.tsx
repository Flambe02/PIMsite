"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ActionCard from "@/components/ActionCard";

export default function MoneyFoundPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const found = Number(sp?.get("found") || 287);

  const actions = [
    { title: "Trocar VR", estValue: 110, estTime: "10 min", subtitle: "Plano com taxa menor" },
    { title: "Plano de saúde", estValue: 62, estTime: "8 min", subtitle: "Migrar para rede melhor" },
    { title: "Ajuste IRRF", estValue: 115, estTime: "5 min", subtitle: "Carta pronta ao RH" },
  ];

  return (
    <main className="p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Dinheiro na mesa</h1>
        <p className="text-sm text-muted-foreground">Você pode recuperar <b>R${found}</b> este mês.</p>
      </header>
      {actions.map(a => (
        <ActionCard key={a.title} {...a} ctaLabel="Gerar dossiê" onClick={() => router.push(`/portabilidade`)} />
      ))}
      <button className="w-full rounded-xl py-3 border font-medium" onClick={() => router.push(`/portabilidade`)}>
        Recuperar R${found} agora
      </button>
    </main>
  );
}