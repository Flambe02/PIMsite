"use client"

export const dynamic = 'force-dynamic';

import Dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CLTView = Dynamic(() => import("@/components/recursos/CLTView").then(m => m.default), {
  loading: () => <div className="py-12 text-center text-emerald-900">Chargement du guide CLT...</div>,
  ssr: false
});

export default function CLTPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/br/recursos" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Guia CLT</h1>
        <p className="text-gray-600">Entenda como funciona seu holerite e seus direitos como trabalhador CLT.</p>
      </div>
      <CLTView />
    </div>
  );
} 