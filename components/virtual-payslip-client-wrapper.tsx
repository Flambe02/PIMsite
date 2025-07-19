"use client";
import Dynamic from "next/dynamic";
const VirtualPayslip = Dynamic(() => import("./virtual-payslip").then(m => m.VirtualPayslip), {
  loading: () => <div className="py-12 text-center text-blue-900">Chargement du holerite...</div>,
  ssr: false
});
export default function VirtualPayslipClientWrapper(props: any) {
  return <VirtualPayslip {...props} />;
} 