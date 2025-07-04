"use client";

import CLTView from "@/components/recursos/CLTView";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CLTPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/recursos" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition">
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