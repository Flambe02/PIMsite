import { PayslipParsed, PayslipLine } from "@/types";

/**
 * Parse le texte OCR + les lignes overlay pour produire
 * une structure complète compatible avec la colonne JSONB `structured_data`.
 */
export function parsePayslipV2(rawText: string, lines: any[]): PayslipParsed {
  const norm = (s = "") => s.replace(/\r?\n/g, " ");

  // --- Helpers -------------------------------------------------------------
  const parseMoney = (s?: string) =>
    s ? parseFloat(s.replace(/\./g, "").replace(",", ".")) : undefined;

  const money = (regex: RegExp) =>
    parseMoney(regex.exec(rawText)?.[1]);

  // --- ENTREPRISE ----------------------------------------------------------
  const empresaNome =
    /raz[aã]o social[:\s]+([^\n]+)/i.exec(rawText)?.[1] ??
    /recibo de pagamento de sal[aá]rio\s+([^\n]+)/i.exec(rawText)?.[1] ??
    "";
  const cnpj = /(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/.exec(rawText)?.[1];

  // --- COLABORADOR ---------------------------------------------------------
  const nome =
    /nome (?:completo|do (?:funcion[aá]rio|colaborador))[:\s]+([^\n]+)/i
      .exec(rawText)?.[1] ?? "";
  const cpf = /cpf[:\s]+(\d{3}\.\d{3}\.\d{3}-\d{2})/i.exec(rawText)?.[1];
  const cargo =
    /(fun[cç][aã]o|cargo)[:\s]+([^\n]+)/i.exec(rawText)?.[2] ?? "";
  const admissao =
    /(data de admiss[aã]o)[:\s]+([\d\/-]+)/i.exec(rawText)?.[2];

  // --- MÊS REFERÊNCIA ------------------------------------------------------
  const mesRef =
    /(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)[-/ ]?(\d{2,4})/i
      .exec(rawText)?.[0] ?? "";

  // --- TABLEAU LIGNES ------------------------------------------------------
  const startIdx = lines.findIndex((l: any) =>
    /descri[çc][aã]o/i.test(l.LineText)
  );
  const itens: PayslipLine[] = [];

  if (startIdx >= 0) {
    for (let i = startIdx + 1; i < lines.length; i++) {
      const t = norm(lines[i].LineText).trim();
      if (/total de venc|valor l[íi]quido|base c[áa]lc/i.test(t)) break;

      // Match type : [codigo]  descricao   ref|venc   desc
      const m =
        /^(\d{3,})?\s*([A-ZÀ-Úa-zà-ú ().%-]+?)\s+([\d.,%-]+)?\s+([\d.,%-]+)?$/.exec(
          t
        );
      if (m) {
        const [, codigo, descricao, col3, col4] = m;
        const isPercent = /%/.test(col3 ?? "");
        itens.push({
          codigo: codigo || undefined,
          descricao: descricao.trim(),
          referencia: isPercent ? col3 : undefined,
          venc: isPercent ? undefined : parseMoney(col3),
          desc: parseMoney(col4),
        });
      }
    }
  }

  // --- BASES & TOTAUX ------------------------------------------------------
  const bases = {
    base_inss: money(/base c[áa]lc[.]? inss[:\s]+r?\$?\s*([\d.,]+)/i),
    base_fgts: money(/base c[áa]lc[.]? fgts[:\s]+r?\$?\s*([\d.,]+)/i),
    valor_fgts: money(/fgts do m[êe]s[:\s]+r?\$?\s*([\d.,]+)/i),
    base_irrf: money(/base c[áa]lc[.]? irrf[:\s]+r?\$?\s*([\d.,]+)/i),
  };

  const totaux = {
    total_venc: money(/total de venc[\w.]*[:\s]+r?\$?\s*([\d.,]+)/i),
    total_desc: money(/total de descontos[:\s]+r?\$?\s*([\d.,]+)/i),
    salario_liquido: money(
      /(sal[aá]rio l[íi]quido|valor l[íi]quido)[:\s]+r?\$?\s*([\d.,]+)/i
    ),
  };

  return {
    empresa: { nome: empresaNome.trim(), cnpj },
    colaborador: { nome: nome.trim(), cpf, cargo: cargo.trim(), admissao },
    folha_pagamento: {
      mes_referencia: mesRef.trim(),
      itens,
      totaux: {
        total_venc: totaux.total_venc ?? 0,
        total_desc: totaux.total_desc ?? 0,
        salario_liquido: totaux.salario_liquido ?? 0,
      },
      bases,
    },
    raw_text: rawText,
  };
}

export async function analyzePayslip(fileUrl: string) {
  await new Promise(res => setTimeout(res, 2000));
  return {
    period: "2025-07",
    gross_income: 5000,
    net_income: 3800,
    taxes: 800,
    deductions: 400,
    benefits: 350,
    benefits_utilization: 75,
  };
} 