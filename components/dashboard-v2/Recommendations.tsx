type Recommendation = {
  label: string;
  title: string;
  desc: string;
  btn: string;
  color?: string;
  tag?: string;
};

export default async function Recommendations({ items }: { items: Recommendation[] }) {
  return (
    <section aria-labelledby="reco-title" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <h2 id="reco-title" className="sr-only">Recomendações</h2>
      {items.map((rec, i) => (
        <div key={i} className={`flex flex-col w-full min-h-[100px] p-4 rounded-2xl border shadow bg-white ${rec.color || ''}`}>
          {rec.tag && <span className={`text-xs font-bold px-2 py-0.5 rounded mb-2 w-max ${rec.tag}`}>{rec.label}</span>}
          <span className="font-bold text-base mb-1 text-gray-800">{rec.title}</span>
          <span className="text-gray-600 text-sm mb-3">{rec.desc}</span>
          <button className="mt-auto bg-white border border-gray-200 hover:bg-gray-50 text-emerald-700 font-semibold px-3 py-1.5 rounded shadow-sm text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-400">{rec.btn}</button>
        </div>
      ))}
    </section>
  );
}


