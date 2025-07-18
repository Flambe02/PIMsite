"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Investimento } from "@/hooks/useInvestimentos";

interface Props {
  status: "PJ" | "CLT" | string;
  investimentos: Investimento[];
}

const statusColors: Record<string, string> = {
  PJ: "bg-blue-100 text-blue-800",
  CLT: "bg-green-100 text-green-800",
};

export default function Investimentos({ status, investimentos }: Props) {
  const ativos = investimentos.length;
  const resumo = ativos === 0 ? "Nenhum investimento detectado." : `Você possui ${ativos} investimento ativo.`;

  return (
    <section className="flex flex-col gap-8">
      {/* En-tête */}
      <Card className="shadow-lg border-emerald-100 rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge className={`${statusColors[status] || "bg-gray-100 text-gray-800"} px-3 py-1 rounded-full font-bold`}>{status}</Badge>
            <span className="text-sm text-gray-600">{ativos} de 1 classe de ativos identificada</span>
          </div>
          <CardTitle className="text-lg font-bold text-emerald-900">Sua Situação de Investimentos</CardTitle>
          <CardDescription className="text-gray-700 max-w-xl">{resumo}</CardDescription>
        </CardHeader>
      </Card>

      {/* Tableau conditionnel */}
      {ativos > 0 ? (
        <Card className="shadow-lg border-emerald-100 rounded-2xl overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Detalhe dos Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table aria-label="Tabela de investimentos">
              <TableHeader>
                <TableRow>
                  <TableHead>Classe de Ativo</TableHead>
                  <TableHead>Montante</TableHead>
                  <TableHead>Rendimento Estimado</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investimentos.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium whitespace-nowrap">Previdência Privada</TableCell>
                    <TableCell>R$ {Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{inv.yield_pct ? `${inv.yield_pct.toFixed(1)} %` : '—'}</TableCell>
                    <TableCell>{inv.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-gray-600 text-sm">Nenhum investimento detectado.</div>
      )}

      {/* Aprenda com o PIM */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-lg">Aprenda com o PIM</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white/90 border-emerald-100 shadow rounded-xl hover:-translate-y-1 transition">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="font-bold text-sm text-gray-900">Investimentos Sem Risco</span>
              <p className="text-xs text-gray-600">Entenda Poupança e CDB antes de investir.</p>
              <Link href="/recursos/poupanca-cdb" className="text-emerald-600 text-xs font-semibold mt-auto">Ler artigo</Link>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-emerald-100 shadow rounded-xl hover:-translate-y-1 transition">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="font-bold text-sm text-gray-900">Ações & ETFs</span>
              <p className="text-xs text-gray-600">Aprenda os fundamentos da Bolsa.</p>
              <Link href="/recursos/acoes-etf" className="text-emerald-600 text-xs font-semibold mt-auto">Ler artigo</Link>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-emerald-100 shadow rounded-xl hover:-translate-y-1 transition">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="font-bold text-sm text-gray-900">Criptomoedas</span>
              <p className="text-xs text-gray-600">Volatilidade e como diversificar.</p>
              <Link href="/recursos/crypto" className="text-emerald-600 text-xs font-semibold mt-auto">Saiba mais</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agir */}
      <Card className="shadow-xl border-emerald-100 rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900 mb-1">Pronto para otimizar seus investimentos?</p>
            <p className="text-gray-600 text-sm">Simule uma carteira diversificada ou explore corretoras parceiras.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Link href="/simulador/alocacao">Simular Alocação</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/guia-corretoras">Guia de Corretoras</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
} 