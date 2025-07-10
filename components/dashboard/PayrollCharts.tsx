"use client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";

const pastelColors = ["#34d399", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa"];

const evolutionData = [
  { mes: "Jan", usuario: 4200, mercado: 4100, meta: 4300 },
  { mes: "Fev", usuario: 4300, mercado: 4150, meta: 4400 },
  { mes: "Mar", usuario: 4400, mercado: 4200, meta: 4500 },
  { mes: "Abr", usuario: 4500, mercado: 4250, meta: 4600 },
];

const breakdownData = [
  { name: "Salário Líquido", value: 4500 },
  { name: "Impostos", value: 1200 },
  { name: "Benefícios", value: 1200 },
  { name: "Auxílios", value: 400 },
  { name: "Previdência", value: 300 },
];

export function PayrollCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="font-bold mb-2">Evolução Salarial e Benefícios</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={evolutionData}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="usuario" name="Você" stroke="#34d399" strokeWidth={3} />
            <Line type="monotone" dataKey="mercado" name="Mercado" stroke="#60a5fa" strokeDasharray="4 2" />
            <Line type="monotone" dataKey="meta" name="Meta" stroke="#fbbf24" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
        <div className="font-bold mb-2">Distribuição do Holerite</div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={breakdownData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name }) => name}
            >
              {breakdownData.map((entry, idx) => (
                <Cell key={entry.name} fill={pastelColors[idx % pastelColors.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 