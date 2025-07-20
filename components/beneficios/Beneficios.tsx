"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HelpCircle, ExternalLink, BookOpen, Video, BarChart3 } from "lucide-react";
import Link from "next/link";
import React from "react";

export type Beneficio = {
  tipo: string;
  detectado: boolean;
  comentario: string;
  actionLink: string;
};

export interface BeneficiosProps {
  userStatus: "PJ" | "CLT" | "Autônomo" | "Aposentado" | string;
  beneficios: Beneficio[];
  onSimularPacote?: () => void;
}

const statusColors: Record<string, string> = {
  PJ: "bg-blue-100 text-blue-800",
  CLT: "bg-green-100 text-green-800",
  Autônomo: "bg-purple-100 text-purple-800",
  Aposentado: "bg-gray-100 text-gray-800",
};

// Filtre certains bénéfices si non pertinents pour le profil
function filterByStatus(items: Beneficio[], status: string): Beneficio[] {
  if (status === "PJ") {
    return items.filter((b) => b.tipo !== "FGTS");
  }
  return items;
}

export default function Beneficios({ userStatus, beneficios, onSimularPacote }: BeneficiosProps) {
  const filtered = React.useMemo(() => filterByStatus(beneficios, userStatus), [beneficios, userStatus]);
  const active = filtered.filter((b) => b.detectado);

  const resumoFrase = React.useMemo(() => {
    if (active.length === 0) return "Aucun bénéfice détecté dans votre dernière feuille de paie. Téléchargez un nouveau holerite pour mettre à jour vos bénéfices.";
    if (active.length === 1) return `Vous avez 1 bénéfice actif: ${active[0].tipo}.`;
    if (active.length === 2) return `Vous avez 2 bénéfices actifs: ${active[0].tipo} et ${active[1].tipo}.`;
    return `Vous avez ${active.length} bénéfices actifs.`;
  }, [active]);

  return (
    <section className="flex flex-col gap-8">
      {/* Bloc Situação */}
      <Card className="shadow-lg border-emerald-100 rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge className={`${statusColors[userStatus] || "bg-gray-100 text-gray-800"} px-3 py-1 rounded-full font-bold`}>{userStatus}</Badge>
            <span className="text-sm text-gray-600">{active.length} de {filtered.length} benefícios ativos</span>
          </div>
          <CardTitle className="text-lg font-bold text-emerald-900">Sua Situação de Benefícios</CardTitle>
          <CardDescription className="text-gray-700 max-w-xl">{resumoFrase}</CardDescription>
        </CardHeader>
        
        {/* Message spécial si aucun bénéfice détecté */}
        {active.length === 0 && (
          <CardContent className="pt-0">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">Aucun bénéfice détecté</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Pour analyser vos bénéfices, téléchargez votre dernière feuille de paie. 
                    PIM détectera automatiquement vos avantages sociaux.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => window.location.href = '/calculadora'}
                  >
                    Télécharger mon holerite
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tableau Benefícios */}
      <Card className="shadow-lg border-emerald-100 rounded-2xl overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Detalhe dos Benefícios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Benefício</TableHead>
                <TableHead className="text-center">Detectado</TableHead>
                <TableHead>Comentário Educativo</TableHead>
                <TableHead className="sr-only">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.tipo}>
                  <TableCell className="font-medium">{b.tipo}</TableCell>
                  <TableCell className="text-center">
                    {b.detectado ? "✅ Sim" : "❌ Não"}
                  </TableCell>
                  <TableCell className="flex gap-2 items-start">
                    <span>{b.detectado ? "Você já possui este benefício — você tem certeza de ter o melhor do mercado?" : b.comentario}</span>
                    <HelpCircle aria-label="Mais informações" className="w-4 h-4 text-gray-400" />
                  </TableCell>
                  <TableCell>
                    <Link href={b.actionLink} target="_blank" className="inline-flex items-center gap-1 text-emerald-600 hover:underline text-sm">
                      Acessar <ExternalLink className="w-3 h-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aprenda com o PIM */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-800 mb-3">Aprenda com o PIM</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/90 border-emerald-100 shadow-lg rounded-2xl hover:-translate-y-1 transition">
            <CardContent className="p-6 flex flex-col gap-3">
              <BookOpen className="w-8 h-8 text-emerald-500" />
              <span className="font-bold text-gray-900">O que são benefícios obrigatórios no Brasil?</span>
              <Link href="/recursos/beneficios-obrigatorios" className="text-emerald-600 hover:underline text-sm">Ler artigo</Link>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-emerald-100 shadow-lg rounded-2xl hover:-translate-y-1 transition">
            <CardContent className="p-6 flex flex-col gap-3">
              <Video className="w-8 h-8 text-emerald-500" />
              <span className="font-bold text-gray-900">Como funciona o vale alimentação?</span>
              <Link href="/recursos/videos/vale-alimentacao" className="text-emerald-600 hover:underline text-sm">Assistir vídeo</Link>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-emerald-100 shadow-lg rounded-2xl hover:-translate-y-1 transition">
            <CardContent className="p-6 flex flex-col gap-3">
              <BarChart3 className="w-8 h-8 text-emerald-500" />
              <span className="font-bold text-gray-900">Vale mais a pena: benefício ou salário direto?</span>
              <Link href="/simuladores/beneficio-vs-salario" className="text-emerald-600 hover:underline text-sm">Testar simulador</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section Agir */}
      <Card className="shadow-xl border-emerald-100 rounded-2xl mt-8">
        <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900 mb-1">Quer descobrir opções de benefícios compatíveis com seu perfil?</p>
            <p className="text-gray-600 text-sm">Compare prestadores ou crie um pacote personalizado.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={onSimularPacote} className="rounded-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
              Simular Pacote Ideal
            </Button>
            <Link href="/guia-beneficios" className="w-full sm:w-auto" passHref>
              <Button variant="outline" className="rounded-full px-6 py-3 w-full sm:w-auto">
                Guia das Empresas de Benefícios
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
} 