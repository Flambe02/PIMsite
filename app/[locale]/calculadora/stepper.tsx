"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Loader2, UploadCloud, FileText, Edit, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useId } from "react";

const initialFields = {
  nome: "",
  empresa: "",
  salario_bruto: "",
  inss: "",
  irrf: "",
  salario_liquido: "",
  data_pagamento: "",
  raw_text: "",
};

export default function CalculadoraStepper() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState(initialFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <h2 className="text-xl font-bold text-emerald-900">Faça upload do seu holerite</h2>
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
          {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2 inline" /> : <ArrowRight className="w-5 h-5 mr-2 inline" />} Analisar holerite
        </Button>
        <Button variant="ghost" className="w-full text-emerald-700 underline" onClick={()=>{setStep(2);}}>Pular OCR e preencher manualmente</Button>
      </div>
    </div>
  );

  // Step 2: Confirmação dos Dados
  const ConfirmStep = () => {
    const nomeId = useId();
    const empresaId = useId();
    const salarioBrutoId = useId();
    const inssId = useId();
    const irrfId = useId();
    const salarioLiquidoId = useId();
    const dataPagamentoId = useId();

    return (
      <form className="flex flex-col gap-6 items-center" onSubmit={handleSave}>
        <h2 className="text-xl font-bold text-emerald-900">Confirme seus dados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <InputField label="Nome do funcionário" value={fields.nome} onChange={v=>setFields(f=>({...f, nome:v}))} />
          <InputField label="Nome da empresa" value={fields.empresa} onChange={v=>setFields(f=>({...f, empresa:v}))} />
          <InputField label="Salário bruto (R$)" value={fields.salario_bruto} onChange={v=>setFields(f=>({...f, salario_bruto:v}))} />
          <InputField label="Descontos INSS (R$)" value={fields.inss} onChange={v=>setFields(f=>({...f, inss:v}))} />
          <InputField label="Descontos IRRF (R$)" value={fields.irrf} onChange={v=>setFields(f=>({...f, irrf:v}))} />
          <InputField label="Salário líquido (R$)" value={fields.salario_liquido} onChange={v=>setFields(f=>({...f, salario_liquido:v}))} />
          <InputField label="Data de pagamento" value={fields.data_pagamento} onChange={v=>setFields(f=>({...f, data_pagamento:v}))} />
        </div>
        <Button type="button" variant="outline" className="rounded-full px-4" onClick={()=>setStep(1)}>
          <Edit className="w-4 h-4 mr-1" /> Editar dados manualmente
        </Button>
        <div className="flex gap-4 mt-4">
          <Button type="button" variant="ghost" onClick={()=>setStep(1)}><ArrowLeft className="w-4 h-4 mr-1" /> Voltar</Button>
          <Button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-xl px-8 py-3">
            <CheckCircle className="w-5 h-5 mr-2 inline" /> Confirmar e Salvar
          </Button>
        </div>
      </form>
    );
  };

  // Step 3: Resultado
  const ResultadoStep = () => {
    const nomeId = useId();
    const empresaId = useId();
    const salarioBrutoId = useId();
    const inssId = useId();
    const irrfId = useId();
    const salarioLiquidoId = useId();
    const dataPagamentoId = useId();

    return (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-emerald-900">Dados salvos com sucesso!</h2>
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
        <Button className="mt-4" onClick={()=>window.location.href='/dashboard'}>Ir para Dashboard</Button>
      </div>
    );
  };

  // InputField helper
  function InputField({label, value, onChange}:{label:string, value:string, onChange:(v:string)=>void}) {
    const id = useId();
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-emerald-800 font-medium mb-1">{label}</label>
        <Input id={id} className="rounded-lg border border-emerald-200" value={value} onChange={e=>onChange(e.target.value)} />
      </div>
    );
  }
  // ResultField helper
  function ResultField({label, value}:{label:string, value:string}) {
    const id = useId();
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-xs text-gray-500">{label}</label>
        <span id={id} className="font-semibold text-emerald-900 text-base">{value}</span>
      </div>
    );
  }

  // OCR handler (mock pour l'instant)
  async function handleOcr() {
    if (!file) return;
    setLoading(true); setError(null);
    // TODO: call OCR.Space API, parse result
    setTimeout(() => {
      setFields({
        nome: "João da Silva",
        empresa: "Empresa Exemplo S.A.",
        salario_bruto: "5000",
        inss: "450",
        irrf: "150",
        salario_liquido: "4350",
        data_pagamento: "01/02/2024",
        raw_text: "...texto completo do holerite..."
      });
      setLoading(false);
      setStep(2);
    }, 1800);
  }

  // Save handler (mock pour l'instant)
  async function handleSave(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: save to Supabase
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Dados salvos com sucesso!" });
      setStep(3);
    }, 1200);
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-0">
      <Stepper />
      <Card className="p-8 rounded-3xl shadow-xl border-0 bg-white">
        {step === 1 && <UploadStep />}
        {step === 2 && <ConfirmStep />}
        {step === 3 && <ResultadoStep />}
      </Card>
    </div>
  );
} 