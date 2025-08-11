import { z } from 'zod';

/**
 * Canonical, country-aware, unified data extraction interface for payslips
 * This interface provides consistent field naming across all countries
 * while maintaining backward compatibility with existing systems
 */
export interface PayslipExtracted {
  // Administrative Information
  employer_name: string | null;
  employer_cnpj: string | null; // CNPJ for BR, SIRET for FR, NIF for PT
  employee_name: string | null;
  employee_cpf: string | null; // CPF for BR, NIR for FR, NIF for PT
  job_title: string | null;
  admission_date: string | null; // ISO date string
  period_start: string | null; // ISO date string
  period_end: string | null; // ISO date string
  
  // Core Financial Data
  salario_bruto: number | null;
  salario_liquido: number | null;
  proventos_total: number | null;
  descontos_total: number | null;
  
  // Taxes and Contributions
  inss_contrib: number | null; // INSS for BR, Sécurité Sociale for FR, Segurança Social for PT
  irrf_contrib: number | null; // IRRF for BR, IR for FR, IRS for PT
  fgts_base: number | null; // FGTS for BR, specific to Brazil
  fgts_mes: number | null; // FGTS monthly contribution for BR
  
  // Vacations and Bonuses
  ferias_valor: number | null; // Vacation pay
  ferias_terco: number | null; // Vacation bonus (1/3) for BR
  bonus: number | null; // Performance bonuses
  adiantamentos_total: number | null; // Advances/anticipations
  
  // Benefits
  vale_refeicao: number | null; // Meal allowance
  auxilio_alimentacao: number | null; // Food assistance
  saude: number | null; // Health plan
  odontologia: number | null; // Dental plan
  previdencia_privada: number | null; // Private pension
  
  // Metadata
  country: 'br' | 'fr' | 'pt';
  extraction_confidence: number; // 0-100 weighted confidence score
  extraction_method: 'regex' | 'llm' | 'hybrid';
  extracted_at: string; // ISO timestamp
}

/**
 * Country-specific field mappings for consistent internal naming
 * Maps country-specific field names to canonical PayslipExtracted fields
 */
export const COUNTRY_FIELD_MAPPINGS = {
  br: {
    // Administrative
    employer_name: ['empresa', 'nome_empresa', 'razao_social'],
    employer_cnpj: ['cnpj', 'empresa_cnpj'],
    employee_name: ['nome', 'nome_funcionario', 'funcionario'],
    employee_cpf: ['cpf', 'funcionario_cpf'],
    job_title: ['cargo', 'funcao', 'cbo'],
    admission_date: ['admissao', 'data_admissao'],
    period_start: ['periodo_inicio', 'mes_referencia'],
    period_end: ['periodo_fim', 'mes_referencia'],
    
    // Financial
    salario_bruto: ['salario_bruto', 'vencimentos_total', 'proventos_total'],
    salario_liquido: ['salario_liquido', 'liquido_total'],
    proventos_total: ['proventos_total', 'vencimentos_total'],
    descontos_total: ['descontos_total', 'abatimentos_total'],
    
    // Taxes
    inss_contrib: ['inss', 'contribuicao_inss'],
    irrf_contrib: ['irrf', 'imposto_renda', 'ir'],
    fgts_base: ['base_fgts', 'fgts_base'],
    fgts_mes: ['fgts_mes', 'fgts'],
    
    // Benefits
    vale_refeicao: ['vale_refeicao', 'vr'],
    auxilio_alimentacao: ['auxilio_alimentacao', 'aa'],
    saude: ['plano_saude', 'saude'],
    odontologia: ['plano_odontologico', 'odontologia'],
    previdencia_privada: ['previdencia_privada', 'previdencia']
  },
  
  fr: {
    // Administrative
    employer_name: ['entreprise', 'raison_sociale'],
    employer_cnpj: ['siret', 'numero_siret'],
    employee_name: ['employe', 'nom', 'prenom'],
    employee_cpf: ['nir', 'numero_secu'],
    job_title: ['poste', 'fonction', 'emploi'],
    admission_date: ['date_embauche', 'date_entree'],
    period_start: ['periode_debut', 'mois_reference'],
    period_end: ['periode_fin', 'mois_reference'],
    
    // Financial
    salario_bruto: ['salaire_brut', 'brut_total'],
    salario_liquido: ['salaire_net', 'net_total'],
    proventos_total: ['revenus_total', 'gains_total'],
    descontos_total: ['deductions_total', 'retraits_total'],
    
    // Taxes
    inss_contrib: ['securite_sociale', 'cotisations_sociales'],
    irrf_contrib: ['impot_revenu', 'ir'],
    fgts_base: null, // Not applicable for France
    fgts_mes: null, // Not applicable for France
    
    // Benefits
    vale_refeicao: ['tickets_restaurant', 'tr'],
    auxilio_alimentacao: ['aide_alimentation', 'aa'],
    saude: ['mutuelle', 'sante'],
    odontologia: ['dentaire', 'soins_dentaires'],
    previdencia_privada: ['retraite_complementaire', 'prevoyance']
  },
  
  pt: {
    // Administrative
    employer_name: ['empresa', 'nome_empresa'],
    employer_cnpj: ['nif', 'numero_nif'],
    employee_name: ['funcionario', 'nome_funcionario'],
    employee_cpf: ['nif_funcionario', 'numero_contribuinte'],
    job_title: ['cargo', 'funcao'],
    admission_date: ['data_admissao', 'data_entrada'],
    period_start: ['periodo_inicio', 'mes_referencia'],
    period_end: ['periodo_fim', 'mes_referencia'],
    
    // Financial
    salario_bruto: ['salario_bruto', 'vencimentos_total'],
    salario_liquido: ['salario_liquido', 'liquido_total'],
    proventos_total: ['proventos_total', 'vencimentos_total'],
    descontos_total: ['descontos_total', 'deducoes_total'],
    
    // Taxes
    inss_contrib: ['seguranca_social', 'contribuicoes_sociais'],
    irrf_contrib: ['irs', 'imposto_rendimento'],
    fgts_base: null, // Not applicable for Portugal
    fgts_mes: null, // Not applicable for Portugal
    
    // Benefits
    vale_refeicao: ['subsidio_refeicao', 'sr'],
    auxilio_alimentacao: ['ajuda_alimentacao', 'aa'],
    saude: ['seguro_saude', 'saude'],
    odontologia: ['seguro_dentario', 'odontologia'],
    previdencia_privada: ['pensao_privada', 'previdencia']
  }
} as const;

/**
 * Field importance weights for confidence scoring
 * Higher weights indicate more critical fields for overall confidence
 */
export const FIELD_IMPORTANCE_WEIGHTS: Record<keyof PayslipExtracted, number> = {
  // Administrative (medium importance)
  employer_name: 3,
  employer_cnpj: 2,
  employee_name: 4,
  employee_cpf: 2,
  job_title: 2,
  admission_date: 1,
  period_start: 3,
  period_end: 3,
  
  // Core Financial (high importance)
  salario_bruto: 8,
  salario_liquido: 8,
  proventos_total: 6,
  descontos_total: 6,
  
  // Taxes (high importance)
  inss_contrib: 7,
  irrf_contrib: 7,
  fgts_base: 5,
  fgts_mes: 5,
  
  // Vacations and Bonuses (medium importance)
  ferias_valor: 4,
  ferias_terco: 3,
  bonus: 3,
  adiantamentos_total: 2,
  
  // Benefits (medium importance)
  vale_refeicao: 4,
  auxilio_alimentacao: 4,
  saude: 5,
  odontologia: 3,
  previdencia_privada: 4,
  
  // Metadata (low importance for confidence)
  country: 1,
  extraction_confidence: 0, // Not used in calculation
  extraction_method: 1,
  extracted_at: 1
};

/**
 * Zod schema for validation and coercion of PayslipExtracted data
 */
export const zPayslipExtracted = z.object({
  // Administrative Information
  employer_name: z.string().nullable(),
  employer_cnpj: z.string().nullable(),
  employee_name: z.string().nullable(),
  employee_cpf: z.string().nullable(),
  job_title: z.string().nullable(),
  admission_date: z.string().nullable(),
  period_start: z.string().nullable(),
  period_end: z.string().nullable(),
  
  // Core Financial Data
  salario_bruto: z.number().nullable(),
  salario_liquido: z.number().nullable(),
  proventos_total: z.number().nullable(),
  descontos_total: z.number().nullable(),
  
  // Taxes and Contributions
  inss_contrib: z.number().nullable(),
  irrf_contrib: z.number().nullable(),
  fgts_base: z.number().nullable(),
  fgts_mes: z.number().nullable(),
  
  // Vacations and Bonuses
  ferias_valor: z.number().nullable(),
  ferias_terco: z.number().nullable(),
  bonus: z.number().nullable(),
  adiantamentos_total: z.number().nullable(),
  
  // Benefits
  vale_refeicao: z.number().nullable(),
  auxilio_alimentacao: z.number().nullable(),
  saude: z.number().nullable(),
  odontologia: z.number().nullable(),
  previdencia_privada: z.number().nullable(),
  
  // Metadata
  country: z.enum(['br', 'fr', 'pt']),
  extraction_confidence: z.number().min(0).max(100),
  extraction_method: z.enum(['regex', 'llm', 'hybrid']),
  extracted_at: z.string()
});

/**
 * Type for the validated and coerced data
 */
export type PayslipExtractedValidated = z.infer<typeof zPayslipExtracted>;

/**
 * Legacy compatibility interface for backward compatibility
 * Maps canonical fields to legacy field names used in existing system
 */
export interface LegacyCompatibility {
  // Map canonical fields to legacy field names
  nome?: string | null;
  empresa?: string | null;
  period?: string | null;
  salario_bruto?: number | null;
  salario_liquido?: number | null;
  descontos?: number | null;
  beneficios?: number | null;
  seguros?: number | null;
  statut?: string | null;
  pays?: string | null;
  incoherence_detectee?: boolean;
  employee_name?: string | null;
  company_name?: string | null;
  position?: string | null;
}

/**
 * Conversion function from canonical to legacy format
 */
export function toLegacyFormat(canonical: PayslipExtracted): LegacyCompatibility {
  return {
    nome: canonical.employee_name,
    empresa: canonical.employer_name,
    period: canonical.period_start,
    salario_bruto: canonical.salario_bruto,
    salario_liquido: canonical.salario_liquido,
    descontos: canonical.descontos_total,
    beneficios: (canonical.vale_refeicao || 0) + (canonical.auxilio_alimentacao || 0) + (canonical.saude || 0),
    seguros: canonical.saude || 0,
    statut: 'CLT', // Default for backward compatibility
    pays: canonical.country,
    incoherence_detectee: false, // Will be calculated during validation
    employee_name: canonical.employee_name,
    company_name: canonical.employer_name,
    position: canonical.job_title
  };
}

/**
 * Conversion function from legacy to canonical format
 */
export function fromLegacyFormat(legacy: LegacyCompatibility, country: 'br' | 'fr' | 'pt' = 'br'): PayslipExtracted {
  return {
    // Administrative
    employer_name: legacy.empresa || legacy.company_name || null,
    employer_cnpj: null,
    employee_name: legacy.nome || legacy.employee_name || null,
    employee_cpf: null,
    job_title: legacy.position || null,
    admission_date: null,
    period_start: legacy.period || null,
    period_end: null,
    
    // Core Financial
    salario_bruto: legacy.salario_bruto || null,
    salario_liquido: legacy.salario_liquido || null,
    proventos_total: null,
    descontos_total: legacy.descontos || null,
    
    // Taxes
    inss_contrib: null,
    irrf_contrib: null,
    fgts_base: null,
    fgts_mes: null,
    
    // Vacations and Bonuses
    ferias_valor: null,
    ferias_terco: null,
    bonus: null,
    adiantamentos_total: null,
    
    // Benefits
    vale_refeicao: null,
    auxilio_alimentacao: null,
    saude: legacy.seguros || null,
    odontologia: null,
    previdencia_privada: null,
    
    // Metadata
    country,
    extraction_confidence: 0,
    extraction_method: 'regex',
    extracted_at: new Date().toISOString()
  };
}
