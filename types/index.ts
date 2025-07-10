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

/**
 * Type global pour les payslips/holerites utilisés dans tout le projet
 */
export interface Payslip {
  id: string;
  periodo: string;
  salarioLiquido: number;
  dataEnvio: string;
  data_pagamento?: string;
  proxima_data_pagamento?: string;
  proximo_valor_liquido?: string;
  nome?: string;
  salario_liquido?: string;
  salario_bruto?: string;
  impostos?: string;
  structured_data?: Record<string, unknown>;
  beneficios?: string;
  created_at?: string;
  metodo?: string;
  status?: string;
  recommendations?: unknown;
  inss?: string;
  empresa?: string;
  upload_id?: string;
  user_id?: string;
  preview_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  file_url?: string;
  upload_date?: string;
}

/**
 * Ligne individuelle du bulletin (tableau Vencimentos / Descontos)
 */
export interface PayslipLine {
  codigo?: string;          // ex : "301"
  descricao: string;        // ex : "INSS"
  referencia?: string;      // ex : "9,00%" ou "30,00"
  venc?: number;            // montant côté Vencimentos
  desc?: number;            // montant côté Descontos
}

/**
 * Structure complète persistée dans la colonne JSONB `structured_data`
 */
export interface PayslipParsed {
  empresa: {
    nome: string;
    cnpj?: string;
    endereco?: string;
  };
  colaborador: {
    nome: string;
    cpf?: string;
    cargo?: string;
    admissao?: string;      // "dd/mm/yyyy" ou "yyyy-mm-dd"
  };
  folha_pagamento: {
    mes_referencia: string; // ex : "Janeiro/2025"
    itens: PayslipLine[];
    totaux: {
      total_venc: number;
      total_desc: number;
      salario_liquido: number;
    };
    bases: {
      base_inss?: number;
      base_fgts?: number;
      valor_fgts?: number;
      base_irrf?: number;
    };
  };
  raw_text: string;         // texte OCR brut (debug)
} 