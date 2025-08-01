"use client"

export const dynamic = 'force-dynamic';

import Dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const AutonomoView = Dynamic(() => import("@/components/recursos/AutonomoView").then(m => m.default), {
  loading: () => <div className="py-12 text-center text-emerald-900">Chargement du guide Autônomo...</div>,
  ssr: false
});

export default function AutonomoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/br/recursos" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Guia Autônomo</h1>
        <p className="text-gray-600">Entenda como funcionam os impostos e o RPA para autônomos.</p>
      </div>
      <AutonomoView />
    </div>
  );
} 