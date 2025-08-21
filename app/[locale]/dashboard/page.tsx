import { DASHBOARD_V2 } from '@/lib/flags';
import LegacyDashboardContent from '@/components/dashboard/LegacyDashboardContent';
import HeroFinancialCheck from '@/components/dashboard-v2/HeroFinancialCheck';
import TopRow from '@/components/dashboard-v2/TopRow';
import CTAImproveScore from '@/components/dashboard-v2/CTAImproveScore';
import { getFinancialCheck360, getLatestNetSalary, getMonthlyBenefits, getSalaryAnalysis, getUserId } from '@/lib/services/dashboardService';

export default async function DashboardPage({ params }: { params: Promise<{ locale: 'br' | 'fr' }> }) {
  const { locale } = await params;
  const userId = await getUserId();

  const [check, net, benefits, analysis] = await Promise.all([
    getFinancialCheck360(userId).catch(() => null),
    getLatestNetSalary(userId).catch(() => null),
    getMonthlyBenefits(userId).catch(() => null),
    getSalaryAnalysis(userId).catch(() => null),
  ]);

  const legacy = <LegacyDashboardContent locale={locale} />;
  const v2 = (
    <>
      <HeroFinancialCheck checkup={check ?? undefined} locale={locale} />
      <TopRow
        locale={locale}
        netSalaryCard={{ title: 'Salário Líquido', value: net ?? '—' }}
        monthlyBenefitsCard={{ title: 'Benefícios Mensais', value: benefits ?? '—' }}
        salaryAnalysisCard={{ title: 'Eficiência', value: analysis ?? '—' }}
      />
      <CTAImproveScore href={`/${locale}/simulador`} />
      {legacy}
    </>
  );

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 animate-fadeIn">
      {DASHBOARD_V2 ? v2 : legacy}
    </main>
  );
}
