"use client";
import { useState } from "react";
import StatTile from "@/components/StatTile";
import ActionCard from "@/components/ActionCard";

export default function TaxCenterPage() {
  const [tab, setTab] = useState<"resumo"|"das_iss"|"fator_r"|"obrigacoes">("resumo");
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Tax Center (PJ)</h1>

      <div className="grid grid-cols-4 gap-2 text-xs">
        {(["resumo","das_iss","fator_r","obrigacoes"] as const).map(t =>
          <button key={t} onClick={() => setTab(t)} className={`py-2 rounded-xl border ${tab===t?"font-medium":"text-muted-foreground"}`}>{t}</button>
        )}
      </div>

      {tab==="resumo" && (
        <section className="grid grid-cols-2 gap-3">
          <StatTile title="DAS (venc. 20)" value="R$ 312" />
          <StatTile title="ISS (cidade)" value="R$ 128" />
          <StatTile title="Pendências" value="0" hint="Sem multas" />
          <StatTile title="Economia mês" value="R$ 180" />
        </section>
      )}

      {tab==="das_iss" && (
        <section className="space-y-3">
          <ActionCard title="Gerar DAS do mês" estValue={0} estTime="3 min" ctaLabel="Gerar boleto" />
          <ActionCard title="Gerar guia ISS" estValue={0} estTime="4 min" ctaLabel="Gerar guia" />
        </section>
      )}

      {tab==="fator_r" && (
        <section className="space-y-3">
          <div className="rounded-2xl p-4 border bg-white">
            <p className="text-sm font-medium">Simular pró-labore/INSS</p>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <input className="border rounded-xl px-3 py-2 text-sm" placeholder="Receita mensal" />
              <input className="border rounded-xl px-3 py-2 text-sm" placeholder="Pró-labore atual" />
            </div>
            <button className="mt-3 w-full rounded-xl border py-2 text-sm">Simular</button>
            <p className="text-xs text-muted-foreground mt-2">Estimativa: pode reduzir a alíquota se atender o Fator R.</p>
          </div>
        </section>
      )}

      {tab==="obrigacoes" && (
        <section className="space-y-3">
          <div className="rounded-2xl p-4 border bg-white text-sm">Agenda: DAS (20), ISS (10), NFS-e semanal.</div>
        </section>
      )}
    </main>
  );
}