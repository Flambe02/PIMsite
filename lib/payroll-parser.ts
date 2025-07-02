export async function analyzePayslip(fileUrl: string) {
  await new Promise(res => setTimeout(res, 2000));
  return {
    period: "2025-07",
    gross_income: 5000,
    net_income: 3800,
    taxes: 800,
    deductions: 400,
    benefits: 350,
    benefits_utilization: 75,
  };
} 