export default function ExplainPayslip() {
  const faqs = [
    { q: "O que é IRRF?", a: "Imposto de Renda retido na fonte. Podemos reduzir se ajustar dependentes/declaração.", cta: "Gerar carta ao RH" },
    { q: "Por que meu VR é tão alto?", a: "Seu plano tem taxa acima da média. Avalie portabilidade.", cta: "Comparar planos VR" },
  ];
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Explicar holerite</h1>
      <ul className="space-y-3">
        {faqs.map(x => (
          <li key={x.q} className="rounded-2xl p-4 border bg-white">
            <p className="text-sm font-medium">{x.q}</p>
            <p className="text-sm text-muted-foreground mt-1">{x.a}</p>
            <button className="mt-2 w-full rounded-xl border py-2 text-sm">{x.cta}</button>
          </li>
        ))}
      </ul>
    </main>
  );
}