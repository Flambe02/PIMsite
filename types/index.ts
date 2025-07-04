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