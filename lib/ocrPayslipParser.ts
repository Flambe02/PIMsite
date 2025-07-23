// Utilitaire pour parser un montant brésilien (ex: "15.345,00") en float
function parseBRL(str: string | null | undefined): number | null {
  if (!str) return null;
  // Accept '5.000 00' or '5000 00' as '5000.00'
  let clean = str.replace(/(\d) (\d{2})\b/g, '$1.$2');
  clean = clean.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.\-]/g, '');
  const val = parseFloat(clean);
  return isNaN(val) ? null : val;
}

// Nettoyage OCR typique
function cleanOcrText(text: string): string {
  return text
    .replace(/CNP3/g, 'CNPJ')
    .replace(/22e horas/g, '220 horas')
    .replace(/janeiro\/2e17/g, 'janeiro/2017')
    .replace(/,ee/g, ',00')
    .replace(/\s+/g, ' ')
    .replace(/\.(?=\d{3},)/g, '');
}

// Extraction par regex
function extractField(text: string, regex: RegExp): string | null {
  const m = text.match(regex);
  return m ? m[1].trim() : null;
}

// Type minimal pour la sortie du parser OCR (adapté au schéma demandé)
export interface PayslipData {
  company_name: { label: string, value: string | null };
  employee_name: { label: string, value: string | null };
  position: { label: string, value: string | null };
  cbo: { label: string, value: string | null };
  admission_date: string | null;
  period: string | null;
  dependents: number | null;
  work_hours: number | null;
  department: { label: string, value: string | null };
  gross_salary: { label: string, value: number | null };
  total_earnings: { label: string, value: number | null };
  total_deductions: { label: string, value: number | null };
  net_salary: { label: string, value: number | null };
  inss_base: { label: string, value: number | null };
  fgts_base: { label: string, value: number | null };
  irrf_base: { label: string, value: number | null };
  fgts_deposit: { label: string, value: number | null };
  earnings: Array<{ description: string, amount: { label: string, value: number | null }, row: number }>;
  deductions: Array<{ description: string, amount: { label: string, value: number | null }, row: number }>;
  validation: { status: 'ok' | 'warning' | 'error', messages: string[] };
}

export function parsePayslipOcr(ocrText: string): PayslipData {
  // --- INITIALIZATION ---
  let text = cleanOcrText(ocrText);
  text = text.replace(/([a-zA-ZçÇãõéíóúâêôàü0-9\)\(\s]+)[\r\n]+([\d\., ]{3,})/g, '$1 $2'); // Join split lines

  const validation: { status: 'ok' | 'warning' | 'error', messages: string[] } = { status: 'ok', messages: [] };
  
  // Single declaration for all variables at the top of the function scope
  let earnings: Array<{ description: string, amount: { label: string, value: number | null }, row: number }> = [];
  let deductions: Array<{ description: string, amount: { label: string, value: number | null }, row: number }> = [];
  let match: RegExpExecArray | null;

  // --- EARNINGS & DEDUCTIONS EXTRACTION (Method 1: General Regex) ---
  const descValRegex = /([A-ZÇÃÕÉÍÓÚÂÊÔÀÜ0-9\(\)\%\.\s]+)[ \t\r\n:]+([\d\.\, ]{3,})/gi;
  const ocrLines = text.split(/\r?\n/);
  const usedRows = new Set();

  while ((match = descValRegex.exec(text)) !== null) {
    const desc = match[1].trim();
    const rawValue = match[2];
    const value = parseBRL(rawValue);
    const idx = text.slice(0, match.index).split(/\r?\n/).length - 1;

    if (/PLANO DE SAUDE|INSS|IRRF|DESCONTO|PENSAO|ALIMENTICIA/i.test(desc)) {
      deductions.push({ description: desc, amount: { label: desc, value }, row: idx });
    } else {
      earnings.push({ description: desc, amount: { label: desc, value }, row: idx });
    }
    usedRows.add(idx);
  }

  // Fallback: If description is on one line and value on the next
  ocrLines.forEach((line, i) => {
    const descMatch = line.match(/^([A-ZÇÃÕÉÍÓÚÂÊÔÀÜ0-9\(\)\%\.\s]+)$/);
    if (descMatch && !usedRows.has(i)) {
      const desc = descMatch[1].trim();
      const nextLine = ocrLines[i + 1] || '';
      const valueMatch = nextLine.match(/([\d\.\, ]{3,})/);
      if (valueMatch) {
        let value = parseBRL(valueMatch[1]);
        if (/PLANO DE SAUDE|INSS|IRRF|DESCONTO|PENSAO|ALIMENTICIA/i.test(desc)) {
          deductions.push({ description: desc, amount: { label: desc, value }, row: i });
        } else {
          earnings.push({ description: desc, amount: { label: desc, value }, row: i });
        }
        validation.status = 'warning';
        validation.messages.push(`Valeur pour "${desc}" trouvée sur la ligne suivante (ligne ${i + 2}) : ${value}`);
      }
    }
  });

  // --- TOTALS CALCULATION & VALIDATION ---
  const sumOfEarnings = earnings.reduce((acc, e) => acc + (e.amount.value || 0), 0);
  const sumOfDeductions = deductions.reduce((acc, d) => acc + (d.amount.value || 0), 0);
  
  let totalEarningsExplicit = parseBRL(extractField(text, /Total de Vencimentos[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i));
  let totalDeductionsExplicit = parseBRL(extractField(text, /Total de Descontos[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i));

  let totalEarnings = totalEarningsExplicit ?? +sumOfEarnings.toFixed(2);
  let totalEarningsLabel = totalEarningsExplicit ? 'Total de Vencimentos' : 'Somme des Vencimentos';
  let totalDeductions = totalDeductionsExplicit ?? +sumOfDeductions.toFixed(2);
  let totalDeductionsLabel = totalDeductionsExplicit ? 'Total de Descontos' : 'Somme des Descontos';

  if (totalEarningsExplicit == null) {
    validation.status = 'warning';
    validation.messages.push('Total de Vencimentos non trouvé, somme calculée utilisée.');
  } else if (Math.abs(totalEarningsExplicit - sumOfEarnings) > 0.01) {
    validation.status = 'warning';
    validation.messages.push(`Total de Vencimentos extrait (${totalEarningsExplicit}) ≠ somme calculée (${sumOfEarnings})`);
  }

  if (totalDeductionsExplicit == null) {
    validation.status = 'warning';
    validation.messages.push('Total de Descontos non trouvé, somme calculée utilisée.');
  } else if (Math.abs(totalDeductionsExplicit - sumOfDeductions) > 0.01) {
    validation.status = 'warning';
    validation.messages.push(`Total de Descontos extrait (${totalDeductionsExplicit}) ≠ somme calculée (${sumOfDeductions})`);
  }
  
  // --- NET SALARY EXTRACTION ---
  const netLabelPatterns = ['liquido a receber', 'iquido a receber', 'liquidoareceber', 'salario liquido', 'salarioliquido'];
  const netLabelRegex = new RegExp(`((?:${netLabelPatterns.join('|')})[^\\d\\n]*)[ \\t\\r\\n:]*([\\d\\.\\, ]{3,})`, 'gi');
  
  let netCandidates: Array<{ label: string, value: number, index: number, fallback: boolean }> = [];
  while ((match = netLabelRegex.exec(text.toLowerCase())) !== null) {
    const value = parseBRL(match[2]);
    if (value != null) {
      netCandidates.push({ label: match[1].trim(), value, index: match.index, fallback: false });
    }
  }

  let net_salary = null;
  if (netCandidates.length > 0) {
    const selected = netCandidates.reduce((a, b) => (a.index > b.index ? a : b));
    net_salary = { label: selected.label, value: selected.value };
    validation.messages.push(`Salário Líquido sélectionné: "${selected.label}" = ${selected.value}`);
  } else {
    validation.status = 'warning';
    validation.messages.push('Aucun label explicite pour le salaire líquido trouvé.');
    net_salary = { label: 'Salário Líquido (non trouvé)', value: null };
  }

  if (net_salary.value != null && Math.abs(net_salary.value - (totalEarnings - totalDeductions)) > 0.01) {
    validation.status = 'warning';
    validation.messages.push(`Salário Líquido (${net_salary.value}) ≠ Total Vencimentos (${totalEarnings}) - Total Descontos (${totalDeductions})`);
  }

  // --- OTHER FIELDS ---
  const salarioBruto = parseBRL(extractField(text, /SALARIO BASE[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i));
  let gross_salary = { label: 'SALARIO BASE', value: salarioBruto };
  if (salarioBruto == null && earnings.length > 0) {
    gross_salary = { label: earnings[0].description, value: earnings[0].amount.value };
    validation.status = 'warning';
    validation.messages.push('Salário Base non trouvé, premier earning utilisé.');
  }

  if (gross_salary.value != null && net_salary.value != null && gross_salary.value < net_salary.value) {
    validation.status = 'warning';
    validation.messages.push(`Salário Base (${gross_salary.value}) < Salário Líquido (${net_salary.value})`);
  }
  
  const inss_base = { label: 'INSS', value: parseBRL(extractField(text, /INSS[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i)) };
  const fgts_base = { label: 'Base Cálc. FGTS', value: parseBRL(extractField(text, /Base Cálc\. FGTS[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i)) };
  const irrf_base = { label: 'IRRF', value: parseBRL(extractField(text, /IRRF[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i)) };
  const fgts_deposit = { label: 'FGTS do Mês', value: parseBRL(extractField(text, /FGTS do Mês[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i)) };
  
  // --- FINAL OUTPUT ASSEMBLY ---
  const periodMatch = text.match(/(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)[-/ ]?(\d{2,4})/i);
  let period = null;
  if(periodMatch) {
      const monthMap: { [key: string]: string } = {janeiro:'01',fevereiro:'02',março:'03',abril:'04',maio:'05',junho:'06',julho:'07',agosto:'08',setembro:'09',outubro:'10',novembro:'11',dezembro:'12'};
      const year = periodMatch[2].length === 2 ? '20' + periodMatch[2] : periodMatch[2];
      const month = monthMap[periodMatch[1].toLowerCase()];
      period = `${year}-${month}`;
  }

  return {
    company_name: { label: 'Empresa', value: extractField(text, /Empresa[\s\S]*?(\w+)/i) },
    employee_name: { label: 'Nome do Funcionário', value: extractField(text, /Nome do Funcionário[\s\S]*?(\w+)/i) },
    position: { label: 'Cargo', value: extractField(text, /Cargo[\s\S]*?(\w+)/i) },
    cbo: { label: 'CBO', value: extractField(text, /CBO[\s\S]*?(\w+)/i) },
    admission_date: extractField(text, /Data de Admissão[\s\S]*?(\d{2}\/\d{2}\/\d{4})/i),
    period,
    dependents: null,
    work_hours: null,
    department: { label: 'Departamento', value: extractField(text, /Departamento[\s\S]*?(\w+)/i) },
    gross_salary,
    total_earnings: { label: totalEarningsLabel, value: totalEarnings },
    total_deductions: { label: totalDeductionsLabel, value: totalDeductions },
    net_salary,
    inss_base,
    fgts_base,
    irrf_base,
    fgts_deposit,
    earnings,
    deductions,
    validation
  };
}


export interface AuditReport {
  earningsCount: number;
  deductionsCount: number;
  lineMerges: number;
  warningsCount: number;
  warnings: string[];
  requiredFields: Record<string, boolean>;
  fallbacks: string[];
  manualCorrections: string[];
  validationStatus: string;
  formatted: string;
}

export function generatePayslipAuditReport(parsedPayslip: any): AuditReport {
  const fallbacks = (parsedPayslip.validation?.messages || []).filter((w: string) => /trouvée sur la ligne suivante/i.test(w));
  const manualCorrections: string[] = [];
  const requiredFields = {
    net_salary: !!parsedPayslip.net_salary?.value,
    gross_salary: !!parsedPayslip.gross_salary?.value,
    total_earnings: !!parsedPayslip.total_earnings?.value,
    total_deductions: !!parsedPayslip.total_deductions?.value,
    earnings: Array.isArray(parsedPayslip.earnings) && parsedPayslip.earnings.length > 0,
    deductions: Array.isArray(parsedPayslip.deductions) && parsedPayslip.deductions.length > 0,
  };
  const formatted = [
    `Payslip Audit Report:`,
    `- Earnings extracted: ${parsedPayslip.earnings?.length ?? 0}`,
    `- Deductions extracted: ${parsedPayslip.deductions?.length ?? 0}`,
    `- Line merges (fallbacks): ${fallbacks.length}`,
    `- Warnings: ${parsedPayslip.validation?.messages?.length ?? 0}`,
    ...(parsedPayslip.validation?.messages || []).map((w: string) => `  • ${w}`),
    `- Required fields:`,
    ...Object.entries(requiredFields).map(([k, v]) => `  • ${k}: ${v ? 'OK' : 'MISSING'}`),
    `- Fallbacks: ${fallbacks.length > 0 ? fallbacks.join('; ') : 'None'}`,
    `- Manual corrections: ${manualCorrections.length > 0 ? manualCorrections.join('; ') : 'None'}`,
    `- Final validation status: ${parsedPayslip.validation?.status ?? 'unknown'}`
  ].join('\n');
  return {
    earningsCount: parsedPayslip.earnings?.length ?? 0,
    deductionsCount: parsedPayslip.deductions?.length ?? 0,
    lineMerges: fallbacks.length,
    warningsCount: parsedPayslip.validation?.messages?.length ?? 0,
    warnings: parsedPayslip.validation?.messages || [],
    requiredFields,
    fallbacks,
    manualCorrections,
    validationStatus: parsedPayslip.validation?.status ?? 'unknown',
    formatted,
  };
}