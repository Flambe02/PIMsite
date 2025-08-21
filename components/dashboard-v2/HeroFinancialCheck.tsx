// Server-first component to render the 360° Financial Check-up as a hero
// Note: Keep data shape identical to existing SummaryCard/FinancialCheckup components

type FinancialHeroProps = {
  checkup?: any; // latestCheckup shape from useFinancialCheckup
  locale: string;
};

export default async function HeroFinancialCheck({ checkup, locale }: FinancialHeroProps) {
  // Presentation-only placeholder; reuse existing props contract in integration
  return (
    <section aria-labelledby="hero-financial-check" className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 id="hero-financial-check" className="text-xl font-semibold text-gray-900">
          {locale === 'fr' ? 'Financial Check-up 360°' : 'Financial Check-up 360°'}
        </h2>
        <span className="text-sm text-gray-500">{checkup ? 'Atualizado' : 'N/A'}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 h-40 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
          Donut/Score (reuse existing chart via dynamic import in page)
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-700">Resumo</div>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            <li>Score atual: {checkup?.score ?? '—'}</li>
            <li>Última análise: {checkup?.updated_at ?? '—'}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}


