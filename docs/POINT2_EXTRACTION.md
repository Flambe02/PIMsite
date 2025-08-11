# 🎯 POINT 2.2: UNIFIED PAYSLIP EXTRACTION SYSTEM

## 📋 **OVERVIEW**

This document describes the implementation of the canonical, country-aware, unified data extraction layer for payslips as specified in Point 2.2 of the requirements. The system provides a unified interface for extracting payslip data across multiple countries while maintaining full backward compatibility with existing systems.

---

## 🏗️ **ARCHITECTURE**

### **System Components**

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Applications                    │
│  • /api/scan-new-pim (legacy)                             │
│  • /api/scan-new-pim-enhanced (enhanced)                  │
│  • Dashboard components                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              PayslipExtractionOrchestrator                 │
│  • Input validation and routing                            │
│  • Country-specific adapter selection                      │
│  • Data validation and confidence scoring                  │
│  • Database persistence                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                Country-Specific Adapters                   │
│  • BrazilPayslipAdapter (BR)                              │
│  • FrancePayslipAdapter (FR)                              │
│  • BrazilPayslipAdapter (PT - similar to BR)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                           │
│  • scan_results table (auto-extended)                      │
│  • holerites table (auto-extended)                         │
│  • extraction_logs table (auto-created)                    │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **Input Processing**: OCR text or structured data is received
2. **Country Detection**: Country is determined from input or headers
3. **Adapter Routing**: Appropriate country-specific adapter is selected
4. **Extraction**: Regex patterns are applied first, LLM fallback if needed
5. **Validation**: Data is validated against Zod schema
6. **Confidence Scoring**: Weighted confidence score is calculated
7. **Persistence**: Data is stored in both scan_results and holerites tables
8. **Legacy Format**: Backward-compatible format is generated

---

## 🔧 **IMPLEMENTATION DETAILS**

### **1. Canonical Data Interface**

#### **PayslipExtracted Interface**

The unified interface covers all payslip data fields across countries:

```typescript
interface PayslipExtracted {
  // Administrative Information
  employer_name: string | null;
  employer_cnpj: string | null; // CNPJ for BR, SIRET for FR, NIF for PT
  employee_name: string | null;
  employee_cpf: string | null; // CPF for BR, NIR for FR, NIF for PT
  job_title: string | null;
  admission_date: string | null;
  period_start: string | null;
  period_end: string | null;
  
  // Core Financial Data
  salario_bruto: number | null;
  salario_liquido: number | null;
  proventos_total: number | null;
  descontos_total: number | null;
  
  // Taxes and Contributions
  inss_contrib: number | null;
  irrf_contrib: number | null;
  fgts_base: number | null; // BR-specific
  fgts_mes: number | null; // BR-specific
  
  // Vacations and Bonuses
  ferias_valor: number | null;
  ferias_terco: number | null; // BR-specific
  bonus: number | null;
  adiantamentos_total: number | null;
  
  // Benefits
  vale_refeicao: number | null;
  auxilio_alimentacao: number | null;
  saude: number | null;
  odontologia: number | null;
  previdencia_privada: number | null;
  
  // Metadata
  country: 'br' | 'fr' | 'pt';
  extraction_confidence: number;
  extraction_method: 'regex' | 'llm' | 'hybrid';
  extracted_at: string;
}
```

#### **Country-Specific Field Mappings**

Each country has specific field name mappings for consistent internal naming:

```typescript
const COUNTRY_FIELD_MAPPINGS = {
  br: {
    employer_name: ['empresa', 'nome_empresa', 'razao_social'],
    employer_cnpj: ['cnpj', 'empresa_cnpj'],
    // ... more mappings
  },
  fr: {
    employer_name: ['entreprise', 'raison_sociale'],
    employer_cnpj: ['siret', 'numero_siret'],
    // ... more mappings
  },
  pt: {
    // Similar to BR with Portuguese variations
  }
};
```

### **2. Extraction Orchestrator**

#### **Key Features**

- **Unified Interface**: Single method for all extraction needs
- **Automatic Routing**: Country-specific adapter selection
- **Schema Validation**: Zod schema validation with error handling
- **Confidence Scoring**: Weighted confidence calculation
- **Database Integration**: Auto-schema extension and data persistence
- **Legacy Compatibility**: Backward-compatible output generation

#### **Usage Example**

```typescript
import { PayslipExtractionOrchestrator } from '@/lib/services/payslips/extractionOrchestrator';

const orchestrator = new PayslipExtractionOrchestrator();

// Extract from OCR text
const result = await orchestrator.extractPayslipData(
  ocrText,
  'br',
  userId,
  llmFallbackFunction
);

if (result.success) {
  console.log('Extracted data:', result.data);
  console.log('Legacy format:', result.legacy);
  console.log('Confidence:', result.data.extraction_confidence);
}
```

### **3. Country-Specific Adapters**

#### **Brazil Adapter (BrazilPayslipAdapter)**

- **Regex Patterns**: Comprehensive patterns for Brazilian payslip formats
- **Field Extraction**: All canonical fields with Brazilian-specific logic
- **Currency Parsing**: Handles Brazilian format (1.234,56 → 1234.56)
- **Date Formatting**: Converts DD/MM/YYYY to ISO format
- **LLM Fallback**: Optional AI-powered extraction for incomplete data

#### **France Adapter (FrancePayslipAdapter)**

- **French Patterns**: Adapted for French payslip terminology
- **Euro Handling**: Proper € currency parsing
- **French Format**: Handles French number formatting (1 234,56)
- **Social Charges**: INSS equivalent (Sécurité Sociale, URSSAF)

#### **Portugal Adapter**

- **Shared Logic**: Uses Brazil adapter with Portuguese field mappings
- **Portuguese Terms**: Adapted terminology for Portuguese payslips

### **4. Database Integration**

#### **Auto-Schema Extension**

The system automatically extends existing tables with new columns:

```sql
-- scan_results table extensions
ALTER TABLE scan_results ADD COLUMN IF NOT EXISTS employer_name TEXT;
ALTER TABLE scan_results ADD COLUMN IF NOT EXISTS employer_cnpj TEXT;
ALTER TABLE scan_results ADD COLUMN IF NOT EXISTS employee_name TEXT;
-- ... and many more

-- holerites table extensions
ALTER TABLE holerites ADD COLUMN IF NOT EXISTS employer_name TEXT;
ALTER TABLE holerites ADD COLUMN IF NOT EXISTS employer_cnpj TEXT;
-- ... and many more
```

#### **New Tables**

- **extraction_logs**: Tracks extraction activities and versions
- **Proper Indexing**: Performance-optimized indexes for all new columns
- **RLS Policies**: Maintains security with Row Level Security

#### **Data Persistence**

Data is stored in both tables for redundancy:
- **scan_results**: Raw extraction results with full metadata
- **holerites**: Processed data for dashboard display

### **5. Confidence Scoring System**

#### **Field Importance Weights**

```typescript
const FIELD_IMPORTANCE_WEIGHTS = {
  // Core Financial (high importance)
  salario_bruto: 8,
  salario_liquido: 8,
  proventos_total: 6,
  descontos_total: 6,
  
  // Taxes (high importance)
  inss_contrib: 7,
  irrf_contrib: 7,
  
  // Administrative (medium importance)
  employer_name: 3,
  employee_name: 4,
  
  // Benefits (medium importance)
  vale_refeicao: 4,
  saude: 5,
  
  // Metadata (low importance)
  country: 1,
  extraction_method: 1
};
```

#### **Calculation Method**

```typescript
confidence = (weighted_score / total_weight) * 100

where:
- weighted_score = sum of weights for fields with values
- total_weight = sum of all field weights
```

---

## 🧪 **TESTING & VALIDATION**

### **Test Coverage**

- **Unit Tests**: Comprehensive testing of all adapters and orchestrator
- **Fixtures**: Realistic payslip examples for each scenario
- **Edge Cases**: Malformed data, missing fields, invalid formats
- **Integration**: Database operations and schema extension

### **Test Scenarios**

#### **Brazilian Payslips**

1. **Basic Payslip**: Standard monthly payslip
2. **With Férias**: Vacation pay and bonus
3. **With Adiantamentos**: Advances and anticipations
4. **With Previdência Privada**: Private pension
5. **Comprehensive Benefits**: All benefit types
6. **Complex Scenario**: Multiple special cases

#### **Validation Tests**

- **Schema Validation**: Zod schema compliance
- **Data Types**: Proper type conversion and handling
- **Confidence Scoring**: Accurate confidence calculation
- **Legacy Compatibility**: Backward compatibility verification

---

## 🔄 **BACKWARD COMPATIBILITY**

### **Legacy Format Generation**

The system automatically generates legacy-compatible output:

```typescript
// Legacy format for existing systems
{
  nome: "João Silva Santos",
  empresa: "TechCorp Brasil Ltda.",
  period: "Janeiro/2025",
  salario_bruto: 8000.00,
  salario_liquido: 5920.00,
  descontos: 2080.00,
  beneficios: 1740.00, // Combined benefits
  seguros: 900.00,     // Health plan
  pays: "br",
  // ... other legacy fields
}
```

### **API Compatibility**

- **Existing Endpoints**: All current APIs continue to work
- **Data Structure**: Legacy field names are preserved
- **Response Format**: Existing response structures maintained
- **Error Handling**: Compatible error responses

---

## 🚀 **USAGE EXAMPLES**

### **1. Basic Extraction**

```typescript
import { PayslipExtractionOrchestrator } from '@/lib/services/payslips/extractionOrchestrator';

const orchestrator = new PayslipExtractionOrchestrator();

// Extract from OCR text
const result = await orchestrator.extractPayslipData(
  "HOLERITE - EMPRESA: Test Corp - FUNCIONÁRIO: João Silva",
  'br'
);

if (result.success) {
  console.log('Extraction successful');
  console.log('Confidence:', result.data.extraction_confidence);
  console.log('Employee:', result.data.employee_name);
  console.log('Company:', result.data.employer_name);
}
```

### **2. With LLM Fallback**

```typescript
const llmFallback = async (text: string) => {
  // Your LLM implementation here
  return await openai.analyze(text);
};

const result = await orchestrator.extractPayslipData(
  ocrText,
  'br',
  userId,
  llmFallback
);
```

### **3. From Existing Data**

```typescript
const existingData = {
  ocr_text: "HOLERITE...",
  file_name: "payslip.pdf",
  file_size: 2048,
  file_type: "pdf"
};

const result = await orchestrator.extractPayslipData(
  existingData,
  'br',
  userId
);
```

---

## 📊 **PERFORMANCE & SCALABILITY**

### **Optimization Features**

- **Regex First**: Fast deterministic extraction before LLM
- **Caching**: Database query optimization with proper indexes
- **Batch Processing**: Support for multiple payslip processing
- **Async Operations**: Non-blocking extraction and persistence

### **Database Performance**

- **GIN Indexes**: JSONB field optimization
- **Composite Indexes**: Multi-column query optimization
- **Partitioning**: Ready for large-scale data partitioning
- **Connection Pooling**: Efficient database connection management

---

## 🔒 **SECURITY & COMPLIANCE**

### **Data Protection**

- **RLS Policies**: Row-level security for all user data
- **User Isolation**: Users can only access their own data
- **Audit Logging**: Complete extraction activity tracking
- **Data Encryption**: Sensitive data encryption at rest

### **Access Control**

- **Authentication**: Supabase auth integration
- **Authorization**: Role-based access control
- **API Security**: Secure endpoint access
- **Input Validation**: Comprehensive input sanitization

---

## 🚨 **ERROR HANDLING & RECOVERY**

### **Error Types**

1. **Validation Errors**: Schema validation failures
2. **Extraction Errors**: Pattern matching failures
3. **Database Errors**: Persistence failures
4. **Network Errors**: External service failures

### **Recovery Strategies**

- **Graceful Degradation**: Continue with partial data
- **Fallback Mechanisms**: LLM fallback for incomplete extraction
- **Retry Logic**: Automatic retry for transient failures
- **Error Logging**: Comprehensive error tracking and reporting

---

## 📈 **MONITORING & ANALYTICS**

### **Metrics Tracked**

- **Extraction Success Rate**: Percentage of successful extractions
- **Confidence Distribution**: Distribution of confidence scores
- **Processing Time**: Extraction and persistence performance
- **Error Rates**: Failure patterns and frequencies

### **Logging**

- **Extraction Logs**: Complete activity tracking
- **Performance Metrics**: Timing and resource usage
- **Error Details**: Comprehensive error information
- **User Actions**: User interaction tracking

---

## 🔮 **FUTURE ENHANCEMENTS**

### **Planned Features**

1. **Additional Countries**: Support for more countries
2. **Advanced ML**: Improved AI-powered extraction
3. **Real-time Processing**: Stream processing capabilities
4. **Advanced Analytics**: Deep insights and reporting

### **Scalability Improvements**

1. **Microservices**: Service decomposition
2. **Event Streaming**: Kafka integration
3. **Caching Layer**: Redis integration
4. **Load Balancing**: Horizontal scaling support

---

## 📚 **REFERENCES**

### **Related Documents**

- [HOLERITE_INVENTORY.md](./HOLERITE_INVENTORY.md) - Current system inventory
- [API Documentation](./API.md) - API endpoint documentation
- [Database Schema](./DATABASE_SCHEMA.md) - Complete database documentation

### **Technical Specifications**

- **TypeScript**: Full type safety and IntelliSense
- **Zod**: Runtime validation and type inference
- **Supabase**: Database and authentication
- **Jest**: Testing framework
- **Regex**: Pattern matching for extraction

---

## 📝 **CHANGELOG**

### **Version 1.0.0 (2025-01-31)**

- ✅ Initial implementation of unified extraction system
- ✅ Brazil, France, and Portugal adapters
- ✅ Automatic database schema extension
- ✅ Confidence scoring system
- ✅ Backward compatibility layer
- ✅ Comprehensive test coverage
- ✅ Documentation and examples

---

*This document is maintained by the PIM Development Team and should be updated with each major release.*
