import type { PayslipData } from "../types";
import { remove as removeAccents } from 'diacritics';

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

// Step 1: Preprocess OCR text to join split label-value lines
function joinSplitLabelValueLines(text: string): string {
  // Join lines where a label is at the end and a value at the start of the next
  // e.g. 'SALARIO LIQUIDO\n5.000 00' => 'SALARIO LIQUIDO 5.000 00'
  return text.replace(/([a-zA-ZçÇãõéíóúâêôàü0-9\)\(\s]+)[\r\n]+([\d\., ]{3,})/g, '$1 $2');
}

// Step 1: Preprocess OCR text to join split description-value lines for earnings/deductions
function joinSplitDescValueLines(text: string): string {
  // Join lines where a description is at the end and a value at the start of the next
  // e.g. 'INSS\n2.669 28' => 'INSS 2.669 28'
  return text.replace(/([A-ZÇÃÕÉÍÓÚÂÊÔÀÜ0-9\)\(\s]+)[\r\n]+([\d\., ]{3,})/g, '$1 $2');
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
  earnings: Array<{ description: string, amount: { label: string, value: number | null } }>;
  deductions: Array<{ description: string, amount: { label: string, value: number | null } }>;
  validation: { status: 'ok' | 'warning' | 'error', messages: string[] };
}

export function parsePayslipOcr(ocrText: string): PayslipData {
  let text = cleanOcrText(ocrText);
  text = joinSplitLabelValueLines(text);
  const validation: { status: 'ok' | 'warning' | 'error', messages: string[] } = { status: 'ok', messages: [] };

  // Step 2: Tolerant regex for (description, value) pairs
  const descValRegex = /([A-ZÇÃÕÉÍÓÚÂÊÔÀÜ0-9\(\)\%\.\s]+)[ \t\r\n:]+([\d\.\, ]{3,})/gi;
  let earnings: Array<{ description: string, amount: { label: string, value: number | null }, row: number }> = [];
  let deductions: Array<{ description: string, amount: { label: string, value: number | null }, row: number }> = [];
  let ocrLines = text.split(/\r?\n/);
  let usedRows = new Set();
  let match;
  while ((match = descValRegex.exec(text)) !== null) {
    const desc = match[1].trim();
    const rawValue = match[2];
    // Accept '2.669 28', '2.669,28', '2669 28', '2669,28', etc.
    let value = parseBRL(rawValue);
    // Find the line number for debugging
    let idx = text.slice(0, match.index).split(/\r?\n/).length - 1;
    // Heuristic: if desc is in known deduction keywords, push to deductions, else earnings
    if (/PLANO DE SAUDE|INSS|IRRF|DESCONTO|PENSAO|ALIMENTICIA/i.test(desc)) {
      deductions.push({ description: desc, amount: { label: desc, value }, row: idx });
    } else {
      earnings.push({ description: desc, amount: { label: desc, value }, row: idx });
    }
    usedRows.add(idx);
  }
  // Fallback: if a description is found but no value on the same line, look at the next line
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

  // --- Robust total extraction logic ---
  // 1. Try to extract explicit total
  let totalEarningsExplicit = parseBRL(extractField(text, /Total de Vencimentos[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i));
  let totalDeductionsExplicit = parseBRL(extractField(text, /Total de Descontos[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i));
  // 2. Calculate sum if not found
  const sumEarnings = earnings.reduce((acc, e) => acc + (e.amount.value || 0), 0);
  const sumDeductions = deductions.reduce((acc, d) => acc + (d.amount.value || 0), 0);
  let totalEarnings = totalEarningsExplicit;
  let totalEarningsLabel = 'Total de Vencimentos';
  let totalDeductions = totalDeductionsExplicit;
  let totalDeductionsLabel = 'Total de Descontos';
  if (totalEarnings == null) {
    totalEarnings = +sumEarnings.toFixed(2);
    totalEarningsLabel = 'Somme des Vencimentos';
    validation.status = 'warning';
    validation.messages.push('Total de Vencimentos non trouvé, somme calculée utilisée.');
  }
  if (totalDeductions == null) {
    totalDeductions = +sumDeductions.toFixed(2);
    totalDeductionsLabel = 'Somme des Descontos';
    validation.status = 'warning';
    validation.messages.push('Total de Descontos non trouvé, somme calculée utilisée.');
  }
  // 3. If both exist and do not match, warning
  if (totalEarningsExplicit != null && Math.abs(totalEarningsExplicit - sumEarnings) > 0.01) {
    validation.status = 'warning';
    validation.messages.push(`Total de Vencimentos extrait (${totalEarningsExplicit}) ≠ somme calculée (${sumEarnings})`);
  }
  if (totalDeductionsExplicit != null && Math.abs(totalDeductionsExplicit - sumDeductions) > 0.01) {
    validation.status = 'warning';
    validation.messages.push(`Total de Descontos extrait (${totalDeductionsExplicit}) ≠ somme calculée (${sumDeductions})`);
  }

  // --- Improved deductions extraction from Descrição/Descontos columns ---
  // Try to find lines like: <desc> ... <venc> ... <desc>
  const deductionLineRegex = /([A-ZÇÃÕÉÍÓÚÂÊÔÀÜ0-9\(\)\%\.\s]+)\s+(\d{1,3}(?:\.\d{3})*,\d{2})?\s*(\d{1,3}(?:\.\d{3})*,\d{2})/gi;
  let deductions: Array<{ description: string, amount: { label: string, value: number | null } }> = [];
  if (tableBlock) {
    let match;
    while ((match = deductionLineRegex.exec(tableBlock)) !== null) {
      const desc = match[1].trim();
      const value = parseBRL(match[3]);
      if (value != null) {
        deductions.push({ description: desc, amount: { label: desc, value } });
      }
    }
  }
  // If no deductions found with this method, fallback to previous extraction
  if (deductions.length === 0) {
    // Extraction des earnings/deductions détaillés (amélioré)
    const earnings: Array<{ description: string, amount: { label: string, value: number | null } }> = [];
    const deductions: Array<{ description: string, amount: { label: string, value: number | null } }> = [];
    const lineRegex = /([A-ZÇÃÕÉÍÓÚÂÊÔÀÜ0-9\(\)\%\.\s]+)\s+(\d{1,3}(?:\.\d{3})*,\d{2})?/gi;
    let tableBlock = extractField(text, /Cód\.|Descrição|Referência|Vencimentos|Descontos([\s\S]+?)Total(s)? de Vencimentos/i);
    if (tableBlock) {
      let match;
      while ((match = lineRegex.exec(tableBlock)) !== null) {
        const desc = match[1].trim();
        const value = parseBRL(match[2]);
        if (value && value > 0) {
          // Heuristic: if desc is in known deduction keywords, push to deductions, else earnings
          if (/PLANO DE SAUDE|INSS|IRRF|DESCONTO|PENSAO|ALIMENTICIA/i.test(desc)) {
            deductions.push({ description: desc, amount: { label: desc, value } });
          } else {
            earnings.push({ description: desc, amount: { label: desc, value } });
          }
        }
      }
    }
  }

  // --- Validation: sum of deductions vs total_deductions ---
  const sumDeductions = deductions.reduce((acc, d) => acc + (d.amount.value || 0), 0);
  if (Math.abs(sumDeductions - totalDeductions) > 0.01) {
    validation.status = 'warning';
    validation.messages.push(`Somme des deductions (${sumDeductions}) ≠ Total Descontos (${totalDeductions})`);
  }

  // --- Improved net salary extraction (robust to noisy OCR) ---
  // Step 2: Regex tolerant to spaces, tabs, line breaks, label variants, accents
  const netLabelPatterns = [
    'liquido a receber', 'iquido a receber', 'liquidoareceber', 'salario liquido', 'salarioliquido'
  ];
  const netLabelRegex = new RegExp(
    `((?:${netLabelPatterns.join('|')})[^\d\n]*)[ \t\r\n:]*([\d\.\, ]{3,})`,
    'gi'
  );
  const netLabelNextLineRegex = new RegExp(
    `((?:${netLabelPatterns.join('|')})[^\d\n]*)[ \t\r\n:]+([\d\.\, ]{3,})`,
    'gi'
  );
  // Step 3: Prefer value on same line, fallback to next line
  let netCandidates: Array<{ label: string, value: number, index: number, fallback: boolean }> = [];
  let match;
  // Same line
  while ((match = netLabelRegex.exec(removeAccents(text.toLowerCase()))) !== null) {
    const rawLabel = match[1].trim();
    const rawValue = match[2];
    const value = parseBRL(rawValue);
    if (value == null) continue;
    netCandidates.push({ label: rawLabel, value, index: match.index, fallback: false });
  }
  // Fallback: next line
  if (netCandidates.length === 0) {
    while ((match = netLabelNextLineRegex.exec(removeAccents(text.toLowerCase()))) !== null) {
      const rawLabel = match[1].trim();
      const rawValue = match[2];
      const value = parseBRL(rawValue);
      if (value == null) continue;
      netCandidates.push({ label: rawLabel, value, index: match.index, fallback: true });
    }
  }
  // Step 4: Accept values like '5.000 00' or '5000 00' as '5000.00'
  function parseBRL(str: string | null | undefined): number | null {
    if (!str) return null;
    // Accept '5.000 00' or '5000 00' as '5000.00'
    let clean = str.replace(/(\d) (\d{2})\b/g, '$1.$2');
    clean = clean.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.\-]/g, '');
    const val = parseFloat(clean);
    return isNaN(val) ? null : val;
  }
  // Step 5: Select candidate and record in validation
  let net_salary = null;
  if (netCandidates.length > 0) {
    // Prefer last candidate (bottom-most)
    const selected = netCandidates.reduce((a, b) => (a.index > b.index ? a : b));
    net_salary = { label: selected.label, value: selected.value };
    validation.messages.push(`Salário Líquido sélectionné: "${selected.label}" = ${selected.value} (${selected.fallback ? 'valeur trouvée sur la ligne suivante' : 'valeur trouvée sur la même ligne'})`);
  } else {
    // No explicit label found, try to find all possible numeric candidates
    const allNumbers = Array.from(text.matchAll(/([\d\.\, ]{3,})/g)).map(m => parseBRL(m[1])).filter(v => v != null);
    validation.status = 'warning';
    validation.messages.push('Aucun label explicite pour le salaire líquido trouvé. Possíveis valeurs líquidos: ' + allNumbers.join(', '));
    net_salary = { label: 'possíveis valeurs líquidos', value: null };
  }

  // --- Gross salary strict mapping ---
  const salarioBruto = parseBRL(extractField(text, /SALARIO BASE[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i));
  let gross_salary = { label: 'SALARIO BASE', value: salarioBruto };
  if (salarioBruto == null && earnings.length > 0) {
    gross_salary = { label: earnings[0].description, value: earnings[0].amount.value };
    validation.status = 'warning';
    validation.messages.push('Salário Base non trouvé, premier earning utilisé.');
  }

  // --- Other strict fields ---
  const inss_base = { label: 'INSS', value: parseBRL(extractField(text, /INSS[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i)) };
  const fgts_base = { label: 'Base Cálc. FGTS', value: parseBRL(extractField(text, /Base Cálc\. FGTS[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i)) };
  const irrf_base = { label: 'IRRF', value: parseBRL(extractField(text, /IRRF[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i)) };
  const fgts_deposit = { label: 'FGTS do Mês', value: parseBRL(extractField(text, /FGTS do Mês[\s\S]*?(\d{1,3}(?:\.\d{3})*,\d{2})/i)) };

  // --- Validation logic ---
  if (net_salary.value != null && Math.abs(net_salary.value - (totalEarnings - totalDeductions)) > 0.01) {
    validation.status = 'warning';
    validation.messages.push(`Salário Líquido (${net_salary.value}) ≠ Total Vencimentos (${totalEarnings}) - Total Descontos (${totalDeductions})`);
  }
  if (gross_salary.value != null && net_salary.value != null && gross_salary.value < net_salary.value) {
    validation.status = 'warning';
    validation.messages.push(`Salário Base (${gross_salary.value}) < Salário Líquido (${net_salary.value})`);
  }

  // --- Improved row-by-row extraction for earnings and deductions ---
  const earnings: Array<{ description: string, amount: { label: string, value: number | null } }> = [];
  let deductions: Array<{ description: string, amount: { label: string, value: number | null } }> = [];
  // Regex for table lines: <desc> <ref> <proventos> <descontos>
  const rowRegex = /([A-ZÇÃÕÉÍÓÚÂÊÔÀÜ0-9\(\)\%\.\s]+)\s+(\d{1,3}(?:\.\d{3})*,\d{2}|-)\s+(\d{1,3}(?:\.\d{3})*,\d{2}|-)\s+(\d{1,3}(?:\.\d{3})*,\d{2}|-)/gi;
  if (tableBlock) {
    let match;
    while ((match = rowRegex.exec(tableBlock)) !== null) {
      const desc = match[1].trim();
      // const ref = match[2]; // unused
      const proventos = parseBRL(match[3]);
      const descontos = parseBRL(match[4]);
      if (proventos != null) {
        earnings.push({ description: desc, amount: { label: desc, value: proventos } });
      }
      if (descontos != null) {
        deductions.push({ description: desc, amount: { label: desc, value: descontos } });
      }
    }
  }

  // --- Output ---
  return {
    period: extractField(text, /(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)[-/ ]?(\d{2,4})/i) ?
      (() => {
        const m = extractField(text, /(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)[-/ ]?(\d{2,4})/i);
        if (!m) return null;
        const [_, month, year] = m.match(/(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)[-/ ]?(\d{2,4})/i) || [];
        const months = {janeiro:'01',fevereiro:'02',março:'03',abril:'04',maio:'05',junho:'06',julho:'07',agosto:'08',setembro:'09',outubro:'10',novembro:'11',dezembro:'12'};
        return year && month ? `${year.length===2?('20'+year):year}-${months[month.toLowerCase()]}` : null;
      })() : null,
    gross_salary,
    net_salary,
    total_earnings: { label: totalEarningsLabel, value: totalEarnings },
    total_deductions: { label: totalDeductionsLabel, value: totalDeductions },
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
  // Count line merges (warnings with 'trouvée sur la ligne suivante')
  const fallbacks = (parsedPayslip.validation?.messages || []).filter((w: string) => /trouvée sur la ligne suivante/i.test(w));
  // Manual corrections (could be tracked in future, here empty)
  const manualCorrections: string[] = [];
  // Required fields
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
    `- Warnings: ${parsedPayslip.validation?.warningsCount ?? parsedPayslip.validation?.messages?.length ?? 0}`,
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

/*
// Example AuditReport for a problematic payslip:
{
  earningsCount: 2,
  deductionsCount: 2,
  lineMerges: 1,
  warningsCount: 1,
  warnings: [
    'Valeur pour "INSS" trouvée sur la ligne suivante (ligne 8) : 2669.28'
  ],
  requiredFields: {
    net_salary: true,
    gross_salary: true,
    total_earnings: true,
    total_deductions: true,
    earnings: true,
    deductions: true
  },
  fallbacks: [
    'Valeur pour "INSS" trouvée sur la ligne suivante (ligne 8) : 2669.28'
  ],
  manualCorrections: [],
  validationStatus: 'warning',
  formatted: `Payslip Audit Report:
- Earnings extracted: 2
- Deductions extracted: 2
- Line merges (fallbacks): 1
- Warnings: 1
  • Valeur pour "INSS" trouvée sur la ligne suivante (ligne 8) : 2669.28
- Required fields:
  • net_salary: OK
  • gross_salary: OK
  • total_earnings: OK
  • total_deductions: OK
  • earnings: OK
  • deductions: OK
- Fallbacks: Valeur pour "INSS" trouvée sur la ligne suivante (ligne 8) : 2669.28
- Manual corrections: None
- Final validation status: warning`
}
*/
// This function provides a clear, structured audit for UI or logging, summarizing extraction quality and issues. 