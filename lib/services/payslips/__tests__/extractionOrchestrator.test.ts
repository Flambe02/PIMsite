import { PayslipExtractionOrchestrator } from '../extractionOrchestrator';
import { brPayslipFixtures } from './fixtures/brPayslips';
import { PayslipExtracted } from '@/types/payslips';

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    rpc: jest.fn(),
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: { id: 'test-id' }, error: null }))
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({ data: null, error: null }))
        }))
      }))
    }))
  }))
}));

describe('PayslipExtractionOrchestrator', () => {
  let orchestrator: PayslipExtractionOrchestrator;

  beforeEach(() => {
    orchestrator = new PayslipExtractionOrchestrator();
    jest.clearAllMocks();
  });

  describe('extractPayslipData', () => {
    it('should extract data from OCR text successfully', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.basic.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.legacy).toBeDefined();
      expect(result.data?.country).toBe('br');
      expect(result.data?.extraction_method).toBe('regex');
    });

    it('should handle structured data input', async () => {
      const structuredData = {
        ocr_text: brPayslipFixtures.basic.ocrText,
        file_name: 'test.pdf',
        file_size: 1024,
        file_type: 'pdf'
      };

      const result = await orchestrator.extractPayslipData(
        structuredData,
        'br'
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should fail with invalid input', async () => {
      const result = await orchestrator.extractPayslipData(
        null as any,
        'br'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail with empty OCR text', async () => {
      const result = await orchestrator.extractPayslipData(
        '',
        'br'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail with unsupported country', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.basic.ocrText,
        'us' as any
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported country');
    });
  });

  describe('Brazil payslip extraction', () => {
    it('should extract basic payslip data correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.basic.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      expect(data.employer_name).toBe('TechCorp Brasil Ltda.');
      expect(data.employer_cnpj).toBe('12.345.678/0001-90');
      expect(data.employee_name).toBe('João Silva Santos');
      expect(data.employee_cpf).toBe('123.456.789-00');
      expect(data.job_title).toBe('Desenvolvedor Senior');
      expect(data.salario_bruto).toBe(8000.00);
      expect(data.salario_liquido).toBe(5920.00);
      expect(data.inss_contrib).toBe(880.00);
      expect(data.irrf_contrib).toBe(1200.00);
      expect(data.fgts_base).toBe(8000.00);
      expect(data.fgts_mes).toBe(640.00);
    });

    it('should extract payslip with férias correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.withFerias.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      expect(data.ferias_valor).toBe(6500.00);
      expect(data.ferias_terco).toBe(2166.67);
      expect(data.proventos_total).toBe(15166.67);
      expect(data.salario_liquido).toBe(13651.67);
    });

    it('should extract payslip with adiantamentos correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.withAdiantamentos.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      expect(data.adiantamentos_total).toBe(500.00);
      expect(data.descontos_total).toBe(775.00);
    });

    it('should extract payslip with previdência privada correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.withPrevidenciaPrivada.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      expect(data.previdencia_privada).toBe(600.00);
    });

    it('should extract payslip with comprehensive benefits correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.withComprehensiveBenefits.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      expect(data.vale_refeicao).toBe(600.00);
      expect(data.saude).toBe(900.00);
      expect(data.odontologia).toBe(240.00);
    });

    it('should extract complex payslip with multiple scenarios correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.complex.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      expect(data.bonus).toBe(5000.00);
      expect(data.ferias_valor).toBe(25000.00);
      expect(data.ferias_terco).toBe(8333.33);
      expect(data.adiantamentos_total).toBe(2000.00);
      expect(data.previdencia_privada).toBe(2500.00);
      expect(data.proventos_total).toBe(63333.33);
    });
  });

  describe('Confidence scoring', () => {
    it('should calculate confidence score correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.basic.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      // Should have a reasonable confidence score (not 0)
      expect(data.extraction_confidence).toBeGreaterThan(0);
      expect(data.extraction_confidence).toBeLessThanOrEqual(100);
    });

    it('should have higher confidence for complete extractions', async () => {
      const basicResult = await orchestrator.extractPayslipData(
        brPayslipFixtures.basic.ocrText,
        'br'
      );

      const complexResult = await orchestrator.extractPayslipData(
        brPayslipFixtures.complex.ocrText,
        'br'
      );

      expect(basicResult.success).toBe(true);
      expect(complexResult.success).toBe(true);

      // Complex extraction should have higher confidence due to more fields
      expect(complexResult.data!.extraction_confidence).toBeGreaterThanOrEqual(
        basicResult.data!.extraction_confidence
      );
    });
  });

  describe('Legacy compatibility', () => {
    it('should generate legacy format correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.basic.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      expect(result.legacy).toBeDefined();

      const legacy = result.legacy!;
      expect(legacy.nome).toBe('João Silva Santos');
      expect(legacy.empresa).toBe('TechCorp Brasil Ltda.');
      expect(legacy.salario_bruto).toBe(8000.00);
      expect(legacy.salario_liquido).toBe(5920.00);
      expect(legacy.descontos).toBe(2080.00);
      expect(legacy.pays).toBe('br');
    });

    it('should maintain backward compatibility', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.withComprehensiveBenefits.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const legacy = result.legacy!;

      // Legacy format should include combined benefits
      expect(legacy.beneficios).toBe(1740.00); // 600 + 900 + 240
      expect(legacy.seguros).toBe(900.00); // saude value
    });
  });

  describe('Error handling', () => {
    it('should handle malformed OCR text gracefully', async () => {
      const malformedText = 'This is not a payslip at all';
      
      const result = await orchestrator.extractPayslipData(
        malformedText,
        'br'
      );

      expect(result.success).toBe(true);
      // Should still extract what it can, even if minimal
      expect(result.data?.extraction_confidence).toBeLessThan(50);
    });

    it('should handle missing critical fields', async () => {
      const incompleteText = `
        EMPRESA: Test Company
        FUNCIONÁRIO: Test Employee
        COMPETÊNCIA: Janeiro/2025
      `;
      
      const result = await orchestrator.extractPayslipData(
        incompleteText,
        'br'
      );

      expect(result.success).toBe(true);
      expect(result.data?.salario_bruto).toBeNull();
      expect(result.data?.salario_liquido).toBeNull();
      expect(result.data?.extraction_confidence).toBeLessThan(50);
    });
  });

  describe('Country routing', () => {
    it('should route to Brazil adapter correctly', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.basic.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      expect(result.data?.country).toBe('br');
    });

    it('should route to France adapter correctly', async () => {
      const frenchText = `
        BULLETIN DE PAIE
        ENTREPRISE: Test Company
        EMPLOYÉ: Test Employee
        SALAIRE BRUT: 5000,00 €
        SALAIRE NET: 3800,00 €
      `;
      
      const result = await orchestrator.extractPayslipData(
        frenchText,
        'fr'
      );

      expect(result.success).toBe(true);
      expect(result.data?.country).toBe('fr');
    });

    it('should route to Portugal adapter correctly', async () => {
      const portugueseText = `
        RECIBO DE VENCIMENTO
        EMPRESA: Test Company
        FUNCIONÁRIO: Test Employee
        SALÁRIO BRUTO: 5000,00 €
        SALÁRIO LÍQUIDO: 3800,00 €
      `;
      
      const result = await orchestrator.extractPayslipData(
        portugueseText,
        'pt'
      );

      expect(result.success).toBe(true);
      expect(result.data?.country).toBe('pt');
    });
  });

  describe('Data validation', () => {
    it('should validate extracted data against schema', async () => {
      const result = await orchestrator.extractPayslipData(
        brPayslipFixtures.basic.ocrText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      // All required fields should be present and properly typed
      expect(typeof data.employer_name).toBe('string');
      expect(typeof data.employee_name).toBe('string');
      expect(typeof data.salario_bruto).toBe('number');
      expect(typeof data.salario_liquido).toBe('number');
      expect(typeof data.country).toBe('string');
      expect(typeof data.extraction_confidence).toBe('number');
      expect(typeof data.extraction_method).toBe('string');
      expect(typeof data.extracted_at).toBe('string');
    });

    it('should handle null values correctly', async () => {
      const incompleteText = `
        EMPRESA: Test Company
        FUNCIONÁRIO: Test Employee
        COMPETÊNCIA: Janeiro/2025
      `;
      
      const result = await orchestrator.extractPayslipData(
        incompleteText,
        'br'
      );

      expect(result.success).toBe(true);
      const data = result.data!;

      // Missing fields should be null, not undefined
      expect(data.salario_bruto).toBeNull();
      expect(data.inss_contrib).toBeNull();
      expect(data.ferias_valor).toBeNull();
    });
  });
});
