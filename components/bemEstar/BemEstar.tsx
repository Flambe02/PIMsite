"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import useBemEstar, { BemEstarEntry, BemEstarType } from "@/hooks/useBemEstar";
import Link from "next/link";
import React from "react";

interface BemEstarProps {
  userId: string | null;
  employmentStatus: "PJ" | "CLT" | string;
}

const ORDER: BemEstarType[] = [
  "conges",
  "pass_gym",
  "sante",
  "sante_mentale",
  "equilibre_wt",
  "psychologie",
  "carte_culture",
];

const LABELS: Record<BemEstarType, string> = {
  conges: "Férias Restantes",
  pass_gym: "Pass Academia / Bem-Estar",
  sante: "Saúde (IMC)",
  sante_mentale: "Saúde Mental (Estresse)",
  equilibre_wt: "Equilíbrio Vida-Trabalho",
  psychologie: "Apoio Psicológico",
  carte_culture: "Cartão Cultura",
};

const DEFAULT_COMMENT: Record<BemEstarType, string> = {
  conges: "CLT: 30 dias/ano. PJ: não aplicado.",
  pass_gym: "Atividade física melhora bem-estar geral.",
  sante: "Calcule seu IMC para monitorar saúde.",
  sante_mentale: "Avalie seu nível de stress regularmente.",
  equilibre_wt: "Controle horas extras para evitar burnout.",
  psychologie: "Acesso confidencial a um psicólogo.",
  carte_culture: "Incentivo cultural: shows, livros, cinema.",
};

const ICON = (status: string) => {
  if (status.match(/offert|sim|✓/i)) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  if (status.match(/⚠|prudence|à renseigner/i)) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  return <XCircle className="w-4 h-4 text-red-500" />;
};

export default function BemEstar({ userId, employmentStatus }: BemEstarProps) {
  const { data, loading } = useBemEstar(userId);

  // Transform array into map for quick lookup
  const map: Record<BemEstarType, BemEstarEntry | undefined> = {} as any;
  data?.forEach((e) => (map[e.type] = e));

  // Determine conformité NR-1
  const psych = map["psychologie"]?.status_value?.match(/offert|sim|✓/i);
  const stress = map["sante_mentale"]?.status_value && !map["sante_mentale"].status_value.match(/na|❌/i);
  const nr1Ok = psych && stress;

  const rows = ORDER.map((type) => {
    let entry = map[type];

    // Spécificité : Congés payés si PJ
    if (!entry && type === "conges" && employmentStatus === "PJ") {
      return {
        type,
        label: LABELS[type],
        status: "N/A",
        comment: "PJ não possui férias remuneradas garantidas por lei.",
        action: null,
      };
    }

    if (!entry) {
      return {
        type,
        label: LABELS[type],
        status: "❌",
        comment: DEFAULT_COMMENT[type] || "",
        action: null,
      };
    }

    return {
      type,
      label: LABELS[type],
      status: entry.status_value,
      comment: entry.comment,
      action: entry.action_link,
    };
  });

  // Pagination setup: 3 per page
  const PER_PAGE = 3;
  const [page, setPage] = React.useState(0);
  const totalPages = Math.ceil(rows.length / PER_PAGE);
  const visibleRows = rows.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  // Summary counts
  const totalActivos = rows.filter((r) => r.status.match(/sim|✓|offert/i)).length;

  return (
    <section className="flex flex-col gap-8">
      {/* Block 1: Summary Card */}
      <Card className="shadow-lg border-emerald-100 rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge className={`${employmentStatus === 'PJ' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} px-3 py-1 rounded-full font-bold`}>{employmentStatus || '-'}</Badge>
            <span className="text-sm text-gray-600">{totalActivos} de {rows.length} indicadores ativos</span>
          </div>
          <CardTitle className="text-lg font-bold text-emerald-900">Sua Situação de Bem-Estar</CardTitle>
          <CardDescription className="text-gray-700 max-w-xl">
            {totalActivos > 0 ? `Você possui ${totalActivos} indicadores positivos.` : 'Você não possui indicadores associados ao seu holerite atual.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Block 2: Details Card */}
      <Card className="rounded-2xl shadow-lg border-emerald-100 bg-white/90 backdrop-blur-sm w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Detalhe do Bem-Estar</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-gray-500 mb-4">Carregando…</div>}
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dimensão</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Comentário</TableHead>
                  <TableHead className="sr-only">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow key={row.type}>
                    <TableCell className="font-medium whitespace-nowrap">{row.label}</TableCell>
                    <TableCell className="text-center flex items-center justify-center">{ICON(row.status)} <span className="ml-1">{row.status}</span></TableCell>
                    <TableCell>{row.comment}</TableCell>
                    <TableCell className="text-right">
                      {row.action && (
                        <Link href={row.action} target="_blank" className="text-emerald-600 hover:underline text-sm">
                          Acessar
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden flex flex-col divide-y divide-gray-200">
            {visibleRows.map((row) => (
              <div key={row.type} className="py-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">{row.label}</span>
                  <span className="flex items-center gap-1 text-sm">{ICON(row.status)}{row.status}</span>
                </div>
                <div className="text-gray-600 text-xs">{row.comment}</div>
                {row.action && (
                  <Link href={row.action} target="_blank" className="text-emerald-600 text-xs font-semibold mt-1">
                    Acessar
                  </Link>
                )}
              </div>
            ))}
          </div>
          {/* Pagination dots if more pages */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Página ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full ${idx === page ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                  onClick={() => setPage(idx)}
                />
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2">
            {nr1Ok ? (
              <Badge className="bg-green-100 text-green-800 border border-green-200">✅ Conforme NR-1</Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">⚠ Verifique sua conformidade NR-1</Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Block 3: Aprenda com o PIM */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-lg">Aprenda com o PIM</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white/90 border-emerald-100 shadow rounded-xl hover:-translate-y-1 transition">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="font-bold text-sm text-gray-900">Guia NR-1 completo</span>
              <p className="text-xs text-gray-600">Entenda as exigências de saúde e segurança no trabalho.</p>
              <Link href="/recursos/nr1" className="text-emerald-600 text-xs font-semibold mt-auto">Ler artigo</Link>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-emerald-100 shadow rounded-xl hover:-translate-y-1 transition">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="font-bold text-sm text-gray-900">Calculadora de IMC</span>
              <p className="text-xs text-gray-600">Descubra se seu índice está dentro do ideal.</p>
              <Link href="/simuladores/imc" className="text-emerald-600 text-xs font-semibold mt-auto">Calcular</Link>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-emerald-100 shadow rounded-xl hover:-translate-y-1 transition">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="font-bold text-sm text-gray-900">Dicas de Equilíbrio Vida-Trabalho</span>
              <p className="text-xs text-gray-600">Técnicas para reduzir stress e horas extras.</p>
              <Link href="/recursos/equilibrio" className="text-emerald-600 text-xs font-semibold mt-auto">Ver dicas</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Block 4: Agir */}
      <Card className="shadow-xl border-emerald-100 rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-1">Quer descobrir seu plano de bem-estar ideal?</p>
              <p className="text-gray-600 text-sm">Simule um plano personalizado ou explore o nosso catálogo cultural.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Link href="/simuladores/bem-estar">Simular Meu Plano Ideal</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/catalogo/cultura">Catálogo Cultural</Link>
              </Button>
            </div>
        </CardContent>
      </Card>
    </section>
  );
} 