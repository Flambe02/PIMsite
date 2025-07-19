"use client";
import Dynamic from "next/dynamic";
const SalaryCalculatorEnhanced = Dynamic(() => import("./salary-calculator-enhanced").then(m => m.SalaryCalculatorEnhanced), {
  loading: () => <div className="py-12 text-center text-blue-900">Chargement de la calculatrice avancée...</div>,
  ssr: false
});
export default function SalaryCalculatorEnhancedClientWrapper(props: any) {
  return <SalaryCalculatorEnhanced {...props} />;
} 