"use client"

import { Briefcase, UserCircle, GraduationCap, Bus, Utensils, HeartPulse, Smile } from "lucide-react"
import { useState } from "react"
import { useId } from "react";


// Supprime la variable inutilisée formSchema

export function ManualPayrollForm() {
  const [step, setStep] = useState(1)
  const [employmentType, setEmploymentType] = useState<string | null>(null)
  const [salary, setSalary] = useState({ bruto: '', liquido: '', base: '' })
  const [benefits, setBenefits] = useState({ transporte: '', refeicao: '', saude: '', odontologico: '' })

  const idSalaryBruto = useId();
  const idNumeroDependentes = useId();
  const idOutrosDescontos = useId();
  const idBeneficios = useId();
  const idOutrosDescontosPj = useId();
  const idBeneficiosPj = useId();
  const idBeneficiosEstagiario = useId();
  const idValeTransporte = useId();
  const idValeRefeicao = useId();
  const idPlanoSaude = useId();
  const idPlanoOdontologico = useId();


  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1,2,3].map(n => (
        <div key={n} className={`w-8 h-2 rounded-full transition-all duration-200 ${step === n ? 'bg-emerald-400 shadow-md' : 'bg-emerald-100'}`}></div>
      ))}
      <span className="ml-4 text-xs text-gray-500">Etapa {step} de 3</span>
    </div>
  )

  // Step 1: Tipo de Contratação
  const Step1 = () => (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-semibold text-emerald-900">Tipo de Contratação</div>
      <div className="flex flex-row gap-4 justify-center">
        <button type="button" onClick={() => setEmploymentType('clt')} className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl shadow-sm border-2 transition-all duration-150 ${employmentType==='clt' ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'} hover:border-emerald-300 focus:outline-none`}>
          <Briefcase className="w-7 h-7 text-emerald-500" />
          <span className="font-medium text-emerald-900">CLT</span>
        </button>
        <button type="button" onClick={() => setEmploymentType('pj')} className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl shadow-sm border-2 transition-all duration-150 ${employmentType==='pj' ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'} hover:border-emerald-300 focus:outline-none`}>
          <UserCircle className="w-7 h-7 text-emerald-500" />
          <span className="font-medium text-emerald-900">PJ</span>
        </button>
        <button type="button" onClick={() => setEmploymentType('estagiario')} className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl shadow-sm border-2 transition-all duration-150 ${employmentType==='estagiario' ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'} hover:border-emerald-300 focus:outline-none`}>
          <GraduationCap className="w-7 h-7 text-emerald-500" />
          <span className="font-medium text-emerald-900">Estagiário</span>
        </button>
      </div>
    </div>
  )

  // Step 2: Informações Salariais (refonte simplifiée)
  const Step2 = () => (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-semibold text-emerald-900 mb-2">Informações Salariais</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Champ principal selon le profil */}
        {employmentType === 'clt' && (
          <div className="col-span-2">
            <label htmlFor={idSalaryBruto} className="block text-emerald-800 font-medium mb-1">Salário Bruto (R$)</label>
            <input type="number" id={idSalaryBruto} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm focus:border-emerald-400 focus:ring-emerald-200" value={salary.bruto} onChange={e=>setSalary({...salary, bruto: e.target.value})} placeholder="Ex: 3500" />
            <div className="text-xs text-gray-500 mt-1">Renda total antes das deduções</div>
          </div>
        )}
        {employmentType === 'pj' && (
          <div className="col-span-2">
            <label htmlFor={idSalaryBruto} className="block text-emerald-800 font-medium mb-1">Valor da Nota/Serviço (R$)</label>
            <input type="number" id={idSalaryBruto} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm focus:border-emerald-400 focus:ring-emerald-200" value={salary.bruto} onChange={e=>setSalary({...salary, bruto: e.target.value})} placeholder="Ex: 8000" />
            <div className="text-xs text-gray-500 mt-1">Valor bruto da sua nota fiscal ou serviço</div>
          </div>
        )}
        {employmentType === 'estagiario' && (
          <div className="col-span-2">
            <label htmlFor={idSalaryBruto} className="block text-emerald-800 font-medium mb-1">Bolsa Estágio (R$)</label>
            <input type="number" id={idSalaryBruto} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm focus:border-emerald-400 focus:ring-emerald-200" value={salary.bruto} onChange={e=>setSalary({...salary, bruto: e.target.value})} placeholder="Ex: 1200" />
            <div className="text-xs text-gray-500 mt-1">Valor mensal da bolsa estágio</div>
          </div>
        )}
        {/* Champs optionnels contextuels */}
        {employmentType === 'clt' && (
          <>
            <div>
              <label htmlFor={idNumeroDependentes} className="block text-emerald-800 font-medium mb-1">Número de dependentes</label>
              <input type="number" id={idNumeroDependentes} min="0" className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm" placeholder="Ex: 2" />
            </div>
            <div>
              <label htmlFor={idOutrosDescontos} className="block text-emerald-800 font-medium mb-1">Outros descontos (R$)</label>
              <input type="number" id={idOutrosDescontos} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm" placeholder="Ex: 200" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor={idBeneficios} className="block text-emerald-800 font-medium mb-1">Benefícios (R$)</label>
              <input type="number" id={idBeneficios} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm" placeholder="Ex: 500" />
            </div>
          </>
        )}
        {employmentType === 'pj' && (
          <>
            <div>
              <label htmlFor={idOutrosDescontosPj} className="block text-emerald-800 font-medium mb-1">Outros descontos (R$)</label>
              <input type="number" id={idOutrosDescontosPj} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm" placeholder="Ex: 300" />
            </div>
            <div>
              <label htmlFor={idBeneficiosPj} className="block text-emerald-800 font-medium mb-1">Benefícios (R$)</label>
              <input type="number" id={idBeneficiosPj} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm" placeholder="Ex: 400" />
            </div>
          </>
        )}
        {employmentType === 'estagiario' && (
          <div>
            <label htmlFor={idBeneficiosEstagiario} className="block text-emerald-800 font-medium mb-1">Benefícios (R$)</label>
            <input type="number" id={idBeneficiosEstagiario} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm" placeholder="Ex: 200" />
          </div>
        )}
      </div>
    </div>
  )

  // Step 3: Benefícios e Adicionais
  const Step3 = () => (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-semibold text-emerald-900 mb-2">Benefícios e Adicionais</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-emerald-400" />
          <label htmlFor={idValeTransporte} className="block text-emerald-800 font-medium mb-1">Vale Transporte</label>
        </div>
        <input type="number" id={idValeTransporte} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm focus:border-emerald-400 focus:ring-emerald-200 mb-2" value={benefits.transporte} onChange={e=>setBenefits({...benefits, transporte: e.target.value})} />
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          <label htmlFor={idValeRefeicao} className="block text-emerald-800 font-medium mb-1">Vale Refeição</label>
        </div>
        <input type="number" id={idValeRefeicao} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm focus:border-emerald-400 focus:ring-emerald-200 mb-2" value={benefits.refeicao} onChange={e=>setBenefits({...benefits, refeicao: e.target.value})} />
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-emerald-400" />
          <label htmlFor={idPlanoSaude} className="block text-emerald-800 font-medium mb-1">Plano de Saúde</label>
        </div>
        <input type="number" id={idPlanoSaude} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm focus:border-emerald-400 focus:ring-emerald-200 mb-2" value={benefits.saude} onChange={e=>setBenefits({...benefits, saude: e.target.value})} />
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-emerald-400" />
          <label htmlFor={idPlanoOdontologico} className="block text-emerald-800 font-medium mb-1">Plano Odontológico</label>
        </div>
        <input type="number" id={idPlanoOdontologico} className="w-full rounded-lg border border-emerald-200 p-2 shadow-sm focus:border-emerald-400 focus:ring-emerald-200 mb-2" value={benefits.odontologico} onChange={e=>setBenefits({...benefits, odontologico: e.target.value})} />
      </div>
    </div>
  )

  return (
    <form className="w-full max-w-2xl mx-auto p-0">
      <StepIndicator />
      <div className="mb-8">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" className="px-6 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100 hover:bg-emerald-100 transition disabled:opacity-50" onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1}>Voltar</button>
        <button type="button" className="px-6 py-2 rounded-full bg-emerald-400 text-white font-bold shadow-md hover:bg-emerald-500 transition disabled:opacity-50" onClick={()=>setStep(s=>Math.min(3,s+1))} disabled={step===3}>Próximo</button>
      </div>
    </form>
  )
}
