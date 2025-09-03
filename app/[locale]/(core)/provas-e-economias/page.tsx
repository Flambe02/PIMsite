"use client";
import ProofTimeline, { ProofItem } from "@/components/ProofTimeline";

const demo: ProofItem[] = [
  { id: "1", title: "Pedido de portabilidade VR enviado", date: "2025-01-31", state: "submitted", value: 110 },
  { id: "2", title: "Guia DAS paga", date: "2025-02-05", state: "completed" },
];

export default function ProofPage() {
  const total = demo.reduce((s, i) => s + (i.value || 0), 0);
  return (
    <main className="p-4 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Provas & economias</h1>
        <p className="text-sm text-muted-foreground">Economia realizada: <b>R${total}</b></p>
      </header>
      <ProofTimeline items={demo} />
      <a className="block text-center w-full rounded-xl border py-2 text-sm" href="#" onClick={(e)=>e.preventDefault()}>
        Compartilhar no WhatsApp
      </a>
    </main>
  );
}