import { createClient } from '@/lib/supabase/server';
import { PayslipExtracted, zPayslipExtracted, toLegacyFormat, FIELD_IMPORTANCE_WEIGHTS } from '@/types/payslips';
import { BrazilPayslipAdapter } from './brAdapter';
import { FrancePayslipAdapter } from './frAdapter';

/**
 * Extraction orchestrator for unified payslip data extraction
 * Routes to country-specific adapters and handles validation and persistence
 */
export class PayslipExtractionOrchestrator {
  private readonly adapters = {
    br: new BrazilPayslipAdapter(),
    fr: new FrancePayslipAdapter(),
    pt: new BrazilPayslipAdapter() // Portugal uses similar structure to Brazil
  };

  /**
   * Extract payslip data from OCR text or existing structured data
   */
  async extractPayslipData(
    input: string | any,
    country: 'br' | 'fr' | 'pt' = 'br',
    userId?: string,
    llmFallback?: (text: string) => Promise<any>
  ): Promise<{
    success: boolean;
    data?: PayslipExtracted;
    error?: string;
    legacy?: any;
  }> {
    try {
      console.log('🎯 Starting payslip extraction orchestration for country:', country);
      
      // Step 1: Determine input type and extract OCR text
      let ocrText: string;
      let existingData: any = null;
      
      if (typeof input === 'string') {
        ocrText = input;
      } else if (input && typeof input === 'object') {
        // Input is structured data, try to extract OCR text
        ocrText = input.ocr_text || input.raw_text || '';
        existingData = input;
      } else {
        throw new Error('Invalid input: must be OCR text string or structured data object');
      }
      
      if (!ocrText) {
        throw new Error('No OCR text available for extraction');
      }
      
      // Step 2: Route to country-specific adapter
      const adapter = this.adapters[country];
      if (!adapter) {
        throw new Error(`Unsupported country: ${country}`);
      }
      
      // Step 3: Extract data using adapter
      const extractedData = await adapter.extractPayslipData(ocrText, llmFallback);
      
      // Step 4: Validate extracted data
      const validationResult = this.validateExtractedData(extractedData);
      if (!validationResult.success) {
        throw new Error(`Validation failed: ${validationResult.error}`);
      }
      
      // Step 5: Calculate final confidence score
      const finalData = this.calculateFinalConfidence(validationResult.data!);
      
      // Step 6: Persist data to database
      if (userId) {
        await this.persistExtractedData(finalData, userId, country, existingData);
      }
      
      // Step 7: Generate legacy format for backward compatibility
      const legacyFormat = toLegacyFormat(finalData);
      
      console.log('✅ Payslip extraction completed successfully');
      
      return {
        success: true,
        data: finalData,
        legacy: legacyFormat
      };
      
    } catch (error) {
      console.error('❌ Payslip extraction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Validate extracted data against Zod schema
   */
  private validateExtractedData(data: PayslipExtracted): {
    success: boolean;
    data?: PayslipExtracted;
    error?: string;
  } {
    try {
      const validated = zPayslipExtracted.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Validation failed' };
    }
  }

  /**
   * Calculate final confidence score using field importance weights
   */
  private calculateFinalConfidence(data: PayslipExtracted): PayslipExtracted {
    let totalWeight = 0;
    let weightedScore = 0;
    
    // Calculate weighted score based on field importance and presence
    Object.keys(data).forEach(key => {
      if (key !== 'extraction_confidence' && key !== 'extraction_method' && key !== 'extracted_at' && key !== 'country') {
        const fieldKey = key as keyof PayslipExtracted;
        const weight = FIELD_IMPORTANCE_WEIGHTS[fieldKey] || 1;
        const hasValue = data[fieldKey] !== null && data[fieldKey] !== undefined;
        
        totalWeight += weight;
        weightedScore += hasValue ? weight : 0;
      }
    });
    
    const finalConfidence = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
    
    return {
      ...data,
      extraction_confidence: finalConfidence
    };
  }

  /**
   * Persist extracted data to database
   */
  private async persistExtractedData(
    data: PayslipExtracted,
    userId: string,
    country: string,
    existingData?: any
  ): Promise<void> {
    try {
      const supabase = await createClient();
      
      // Step 1: Ensure database schema is up to date
      await this.ensureDatabaseSchema(supabase);
      
      // Step 2: Insert into scan_results table
      const scanResult = await this.insertScanResult(supabase, data, userId, country, existingData);
      
      // Step 3: Insert into holerites table
      await this.insertHolerite(supabase, data, userId, scanResult.id);
      
      console.log('💾 Data persisted successfully to database');
      
    } catch (error) {
      console.error('❌ Failed to persist data:', error);
      throw error;
    }
  }

  /**
   * Ensure database schema is up to date (auto-create missing columns/tables)
   */
  private async ensureDatabaseSchema(supabase: any): Promise<void> {
    try {
      // Check and add missing columns to scan_results table
      await this.ensureScanResultsSchema(supabase);
      
      // Check and add missing columns to holerites table
      await this.ensureHoleritesSchema(supabase);
      
      // Check and create extraction_logs table if missing
      await this.ensureExtractionLogsTable(supabase);
      
    } catch (error) {
      console.error('❌ Schema update failed:', error);
      throw error;
    }
  }

  /**
   * Ensure scan_results table has all required columns
   */
  private async ensureScanResultsSchema(supabase: any): Promise<void> {
    const requiredColumns = [
      { name: 'employer_name', type: 'text' },
      { name: 'employer_cnpj', type: 'text' },
      { name: 'employee_name', type: 'text' },
      { name: 'employee_cpf', type: 'text' },
      { name: 'job_title', type: 'text' },
      { name: 'admission_date', type: 'text' },
      { name: 'period_start', type: 'text' },
      { name: 'period_end', type: 'text' },
      { name: 'proventos_total', type: 'decimal(10,2)' },
      { name: 'inss_contrib', type: 'decimal(10,2)' },
      { name: 'irrf_contrib', type: 'decimal(10,2)' },
      { name: 'fgts_base', type: 'decimal(10,2)' },
      { name: 'fgts_mes', type: 'decimal(10,2)' },
      { name: 'ferias_valor', type: 'decimal(10,2)' },
      { name: 'ferias_terco', type: 'decimal(10,2)' },
      { name: 'bonus', type: 'decimal(10,2)' },
      { name: 'adiantamentos_total', type: 'decimal(10,2)' },
      { name: 'vale_refeicao', type: 'decimal(10,2)' },
      { name: 'auxilio_alimentacao', type: 'decimal(10,2)' },
      { name: 'saude', type: 'decimal(10,2)' },
      { name: 'odontologia', type: 'decimal(10,2)' },
      { name: 'previdencia_privada', type: 'decimal(10,2)' },
      { name: 'extraction_confidence', type: 'integer' },
      { name: 'extraction_method', type: 'text' },
      { name: 'extracted_at', type: 'timestamp' }
    ];

    for (const column of requiredColumns) {
      try {
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'scan_results',
          column_name: column.name,
          column_type: column.type
        });
      } catch (error) {
        // Column might already exist, continue
        console.log(`Column ${column.name} already exists or couldn't be added`);
      }
    }
  }

  /**
   * Ensure holerites table has all required columns
   */
  private async ensureHoleritesSchema(supabase: any): Promise<void> {
    const requiredColumns = [
      { name: 'employer_name', type: 'text' },
      { name: 'employer_cnpj', type: 'text' },
      { name: 'employee_name', type: 'text' },
      { name: 'employee_cpf', type: 'text' },
      { name: 'job_title', type: 'text' },
      { name: 'admission_date', type: 'text' },
      { name: 'period_start', type: 'text' },
      { name: 'period_end', type: 'text' },
      { name: 'proventos_total', type: 'decimal(10,2)' },
      { name: 'inss_contrib', type: 'decimal(10,2)' },
      { name: 'irrf_contrib', type: 'decimal(10,2)' },
      { name: 'fgts_base', type: 'decimal(10,2)' },
      { name: 'fgts_mes', type: 'decimal(10,2)' },
      { name: 'ferias_valor', type: 'decimal(10,2)' },
      { name: 'ferias_terco', type: 'decimal(10,2)' },
      { name: 'bonus', type: 'decimal(10,2)' },
      { name: 'adiantamentos_total', type: 'decimal(10,2)' },
      { name: 'vale_refeicao', type: 'decimal(10,2)' },
      { name: 'auxilio_alimentacao', type: 'decimal(10,2)' },
      { name: 'saude', type: 'decimal(10,2)' },
      { name: 'odontologia', type: 'decimal(10,2)' },
      { name: 'previdencia_privada', type: 'decimal(10,2)' },
      { name: 'extraction_confidence', type: 'integer' },
      { name: 'extraction_method', type: 'text' },
      { name: 'extracted_at', type: 'timestamp' }
    ];

    for (const column of requiredColumns) {
      try {
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'holerites',
          column_name: column.name,
          column_type: column.type
        });
      } catch (error) {
        // Column might already exist, continue
        console.log(`Column ${column.name} already exists or couldn't be added`);
      }
    }
  }

  /**
   * Ensure extraction_logs table exists
   */
  private async ensureExtractionLogsTable(supabase: any): Promise<void> {
    try {
      // Check if table exists
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'extraction_logs')
        .eq('table_schema', 'public')
        .single();

      if (!tableExists) {
        // Create table
        await supabase.rpc('create_extraction_logs_table');
        console.log('📋 Created extraction_logs table');
      }
    } catch (error) {
      console.log('extraction_logs table already exists or couldn\'t be created');
    }
  }

  /**
   * Insert data into scan_results table
   */
  private async insertScanResult(
    supabase: any,
    data: PayslipExtracted,
    userId: string,
    country: string,
    existingData?: any
  ): Promise<{ id: string }> {
    const scanData = {
      user_id: userId,
      country,
      file_name: existingData?.file_name || 'extracted',
      file_size: existingData?.file_size || 0,
      file_type: existingData?.file_type || 'text',
      ocr_text: existingData?.ocr_text || '',
      structured_data: data,
      recommendations: null,
      confidence_score: data.extraction_confidence / 100,
      scan_version: 2,
      analysis_version: {
        type: 'enhanced',
        schema_version: 2,
        timestamp: Date.now()
      },
      explanation_report: null,
      recommendations_report: null,
      // New canonical fields
      employer_name: data.employer_name,
      employer_cnpj: data.employer_cnpj,
      employee_name: data.employee_name,
      employee_cpf: data.employee_cpf,
      job_title: data.job_title,
      admission_date: data.admission_date,
      period_start: data.period_start,
      period_end: data.period_end,
      proventos_total: data.proventos_total,
      inss_contrib: data.inss_contrib,
      irrf_contrib: data.irrf_contrib,
      fgts_base: data.fgts_base,
      fgts_mes: data.fgts_mes,
      ferias_valor: data.ferias_valor,
      ferias_terco: data.ferias_terco,
      bonus: data.bonus,
      adiantamentos_total: data.adiantamentos_total,
      vale_refeicao: data.vale_refeicao,
      auxilio_alimentacao: data.auxilio_alimentacao,
      saude: data.saude,
      odontologia: data.odontologia,
      previdencia_privada: data.previdencia_privada,
      extraction_confidence: data.extraction_confidence,
      extraction_method: data.extraction_method,
      extracted_at: data.extracted_at
    };

    const { data: result, error } = await supabase
      .from('scan_results')
      .insert(scanData)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to insert scan result: ${error.message}`);
    }

    return result;
  }

  /**
   * Insert data into holerites table
   */
  private async insertHolerite(
    supabase: any,
    data: PayslipExtracted,
    userId: string,
    scanResultId: string
  ): Promise<void> {
    const holeriteData = {
      user_id: userId,
      period: data.period_start,
      nome: data.employee_name,
      empresa: data.employer_name,
      salario_bruto: data.salario_bruto,
      salario_liquido: data.salario_liquido,
      structured_data: data,
      analysis_version: {
        type: 'enhanced',
        schema_version: 2,
        timestamp: Date.now()
      },
      explanation_report: null,
      recommendations_report: null,
      // New canonical fields
      employer_name: data.employer_name,
      employer_cnpj: data.employer_cnpj,
      employee_name: data.employee_name,
      employee_cpf: data.employee_cpf,
      job_title: data.job_title,
      admission_date: data.admission_date,
      period_start: data.period_start,
      period_end: data.period_end,
      proventos_total: data.proventos_total,
      inss_contrib: data.inss_contrib,
      irrf_contrib: data.irrf_contrib,
      fgts_base: data.fgts_base,
      fgts_mes: data.fgts_mes,
      ferias_valor: data.ferias_valor,
      ferias_terco: data.ferias_terco,
      bonus: data.bonus,
      adiantamentos_total: data.adiantamentos_total,
      vale_refeicao: data.vale_refeicao,
      auxilio_alimentacao: data.auxilio_alimentacao,
      saude: data.saude,
      odontologia: data.odontologia,
      previdencia_privada: data.previdencia_privada,
      extraction_confidence: data.extraction_confidence,
      extraction_method: data.extraction_method,
      extracted_at: data.extracted_at
    };

    const { error } = await supabase
      .from('holerites')
      .insert(holeriteData);

    if (error) {
      throw new Error(`Failed to insert holerite: ${error.message}`);
    }
  }

  /**
   * Log extraction activity
   */
  private async logExtraction(
    supabase: any,
    holeriteId: string,
    analysisVersion: any,
    message: string,
    payload: any
  ): Promise<void> {
    try {
      await supabase
        .from('extraction_logs')
        .insert({
          holerite_id: holeriteId,
          analysis_version: analysisVersion,
          message,
          payload,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      // Logging is not critical, continue
      console.warn('Failed to log extraction:', error);
    }
  }
}
