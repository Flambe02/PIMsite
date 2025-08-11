# 🔍 HOLERITE/PAYSLIP ANALYSIS STACK INVENTORY

## 📋 **EXECUTIVE SUMMARY**

This document provides a comprehensive inventory of the current Holerite/Payslip analysis stack in the PIM system, including API endpoints, services, UI components, database schema, and data flow. The system has evolved from a legacy OCR-based approach to a unified Google Vision + AI analysis system with enhanced capabilities.

---

## 🏗️ **ARCHITECTURE OVERVIEW**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   API Gateway    │    │   AI Services   │
│                 │    │                  │    │                 │
│ • Upload Modal  │───▶│ • /scan-new-pim  │───▶│ • OpenAI GPT-4  │
│ • Dashboard     │    │ • /scan-enhanced │    │ • Enhanced      │
│ • Enhanced View │    │ • /process-payslip│   │   Analysis      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   OCR Service    │
                       │                  │
                       │ • Google Vision  │
                       │ • Document       │
                       │   Validation     │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Database       │
                       │                  │
                       │ • scan_results   │
                       │ • holerites      │
                       │ • user_beneficios│
                       │ • seguros        │
                       │ • investimentos  │
                       └──────────────────┘
```

---

## 🚀 **API ENDPOINTS**

### **1. Primary Upload Endpoint**
- **Path**: `/api/scan-new-pim`
- **Method**: `POST`
- **Purpose**: Main unified payslip processing endpoint
- **Payload**: `FormData` with file and optional headers
- **Response**: `ScanNewPIMResponse` with structured data and recommendations

### **2. Enhanced Analysis Endpoint**
- **Path**: `/api/scan-new-pim-enhanced`
- **Method**: `POST`
- **Purpose**: Advanced analysis with separated explanation and recommendations
- **Payload**: `FormData` with file, analysisType, and country headers
- **Response**: `ScanNewPIMEnhancedResponse` with enhanced analysis

### **3. Legacy Endpoint (Deprecated)**
- **Path**: `/api/process-payslip`
- **Method**: `POST`
- **Status**: ❌ **DEPRECATED** - No longer used
- **Note**: Replaced by unified scan-new-pim system

### **4. Payslip Management Endpoints**
- **Path**: `/api/payslip/[id]`
- **Methods**: `GET`, `PUT`, `DELETE`
- **Purpose**: CRUD operations on existing payslips

---

## 🔧 **SERVICES & UTILITIES**

### **1. OCR Services**
- **`GoogleVisionService`** (`lib/services/googleVisionService.ts`)
  - Document scanning with Google Vision API
  - Country detection (BR/FR/PT)
  - Document validation (payslip recognition)
  - Duplicate page detection
  - Confidence scoring

### **2. AI Analysis Services**
- **`ScanAnalysisService`** (`lib/services/scanAnalysisService.ts`)
  - Legacy analysis with OpenAI GPT-4
  - Brazilian payslip optimization
  - Basic recommendations generation

- **`EnhancedPayslipAnalysisService`** (`lib/ia/enhancedPayslipAnalysisService.ts`)
  - Advanced analysis with version control
  - Separated explanation and recommendations
  - Multi-country support
  - Fallback mechanisms

- **`PayslipAnalysisService`** (`lib/ia/payslipAnalysisService.ts`)
  - Optimized extraction with country-specific prompts
  - Intelligent validation and correction
  - Confidence scoring

### **3. Validation Services**
- **`PayslipValidator`** (`lib/validation/payslipValidator.ts`)
  - Data consistency validation
  - Automatic error correction
  - Country-specific validation rules
  - Confidence calculation

### **4. Prompt Management**
- **`prompts.ts`** (`lib/ia/prompts.ts`)
  - Country-specific extraction prompts
  - Multi-language support (BR/FR/ES)
  - Optimized for accuracy and completeness

- **`enhancedPrompts.ts`** (`lib/ia/enhancedPrompts.ts`)
  - Enhanced analysis prompts
  - Explanation and recommendation generation
  - Structured output formatting

---

## 🎨 **UI COMPONENTS**

### **1. Upload Components**
- **`PayslipUpload`** (`components/payslip-upload.tsx`)
  - Main upload interface
  - File validation and processing
  - Progress indicators (OCR/AI)

- **`EnhancedScanNewPIM`** (`components/scan-new-pim/EnhancedScanNewPIM.tsx`)
  - Advanced upload with analysis type selection
  - Real-time processing feedback
  - Enhanced result display

- **`FileUploadZone`** (`components/scan-new-pim/FileUploadZone.tsx`)
  - Drag & drop file upload
  - File type validation
  - Upload progress tracking

### **2. Dashboard Pages**
- **Main Dashboard** (`app/[locale]/dashboard/page.tsx`)
  - Overview of payslip data
  - Financial health scoring
  - AI recommendations display

- **Enhanced Dashboard** (`app/[locale]/dashboard/enhanced/page.tsx`)
  - Advanced analysis results
  - Separated explanation and recommendations
  - Interactive data exploration

- **Historical View** (`app/[locale]/dashboard/historico/page.tsx`)
  - Payslip history and documents
  - Data comparison over time

### **3. Mobile Components**
- **`MobileUpload`** (`components/mobile/MobileUpload.tsx`)
  - Mobile-optimized upload interface
  - Touch-friendly controls
  - Progress visualization

---

## 🗄️ **DATABASE INTEGRATION**

### **1. Core Tables**

#### **`scan_results`**
- **Purpose**: Raw OCR and analysis results storage
- **Columns**:
  ```sql
  id UUID PRIMARY KEY
  user_id UUID REFERENCES auth.users(id)
  country VARCHAR(2) DEFAULT 'br'
  file_name VARCHAR(255)
  file_size INTEGER
  file_type VARCHAR(10)
  ocr_text TEXT
  structured_data JSONB
  recommendations JSONB
  confidence_score DECIMAL(3,2)
  scan_version INTEGER DEFAULT 1
  analysis_version JSONB
  explanation_report JSONB
  recommendations_report JSONB
  created_at TIMESTAMP DEFAULT NOW()
  updated_at TIMESTAMP DEFAULT NOW()
  ```
- **Indexes**: `user_id`, `created_at`, `country`, JSONB columns
- **RLS Policies**: Users can only access their own scan results

#### **`holerites`**
- **Purpose**: Processed payslip data for dashboard display
- **Columns**:
  ```sql
  id UUID PRIMARY KEY
  user_id UUID REFERENCES auth.users(id)
  period TEXT
  nome TEXT
  empresa TEXT
  salario_bruto DECIMAL(10,2)
  salario_liquido DECIMAL(10,2)
  structured_data JSONB
  analysis_version JSONB
  explanation_report JSONB
  recommendations_report JSONB
  created_at TIMESTAMP DEFAULT NOW()
  updated_at TIMESTAMP DEFAULT NOW()
  ```
- **Indexes**: `user_id`, `created_at`, `period`, JSONB columns
- **RLS Policies**: Users can only access their own holerites

### **2. Supporting Tables**

#### **`user_beneficios`**
- **Purpose**: User-defined benefits and deductions
- **Columns**: `id`, `user_id`, `nome`, `valor`, `tipo`, `descricao`, `created_at`, `updated_at`
- **RLS**: User isolation

#### **`seguros`**
- **Purpose**: Insurance products tracking
- **Columns**: `id`, `user_id`, `type`, `detected`, `comment`, `link`, `priority`, `updated_at`
- **RLS**: User isolation

#### **`investimentos`**
- **Purpose**: Investment tracking
- **Columns**: `id`, `user_id`, `asset_class`, `amount`, `yield_pct`, `description`, `updated_at`
- **RLS**: User isolation

#### **`report_feedback`**
- **Purpose**: User feedback on AI reports
- **Columns**: `id`, `user_id`, `holerite_id`, `report_type`, `analysis_version`, `rating`, `comment`, `created_at`, `updated_at`
- **RLS**: User isolation with admin override

### **3. Functions & Triggers**

#### **`extract_enhanced_data_from_structured()`**
- **Purpose**: Automatically extract data from JSONB to dedicated columns
- **Trigger**: Fires on INSERT/UPDATE for both `scan_results` and `holerites`

#### **`extract_period_from_structured_data()`**
- **Purpose**: Extract period, name, company, and salary data from structured_data
- **Trigger**: Fires on INSERT/UPDATE for `holerites`

#### **`update_updated_at_column()`**
- **Purpose**: Automatically update `updated_at` timestamp
- **Usage**: Applied to multiple tables

---

## 🔒 **SECURITY & RLS POLICIES**

### **1. Row Level Security (RLS)**
- **Status**: ✅ **ENABLED** on all user data tables
- **Scope**: Users can only access their own data
- **Implementation**: `auth.uid() = user_id` policy

### **2. Table Security Status**
- **`scan_results`**: ✅ RLS enabled with full CRUD policies
- **`holerites`**: ✅ RLS enabled with full CRUD policies
- **`user_beneficios`**: ✅ RLS enabled with full CRUD policies
- **`seguros`**: ✅ RLS enabled with full CRUD policies
- **`investimentos`**: ✅ RLS enabled with full CRUD policies
- **`report_feedback`**: ✅ RLS enabled with user isolation + admin access

### **3. Authentication Flow**
- **API Authentication**: `supabase.auth.getUser()` for user identification
- **Demo Mode**: Graceful fallback for unauthenticated users
- **Session Management**: Secure token-based authentication

---

## 🔍 **EXTRACTION LOGIC**

### **1. Field Extraction**

#### **Core Fields**
- **Employee Information**: `employee_name`, `company_name`, `position`
- **Financial Data**: `salario_bruto`, `salario_liquido`, `descontos`
- **Benefits**: `beneficios` (array of objects with label/value)
- **Insurance**: `seguros` (detection and categorization)
- **Period**: `period` (month/year reference)

#### **Data Types**
- **Numbers**: Decimal with proper formatting (dot separator)
- **Strings**: Cleaned and normalized
- **Arrays**: Structured objects for benefits and deductions
- **JSONB**: Flexible storage for complex data structures

### **2. Field Mapping & Validation**

#### **Validation Process**
1. **Data Extraction**: AI-powered field identification
2. **Format Validation**: Type checking and normalization
3. **Business Logic**: Country-specific rule validation
4. **Correction**: Automatic error fixing (inversions, formatting)
5. **Confidence Scoring**: 0-100 scale with warnings

#### **Validation Rules**
- **Mathematical Consistency**: Net ≈ Gross - Deductions (±5% tolerance)
- **Country-Specific**: INSS/IRRF for Brazil, social charges for France
- **Range Validation**: Reasonable salary and deduction values
- **Format Validation**: Proper number formatting and currency handling

### **3. Country Branching**

#### **Brazil (BR) - Default**
- **Keywords**: `cnpj`, `cpf`, `inss`, `irff`, `fgts`, `holerite`
- **Validation**: INSS ~11%, IRRF progressive rates
- **Benefits**: Vale refeição, transporte, plano de saúde
- **Status**: CLT, PJ, Estagiário

#### **France (FR)**
- **Keywords**: `bulletin de paie`, `salaire`, `urssaf`, `caf`
- **Validation**: Social charges ~22%, CSG ~9%
- **Benefits**: Tickets restaurant, transport, mutuelle
- **Status**: CDI, CDD, Intérimaire

#### **Portugal (PT)**
- **Keywords**: `recibo de vencimento`, `segurança social`, `irs`
- **Validation**: Social security rates, progressive IRS
- **Benefits**: Subsídio de refeição, transporte
- **Status**: Contrato sem termo, termo certo

---

## ❌ **GAPS VS. TARGET SPECIFICATION**

### **1. Missing Fields & Inconsistent Keys**

#### **Data Structure Issues**
- **Inconsistent Naming**: Mix of Portuguese and English field names
- **Missing Standardization**: No unified field mapping across countries
- **Version Control**: Limited tracking of data structure evolution

#### **Field Completeness**
- **Benefits**: Incomplete categorization and valuation
- **Deductions**: Missing detailed breakdown by type
- **Metadata**: Limited document source tracking

### **2. Lack of Versioning & Logging**

#### **Version Control Gaps**
- **Data Evolution**: No tracking of field changes over time
- **Schema Versioning**: Limited support for backward compatibility
- **Migration History**: Incomplete documentation of structural changes

#### **Audit Trail Issues**
- **Change Tracking**: No comprehensive modification history
- **User Actions**: Limited logging of user interactions
- **Data Lineage**: Incomplete traceability of data transformations

### **3. Explanation & Recommendations Separation**

#### **Current State**
- **Mixed Output**: Some endpoints return combined explanation/recommendations
- **Inconsistent Format**: Varying structure across different analysis types
- **Limited Context**: Recommendations lack detailed reasoning

#### **Target Improvements**
- **Clear Separation**: Distinct explanation and recommendation reports
- **Structured Output**: Consistent JSON schema for both types
- **Context Preservation**: Maintain relationship between data and insights

---

## 🎯 **RECOMMENDATIONS FOR IMPROVEMENT**

### **1. Data Standardization**
- Implement unified field naming convention
- Create country-specific field mapping schemas
- Establish data validation rules per country

### **2. Versioning & Logging**
- Add comprehensive version tracking for data structures
- Implement audit logging for all data modifications
- Create migration documentation and rollback procedures

### **3. Enhanced Analysis**
- Complete separation of explanation and recommendation systems
- Implement structured output validation
- Add confidence scoring for individual field extractions

### **4. Performance Optimization**
- Optimize JSONB queries with proper indexing
- Implement caching for frequently accessed data
- Add query performance monitoring

---

## 📊 **CURRENT SYSTEM STATUS**

### **✅ Strengths**
- Unified API architecture with Google Vision OCR
- Comprehensive RLS security implementation
- Multi-country support with specialized prompts
- Enhanced analysis capabilities with version control
- Robust error handling and fallback mechanisms

### **⚠️ Areas for Improvement**
- Data structure consistency across countries
- Versioning and audit trail completeness
- Performance optimization for large datasets
- Documentation and migration procedures

### **🚀 Next Steps**
1. **Standardize data structures** across all countries
2. **Implement comprehensive versioning** and logging
3. **Complete separation** of explanation and recommendation systems
4. **Optimize database performance** and query patterns
5. **Enhance documentation** and migration procedures

---

*Last Updated: January 2025*  
*Document Version: 1.0*  
*Maintained by: PIM Development Team*
