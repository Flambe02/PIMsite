"use client";
import Dynamic from "next/dynamic";
const SalaryCalculator = Dynamic(() => import("./salary-calculator").then(m => m.SalaryCalculator), {
  loading: () => <div className="py-12 text-center text-blue-900">Chargement de la calculatrice...</div>,
  ssr: false
});
export default function SalaryCalculatorClientWrapper(props: any) {
  return <SalaryCalculator {...props} />;
} 