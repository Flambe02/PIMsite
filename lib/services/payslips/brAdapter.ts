import { PayslipExtracted, COUNTRY_FIELD_MAPPINGS } from '@/types/payslips';

/**
 * Brazil-specific payslip extraction adapter
 * Uses regex patterns for deterministic extraction with LLM fallback
 */
export class BrazilPayslipAdapter {
  private readonly country = 'br' as const;
  private readonly fieldMappings = COUNTRY_FIELD_MAPPINGS.br;

  /**
   * Extract payslip data using regex patterns first, then LLM fallback
   */
  async extractPayslipData(ocrText: string, llmFallback?: (text: string) => Promise<any>): Promise<PayslipExtracted> {
    console.log('🇧🇷 Starting Brazil payslip extraction...');
    
    // Step 1: Try regex extraction first
    const regexResult = this.extractWithRegex(ocrText);
    console.log('🔍 Regex extraction result:', regexResult);
    
    // Step 2: If LLM fallback is available and regex extraction is incomplete, use it
    let finalResult = regexResult;
    if (llmFallback && this.isExtractionIncomplete(regexResult)) {
      console.log('🤖 Using LLM fallback for incomplete extraction...');
      try {
        const llmResult = await llmFallback(ocrText);
        finalResult = this.mergeResults(regexResult, llmResult);
      } catch (error) {
        console.warn('⚠️ LLM fallback failed, using regex result:', error);
      }
    }
    
    // Step 3: Calculate confidence and finalize
    finalResult.extraction_confidence = this.calculateConfidence(finalResult);
    finalResult.extraction_method = llmFallback && this.isExtractionIncomplete(regexResult) ? 'hybrid' : 'regex';
    finalResult.extracted_at = new Date().toISOString();
    
    console.log('✅ Brazil extraction completed with confidence:', finalResult.extraction_confidence);
    return finalResult;
  }

  /**
   * Extract data using regex patterns for Brazilian payslips
   */
  private extractWithRegex(ocrText: string): PayslipExtracted {
    const text = ocrText.toLowerCase();
    
    return {
      // Administrative Information
      employer_name: this.extractEmployerName(text),
      employer_cnpj: this.extractCNPJ(text),
      employee_name: this.extractEmployeeName(text),
      employee_cpf: this.extractCPF(text),
      job_title: this.extractJobTitle(text),
      admission_date: this.extractAdmissionDate(text),
      period_start: this.extractPeriod(text),
      period_end: this.extractPeriod(text), // Same as start for monthly payslips
      
      // Core Financial Data
      salario_bruto: this.extractSalary(text, 'bruto'),
      salario_liquido: this.extractSalary(text, 'liquido'),
      proventos_total: this.extractTotal(text, 'proventos'),
      descontos_total: this.extractTotal(text, 'descontos'),
      
      // Taxes and Contributions
      inss_contrib: this.extractContribution(text, 'inss'),
      irrf_contrib: this.extractContribution(text, 'irrf'),
      fgts_base: this.extractContribution(text, 'fgts_base'),
      fgts_mes: this.extractContribution(text, 'fgts_mes'),
      
      // Vacations and Bonuses
      ferias_valor: this.extractVacation(text, 'ferias'),
      ferias_terco: this.extractVacation(text, 'ferias_terco'),
      bonus: this.extractBonus(text),
      adiantamentos_total: this.extractAdvances(text),
      
      // Benefits
      vale_refeicao: this.extractBenefit(text, 'vale_refeicao'),
      auxilio_alimentacao: this.extractBenefit(text, 'auxilio_alimentacao'),
      saude: this.extractBenefit(text, 'saude'),
      odontologia: this.extractBenefit(text, 'odontologia'),
      previdencia_privada: this.extractBenefit(text, 'previdencia'),
      
      // Metadata
      country: this.country,
      extraction_confidence: 0, // Will be calculated later
      extraction_method: 'regex',
      extracted_at: new Date().toISOString()
    };
  }

  /**
   * Extract employer name using various patterns
   */
  private extractEmployerName(text: string): string | null {
    const patterns = [
      /empresa[:\s]+([^\n\r]+)/i,
      /razao social[:\s]+([^\n\r]+)/i,
      /nome da empresa[:\s]+([^\n\r]+)/i,
      /empregador[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.cleanText(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract CNPJ (Brazilian company registration number)
   */
  private extractCNPJ(text: string): string | null {
    const cnpjPattern = /(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/;
    const match = text.match(cnpjPattern);
    return match ? match[1] : null;
  }

  /**
   * Extract employee name using various patterns
   */
  private extractEmployeeName(text: string): string | null {
    const patterns = [
      /funcionario[:\s]+([^\n\r]+)/i,
      /nome[:\s]+([^\n\r]+)/i,
      /empregado[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = this.cleanText(match[1]);
        // Avoid extracting company names or other fields
        if (name && !name.includes('empresa') && !name.includes('cnpj') && name.length > 2) {
          return name;
        }
      }
    }
    
    return null;
  }

  /**
   * Extract CPF (Brazilian individual taxpayer number)
   */
  private extractCPF(text: string): string | null {
    const cpfPattern = /(\d{3}\.\d{3}\.\d{3}-\d{2})/;
    const match = text.match(cpfPattern);
    return match ? match[1] : null;
  }

  /**
   * Extract job title/position
   */
  private extractJobTitle(text: string): string | null {
    const patterns = [
      /cargo[:\s]+([^\n\r]+)/i,
      /funcao[:\s]+([^\n\r]+)/i,
      /cbo[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.cleanText(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract admission date
   */
  private extractAdmissionDate(text: string): string | null {
    const patterns = [
      /admissao[:\s]+(\d{2}\/\d{2}\/\d{4})/i,
      /data admissao[:\s]+(\d{2}\/\d{2}\/\d{4})/i,
      /admissao[:\s]+(\d{2}-\d{2}-\d{4})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.formatDate(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract period information
   */
  private extractPeriod(text: string): string | null {
    const patterns = [
      /periodo[:\s]+([^\n\r]+)/i,
      /mes referencia[:\s]+([^\n\r]+)/i,
      /competencia[:\s]+([^\n\r]+)/i,
      /(\w+\/\d{4})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.cleanText(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract salary amounts (bruto or liquido)
   */
  private extractSalary(text: string, type: 'bruto' | 'liquido'): number | null {
    const patterns = [
      new RegExp(`salario ${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`total ${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.parseCurrency(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract total amounts (proventos or descontos)
   */
  private extractTotal(text: string, type: 'proventos' | 'descontos'): number | null {
    const patterns = [
      new RegExp(`total ${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.parseCurrency(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract contribution amounts (INSS, IRRF, FGTS)
   */
  private extractContribution(text: string, type: string): number | null {
    const patterns = [
      new RegExp(`${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`contribuicao ${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`base ${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.parseCurrency(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract vacation-related amounts
   */
  private extractVacation(text: string, type: 'ferias' | 'ferias_terco'): number | null {
    const patterns = [
      new RegExp(`${type}[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`ferias[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`terco ferias[:\s]*r?\\$?\\s*([\\d.,]+)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.parseCurrency(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract bonus amounts
   */
  private extractBonus(text: string): number | null {
    const patterns = [
      /bonus[:\s]*r?\$?\s*([\d.,]+)/i,
      /gratificacao[:\s]*r?\$?\s*([\d.,]+)/i,
      /premio[:\s]*r?\$?\s*([\d.,]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.parseCurrency(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract advance/anticipation amounts
   */
  private extractAdvances(text: string): number | null {
    const patterns = [
      /adiantamento[:\s]*r?\$?\s*([\d.,]+)/i,
      /antecipacao[:\s]*r?\$?\s*([\d.,]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.parseCurrency(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Extract benefit amounts
   */
  private extractBenefit(text: string, benefitType: string): number | null {
    const benefitPatterns = {
      vale_refeicao: ['vale refeicao', 'vr', 'vale alimentacao'],
      auxilio_alimentacao: ['auxilio alimentacao', 'aa', 'ajuda alimentacao'],
      saude: ['plano saude', 'saude', 'assistencia medica'],
      odontologia: ['plano odontologico', 'odontologia', 'assistencia odontologica'],
      previdencia: ['previdencia privada', 'previdencia', 'pensao privada']
    };
    
    const patterns = benefitPatterns[benefitType as keyof typeof benefitPatterns] || [benefitType];
    
    for (const pattern of patterns) {
      const regex = new RegExp(`${pattern}[:\s]*r?\$?\s*([\d.,]+)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return this.parseCurrency(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Parse currency values from Brazilian format (1.234,56)
   */
  private parseCurrency(value: string): number | null {
    if (!value) return null;
    
    // Remove R$ and spaces
    let cleanValue = value.replace(/r?\$?\s*/gi, '');
    
    // Handle Brazilian format: 1.234,56 -> 1234.56
    if (cleanValue.includes(',') && cleanValue.includes('.')) {
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
    }
    // Handle simple comma format: 1234,56 -> 1234.56
    else if (cleanValue.includes(',')) {
      cleanValue = cleanValue.replace(',', '.');
    }
    
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Clean extracted text
   */
  private cleanText(text: string): string {
    return text.trim().replace(/^\s*[-:]\s*/, '');
  }

  /**
   * Format date to ISO string
   */
  private formatDate(dateStr: string): string {
    try {
      // Handle DD/MM/YYYY format
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
      }
      // Handle DD-MM-YYYY format
      else if (dateStr.includes('-')) {
        const [day, month, year] = dateStr.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  /**
   * Check if extraction is incomplete (missing critical fields)
   */
  private isExtractionIncomplete(result: PayslipExtracted): boolean {
    const criticalFields = ['salario_bruto', 'salario_liquido', 'employee_name', 'employer_name'];
    const missingCritical = criticalFields.filter(field => !result[field as keyof PayslipExtracted]);
    
    return missingCritical.length > 2; // Allow some missing fields
  }

  /**
   * Merge regex and LLM results
   */
  private mergeResults(regexResult: PayslipExtracted, llmResult: any): PayslipExtracted {
    // Simple merge strategy: prefer regex results, fill gaps with LLM
    const merged = { ...regexResult };
    
    // Only merge if LLM result has the expected structure
    if (llmResult && typeof llmResult === 'object') {
      Object.keys(merged).forEach(key => {
        if (key !== 'extraction_method' && key !== 'extracted_at' && key !== 'extraction_confidence') {
          if (!merged[key as keyof PayslipExtracted] && llmResult[key]) {
            (merged as any)[key] = llmResult[key];
          }
        }
      });
    }
    
    return merged;
  }

  /**
   * Calculate confidence score based on extracted fields
   */
  private calculateConfidence(result: PayslipExtracted): number {
    let totalWeight = 0;
    let weightedScore = 0;
    
    // Calculate weighted score based on field importance and presence
    Object.keys(result).forEach(key => {
      if (key !== 'extraction_confidence' && key !== 'extraction_method' && key !== 'extracted_at' && key !== 'country') {
        const fieldKey = key as keyof PayslipExtracted;
        const weight = (result as any).FIELD_IMPORTANCE_WEIGHTS?.[fieldKey] || 1;
        const hasValue = result[fieldKey] !== null && result[fieldKey] !== undefined;
        
        totalWeight += weight;
        weightedScore += hasValue ? weight : 0;
      }
    });
    
    return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
  }
}
