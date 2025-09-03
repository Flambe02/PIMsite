export default function ExplainPJ() {
  const faqs = [
    { q: "Meu DAS aumentou, por quê?", a: "Receita acumulada elevou a faixa. Simule pró-labore/INSS para checar Fator R.", cta: "Simular Fator R" },
    { q: "O que é retenção de ISS?", a: "Alguns tomadores retêm ISS na fonte; precisa conciliar nas guias.", cta: "Gerar guia ISS" },
  ];
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Explicar (PJ)</h1>
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