"use client";
import Dynamic from "next/dynamic";
const BenefitComparator = Dynamic(() => import("./BenefitComparator").then(m => m.BenefitComparator), {
  loading: () => <div className="py-12 text-center text-emerald-900">Chargement du comparateur...</div>,
  ssr: false
});
export default function BenefitComparatorClientWrapper(props: any) {
  return <BenefitComparator {...props} />;
} 