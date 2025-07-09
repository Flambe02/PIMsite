"use client";
import { useBenefitComparison, UserProfile } from "@/hooks/useBenefitComparison";
import { BarChart2 } from "lucide-react";

interface BenefitComparatorProps {
  profile: UserProfile;
}

export function BenefitComparator({ profile }: BenefitComparatorProps) {
  const data = useBenefitComparison(profile);

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BarChart2 className="w-6 h-6 text-emerald-500" />
        Comparateur d’avantages
      </h2>
      <table className="w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-gray-600">
            <th>Avantage</th>
            <th className="text-center">Menor</th>
            <th className="text-center">Média</th>
            <th className="text-center">Maior</th>
            <th className="text-center">Vous</th>
            <th className="text-center">Écart</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.type} className="bg-emerald-50 hover:bg-emerald-100 transition">
              <td className="font-medium py-2">{row.label}</td>
              <td className="text-center">{row.menor} {row.unit}</td>
              <td className="text-center font-bold">{row.media} {row.unit}</td>
              <td className="text-center">{row.maior} {row.unit}</td>
              <td className="text-center font-semibold text-emerald-700">
                {row.userValue} {row.unit}
              </td>
              <td className={`text-center font-bold ${row.diffToMedia < 0 ? "text-red-600" : "text-green-700"}`}>
                {row.diffToMedia > 0 ? "+" : ""}
                {row.diffToMedia} {row.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-4">
        Source: Swile 2025. Les valeurs sont des moyennes de marché par secteur.
      </p>
    </div>
  );
} 