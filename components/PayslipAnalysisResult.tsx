import React from "react";

function safeDisplay(value: any): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.every(v => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
      return value.join(', ');
    }
    return '[objet complexe]';
  }
  return '[objet complexe]';
}

function extractValor(val: any): string {
  if (val == null) return '';
  if (typeof val === 'number' || typeof val === 'string') return String(val);
  if (Array.isArray(val)) {
    for (const v of val) {
      if (v && typeof v === 'object' && 'valor' in v && v.valor != null) return String(v.valor);
      if (typeof v === 'number' || typeof v === 'string') return String(v);
    }
    return '[objet complexe]';
  }
  if (typeof val === 'object' && 'valor' in val) return String(val.valor);
  return '[objet complexe]';
}

export default function PayslipAnalysisResult({ result }: { result: any }) {
  if (!result) return null;
  console.log('PayslipAnalysisResult result:', result);
  return (
    <div className="bg-green-50 rounded-lg p-4 md:p-8 w-full text-green-900 text-center shadow">
      <div className="font-bold text-lg md:text-2xl mb-2">Holerite analisado com sucesso!</div>
      <div className="flex flex-col md:flex-row md:justify-center md:gap-8 gap-2 mb-2">
        <div><b>Salário bruto:</b> R$ {extractValor(result.salarioBruto ?? result.gross_salary ?? result.structured_data?.gross_salary)}</div>
        <div><b>Salário líquido:</b> R$ {extractValor(result.salarioLiquido ?? result.net_salary ?? result.structured_data?.net_salary)}</div>
        <div><b>Eficiência:</b> {extractValor(result.eficiencia)}</div>
      </div>
      <div className="text-left md:text-center mt-2">
        {Array.isArray(result.insights) && result.insights.map((insight: any, idx: number) => (
          <div key={idx} className="text-sm md:text-base mb-1">
            <b>{safeDisplay(insight.label)}:</b> {safeDisplay(insight.value ?? insight.valor ?? '')}
          </div>
        ))}
      </div>
    </div>
  );
} 