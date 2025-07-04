"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";
import { PayslipLines } from "@/components/payslip-lines";
import type { PayslipParsed } from "@/types";

interface Holerite {
  id: string;
  user_id: string;
  nome: string;
  empresa: string;
  salario_liquido: number;
  raw_text: string;
  structured_data: PayslipParsed;
  created_at: string;
}

export default function HoleriteDetailPage() {
  const params = useParams();
  const { supabase, session } = useSupabase();
  const [holerite, setHolerite] = useState<Holerite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHolerite();
  }, []);

  async function loadHolerite() {
    if (!params.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (!session) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("holerites")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Bulletin non trouvé");

      setHolerite(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar bulletin");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8 text-emerald-600" />
            <span className="ml-2 text-emerald-700">Carregando bulletin...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (!holerite) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertDescription>Bulletin não encontrado</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const structured = holerite.structured_data;

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-emerald-900">
            Détail du Bulletin
          </h1>
        </div>

        {/* Informations principales */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-emerald-900">
              {structured?.empresa?.nome || holerite.empresa}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Employeur */}
            {structured?.empresa && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-2">Empresa</h3>
                  <p className="text-sm text-emerald-700">
                    <strong>Nome:</strong> {structured.empresa.nome}
                  </p>
                  {structured.empresa.cnpj && (
                    <p className="text-sm text-emerald-700">
                      <strong>CNPJ:</strong> {structured.empresa.cnpj}
                    </p>
                  )}
                  {structured.empresa.endereco && (
                    <p className="text-sm text-emerald-700">
                      <strong>Endereço:</strong> {structured.empresa.endereco}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Salarié */}
            {structured?.colaborador && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Colaborador</h3>
                  <p className="text-sm text-blue-700">
                    <strong>Nome:</strong> {structured.colaborador.nome}
                  </p>
                  {structured.colaborador.cpf && (
                    <p className="text-sm text-blue-700">
                      <strong>CPF:</strong> {structured.colaborador.cpf}
                    </p>
                  )}
                  {structured.colaborador.cargo && (
                    <p className="text-sm text-blue-700">
                      <strong>Cargo:</strong> {structured.colaborador.cargo}
                    </p>
                  )}
                  {structured.colaborador.admissao && (
                    <p className="text-sm text-blue-700">
                      <strong>Admissão:</strong> {structured.colaborador.admissao}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Période */}
            {structured?.folha_pagamento?.mes_referencia && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Período</h3>
                <p className="text-sm text-purple-700">
                  {structured.folha_pagamento.mes_referencia}
                </p>
              </div>
            )}

            {/* Totaux */}
            {structured?.folha_pagamento?.totaux && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-orange-800 mb-2">Totais</h3>
                  <p className="text-sm text-orange-700">
                    <strong>Vencimentos:</strong> R$ {structured.folha_pagamento.totaux.total_venc.toFixed(2)}
                  </p>
                  <p className="text-sm text-orange-700">
                    <strong>Descontos:</strong> R$ {structured.folha_pagamento.totaux.total_desc.toFixed(2)}
                  </p>
                  <p className="text-sm text-orange-700 font-semibold">
                    <strong>Líquido:</strong> R$ {structured.folha_pagamento.totaux.salario_liquido.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Bases */}
            {structured?.folha_pagamento?.bases && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Bases de Cálculo</h3>
                  {structured.folha_pagamento.bases.base_inss && (
                    <p className="text-sm text-gray-700">
                      <strong>Base INSS:</strong> R$ {structured.folha_pagamento.bases.base_inss.toFixed(2)}
                    </p>
                  )}
                  {structured.folha_pagamento.bases.base_fgts && (
                    <p className="text-sm text-gray-700">
                      <strong>Base FGTS:</strong> R$ {structured.folha_pagamento.bases.base_fgts.toFixed(2)}
                    </p>
                  )}
                  {structured.folha_pagamento.bases.valor_fgts && (
                    <p className="text-sm text-gray-700">
                      <strong>FGTS:</strong> R$ {structured.folha_pagamento.bases.valor_fgts.toFixed(2)}
                    </p>
                  )}
                  {structured.folha_pagamento.bases.base_irrf && (
                    <p className="text-sm text-gray-700">
                      <strong>Base IRRF:</strong> R$ {structured.folha_pagamento.bases.base_irrf.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Détails des lignes */}
            {structured?.folha_pagamento?.itens && structured.folha_pagamento.itens.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-sm mb-2 text-gray-800">Détails des lignes</h3>
                <PayslipLines itens={structured.folha_pagamento.itens} />
              </div>
            )}

            {/* Texte brut (optionnel, pour debug) */}
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-semibold text-indigo-600">
                Voir le texte OCR brut (debug)
              </summary>
              <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {holerite.raw_text}
                </pre>
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 