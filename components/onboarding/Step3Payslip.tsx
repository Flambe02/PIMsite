import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayslipUpload } from "@/components/payslip-upload"; // On peut le réutiliser si adapté
import { Progress } from "@/components/ui/progress";

interface Step3PayslipProps {
  onBack: () => void;
  onFinish: (data: { mode: 'upload' | 'manual'; payslipFile?: File | null; bruto?: string; liquido?: string; vr?: string }) => void;
}

export default function Step3Payslip({ onBack, onFinish }: Step3PayslipProps) {
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [bruto, setBruto] = useState("");
  const [liquido, setLiquido] = useState("");
  const [vr, setVr] = useState("");
  const [payslipFile, setPayslipFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isManualValid = bruto.trim() && liquido.trim();
  const isUploadValid = !!payslipFile;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6">
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-full">
        <Button
          variant={mode === 'upload' ? 'default' : 'ghost'}
          onClick={() => setMode('upload')}
          className="w-full rounded-full"
        >
          Fazer upload
        </Button>
        <Button
          variant={mode === 'manual' ? 'default' : 'ghost'}
          onClick={() => setMode('manual')}
          className="w-full rounded-full"
        >
          Preencher manualmente
        </Button>
      </div>

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Progress value={60} className="w-2/3 mb-4" />
          <span className="text-blue-700 text-base font-medium mt-2">Analyse du fichier en cours…</span>
        </div>
      ) : (
        <>
          {mode === 'upload' ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
               <input
                type="file"
                id="payslip-upload-input"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => setPayslipFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Label htmlFor="payslip-upload-input" className="cursor-pointer">
                <div className="text-blue-600 font-semibold mb-2">Clique para enviar</div>
                <div className="text-xs text-gray-500">PDF, PNG, JPG até 10MB</div>
              </Label>
              {payslipFile && (
                <div className="mt-4 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                  {payslipFile.name}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bruto">Salário bruto</Label>
                <Input id="bruto" type="number" placeholder="Ex: 5000" value={bruto} onChange={e => setBruto(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="liquido">Salário líquido</Label>
                <Input id="liquido" type="number" placeholder="Ex: 4000" value={liquido} onChange={e => setLiquido(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vr">Vale Refeição (opcional)</Label>
                <Input id="vr" type="number" placeholder="Ex: 500" value={vr} onChange={e => setVr(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={onBack} className="w-full">
              Anterior
            </Button>
            <Button
              onClick={() => onFinish({ mode, payslipFile, bruto, liquido, vr })}
              disabled={mode === 'upload' ? !isUploadValid : !isManualValid}
              className="w-full"
            >
              Terminar
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 