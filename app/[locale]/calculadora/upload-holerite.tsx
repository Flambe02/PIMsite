import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info, UploadCloud, FileText, Loader2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRequireSession } from "@/components/supabase-provider";

const pastel = {
  green: "#B8E4C7",
  aqua: "#AEE9E1",
  offwhite: "#F8FAF7",
  yellow: "#FFF9D6",
  pink: "#FFE3E3",
};

const checklist = [
  "Diagnóstico do salário",
  "Comparação com o mercado",
  "Sugestão de economia",
  "Avaliação dos benefícios",
  "Possibilidade de portabilidade",
];

export default function UploadHolerite({ onResult }: { onResult?: (result: any) => void }) {
  useRequireSession(`/calculadora/upload-holerite`);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (f: File) => {
    if (["application/pdf", "image/png", "image/jpeg"].includes(f.type)) {
      setFile(f);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => setFile(null);

  const onAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const controller = new AbortController();
    setAbortController(controller);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/process-payslip', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        credentials: 'include',
      });
      console.log('Réponse brute:', res);
      const data = await res.json();
      console.log('Données reçues:', data);
      setLoading(false);
      setAbortController(null);
      if (data.success && onResult) {
        // --- ENRICHISSEMENT PJ ---
        let analysis = data.analysisData.analysis || {};
        const raw = data.analysisData;
        const nowYear = new Date().getFullYear();
        let periodYear = null;
        if (raw.period) {
          const match = String(raw.period).match(/(\d{4})/);
          if (match) periodYear = parseInt(match[1]);
        }
        // 1. Warning année différente
        if (periodYear && periodYear !== nowYear) {
          analysis.optimization_opportunities = analysis.optimization_opportunities || [];
          analysis.optimization_opportunities.push(`Atenção: Este holerite é de ${periodYear}. Alguns valores (salário mínimo, INSS, faixas de impostos) podem não ser comparáveis com as regras atuais.`);
        }
        // 2. Analyse pro-labore, INSS, autres prélèvements
        if (raw.profile_type === 'PJ') {
          analysis.optimization_opportunities = analysis.optimization_opportunities || [];
          // Normalização helper (remove acentos e pontuações)
          const normalize = (txt: string) =>
            txt
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
              .replace(/[\s\-]/g, ''); // remove espaços e hífens

          // Honorário pro-labore (detecção mais robusta, insensível a acentos/hífens)
          const hasProLabore = (raw.earnings || []).some((e: any) => {
            const desc = normalize(String(e.description || ''));
            return desc.includes('prolabore');
          });
          if (!hasProLabore) {
            analysis.optimization_opportunities.push('Atenção: Não foi identificado honorário pro-labore. Verifique se está corretamente declarado.');
          }
          // INSS sobre pro-labore (busca genérica por "inss")
          const hasINSS = (raw.deductions || []).some((d: any) => {
            const desc = normalize(String(d.description || ''));
            return desc.includes('inss');
          });
          if (!hasINSS) {
            analysis.optimization_opportunities.push('Atenção: Não foi identificado desconto de INSS sobre o pro-labore. Confirme se a contribuição está correta.');
          }
          // Autres prélèvements
          const hasIRPJ = (raw.deductions || []).some((d:any) => String(d.description).toLowerCase().includes('irpj'));
          if (!hasIRPJ) {
            analysis.optimization_opportunities.push('Avalie se há incidência de IRPJ ou outros tributos sobre o pro-labore.');
          }
          // 3. Efficacité financière
          let eficiencia = null;
          if (raw.gross_salary && raw.net_salary) {
            eficiencia = (raw.net_salary / raw.gross_salary) * 100;
            if (eficiencia < 75) {
              analysis.optimization_opportunities.push('Eficiência abaixo de 75%: Sua estrutura fiscal pode ser otimizada para reduzir descontos e aumentar o valor líquido recebido.');
            }
          }
          // 4. Recommandations PJ personnalisées (toujours ajouter)
          const recosPJ = [
            'Simule diferentes formas de retirada (pro labore vs distribuição de lucros) para pagar menos impostos.',
            'Considere contratar um plano de saúde empresarial dedutível para reduzir a base tributária.',
            'Avalie contribuir para uma previdência privada dedutível (PGBL) para otimizar sua aposentadoria e reduzir IRPJ.',
            'Se sua empresa for elegível, avalie o Simples Nacional ou Lucro Presumido para simplificar e possivelmente reduzir a carga tributária.'
          ];
          for (const reco of recosPJ) {
            if (!analysis.optimization_opportunities.includes(reco)) {
              analysis.optimization_opportunities.push(reco);
            }
          }
          // 5. Infobulle explicative efficacité
          analysis.efficiency_tooltip = 'Eficiência representa quanto do seu salário bruto você realmente recebe. Uma eficiência abaixo de 75% pode indicar excesso de descontos ou estrutura fiscal ineficiente.';
        }
        // --- FIN ENRICHISSEMENT PJ ---
        onResult({
          salarioBruto: data.analysisData.gross_salary,
          salarioLiquido: data.analysisData.net_salary,
          descontos: (data.analysisData.gross_salary || 0) - (data.analysisData.net_salary || 0),
          eficiencia: data.analysisData.gross_salary && data.analysisData.net_salary ? ((data.analysisData.net_salary / data.analysisData.gross_salary) * 100).toFixed(1) : null,
          insights: [
            { label: "Resumo", value: analysis.summary || "" },
            ...((analysis.optimization_opportunities || []).map((v: string) => ({ label: "Oportunidade", value: v })))
          ],
          raw: { ...data.analysisData, analysis }
        });
      } else {
        // Gestion d'erreur OCR détaillée
        let msg = data.error || 'Erreur lors de l\'analyse.';
        if (msg.includes('E101')) {
          msg = 'Le service OCR a mis trop de temps à répondre (timeout). Essayez avec un fichier plus simple ou plus petit.';
        } else if (msg.toLowerCase().includes('ocr')) {
          msg = 'Erreur lors de l\'extraction du texte du holerite. Vérifiez que le fichier est lisible et non protégé.';
        }
        toast({ title: "Erreur d'analyse", description: msg + (data.details ? `\nDétails: ${data.details}` : ''), variant: "destructive" });
        setError(msg + (data.details ? `\nDétails: ${data.details}` : ''));
        console.error('Erreur OCR/IA côté client:', msg, data.details);
      }
    } catch (err: any) {
      setLoading(false);
      setAbortController(null);
      if (err.name === 'AbortError') {
        toast({ title: "Analyse annulée", description: "Le process a été stoppé par l'utilisateur.", variant: "destructive" });
      } else {
        toast({ title: "Erreur réseau ou serveur", description: String(err), variant: "destructive" });
        console.error('Erreur dans onAnalyze:', err);
      }
    }
  };

  const onStop = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false);
      setAbortController(null);
    }
  };

  // Helper global pour éviter les crashs JSON.parse
  function _safeJsonParse(str: string) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6">
      {/* Loader global */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50 rounded-2xl">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-2" />
          <div className="text-emerald-700 font-medium mb-4">Analyse en cours…</div>
          <Button variant="destructive" onClick={onStop}>Arrêter</Button>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur OCR</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <Card className="rounded-2xl shadow-xl border-0 bg-[var(--offwhite)]" style={{ background: pastel.offwhite }}>
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">Faça upload do seu holerite e receba 5 insights personalizados</h1>
            <p className="text-emerald-700 text-base md:text-lg mb-2">Entenda seu salário, descontos e benefícios em 2 minutos.</p>
          </div>
          {/* Zone d'upload */}
          {!file && (
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-xl bg-white hover:bg-emerald-50 transition p-8 cursor-pointer text-center relative"
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud className="w-12 h-12 text-emerald-400 mb-2" />
              <div className="font-semibold text-emerald-900">Arraste e solte seu holerite aqui</div>
              <div className="text-emerald-700 text-sm mb-2">ou clique para selecionar um arquivo</div>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} aria-label="Informação sobre formatos aceitos">
                        <Info className="w-5 h-5 text-emerald-300" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="text-xs">
                      Aceita PDF, PNG ou JPG. Seus dados são privados.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
          {/* Preview du fichier */}
          {file && (
            <div className="flex flex-col items-center gap-3 bg-white rounded-xl p-6 border border-emerald-100 relative">
              <FileText className="w-10 h-10 text-emerald-400" />
              <div className="text-emerald-900 font-medium text-center">{file.name}</div>
              <Button variant="outline" size="sm" className="rounded-full px-4" onClick={removeFile}>
                <XCircle className="w-4 h-4 mr-1" /> Substituir
              </Button>
            </div>
          )}
          {/* CTA */}
          <Button
            className="w-full py-3 text-lg font-bold rounded-xl bg-emerald-400 hover:bg-emerald-500 text-white shadow-md transition disabled:opacity-60"
            disabled={!file || loading}
            onClick={onAnalyze}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" /> Analisando...
              </span>
            ) : (
              "Analisar agora"
            )}
          </Button>
          {/* Checklist */}
          <div className="mt-4 bg-[var(--aqua)]/30 rounded-xl p-4 flex flex-col gap-2">
            <div className="font-semibold text-emerald-900 mb-1">Você receberá:</div>
            <ul className="space-y-1">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-2 text-emerald-800 text-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 