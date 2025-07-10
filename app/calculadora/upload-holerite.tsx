import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info, UploadCloud, FileText, Loader2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

export default function UploadHolerite() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const onAnalyze = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200); // Simule l'analyse
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6">
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