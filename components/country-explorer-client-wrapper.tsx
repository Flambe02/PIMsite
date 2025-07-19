"use client";
import Dynamic from "next/dynamic";
const CountryExplorer = Dynamic(() => import("./country-explorer").then(m => m.CountryExplorer), {
  loading: () => <div className="py-12 text-center text-emerald-900">Chargement de l’explorateur de pays...</div>,
  ssr: false
});
export default function CountryExplorerClientWrapper(props: any) {
  return <CountryExplorer {...props} />;
} 