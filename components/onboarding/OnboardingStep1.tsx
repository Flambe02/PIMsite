"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSupabase } from "@/components/supabase-provider";

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
  });

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
    return <div className="flex items-center justify-center min-h-[300px] w-full text-emerald-700">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-2 md:p-4">
      <Card className="w-full max-w-lg rounded-3xl shadow-2xl border-0 bg-white/80 backdrop-blur-xl flex flex-col justify-center items-center min-h-[520px] h-auto py-8 px-8 animate-fade-in">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-bold mb-2 text-emerald-900 text-center">Données personnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nom</Label>
              <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="nomePreferido">Nom préféré</Label>
              <Input id="nomePreferido" name="nomePreferido" value={form.nomePreferido} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="nascimento">Date de naissance</Label>
              <Input id="nascimento" name="nascimento" type="date" value={form.nascimento} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="genero">Genre</Label>
              <select id="genero" name="genero" className="input" value={form.genero} onChange={handleChange}>
                <option value="">Sélectionner</option>
                <option value="Féminin">Féminin</option>
                <option value="Masculin">Masculin</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <Label htmlFor="cidade">Ville</Label>
              <Input id="cidade" name="cidade" value={form.cidade} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="telefone">Téléphone</Label>
              <Input id="telefone" name="telefone" value={form.telefone} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="empresa">Entreprise</Label>
              <Input id="empresa" name="empresa" value={form.empresa} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="setor">Secteur</Label>
              <Input id="setor" name="setor" value={form.setor} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="localizacao">Localisation entreprise</Label>
              <Input id="localizacao" name="localizacao" value={form.localizacao} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="tamanho">Taille entreprise</Label>
              <Input id="tamanho" name="tamanho" value={form.tamanho} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="profissao">Profession</Label>
              <Input id="profissao" name="profissao" value={form.profissao} onChange={handleChange} />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
          <Button type="submit" className="w-full h-12 rounded-2xl text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-4" disabled={saving}>
            {saving ? "Sauvegarde..." : "OK"}
          </Button>
        </form>
      </Card>
    </div>
  )
} 