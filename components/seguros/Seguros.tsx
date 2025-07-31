"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import useSeguros, { SeguroEntry } from "@/hooks/useSeguros";
import Link from "next/link";

interface SegurosProps {
  userId: string | null;
  employmentStatus: "PJ" | "CLT" | string;
  holeriteRaw?: any;
}

const LABELS: Record<SeguroEntry['type'], string> = {
  saude: "Seguro de Saúde",
  vida: "Seguro de Vida",
  acidentes: "Seguro de Acidentes Pessoais",
  odontologico: "Seguro Odontológico",
  rcp: "Seguro de Responsabilidade Civil",
  pet: "Seguro para Pet",
};

const ICON = (detected: boolean) => {
  return detected ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />;
};

export default function Seguros({ userId, employmentStatus, holeriteRaw }: SegurosProps) {
  const { data: seguros = [], isLoading } = useSeguros(userId, holeriteRaw);

  const [page, setPage] = React.useState(0);
  const PER_PAGE = 3;
  const totalPages = Math.ceil((seguros ? seguros.length : 0) / PER_PAGE);
  const visibleSeguros = seguros.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const totalActivos = Array.isArray(seguros) ? seguros.filter((s) => s.detected).length : 0;

  // Mock data for educational cards and actions, to be replaced later
  const educationalContent = [
    { title: "Guia Completo de Seguros", description: "Entenda os diferentes tipos de seguro e qual o melhor para você.", link: "/recursos/guia-seguros", linkText: "Ler artigo" },
    { title: "Simulador de Pacote de Seguros", description: "Descubra o custo-benefício de agrupar seus seguros.", link: "/simulador/pacote-seguros", linkText: "Simular" },
    { title: "Glossário de Seguros", description: "Desmistifique os termos técnicos do mundo dos seguros.", link: "/recursos/glossario-seguros", linkText: "Consultar" },
  ];

  return (
    <section className="flex flex-col gap-8">
      {/* Block 1: Summary Card */}
      <Card className="shadow-lg border-blue-100 rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge className={`${employmentStatus === 'PJ' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} px-3 py-1 rounded-full font-bold`}>{employmentStatus || '-'}</Badge>
            <span className="text-sm text-gray-600">{totalActivos} de {seguros ? seguros.length : 0} seguros identificados</span>
          </div>
          <CardTitle className="text-lg font-bold text-blue-900">Sua Cobertura de Seguros</CardTitle>
          <CardDescription className="text-gray-700 max-w-xl">
            {totalActivos > 0 ? `Você possui ${totalActivos} seguros ativos.` : 'Nenhuma apólice de seguro identificada no seu perfil.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Block 2: Details Card */}
      <Card className="rounded-2xl shadow-lg border-blue-100 bg-white/90 backdrop-blur-sm w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Detalhe dos Seguros</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-gray-500 mb-4">Carregando…</div>}
          
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Seguro</TableHead>
                  <TableHead className="text-center">Detectado</TableHead>
                  <TableHead>Comentário Educativo</TableHead>
                  <TableHead className="sr-only">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleSeguros.map((seguro) => (
                  <TableRow key={seguro.id}>
                    <TableCell className="font-medium whitespace-nowrap">{LABELS[seguro.type]}</TableCell>
                    <TableCell className="text-center flex items-center justify-center">{ICON(seguro.detected)}</TableCell>
                    <TableCell>{seguro.comment}</TableCell>
                    <TableCell className="text-right">
                      {seguro.link && (
                        <Link href={seguro.link} target="_blank" className="text-blue-600 hover:underline text-sm">
                          Ver Detalhes
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Accordion */}
          <div className="sm:hidden flex flex-col divide-y divide-gray-200">
            {visibleSeguros.map((seguro) => (
              <div key={seguro.id} className="py-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">{LABELS[seguro.type]}</span>
                  <span className="flex items-center gap-1 text-sm">{ICON(seguro.detected)}</span>
                </div>
                <div className="text-gray-600 text-xs">{seguro.comment}</div>
                {seguro.link && (
                  <Link href={seguro.link} target="_blank" className="text-blue-600 text-xs font-semibold mt-1">
                    Ver Detalhes
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages || 0 }).map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Página ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full ${idx === page ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                  onClick={() => setPage(idx)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Block 3: Aprenda com o PIM */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-lg">Aprenda com o PIM</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {educationalContent.map((item, index) => (
            <Card key={index} className="bg-white/90 border-blue-100 shadow rounded-xl hover:-translate-y-1 transition">
              <CardContent className="p-4 flex flex-col gap-2">
                <span className="font-bold text-sm text-gray-900">{item.title}</span>
                <p className="text-xs text-gray-600">{item.description}</p>
                <Link href={item.link} className="text-blue-600 text-xs font-semibold mt-auto">{item.linkText}</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Block 4: Agir */}
      <Card className="shadow-xl border-blue-100 rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-1">Pronto para otimizar sua proteção?</p>
              <p className="text-gray-600 text-sm">Simule um pacote de seguros ideal ou explore nosso guia de seguradoras parceiras.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href="/simulador/pacote-seguros">Simular Pacote Ideal</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/guia-seguradoras">Guia de Seguradoras</Link>
              </Button>
            </div>
        </CardContent>
      </Card>
    </section>
  );
}
