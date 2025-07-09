"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Loader2, UploadCloud, FileText, Edit, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { parseWithOCRSpaceEnhanced } from "@/lib/ocr";
import PayslipPreview from "@/components/payslip-preview";
import AnalysisDisplay from "@/components/AnalysisDisplay";
import { useToast } from "@/components/ui/use-toast";

const initialFields = {
  nome: "",
  empresa: "",
  salario_bruto: "",
  salario_liquido: "",
  inss: "",
  irrf: "",
  data_pagamento: "",
  raw_text: "",
};

async function parseWithOCRSpace(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", "por");
  formData.append("isOverlayRequired", "false");
  formData.append("OCREngine", "2");
  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: { apikey: "helloworld" },
    body: formData,
  });
  const data = await res.json();
  if (data.IsErroredOnProcessing) throw new Error(data.ErrorMessage?.[0] || "Erro de OCR");
  return data.ParsedResults?.[0]?.ParsedText || "";
}

function extractFields(parsedText: string) {
  return {
    nome: /Nome[:\-]?\s*(.+)/i.exec(parsedText)?.[1] || "",
    empresa: /Empresa[:\-]?\s*(.+)/i.exec(parsedText)?.[1] || "",
    salario_bruto: /Sal[aá]rio Bruto[:\-]?\s*R?\$?\s*([\d.,]+)/i.exec(parsedText)?.[1] || "",
    salario_liquido: /L[ií]quido[:\-]?\s*R?\$?\s*([\d.,]+)/i.exec(parsedText)?.[1] || "",
    inss: /INSS[:\-]?\s*R?\$?\s*([\d.,]+)/i.exec(parsedText)?.[1] || "",
    irrf: /IRRF[:\-]?\s*R?\$?\s*([\d.,]+)/i.exec(parsedText)?.[1] || "",
    data_pagamento: /Data[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i.exec(parsedText)?.[1] || "",
    raw_text: parsedText,
  };
}

export default function CalculadoraClient({ user }: { user: any }) {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState(initialFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  // Stepper header
  const Stepper = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1,2,3].map(n => (
        <div key={n} className={`w-8 h-2 rounded-full transition-all duration-200 ${step === n ? 'bg-emerald-400 shadow-md' : 'bg-emerald-100'}`}></div>
      ))}
      <span className="ml-4 text-xs text-gray-500">Etapa {step} de 3</span>
    </div>
  );

  // Step 1: Upload
  const UploadStep = () => (
    <div className="flex flex-col gap-6 items-center">
      <h2 className="text-xl font-bold text-emerald-900">Envie seu holerite</h2>
      <p className="text-emerald-700 text-center">PDF, PNG ou JPG. Seus dados são privados.</p>
      {!file && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-xl bg-white hover:bg-emerald-50 transition p-8 cursor-pointer text-center w-full max-w-md">
          <UploadCloud className="w-12 h-12 text-emerald-400 mb-2" />
          <span className="font-semibold text-emerald-900">Arraste e solte seu holerite aqui</span>
          <span className="text-emerald-700 text-sm mb-2">ou clique para selecionar um arquivo</span>
          <Input type="file" accept="application/pdf,image/png,image/jpeg" className="hidden" onChange={e => {
            if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
          }} />
        </label>
      )}
      {file && (
        <div className="flex flex-col items-center gap-3 bg-white rounded-xl p-6 border border-emerald-100 relative w-full max-w-md">
          <FileText className="w-10 h-10 text-emerald-400" />
          <div className="text-emerald-900 font-medium text-center">{file.name}</div>
          <Button variant="outline" size="sm" className="rounded-full px-4" onClick={()=>setFile(null)}>
            Substituir
          </Button>
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <Button className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-xl py-3" disabled={!file || loading} onClick={handleOcr}>
          {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
          Analisar com IA
        </Button>
        <Button variant="ghost" className="w-full text-emerald-700 underline" onClick={()=>{setFields(initialFields); setStep(2); setEditing(true);}} disabled={loading}>
          Pular OCR e preencher manualmente
        </Button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );

  // Step 2: Confirmação dos Dados
  const ConfirmStep = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-emerald-900 text-center">Confirme seus dados</h2>
      
      <section className="grid md:grid-cols-12 gap-6">
        {/* Aperçu à gauche (7/12) */}
        <div className="md:col-span-7">
          <PayslipPreview url={previewUrl} />
        </div>

        {/* Formulaire à droite (5/12) */}
        <div className="md:col-span-5">
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <InputField label="Nome do funcionário" value={fields.nome} onChange={v=>setFields(f=>({...f, nome:v}))} disabled={!editing} />
            <InputField label="Nome da empresa" value={fields.empresa} onChange={v=>setFields(f=>({...f, empresa:v}))} disabled={!editing} />
            <InputField label="Salário bruto (R$)" value={fields.salario_bruto} onChange={v=>setFields(f=>({...f, salario_bruto:v}))} disabled={!editing} />
            <InputField label="Descontos INSS (R$)" value={fields.inss} onChange={v=>setFields(f=>({...f, inss:v}))} disabled={!editing} />
            <InputField label="Descontos IRRF (R$)" value={fields.irrf} onChange={v=>setFields(f=>({...f, irrf:v}))} disabled={!editing} />
            <InputField label="Salário líquido (R$)" value={fields.salario_liquido} onChange={v=>setFields(f=>({...f, salario_liquido:v}))} disabled={!editing} />
            <InputField label="Data de pagamento" value={fields.data_pagamento} onChange={v=>setFields(f=>({...f, data_pagamento:v}))} disabled={!editing} />
            
            {!editing && <Button type="button" variant="outline" className="rounded-full px-4" onClick={()=>setEditing(true)}>
              <Edit className="w-4 h-4 mr-1" /> Editar manualmente
            </Button>}
            
            <div className="flex gap-4 mt-4">
              <Button type="button" variant="ghost" onClick={()=>{setStep(1); setEditing(false);}}><ArrowLeft className="w-4 h-4 mr-1" /> Voltar</Button>
              <Button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-xl px-8 py-3" disabled={loading || !user}>
                {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2 inline" /> : <CheckCircle className="w-5 h-5 mr-2 inline" />} Confirmar
              </Button>
            </div>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        </div>
      </section>
    </div>
  );

  // Step 3: Resultado
  const ResultadoStep = () => (
    <div className="flex flex-col gap-6">
      {analysisResult ? (
        <>
          <AnalysisDisplay data={analysisResult} />
          <div className="flex gap-4 mt-8 justify-center">
            <Button variant="outline" onClick={resetFlow}>Analisar outro holerite</Button>
            <Button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-xl px-8 py-3" onClick={()=>window.location.href='/dashboard'}>Ir para o dashboard</Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold text-emerald-900">Análise concluída!</h2>
          <p className="text-gray-600 mt-2">Resultados disponíveis</p>
        </div>
      )}
    </div>
  );

  // InputField helper
  function InputField({label, value, onChange, disabled}: {label: string, value: string, onChange: (v: string) => void, disabled: boolean}) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-emerald-800 font-medium mb-1">{label}</label>
        <Input className="rounded-lg border border-emerald-200" value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} />
      </div>
    );
  }
  // ResultField helper
  function ResultField({label, value}: {label: string, value: string}) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="font-semibold text-emerald-900 text-base">{value}</span>
      </div>
    );
  }

  // OCR handler
  async function handleOcr() {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/process-payslip', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao processar holerite');
        toast({ title: "Erreur d'analyse", description: errorData.error || 'Erro ao processar holerite', variant: "destructive" });
        return;
      }
      const result = await response.json();
      setAnalysisResult(result.analysisData);
      setStep(3);
      toast({ title: "Análise concluída!", description: "Veja as oportunidades identificadas.", variant: "default" });
    } catch (err: any) {
      setError(err.message || "Erro ao processar holerite");
      toast({ title: "Erreur d'analyse", description: err.message || "Erro ao processar holerite", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  // Save handler
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await saveToSupabase(fields);
      toast({ title: "Dados salvos com sucesso!" });
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar no banco de dados");
    } finally {
      setLoading(false);
    }
  }

  async function saveToSupabase(data: any) {
    // Save legacy + structured_data
    await supabase.from("holerites").insert({
      upload_id: "manual-upload", // or generate/uploadId if available
      nome: data.nome,
      empresa: data.empresa,
      salario_liquido: data.salario_liquido,
      structured_data: data, // or parsed if you want the full structure
      preview_url: previewUrl, // Add preview URL to database
    });
  }

  function resetFlow() {
    setStep(1);
    setFile(null);
    setFields(initialFields);
    setEditing(false);
    setError(null);
    setLoading(false);
    setPreviewUrl("");
    setAnalysisResult(null);
  }

  return (
    <main className="min-h-screen bg-[#F8FAF7] py-8 px-2 md:px-0">
      <div className="w-full max-w-6xl mx-auto p-0">
        <Stepper />
        <Card className="p-8 rounded-3xl shadow-xl border-0 bg-white">
          {step === 1 && <UploadStep />}
          {step === 2 && <ConfirmStep />}
          {step === 3 && <ResultadoStep />}
        </Card>
      </div>
    </main>
  );
} 