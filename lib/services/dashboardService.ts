import { getServerSession } from '@/lib/supabase/server';

/** Returns the current user ID or empty string if not authenticated */
export async function getUserId(): Promise<string> {
  const user = await getServerSession();
  return user?.id ?? '';
}

/** Stub: fetch a 360° financial check for the dashboard */
export async function getFinancialCheck360(userId: string): Promise<any | null> {
  return null;
}

/** Stub: fetch latest net salary for the dashboard */
export async function getLatestNetSalary(userId: string): Promise<any | null> {
  return null;
}

/** Stub: fetch monthly benefits data for the dashboard */
export async function getMonthlyBenefits(userId: string): Promise<any | null> {
  return null;
}

/** Stub: fetch salary analysis summary for the dashboard */
export async function getSalaryAnalysis(userId: string): Promise<any | null> {
  return null;
}
