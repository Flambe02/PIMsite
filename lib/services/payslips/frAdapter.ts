import { PayslipExtracted, COUNTRY_FIELD_MAPPINGS } from '@/types/payslips';

/**
 * France-specific payslip extraction adapter
 * Uses regex patterns for deterministic extraction with LLM fallback
 */
export class FrancePayslipAdapter {
  private readonly country = 'fr' as const;
  private readonly fieldMappings = COUNTRY_FIELD_MAPPINGS.fr;

  /**
   * Extract payslip data using regex patterns first, then LLM fallback
   */
  async extractPayslipData(ocrText: string, llmFallback?: (text: string) => Promise<any>): Promise<PayslipExtracted> {
    console.log('🇫🇷 Starting France payslip extraction...');
    
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
    
    console.log('✅ France extraction completed with confidence:', finalResult.extraction_confidence);
    return finalResult;
  }

  /**
   * Extract data using regex patterns for French payslips
   */
  private extractWithRegex(ocrText: string): PayslipExtracted {
    const text = ocrText.toLowerCase();
    
    return {
      // Administrative Information
      employer_name: this.extractEmployerName(text),
      employer_cnpj: this.extractSIRET(text),
      employee_name: this.extractEmployeeName(text),
      employee_cpf: this.extractNIR(text),
      job_title: this.extractJobTitle(text),
      admission_date: this.extractAdmissionDate(text),
      period_start: this.extractPeriod(text),
      period_end: this.extractPeriod(text), // Same as start for monthly payslips
      
      // Core Financial Data
      salario_bruto: this.extractSalary(text, 'brut'),
      salario_liquido: this.extractSalary(text, 'net'),
      proventos_total: this.extractTotal(text, 'revenus'),
      descontos_total: this.extractTotal(text, 'deductions'),
      
      // Taxes and Contributions (France-specific)
      inss_contrib: this.extractSocialCharges(text),
      irrf_contrib: this.extractIncomeTax(text),
      fgts_base: null, // Not applicable for France
      fgts_mes: null, // Not applicable for France
      
      // Vacations and Bonuses
      ferias_valor: this.extractVacation(text),
      ferias_terco: null, // Not applicable for France
      bonus: this.extractBonus(text),
      adiantamentos_total: this.extractAdvances(text),
      
      // Benefits
      vale_refeicao: this.extractBenefit(text, 'tickets_restaurant'),
      auxilio_alimentacao: this.extractBenefit(text, 'aide_alimentation'),
      saude: this.extractBenefit(text, 'mutuelle'),
      odontologia: this.extractBenefit(text, 'dentaire'),
      previdencia_privada: this.extractBenefit(text, 'retraite'),
      
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
      /entreprise[:\s]+([^\n\r]+)/i,
      /raison sociale[:\s]+([^\n\r]+)/i,
      /nom de l'entreprise[:\s]+([^\n\r]+)/i,
      /employeur[:\s]+([^\n\r]+)/i
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
   * Extract SIRET (French company registration number)
   */
  private extractSIRET(text: string): string | null {
    const siretPattern = /(\d{14})/;
    const match = text.match(siretPattern);
    return match ? match[1] : null;
  }

  /**
   * Extract employee name using various patterns
   */
  private extractEmployeeName(text: string): string | null {
    const patterns = [
      /employe[:\s]+([^\n\r]+)/i,
      /nom[:\s]+([^\n\r]+)/i,
      /prenom[:\s]+([^\n\r]+)/i,
      /salarie[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = this.cleanText(match[1]);
        // Avoid extracting company names or other fields
        if (name && !name.includes('entreprise') && !name.includes('siret') && name.length > 2) {
          return name;
        }
      }
    }
    
    return null;
  }

  /**
   * Extract NIR (French social security number)
   */
  private extractNIR(text: string): string | null {
    const nirPattern = /(\d{15})/;
    const match = text.match(nirPattern);
    return match ? match[1] : null;
  }

  /**
   * Extract job title/position
   */
  private extractJobTitle(text: string): string | null {
    const patterns = [
      /poste[:\s]+([^\n\r]+)/i,
      /fonction[:\s]+([^\n\r]+)/i,
      /emploi[:\s]+([^\n\r]+)/i,
      /metier[:\s]+([^\n\r]+)/i
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
      /date embauche[:\s]+(\d{2}\/\d{2}\/\d{4})/i,
      /date entree[:\s]+(\d{2}\/\d{2}\/\d{4})/i,
      /embauche[:\s]+(\d{2}-\d{2}-\d{4})/i
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
      /periode[:\s]+([^\n\r]+)/i,
      /mois reference[:\s]+([^\n\r]+)/i,
      /competence[:\s]+([^\n\r]+)/i,
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
   * Extract salary amounts (brut or net)
   */
  private extractSalary(text: string, type: 'brut' | 'net'): number | null {
    const patterns = [
      new RegExp(`salaire ${type}[:\s]*€?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`${type}[:\s]*€?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`total ${type}[:\s]*€?\\s*([\\d.,]+)`, 'i')
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
   * Extract total amounts (revenus or deductions)
   */
  private extractTotal(text: string, type: 'revenus' | 'deductions'): number | null {
    const patterns = [
      new RegExp(`total ${type}[:\s]*€?\\s*([\\d.,]+)`, 'i'),
      new RegExp(`${type}[:\s]*€?\\s*([\\d.,]+)`, 'i')
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
   * Extract social charges (Sécurité Sociale, URSSAF)
   */
  private extractSocialCharges(text: string): number | null {
    const patterns = [
      /securite sociale[:\s]*€?\s*([\d.,]+)/i,
      /urssaf[:\s]*€?\s*([\d.,]+)/i,
      /cotisations sociales[:\s]*€?\s*([\d.,]+)/i,
      /charges sociales[:\s]*€?\s*([\d.,]+)/i
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
   * Extract income tax (IR)
   */
  private extractIncomeTax(text: string): number | null {
    const patterns = [
      /impot revenu[:\s]*€?\s*([\d.,]+)/i,
      /ir[:\s]*€?\s*([\d.,]+)/i,
      /impot[:\s]*€?\s*([\d.,]+)/i
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
  private extractVacation(text: string): number | null {
    const patterns = [
      /conges[:\s]*€?\s*([\d.,]+)/i,
      /vacances[:\s]*€?\s*([\d.,]+)/i,
      /indemnite conges[:\s]*€?\s*([\d.,]+)/i
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
      /bonus[:\s]*€?\s*([\d.,]+)/i,
      /prime[:\s]*€?\s*([\d.,]+)/i,
      /gratification[:\s]*€?\s*([\d.,]+)/i
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
      /avance[:\s]*€?\s*([\d.,]+)/i,
      /anticipation[:\s]*€?\s*([\d.,]+)/i
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
      tickets_restaurant: ['tickets restaurant', 'tr', 'restaurant'],
      aide_alimentation: ['aide alimentation', 'aa', 'subvention alimentation'],
      mutuelle: ['mutuelle', 'sante', 'assurance maladie'],
      dentaire: ['dentaire', 'soins dentaires', 'assurance dentaire'],
      retraite: ['retraite complementaire', 'prevoyance', 'assurance retraite']
    };
    
    const patterns = benefitPatterns[benefitType as keyof typeof benefitPatterns] || [benefitType];
    
    for (const pattern of patterns) {
      const regex = new RegExp(`${pattern}[:\s]*€?\s*([\d.,]+)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return this.parseCurrency(match[1]);
      }
    }
    
    return null;
  }

  /**
   * Parse currency values from French format (1 234,56)
   */
  private parseCurrency(value: string): number | null {
    if (!value) return null;
    
    // Remove € and spaces
    let cleanValue = value.replace(/€?\s*/gi, '');
    
    // Handle French format: 1 234,56 -> 1234.56
    if (cleanValue.includes(',') && cleanValue.includes(' ')) {
      cleanValue = cleanValue.replace(/\s/g, '').replace(',', '.');
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
