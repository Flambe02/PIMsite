"use client";
import { useState } from "react";
import StatusStepper from "@/components/StatusStepper";
import ActionCard from "@/components/ActionCard";

const steps = ["Comparar","Dossiê","Status","Provas"];

export default function PortabilidadePage() {
  const [tab, setTab] = useState<"comparar"|"dossie"|"status"|"provas">("comparar");

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Portabilidade</h1>
      <StatusStepper steps={steps} current={["comparar","dossie","status","provas"].indexOf(tab)} />
      
      <div className="grid grid-cols-4 gap-2 text-xs">
        {(["comparar","dossie","status","provas"] as const).map(t => 
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`py-2 rounded-xl border ${tab===t?"font-medium":"text-muted-foreground"}`}
          >
            {t}
          </button>
        )}
      </div>

      {tab==="comparar" && (
        <section className="space-y-3">
          <ActionCard title="VR—Fornecedor A" estValue={110} estTime="10 min" ctaLabel="Gerar dossiê" />
          <ActionCard title="VR—Fornecedor B" estValue={95} estTime="8 min" ctaLabel="Gerar dossiê" />
        </section>
      )}

      {tab==="dossie" && (
        <section className="space-y-3">
          <div className="rounded-2xl p-4 border bg-white">
            <p className="text-sm font-medium">Dados do dossiê</p>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <input className="border rounded-xl px-3 py-2 text-sm" placeholder="Empresa / CNPJ" />
              <input className="border rounded-xl px-3 py-2 text-sm" placeholder="Matrícula" />
              <input className="border rounded-xl px-3 py-2 text-sm" placeholder="Fornecedor atual" />
            </div>
            <button className="mt-3 w-full rounded-xl border py-2 text-sm">Gerar PDF & Email</button>
          </div>
        </section>
      )}

      {tab==="status" && (
        <section className="space-y-3">
          <div className="rounded-2xl p-4 border bg-white text-sm">Status: <b>submitted</b> — 2025-01-31 10:12</div>
        </section>
      )}

      {tab==="provas" && (
        <section className="space-y-3">
          <div className="rounded-2xl p-4 border bg-white text-sm">Sem provas enviadas ainda.</div>
        </section>
      )}
    </main>
  );
}
