type Card = {
  title: string;
  value: string | number;
  hint?: string;
};

type TopRowProps = {
  locale: string;
  netSalaryCard: Card;
  monthlyBenefitsCard: Card;
  salaryAnalysisCard: Card;
};

export default async function TopRow({ locale, netSalaryCard, monthlyBenefitsCard, salaryAnalysisCard }: TopRowProps) {
  const t = (br: string, fr: string) => (locale === 'fr' ? fr : br);
  const CardBox = ({ c }: { c: Card }) => (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
      <div className="text-sm text-gray-500">{c.title}</div>
      <div className="text-2xl font-bold text-gray-900">{c.value}</div>
      {c.hint && <div className="text-xs text-gray-500 mt-1">{c.hint}</div>}
    </div>
  );
  return (
    <section aria-label={t('Resumo financeiro', 'Résumé financier')} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardBox c={netSalaryCard} />
      <CardBox c={monthlyBenefitsCard} />
      <CardBox c={salaryAnalysisCard} />
    </section>
  );
}


