import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SECTORS = ["Services", "Industrie", "Tech", "Commerce", "Santé", "Éducation", "Autre"];
const SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
const INTERESTS = [
  "Finanças pessoais", "Investimentos", "Saúde", "Previdência", "Educação",
  "Bem-estar", "Impostos", "Viagem", "Família"
];
const MARITAL_STATUS = ["Casado(a)", "Solteiro(a)", "Divorciado(a)", "Outro"];

export default function Step2Dados({ onNext, onBack, locale }: { onNext: () => void, onBack: () => void, locale: string }) {
  const [form, setForm] = useState({
    // nomePreferido supprimé
    nascimento: "",
    genero: "",
    cidade: "",
    pais: "",
    empresa: "",
    setor: "",
    localizacao: "",
    tamanho: "",
    email: "",
    telefone: "",
    interesses: [] as string[],
    numeroFilhos: "",
    estadoCivil: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<{ code: string, name: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Pré-remplissage profil + fetch pays
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Fetch profil existant
        const res = await fetch("/api/profile", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          // Mapping robuste : on ne touche pas aux champs vides, on remplit ceux qui existent
          setForm(f => ({ ...f, ...Object.fromEntries(Object.entries(data).filter(([k, v]) => v !== null && v !== undefined && v !== "")) }));
        }
        // 2. Fetch countries
        const res2 = await fetch("/api/countries");
        if (res2.ok) {
          let data2 = await res2.json();
          // Localisation du nom du pays
          data2 = data2.map((c: any) => ({
            ...c,
            name: (locale === "br" && c.code === "BR") ? "Brasil" : (locale === "fr" && c.code === "BR") ? "Brésil" : c.name
          }));
          setCountries(data2);
        }
      } catch (e) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [locale]);

  // Fetch cities dynamiquement selon le pays sélectionné
  useEffect(() => {
    async function fetchCities() {
      if (form.pais) {
        const res = await fetch(`/api/cities?country_code=${form.pais}`);
        if (res.ok) {
          const data = await res.json();
          setCities(data.map((c: { name: string }) => c.name));
        } else {
          setCities([]);
        }
      } else {
        setCities([]);
      }
    }
    fetchCities();
  }, [form.pais]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleMultiSelect = (interest: string) => {
    setForm((f) => ({ ...f, interesses: f.interesses.includes(interest)
      ? f.interesses.filter(i => i !== interest)
      : [...f.interesses, interest] }));
  };

  const handleSave = async () => {
    setLoading(true); setError("");
    try {
      // Nettoyage des champs numériques
      const cleanForm = {
        ...form,
        numeroFilhos: form.numeroFilhos === "" ? null : Number(form.numeroFilhos)
      };
      const res = await fetch(`/api/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: cleanForm }),
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      onNext();
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2 text-center">{locale === "br" ? "Dados principais" : "Données principales"}</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <input name="nascimento" placeholder="Data de nascimento" value={form.nascimento} onChange={handleChange} className="border rounded px-4 py-2 w-full" type="date" />
        <input name="genero" placeholder="Gênero" value={form.genero} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        <div className="flex gap-2">
          <select name="pais" value={form.pais} onChange={handleChange} className="border rounded px-4 py-2 w-full">
            <option value="">{locale === "br" ? "Selecione o país" : "Choisir le pays"}</option>
            {countries.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
          </select>
          <select name="cidade" value={form.cidade} onChange={handleChange} className="border rounded px-4 py-2 w-full">
            <option value="">{locale === "br" ? "Cidade" : "Ville"}</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <input name="empresa" placeholder="Nome da empresa" value={form.empresa} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        <select name="setor" value={form.setor} onChange={handleChange} className="border rounded px-4 py-2 w-full">
          <option value="">{locale === "br" ? "Setor" : "Secteur"}</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="tamanho" value={form.tamanho} onChange={handleChange} className="border rounded px-4 py-2 w-full">
          <option value="">{locale === "br" ? "Tamanho da empresa" : "Taille de l'entreprise"}</option>
          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input name="localizacao" placeholder="Localização" value={form.localizacao} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 items-center">
          <span className="font-semibold mr-2">{locale === "br" ? "Interesses:" : "Intérêts:"}</span>
          {INTERESTS.map(interest => (
            <label key={interest} className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={form.interesses.includes(interest)} onChange={() => handleMultiSelect(interest)} />
              {interest}
            </label>
          ))}
        </div>
        <input name="numeroFilhos" type="number" min="0" placeholder={locale === "br" ? "Número de filhos" : "Nombre d'enfants"} value={form.numeroFilhos} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        <select name="estadoCivil" value={form.estadoCivil} onChange={handleChange} className="border rounded px-4 py-2 w-full">
          <option value="">{locale === "br" ? "Estado civil" : "Statut marital"}</option>
          {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </form>
      {error && <div className="text-red-600 text-sm mb-2 text-center">{error}</div>}
      <div className="flex flex-col md:flex-row gap-2 justify-center">
        <Button variant="outline" onClick={onBack} disabled={loading}>Voltar</Button>
        <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto">
          {loading ? "Salvando..." : "Salvar e continuar"}
        </Button>
      </div>
    </div>
  );
} 