export interface PayrollAnalysisResult {
  id: string;
  user_id: string;
  period: string;
  gross_income: number;
  net_income: number;
  taxes: number;
  deductions: number;
  benefits: number;
  benefits_utilization: number;
  created_at: string;
} 