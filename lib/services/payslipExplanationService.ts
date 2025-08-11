/**
 * Service d'explication de holerite amélioré
 * Génère des explications claires et pédagogiques selon les règles spécifiées
 */

export interface PayslipData {
  employee_name?: string;
  company_name?: string;
  period?: string;
  gross_salary?: { valor: number; label: string };
  net_salary?: { valor: number; label: string };
  total_earnings?: { valor: number; label: string };
  total_deductions?: { valor: number; label: string };
  inss_base?: { valor: number; label: string };
  irrf_base?: { valor: number; label: string };
  fgts_base?: { valor: number; label: string };
  inss_amount?: { valor: number; label: string };
  irrf_amount?: { valor: number; label: string };
  fgts_deposit?: { valor: number; label: string };
  profile_type?: string;
  [key: string]: any;
}

export interface PayslipExplanationReport {
  summary: string;
  generalInfo: string[];
  howToRead: string;
  proventos: string[];
  descontos: string[];
  calculationBases: string[];
  liquidCalculation: string;
  observations?: string[];
}

export class PayslipExplanationService {
  
  /**
   * Génère une explication complète et pédagogique du holerite
   */
  generateExplanation(data: PayslipData): PayslipExplanationReport {
    const report: PayslipExplanationReport = {
      summary: this.generateSummary(data),
      generalInfo: this.generateGeneralInfo(data),
      howToRead: "Proventos = o que entra; Descontos = o que sai; Líquido = Proventos – Descontos.",
      proventos: this.generateProventos(data),
      descontos: this.generateDescontos(data),
      calculationBases: this.generateCalculationBases(data),
      liquidCalculation: this.generateLiquidCalculation(data),
      observations: this.generateObservations(data)
    };

    return report;
  }

  /**
   * Génère le résumé pédagogique obligatoire
   */
  private generateSummary(data: PayslipData): string {
    const monthYear = this.extractMonthYear(data.period);
    const employeeName = data.employee_name || "Funcionário";
    const grossSalary = this.extractValue(data.gross_salary) || this.extractValue(data.total_earnings);
    const totalDeductions = this.extractValue(data.total_deductions);
    const netSalary = this.extractValue(data.net_salary);

    let summary = `Em ${monthYear}, ${employeeName} teve R$ ${this.formatCurrency(grossSalary)}. `;
    summary += `Após descontos de R$ ${this.formatCurrency(totalDeductions)}, recebe R$ ${this.formatCurrency(netSalary)}.`;

    // Vérifier les items excepcionais
    const exceptionalItems = this.findExceptionalItems(data);
    if (exceptionalItems.length > 0) {
      summary += ` Este mês teve ${exceptionalItems.join(", ")}.`;
    } else {
      summary += " Sem itens excepcionais.";
    }

    // Descontos principaux
    const mainDeductions = this.findMainDeductions(data);
    if (mainDeductions.length > 0) {
      summary += ` Descontos principaux: ${mainDeductions.join(", ")}.`;
    }

    return summary;
  }

  /**
   * Génère les informations générales
   */
  private generateGeneralInfo(data: PayslipData): string[] {
    const info: string[] = [];

    if (data.company_name) {
      info.push(`Empresa: ${data.company_name}`);
    }

    if (data.employee_name) {
      info.push(`Empregado: ${data.employee_name}`);
    }

    if (data.profile_type) {
      info.push(`Tipo de contrato: ${data.profile_type}`);
    }

    if (data.period) {
      info.push(`Período: ${data.period}`);
    }

    return info;
  }

  /**
   * Génère la liste des proventos
   */
  private generateProventos(data: PayslipData): string[] {
    const proventos: string[] = [];

    if (data.gross_salary?.valor) {
      proventos.push(`Salário base: R$ ${this.formatCurrency(data.gross_salary.valor)}`);
    }

    if (data.total_earnings?.valor) {
      proventos.push(`Total de proventos: R$ ${this.formatCurrency(data.total_earnings.valor)}`);
    }

    // Chercher d'autres proventos possibles
    const otherProventos = this.findOtherProventos(data);
    proventos.push(...otherProventos);

    return proventos;
  }

  /**
   * Génère la liste des descontos
   */
  private generateDescontos(data: PayslipData): string[] {
    const descontos: string[] = [];

    if (data.inss_amount?.valor) {
      descontos.push(`INSS (aposentadoria pública): R$ ${this.formatCurrency(data.inss_amount.valor)}`);
    }

    if (data.irrf_amount?.valor) {
      descontos.push(`IRRF (imposto de renda): R$ ${this.formatCurrency(data.irrf_amount.valor)}`);
    }

    if (data.total_deductions?.valor) {
      descontos.push(`Total de descontos: R$ ${this.formatCurrency(data.total_deductions.valor)}`);
    }

    return descontos;
  }

  /**
   * Génère les bases de calcul
   */
  private generateCalculationBases(data: PayslipData): string[] {
    const bases: string[] = [];

    if (data.inss_base?.valor) {
      bases.push(`Base INSS: R$ ${this.formatCurrency(data.inss_base.valor)}`);
    }

    if (data.irrf_base?.valor) {
      bases.push(`Base IRRF: R$ ${this.formatCurrency(data.irrf_base.valor)}`);
    }

    if (data.fgts_base?.valor) {
      bases.push(`Base FGTS: R$ ${this.formatCurrency(data.fgts_base.valor)}`);
    }

    bases.push("FGTS = 8% pago pela empresa (não sai do seu líquido)");

    return bases;
  }

  /**
   * Génère le calcul du líquido
   */
  private generateLiquidCalculation(data: PayslipData): string {
    const grossSalary = this.extractValue(data.gross_salary) || this.extractValue(data.total_earnings);
    const totalDeductions = this.extractValue(data.total_deductions);
    const netSalary = this.extractValue(data.net_salary);

    if (grossSalary && totalDeductions && netSalary) {
      return `Líquido = Proventos – Descontos = R$ ${this.formatCurrency(grossSalary)} - R$ ${this.formatCurrency(totalDeductions)} = R$ ${this.formatCurrency(netSalary)}`;
    }

    return "Líquido = Proventos – Descontos";
  }

  /**
   * Génère les observations
   */
  private generateObservations(data: PayslipData): string[] {
    const observations: string[] = [];

    // Vérifier les incohérences
    const grossSalary = this.extractValue(data.gross_salary) || this.extractValue(data.total_earnings);
    const totalDeductions = this.extractValue(data.total_deductions);
    const netSalary = this.extractValue(data.net_salary);

    if (grossSalary && totalDeductions && netSalary) {
      const calculatedNet = grossSalary - totalDeductions;
      const difference = Math.abs(calculatedNet - netSalary);
      
      if (difference > 0.01) {
        observations.push(`Observação: A soma não fecha exatamente. Calculado: R$ ${this.formatCurrency(calculatedNet)}, Informado: R$ ${this.formatCurrency(netSalary)}`);
      }
    }

    return observations;
  }

  /**
   * Utilitaires
   */
  private extractValue(item: any): number | null {
    if (item && typeof item.valor === 'number') {
      return item.valor;
    }
    if (typeof item === 'number') {
      return item;
    }
    return null;
  }

  private formatCurrency(value: number | null): string {
    if (value === null || isNaN(value)) return "0,00";
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private extractMonthYear(period: string | undefined): string {
    if (!period) return "mês/ano não informado";
    
    // Essayer différents formats
    if (period.includes('/')) {
      return period;
    }
    if (period.includes('-')) {
      return period.replace('-', '/');
    }
    
    return period;
  }

  private findExceptionalItems(data: PayslipData): string[] {
    const items: string[] = [];
    
    // Chercher des mots-clés dans les données
    const dataStr = JSON.stringify(data).toLowerCase();
    
    if (dataStr.includes('férias') || dataStr.includes('ferias')) {
      items.push("férias");
    }
    if (dataStr.includes('13º') || dataStr.includes('13o')) {
      items.push("13º salário");
    }
    if (dataStr.includes('bônus') || dataStr.includes('bonus')) {
      items.push("bônus");
    }
    if (dataStr.includes('horas extras') || dataStr.includes('hora extra')) {
      items.push("horas extras");
    }

    return items;
  }

  private findMainDeductions(data: PayslipData): string[] {
    const deductions: string[] = [];
    
    if (data.inss_amount?.valor) {
      deductions.push(`INSS R$ ${this.formatCurrency(data.inss_amount.valor)}`);
    }
    if (data.irrf_amount?.valor) {
      deductions.push(`IRRF R$ ${this.formatCurrency(data.irrf_amount.valor)}`);
    }

    return deductions;
  }

  private findOtherProventos(data: PayslipData): string[] {
    const proventos: string[] = [];
    
    // Chercher d'autres proventos possibles dans les données
    Object.keys(data).forEach(key => {
      if (key.toLowerCase().includes('ferias') && data[key]?.valor) {
        proventos.push(`Férias: R$ ${this.formatCurrency(data[key].valor)}`);
      }
      if (key.toLowerCase().includes('bonus') && data[key]?.valor) {
        proventos.push(`Bônus: R$ ${this.formatCurrency(data[key].valor)}`);
      }
      if (key.toLowerCase().includes('13') && data[key]?.valor) {
        proventos.push(`13º salário: R$ ${this.formatCurrency(data[key].valor)}`);
      }
    });

    return proventos;
  }
}

export const payslipExplanationService = new PayslipExplanationService();
