import { PayslipExtracted } from '@/types/payslips';

/**
 * Test fixtures for Brazilian payslips
 * Covers various scenarios: basic, with férias, with adiantamentos, with previdência privada
 */

export const brPayslipFixtures = {
  /**
   * Basic Brazilian payslip with minimal information
   */
  basic: {
    ocrText: `
      HOLERITE - COMPROVANTE DE PAGAMENTO DE SALÁRIO
      
      EMPRESA: TechCorp Brasil Ltda.
      CNPJ: 12.345.678/0001-90
      
      FUNCIONÁRIO: João Silva Santos
      CPF: 123.456.789-00
      CARGO: Desenvolvedor Senior
      DATA ADMISSÃO: 15/03/2020
      
      COMPETÊNCIA: Janeiro/2025
      
      VENCIMENTOS:
      Salário Base: R$ 8.000,00
      Total Vencimentos: R$ 8.000,00
      
      DESCONTOS:
      INSS: R$ 880,00
      IRRF: R$ 1.200,00
      Total Descontos: R$ 2.080,00
      
      LÍQUIDO: R$ 5.920,00
      
      BASE FGTS: R$ 8.000,00
      FGTS MÊS: R$ 640,00
    `,
    
    expectedExtraction: {
      employer_name: 'TechCorp Brasil Ltda.',
      employer_cnpj: '12.345.678/0001-90',
      employee_name: 'João Silva Santos',
      employee_cpf: '123.456.789-00',
      job_title: 'Desenvolvedor Senior',
      admission_date: '2020-03-15T00:00:00.000Z',
      period_start: 'Janeiro/2025',
      period_end: 'Janeiro/2025',
      salario_bruto: 8000.00,
      salario_liquido: 5920.00,
      proventos_total: 8000.00,
      descontos_total: 2080.00,
      inss_contrib: 880.00,
      irrf_contrib: 1200.00,
      fgts_base: 8000.00,
      fgts_mes: 640.00,
      ferias_valor: null,
      ferias_terco: null,
      bonus: null,
      adiantamentos_total: null,
      vale_refeicao: null,
      auxilio_alimentacao: null,
      saude: null,
      odontologia: null,
      previdencia_privada: null,
      country: 'br',
      extraction_confidence: 0,
      extraction_method: 'regex',
      extracted_at: ''
    }
  },

  /**
   * Brazilian payslip with férias (vacation pay)
   */
  withFerias: {
    ocrText: `
      HOLERITE - COMPROVANTE DE PAGAMENTO DE SALÁRIO
      
      EMPRESA: Inovação Digital Ltda.
      CNPJ: 98.765.432/0001-10
      
      FUNCIONÁRIO: Maria Oliveira Costa
      CPF: 987.654.321-00
      CARGO: Analista de Marketing
      DATA ADMISSÃO: 10/06/2019
      
      COMPETÊNCIA: Dezembro/2024
      
      VENCIMENTOS:
      Salário Base: R$ 6.500,00
      Férias: R$ 6.500,00
      Terço de Férias: R$ 2.166,67
      Total Vencimentos: R$ 15.166,67
      
      DESCONTOS:
      INSS: R$ 715,00
      IRRF: R$ 800,00
      Total Descontos: R$ 1.515,00
      
      LÍQUIDO: R$ 13.651,67
      
      BASE FGTS: R$ 15.166,67
      FGTS MÊS: R$ 1.213,33
    `,
    
    expectedExtraction: {
      employer_name: 'Inovação Digital Ltda.',
      employer_cnpj: '98.765.432/0001-10',
      employee_name: 'Maria Oliveira Costa',
      employee_cpf: '987.654.321-00',
      job_title: 'Analista de Marketing',
      admission_date: '2019-06-10T00:00:00.000Z',
      period_start: 'Dezembro/2024',
      period_end: 'Dezembro/2024',
      salario_bruto: 6500.00,
      salario_liquido: 13651.67,
      proventos_total: 15166.67,
      descontos_total: 1515.00,
      inss_contrib: 715.00,
      irrf_contrib: 800.00,
      fgts_base: 15166.67,
      fgts_mes: 1213.33,
      ferias_valor: 6500.00,
      ferias_terco: 2166.67,
      bonus: null,
      adiantamentos_total: null,
      vale_refeicao: null,
      auxilio_alimentacao: null,
      saude: null,
      odontologia: null,
      previdencia_privada: null,
      country: 'br',
      extraction_confidence: 0,
      extraction_method: 'regex',
      extracted_at: ''
    }
  },

  /**
   * Brazilian payslip with adiantamentos (advances)
   */
  withAdiantamentos: {
    ocrText: `
      HOLERITE - COMPROVANTE DE PAGAMENTO DE SALÁRIO
      
      EMPRESA: Construção Express Ltda.
      CNPJ: 55.444.333/0001-22
      
      FUNCIONÁRIO: Pedro Santos Lima
      CPF: 555.444.333-22
      CARGO: Pedreiro
      DATA ADMISSÃO: 20/01/2021
      
      COMPETÊNCIA: Novembro/2024
      
      VENCIMENTOS:
      Salário Base: R$ 2.500,00
      Total Vencimentos: R$ 2.500,00
      
      DESCONTOS:
      INSS: R$ 275,00
      IRRF: R$ 0,00
      Adiantamento: R$ 500,00
      Total Descontos: R$ 775,00
      
      LÍQUIDO: R$ 1.725,00
      
      BASE FGTS: R$ 2.500,00
      FGTS MÊS: R$ 200,00
    `,
    
    expectedExtraction: {
      employer_name: 'Construção Express Ltda.',
      employer_cnpj: '55.444.333/0001-22',
      employee_name: 'Pedro Santos Lima',
      employee_cpf: '555.444.333-22',
      job_title: 'Pedreiro',
      admission_date: '2021-01-20T00:00:00.000Z',
      period_start: 'Novembro/2024',
      period_end: 'Novembro/2024',
      salario_bruto: 2500.00,
      salario_liquido: 1725.00,
      proventos_total: 2500.00,
      descontos_total: 775.00,
      inss_contrib: 275.00,
      irrf_contrib: 0.00,
      fgts_base: 2500.00,
      fgts_mes: 200.00,
      ferias_valor: null,
      ferias_terco: null,
      bonus: null,
      adiantamentos_total: 500.00,
      vale_refeicao: null,
      auxilio_alimentacao: null,
      saude: null,
      odontologia: null,
      previdencia_privada: null,
      country: 'br',
      extraction_confidence: 0,
      extraction_method: 'regex',
      extracted_at: ''
    }
  },

  /**
   * Brazilian payslip with previdência privada (private pension)
   */
  withPrevidenciaPrivada: {
    ocrText: `
      HOLERITE - COMPROVANTE DE PAGAMENTO DE SALÁRIO
      
      EMPRESA: Financeira Futuro Ltda.
      CNPJ: 11.222.333/0001-44
      
      FUNCIONÁRIO: Ana Beatriz Silva
      CPF: 111.222.333-44
      CARGO: Gerente Financeiro
      DATA ADMISSÃO: 05/09/2018
      
      COMPETÊNCIA: Outubro/2024
      
      VENCIMENTOS:
      Salário Base: R$ 12.000,00
      Total Vencimentos: R$ 12.000,00
      
      DESCONTOS:
      INSS: R$ 1.320,00
      IRRF: R$ 2.400,00
      Previdência Privada: R$ 600,00
      Total Descontos: R$ 4.320,00
      
      LÍQUIDO: R$ 7.680,00
      
      BASE FGTS: R$ 12.000,00
      FGTS MÊS: R$ 960,00
    `,
    
    expectedExtraction: {
      employer_name: 'Financeira Futuro Ltda.',
      employer_cnpj: '11.222.333/0001-44',
      employee_name: 'Ana Beatriz Silva',
      employee_cpf: '111.222.333-44',
      job_title: 'Gerente Financeiro',
      admission_date: '2018-09-05T00:00:00.000Z',
      period_start: 'Outubro/2024',
      period_end: 'Outubro/2024',
      salario_bruto: 12000.00,
      salario_liquido: 7680.00,
      proventos_total: 12000.00,
      descontos_total: 4320.00,
      inss_contrib: 1320.00,
      irrf_contrib: 2400.00,
      fgts_base: 12000.00,
      fgts_mes: 960.00,
      ferias_valor: null,
      ferias_terco: null,
      bonus: null,
      adiantamentos_total: null,
      vale_refeicao: null,
      auxilio_alimentacao: null,
      saude: null,
      odontologia: null,
      previdencia_privada: 600.00,
      country: 'br',
      extraction_confidence: 0,
      extraction_method: 'regex',
      extracted_at: ''
    }
  },

  /**
   * Brazilian payslip with comprehensive benefits
   */
  withComprehensiveBenefits: {
    ocrText: `
      HOLERITE - COMPROVANTE DE PAGAMENTO DE SALÁRIO
      
      EMPRESA: Saúde & Bem-Estar Ltda.
      CNPJ: 77.888.999/0001-55
      
      FUNCIONÁRIO: Carlos Eduardo Rocha
      CPF: 777.888.999-55
      CARGO: Médico
      DATA ADMISSÃO: 12/04/2020
      
      COMPETÊNCIA: Setembro/2024
      
      VENCIMENTOS:
      Salário Base: R$ 15.000,00
      Total Vencimentos: R$ 15.000,00
      
      DESCONTOS:
      INSS: R$ 1.650,00
      IRRF: R$ 3.000,00
      Vale Refeição: R$ 300,00
      Vale Transporte: R$ 180,00
      Plano de Saúde: R$ 450,00
      Plano Odontológico: R$ 120,00
      Total Descontos: R$ 5.700,00
      
      LÍQUIDO: R$ 9.300,00
      
      BASE FGTS: R$ 15.000,00
      FGTS MÊS: R$ 1.200,00
      
      BENEFÍCIOS:
      Vale Refeição: R$ 600,00
      Vale Transporte: R$ 180,00
      Plano de Saúde: R$ 900,00
      Plano Odontológico: R$ 240,00
    `,
    
    expectedExtraction: {
      employer_name: 'Saúde & Bem-Estar Ltda.',
      employer_cnpj: '77.888.999/0001-55',
      employee_name: 'Carlos Eduardo Rocha',
      employee_cpf: '777.888.999-55',
      job_title: 'Médico',
      admission_date: '2020-04-12T00:00:00.000Z',
      period_start: 'Setembro/2024',
      period_end: 'Setembro/2024',
      salario_bruto: 15000.00,
      salario_liquido: 9300.00,
      proventos_total: 15000.00,
      descontos_total: 5700.00,
      inss_contrib: 1650.00,
      irrf_contrib: 3000.00,
      fgts_base: 15000.00,
      fgts_mes: 1200.00,
      ferias_valor: null,
      ferias_terco: null,
      bonus: null,
      adiantamentos_total: null,
      vale_refeicao: 600.00,
      auxilio_alimentacao: null,
      saude: 900.00,
      odontologia: 240.00,
      previdencia_privada: null,
      country: 'br',
      extraction_confidence: 0,
      extraction_method: 'regex',
      extracted_at: ''
    }
  },

  /**
   * Complex Brazilian payslip with multiple scenarios
   */
  complex: {
    ocrText: `
      HOLERITE - COMPROVANTE DE PAGAMENTO DE SALÁRIO
      
      EMPRESA: Mega Corporação Internacional Ltda.
      CNPJ: 99.999.999/0001-99
      
      FUNCIONÁRIO: Roberto Almeida Santos
      CPF: 999.999.999-99
      CARGO: Diretor Executivo
      DATA ADMISSÃO: 01/01/2015
      
      COMPETÊNCIA: Agosto/2024
      
      VENCIMENTOS:
      Salário Base: R$ 25.000,00
      Bônus Performance: R$ 5.000,00
      Férias: R$ 25.000,00
      Terço de Férias: R$ 8.333,33
      Total Vencimentos: R$ 63.333,33
      
      DESCONTOS:
      INSS: R$ 2.750,00
      IRRF: R$ 6.250,00
      Vale Refeição: R$ 400,00
      Vale Transporte: R$ 200,00
      Plano de Saúde: R$ 600,00
      Plano Odontológico: R$ 150,00
      Previdência Privada: R$ 1.250,00
      Adiantamento: R$ 2.000,00
      Total Descontos: R$ 13.600,00
      
      LÍQUIDO: R$ 49.733,33
      
      BASE FGTS: R$ 63.333,33
      FGTS MÊS: R$ 5.066,67
      
      BENEFÍCIOS:
      Vale Refeição: R$ 800,00
      Vale Transporte: R$ 200,00
      Plano de Saúde: R$ 1.200,00
      Plano Odontológico: R$ 300,00
      Previdência Privada: R$ 2.500,00
    `,
    
    expectedExtraction: {
      employer_name: 'Mega Corporação Internacional Ltda.',
      employer_cnpj: '99.999.999/0001-99',
      employee_name: 'Roberto Almeida Santos',
      employee_cpf: '999.999.999-99',
      job_title: 'Diretor Executivo',
      admission_date: '2015-01-01T00:00:00.000Z',
      period_start: 'Agosto/2024',
      period_end: 'Agosto/2024',
      salario_bruto: 25000.00,
      salario_liquido: 49733.33,
      proventos_total: 63333.33,
      descontos_total: 13600.00,
      inss_contrib: 2750.00,
      irrf_contrib: 6250.00,
      fgts_base: 63333.33,
      fgts_mes: 5066.67,
      ferias_valor: 25000.00,
      ferias_terco: 8333.33,
      bonus: 5000.00,
      adiantamentos_total: 2000.00,
      vale_refeicao: 800.00,
      auxilio_alimentacao: null,
      saude: 1200.00,
      odontologia: 300.00,
      previdencia_privada: 2500.00,
      country: 'br',
      extraction_confidence: 0,
      extraction_method: 'regex',
      extracted_at: ''
    }
  }
};

/**
 * Helper function to create a PayslipExtracted object with current timestamp
 */
export function createPayslipExtracted(data: Partial<PayslipExtracted>): PayslipExtracted {
  return {
    employer_name: null,
    employer_cnpj: null,
    employee_name: null,
    employee_cpf: null,
    job_title: null,
    admission_date: null,
    period_start: null,
    period_end: null,
    salario_bruto: null,
    salario_liquido: null,
    proventos_total: null,
    descontos_total: null,
    inss_contrib: null,
    irrf_contrib: null,
    fgts_base: null,
    fgts_mes: null,
    ferias_valor: null,
    ferias_terco: null,
    bonus: null,
    adiantamentos_total: null,
    vale_refeicao: null,
    auxilio_alimentacao: null,
    saude: null,
    odontologia: null,
    previdencia_privada: null,
    country: 'br',
    extraction_confidence: 0,
    extraction_method: 'regex',
    extracted_at: new Date().toISOString(),
    ...data
  };
}
