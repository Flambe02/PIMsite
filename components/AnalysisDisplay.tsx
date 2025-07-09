'use client';

interface AnalysisData {
  gross_salary: number;
  net_salary: number;
  earnings: { description: string; amount: number; }[];
  deductions: { description: string; amount: number; }[];
  analysis: { summary: string; optimization_opportunities: string[]; };
}

export default function AnalysisDisplay({ data }: { data: AnalysisData }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Análise do Holerite</h1>
      <p className="text-gray-600 mb-8">{data.analysis.summary}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-6">Detalhamento do Holerite</h2>
          <div className="space-y-4">
            {data.earnings.map(item => (
              <div key={item.description} className="flex justify-between"><span>{item.description}</span><span className="font-mono">R$ {item.amount.toFixed(2)}</span></div>
            ))}
            {data.deductions.map(item => (
              <div key={item.description} className="flex justify-between"><span>{item.description}</span><span className="font-mono text-red-500">-R$ {item.amount.toFixed(2)}</span></div>
            ))}
            <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg"><span>Salário Líquido:</span><span className="font-mono">R$ {data.net_salary.toFixed(2)}</span></div>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Oportunidades Identificadas</h2>
          <ul className="space-y-4 list-disc list-inside">
            {data.analysis.optimization_opportunities.map((opp, index) => (
              <li key={index} className="text-gray-700">{opp}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 