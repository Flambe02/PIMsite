"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Loader2, UploadCloud, FileText, Edit, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

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

async function parseWithOCRSpace(file) {
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

function extractFields(parsedText) {
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

export default function CalculadoraPage() {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState(initialFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Auth check on Step 2
  useEffect(() => {
    if (step === 2) {
      setAuthLoading(true);
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        setAuthLoading(false);
      });
    }
  }, [step]);

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
          {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2 inline" /> : <ArrowRight className="w-5 h-5 mr-2 inline" />} Usar OCR
        </Button>
        <Button variant="ghost" className="w-full text-emerald-700 underline" onClick={()=>{setFields(initialFields); setStep(2); setEditing(true);}}>Pular OCR e preencher manualmente</Button>
      </div>
    </div>
  );

  // Step 2: Confirmação dos Dados
  const ConfirmStep = () => {
    if (authLoading) {
      return <div className="text-center text-emerald-700 mt-6 flex flex-col items-center"><Loader2 className="animate-spin w-6 h-6 mb-2" />Verificando autenticação...</div>;
    }
    if (!user) {
      return (
        <div className="text-center text-red-600 mt-6 flex flex-col items-center gap-4">
          <div>Usuário não autenticado</div>
          <Button
            className="mt-2"
            onClick={() => router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)}
          >
            Fazer login
          </Button>
        </div>
      );
    }
    return (
      <form className="flex flex-col gap-6 items-center" onSubmit={handleSave}>
        <h2 className="text-xl font-bold text-emerald-900">Confirme seus dados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <InputField label="Nome do funcionário" value={fields.nome} onChange={v=>setFields(f=>({...f, nome:v}))} disabled={!editing} />
          <InputField label="Nome da empresa" value={fields.empresa} onChange={v=>setFields(f=>({...f, empresa:v}))} disabled={!editing} />
          <InputField label="Salário bruto (R$)" value={fields.salario_bruto} onChange={v=>setFields(f=>({...f, salario_bruto:v}))} disabled={!editing} />
          <InputField label="Descontos INSS (R$)" value={fields.inss} onChange={v=>setFields(f=>({...f, inss:v}))} disabled={!editing} />
          <InputField label="Descontos IRRF (R$)" value={fields.irrf} onChange={v=>setFields(f=>({...f, irrf:v}))} disabled={!editing} />
          <InputField label="Salário líquido (R$)" value={fields.salario_liquido} onChange={v=>setFields(f=>({...f, salario_liquido:v}))} disabled={!editing} />
          <InputField label="Data de pagamento" value={fields.data_pagamento} onChange={v=>setFields(f=>({...f, data_pagamento:v}))} disabled={!editing} />
        </div>
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
    );
  };

  // Step 3: Resultado
  const ResultadoStep = () => (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold text-emerald-900">Análise concluída!</h2>
      <Card className="p-6 rounded-2xl shadow-lg border-0 bg-emerald-50 max-w-xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultField label="Nome do funcionário" value={fields.nome} />
          <ResultField label="Nome da empresa" value={fields.empresa} />
          <ResultField label="Salário bruto (R$)" value={fields.salario_bruto} />
          <ResultField label="Descontos INSS (R$)" value={fields.inss} />
          <ResultField label="Descontos IRRF (R$)" value={fields.irrf} />
          <ResultField label="Salário líquido (R$)" value={fields.salario_liquido} />
          <ResultField label="Data de pagamento" value={fields.data_pagamento} />
        </div>
      </Card>
      <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={resetFlow}>Voltar ao início</Button>
        <Button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-xl px-8 py-3" onClick={()=>window.location.href='/dashboard'}>Ir para o dashboard</Button>
      </div>
    </div>
  );

  // InputField helper
  function InputField({label, value, onChange, disabled}) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-emerald-800 font-medium mb-1">{label}</label>
        <Input className="rounded-lg border border-emerald-200" value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} />
      </div>
    );
  }
  // ResultField helper
  function ResultField({label, value}) {
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
      const parsedText = await parseWithOCRSpace(file);
      const extracted = extractFields(parsedText);
      setFields(extracted);
      setStep(2);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Erro ao processar OCR");
    } finally {
      setLoading(false);
    }
  }

  // Save handler
  async function handleSave(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await saveToSupabase(fields);
      toast({ title: "Dados salvos com sucesso!" });
      setStep(3);
    } catch (err) {
      setError(err.message || "Erro ao salvar no banco de dados");
    } finally {
      setLoading(false);
    }
  }

  async function saveToSupabase(data) {
    const user = await supabase.auth.getUser();
    const user_id = user.data?.user?.id;
    if (!user_id) throw new Error("Usuário não autenticado");
    const { error } = await supabase.from("holerites").insert([{ ...data, user_id }]);
    if (error) throw error;
  }

  function resetFlow() {
    setStep(1);
    setFile(null);
    setFields(initialFields);
    setEditing(false);
    setError(null);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F8FAF7] py-8 px-2 md:px-0">
      <div className="w-full max-w-2xl mx-auto p-0">
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