/**
 * Payslip Extraction Services
 * 
 * This module provides the unified payslip extraction system with country-specific adapters
 * and automatic database schema management.
 */

// Main orchestrator
export { PayslipExtractionOrchestrator } from './extractionOrchestrator';

// Country-specific adapters
export { BrazilPayslipAdapter } from './brAdapter';
export { FrancePayslipAdapter } from './frAdapter';

// Types and interfaces
export type { 
  PayslipExtracted, 
  PayslipExtractedValidated,
  LegacyCompatibility 
} from '@/types/payslips';

export { 
  zPayslipExtracted,
  COUNTRY_FIELD_MAPPINGS,
  FIELD_IMPORTANCE_WEIGHTS,
  toLegacyFormat,
  fromLegacyFormat
} from '@/types/payslips';

// Test fixtures (for development and testing)
export { brPayslipFixtures, createPayslipExtracted } from './__tests__/fixtures/brPayslips';
