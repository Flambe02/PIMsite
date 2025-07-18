"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSupabase } from "@/components/supabase-provider";
import { User, Briefcase } from "lucide-react";

export default function OnboardingStep1({ onNext }: { onNext: () => void }) {
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    nomePreferido: "",
    nascimento: "",
    genero: "",
    cidade: "",
    email: "",
    telefone: "",
    empresa: "",
    setor: "",
    localizacao: "",
    tamanho: "",
    profissao: "",
    cargo: "",
    salario: "",
  });

  const textos = {
    dadosPessoais: "Dados pessoais",
    nome: "Nome completo",
    nomePreferido: "Nome preferido",
    nascimento: "Data de nascimento",
    genero: "Gênero",
    selecione: "Selecione",
    feminino: "Feminino",
    masculino: "Masculino",
    outro: "Outro",
    cidade: "Cidade",
    telefone: "Telefone",
    empresa: "Empresa",
    setor: "Setor",
    localizacao: "Localização da empresa",
    tamanho: "Tamanho da empresa",
    cargo: "Cargo/Função",
    salario: "Salário bruto",
    salvar: "Salvar",
    carregando: "Carregando...",
    instrucao: "Forneça suas informações pessoais para começarmos",
    instrucaoEmpresa: "Informações profissionais",
    instrucaoPessoal: "Informações pessoais",
  };

  // Pré-remplir avec les données existantes du profil
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setForm(f => ({
          ...f,
          nome: data.nome || "",
          nomePreferido: data.nome_preferido || "",
          nascimento: data.data_nascimento || "",
          genero: data.genero || "",
          cidade: data.cidade || "",
          email: user.email || data.comunicacao_email || "",
          telefone: data.comunicacao_telefone || "",
          empresa: data.empresa_nome || "",
          setor: data.empresa_setor || "",
          localizacao: data.empresa_localizacao || "",
          tamanho: data.empresa_tamanho || "",
          profissao: data.profissao || "",
          cargo: data.cargo || "",
          salario: data.salario || "",
        }));
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Session expirée, reconnecte-toi."); setSaving(false); return; }
    // Mise à jour du profil
    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: form.email,
      nome: form.nome,
      nome_preferido: form.nomePreferido,
      data_nascimento: form.nascimento,
      genero: form.genero,
      cidade: form.cidade,
      comunicacao_email: form.email,
      comunicacao_telefone: form.telefone,
      empresa_nome: form.empresa,
      empresa_setor: form.setor,
      empresa_localizacao: form.localizacao,
      empresa_tamanho: form.tamanho,
      profissao: form.profissao,
      cargo: form.cargo,
      salario: form.salario,
    });
    setSaving(false);
    if (upsertError) {
      setError("Erreur lors de la sauvegarde : " + upsertError.message);
    } else {
      setSuccess(true);
      onNext();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[300px] w-full text-emerald-700">{textos.carregando}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Seus dados</h2>
        <p className="text-gray-600 text-sm">{textos.instrucao}</p>
      </div>
      
      <div className="flex-1 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Informações personnelles */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              {textos.instrucaoPessoal}
            </h3>
            <Card className="rounded-xl shadow-lg border-0 bg-white flex-1">
              <div className="p-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="nome" className="text-sm">{textos.nome}</Label>
                    <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required placeholder="Digite seu nome completo" className="h-9" />
                  </div>
                  <div>
                    <Label htmlFor="nomePreferido" className="text-sm">{textos.nomePreferido}</Label>
                    <Input id="nomePreferido" name="nomePreferido" value={form.nomePreferido} onChange={handleChange} placeholder="Como gosta de ser chamado" className="h-9" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="nascimento" className="text-sm">{textos.nascimento}</Label>
                      <Input id="nascimento" name="nascimento" type="date" value={form.nascimento} onChange={handleChange} className="h-9" />
                    </div>
                    <div>
                      <Label htmlFor="genero" className="text-sm">{textos.genero}</Label>
                      <select id="genero" name="genero" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-9 text-sm" value={form.genero} onChange={handleChange}>
                        <option value="">{textos.selecione}</option>
                        <option value="Feminino">{textos.feminino}</option>
                        <option value="Masculino">{textos.masculino}</option>
                        <option value="Outro">{textos.outro}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="cidade" className="text-sm">{textos.cidade}</Label>
                      <Input id="cidade" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Sua cidade" className="h-9" />
                    </div>
                    <div>
                      <Label htmlFor="telefone" className="text-sm">{textos.telefone}</Label>
                      <Input id="telefone" name="telefone" type="tel" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" className="h-9" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Informations professionnelles */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              {textos.instrucaoEmpresa}
            </h3>
            <Card className="rounded-xl shadow-lg border-0 bg-white flex-1">
              <div className="p-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="empresa" className="text-sm">{textos.empresa}</Label>
                    <Input id="empresa" name="empresa" value={form.empresa} onChange={handleChange} placeholder="Nome da empresa" className="h-9" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="cargo" className="text-sm">{textos.cargo}</Label>
                      <Input id="cargo" name="cargo" value={form.cargo} onChange={handleChange} placeholder="Seu cargo atual" className="h-9" />
                    </div>
                    <div>
                      <Label htmlFor="setor" className="text-sm">{textos.setor}</Label>
                      <Input id="setor" name="setor" value={form.setor} onChange={handleChange} placeholder="Setor de atuação" className="h-9" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="localizacao" className="text-sm">{textos.localizacao}</Label>
                      <Input id="localizacao" name="localizacao" value={form.localizacao} onChange={handleChange} placeholder="Cidade/Estado da empresa" className="h-9" />
                    </div>
                    <div>
                      <Label htmlFor="tamanho" className="text-sm">{textos.tamanho}</Label>
                      <select id="tamanho" name="tamanho" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-9 text-sm" value={form.tamanho} onChange={handleChange}>
                        <option value="">{textos.selecione}</option>
                        <option value="1-10">1-10 funcionários</option>
                        <option value="11-50">11-50 funcionários</option>
                        <option value="51-200">51-200 funcionários</option>
                        <option value="201-1000">201-1000 funcionários</option>
                        <option value="1000+">Mais de 1000 funcionários</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="salario" className="text-sm">{textos.salario}</Label>
                    <Input id="salario" name="salario" type="number" value={form.salario} onChange={handleChange} placeholder="R$ 0,00" className="h-9" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 text-sm">Dados salvos com sucesso!</p>
          </div>
        )}
      </div>
    </div>
  )
} 