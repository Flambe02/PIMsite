"use client";

import EstagiarioView from "@/components/recursos/EstagiarioView";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EstagiarioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/recursos" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Guia Estagiário</h1>
        <p className="text-gray-600">Entenda como funciona a bolsa-auxílio e seus direitos como estagiário.</p>
      </div>
      <EstagiarioView />
    </div>
  );
} 