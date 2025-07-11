"use client";
import { useState, useEffect, useContext } from "react";
import { User, Mail, Heart, Home, Users, UserPlus, UserMinus, Share2, Briefcase, Lock, Building2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseContext } from "@/components/supabase-provider";
import { useToast } from "@/components/ui/use-toast";
import AccountSectionAccount from "@/components/account/AccountSectionAccount";

const interessesList = [
  "Finanças pessoais", "Investimentos", "Saúde", "Previdência", "Educação", "Bem-estar", "Impostos", "Viagem", "Família"
];
const setoresList = [
  "Tecnologia", "Saúde", "Educação", "Finanças", "Indústria", "Comércio", "Serviços", "Outro"
];
const tamanhosList = [
  "1-10", "11-50", "51-200", "201-1000", "1000+"
];

export default function DashboardPerfilView({ holeriteResult, user }: { holeriteResult: any, user?: any }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const supabaseCtx = useContext(SupabaseContext);
  const sessionUser = user || supabaseCtx?.session?.user || null;
  const raw = holeriteResult?.raw || {};
  // State local pour édition
  const [core, setCore] = useState({
    nome: raw.employee_name || "",
    nomePreferido: raw.preferred_name || "",
    nascimento: raw.birth_date || "",
    genero: raw.gender || "",
    cidade: raw.lives || "",
    salario: raw.gross_salary || "",
    profissao: raw.position || "",
  });
  const [empresa, setEmpresa] = useState({
    nome: raw.company_name || "",
    setor: raw.company_sector || "",
    localizacao: raw.company_location || "",
    tamanho: raw.company_size || "",
  });
  const [comunicacao, setComunicacao] = useState({
    email: "",
    telefone: "",
    tipoEmail: "Pessoal",
    tipoTelefone: "Pessoal",
  });
  const [interesses, setInteresses] = useState<string[]>([]);
  const [casa, setCasa] = useState("");
  const [parceiro, setParceiro] = useState("");
  const [dependentes, setDependentes] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  // Ajout du state pour le bloc statut
  const [status, setStatus] = useState({
    tipo: raw.profile_type || "",
    dataEntrada: raw.data_entrada || "",
    matricula: raw.matricula || "",
    tipoImposicao: raw.tipo_imposicao || "",
    tipoVinculo: raw.tipo_vinculo || "",
    cargo: raw.cargo || core.profissao || ""
  });

  const { toast } = useToast();

  // Récupère le profil existant à l'ouverture
  useEffect(() => {
    async function fetchProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();
      if (data) {
        setCore({
          nome: data.nome || "",
          nomePreferido: data.nome_preferido || "",
          nascimento: data.data_nascimento || "",
          genero: data.genero || "",
          cidade: data.cidade || "",
          salario: data.salario || "",
          profissao: data.profissao || "",
        });
        setEmpresa({
          nome: data.empresa_nome || "",
          setor: data.empresa_setor || "",
          localizacao: data.empresa_localizacao || "",
          tamanho: data.empresa_tamanho || "",
        });
        setComunicacao({
          email: authUser.email || data.comunicacao_email || "",
          telefone: data.comunicacao_telefone || "",
          tipoEmail: data.comunicacao_tipo_email || "Pessoal",
          tipoTelefone: data.comunicacao_tipo_telefone || "Pessoal",
        });
        setInteresses(data.interesses || []);
        setCasa(data.casa || "");
        setParceiro(data.parceiro || "");
        setDependentes(data.dependentes || []);
        setStatus({
          tipo: data.profile_type || "",
          dataEntrada: data.data_entrada || "",
          matricula: data.matricula || "",
          tipoImposicao: data.tipo_imposicao || "",
          tipoVinculo: data.tipo_vinculo || "",
          cargo: data.cargo || "",
        });
      }
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  async function handleSalvar() {
    setSaving(true);
    setMsg("");
    setEmailMsg("");
    // Correction récupération user
    const authUser = sessionUser;
    if (!authUser) {
      setMsg("Session expirée ou non détectée. Veuillez vous reconnecter.");
      setSaving(false);
      return;
    }
    // Fusionne les champs du formulaire avec ceux du dernier holerite (priorité au formulaire)
    const mergedCore = {
      nome: core.nome || raw.employee_name || "",
      nomePreferido: core.nomePreferido || raw.preferred_name || "",
      nascimento: core.nascimento || raw.birth_date || "",
      genero: core.genero || raw.gender || "",
      cidade: core.cidade || raw.lives || "",
      salario: core.salario || raw.gross_salary || "",
      profissao: core.profissao || raw.position || "",
    };
    const mergedEmpresa = {
      nome: empresa.nome || raw.company_name || "",
      setor: empresa.setor || raw.company_sector || "",
      localizacao: empresa.localizacao || raw.company_location || "",
      tamanho: empresa.tamanho || raw.company_size || "",
    };
    const mergedStatus = {
      ...status,
      cargo: status.cargo || raw.position || ""
    };
    // Si l'email a changé, tente de le mettre à jour dans Auth
    if (comunicacao.email && comunicacao.email !== authUser.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: comunicacao.email });
      if (emailError) {
        setEmailMsg("Erreur lors de la modification de l'email: " + emailError.message);
        setSaving(false);
        return;
      } else {
        setEmailMsg("Un email de confirmation a été envoyé à la nouvelle adresse. Veuillez confirmer pour finaliser la modification.");
      }
    }
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: authUser.id,
        email: comunicacao.email,
        nome: mergedCore.nome,
        nome_preferido: mergedCore.nomePreferido,
        data_nascimento: core.nascimento || null,
        genero: core.genero || null,
        cidade: core.cidade || null,
        salario: core.salario || null,
        profissao: core.profissao || null,
        empresa_nome: mergedEmpresa.nome || null,
        empresa_setor: mergedEmpresa.setor || null,
        empresa_localizacao: mergedEmpresa.localizacao || null,
        empresa_tamanho: mergedEmpresa.tamanho || null,
        comunicacao_email: comunicacao.email || null,
        comunicacao_telefone: comunicacao.telefone || null,
        comunicacao_tipo_email: comunicacao.tipoEmail || null,
        comunicacao_tipo_telefone: comunicacao.tipoTelefone || null,
        interesses,
        casa: casa || null,
        parceiro: parceiro || null,
        dependentes,
        profile_type: holeriteResult?.raw?.profile_type || null,
        // Ajout des nouveaux champs statut
        data_entrada: mergedStatus.dataEntrada ? mergedStatus.dataEntrada : null,
        matricula: mergedStatus.matricula || null,
        tipo_imposicao: mergedStatus.tipoImposicao || null,
        tipo_vinculo: mergedStatus.tipoVinculo || null,
        cargo: mergedStatus.cargo || null,
      }, { onConflict: 'id' });
    if (error) {
      setMsg("Erro ao salvar: " + error.message);
    } else {
      setMsg("Perfil salvo com sucesso!");
    }
    setSaving(false);
  }

  function toggleInteresse(val: string) {
    setInteresses((prev) => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte et toutes vos données ?")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Non connecté", description: "Vous devez être connecté pour cette action.", variant: "destructive" });
      return;
    }
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    if (res.ok) {
      toast({ title: "Compte supprimé", description: "Votre compte et vos données ont été supprimés.", variant: "default" });
      await supabase.auth.signOut();
      window.location.href = '/';
    } else {
      toast({ title: "Erreur", description: "Erreur lors de la suppression du compte.", variant: "destructive" });
    }
  };

  return (
    <div className="w-full relative">
      {/* Section Dados principais */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-900"><User className="w-7 h-7 text-emerald-600" /> Dados principais</h2>
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
          <div>
            <label className="font-semibold block mb-1">Nome</label>
            <input type="text" className="input" value={core.nome} onChange={e => setCore(c => ({ ...c, nome: e.target.value }))} placeholder="Seu nome" />
          </div>
          <div>
            <label className="font-semibold block mb-1">Nome preferido</label>
            <input type="text" className="input" value={core.nomePreferido} onChange={e => setCore(c => ({ ...c, nomePreferido: e.target.value }))} placeholder="Como prefere ser chamado" />
          </div>
          <div>
            <label className="font-semibold block mb-1">Data de nascimento</label>
            <input type="date" className="input" value={core.nascimento} onChange={e => setCore(c => ({ ...c, nascimento: e.target.value }))} />
          </div>
          <div>
            <label className="font-semibold block mb-1">Gênero</label>
            <select className="input" value={core.genero} onChange={e => setCore(c => ({ ...c, genero: e.target.value }))}>
              <option value="">Selecione</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-1">Cidade/Estado</label>
            <input type="text" className="input" value={core.cidade} onChange={e => setCore(c => ({ ...c, cidade: e.target.value }))} placeholder="Onde mora" />
          </div>
          <div>
            <label className="font-semibold block mb-1">Salário</label>
            <input type="number" className="input" value={core.salario} onChange={e => setCore(c => ({ ...c, salario: e.target.value }))} placeholder="R$" />
          </div>
          <div>
            <label className="font-semibold block mb-1">Profissão</label>
            <input type="text" className="input" value={core.profissao} onChange={e => setCore(c => ({ ...c, profissao: e.target.value }))} placeholder="Sua profissão" />
          </div>
        </div>
      </div>
      {/* Section Status profissional */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-900"><Briefcase className="w-7 h-7 text-emerald-600" /> Status profissional</h2>
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
          <div>
            <label className="font-semibold block mb-1">Tipo de vínculo</label>
            <select className="input" value={status.tipoVinculo} onChange={e => setStatus(s => ({ ...s, tipoVinculo: e.target.value }))}>
              <option value="">Selecione</option>
              <option value="Sócio">Sócio</option>
              <option value="Autônomo">Autônomo</option>
              <option value="Estagiário">Estagiário</option>
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-1">Cargo</label>
            <input type="text" className="input" value={status.cargo} onChange={e => setStatus(s => ({ ...s, cargo: e.target.value }))} placeholder="Cargo ou função" />
          </div>
          {((status.tipo || raw.profile_type) === "CLT") && <>
            <div>
              <label className="font-semibold block mb-1">Data de entrada na empresa</label>
              <input type="date" className="input" value={status.dataEntrada} onChange={e => setStatus(s => ({ ...s, dataEntrada: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold block mb-1">Número de matrícula</label>
              <input type="text" className="input" value={status.matricula} onChange={e => setStatus(s => ({ ...s, matricula: e.target.value }))} placeholder="Matrícula" />
            </div>
          </>}
          {((status.tipo || raw.profile_type) === "PJ") && <>
            <div>
              <label className="font-semibold block mb-1">Tipo de imposição</label>
              <select className="input" value={status.tipoImposicao} onChange={e => setStatus(s => ({ ...s, tipoImposicao: e.target.value }))}>
                <option value="">Selecione</option>
                <option value="Lucro Real">Lucro Real</option>
                <option value="Lucro Presumido">Lucro Presumido</option>
                <option value="Simples Nacional">Simples Nacional</option>
              </select>
            </div>
          </>}
        </div>
      </div>
      {/* Section Empresa */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Building2 className="w-5 h-5 text-emerald-600" /> Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="font-semibold block mb-1">Nome da empresa</label>
            <input type="text" className="input" value={empresa.nome} onChange={e => setEmpresa(emp => ({ ...emp, nome: e.target.value }))} placeholder="Empresa onde trabalha" />
          </div>
          <div>
            <label className="font-semibold block mb-1">Setor</label>
            <select className="input" value={empresa.setor} onChange={e => setEmpresa(emp => ({ ...emp, setor: e.target.value }))}>
              <option value="">Selecione</option>
              {setoresList.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-1">Localização</label>
            <input type="text" className="input" value={empresa.localizacao} onChange={e => setEmpresa(emp => ({ ...emp, localizacao: e.target.value }))} placeholder="Cidade/Estado da empresa" />
          </div>
          <div>
            <label className="font-semibold block mb-1">Tamanho</label>
            <select className="input" value={empresa.tamanho} onChange={e => setEmpresa(emp => ({ ...emp, tamanho: e.target.value }))}>
              <option value="">Selecione</option>
              {tamanhosList.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>
      {/* Section Comunicação preferencial */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Mail className="w-5 h-5 text-emerald-600" /> Comunicação preferencial</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="font-semibold block mb-1">Email</label>
            <input type="email" className="input" value={comunicacao.email} onChange={e => setComunicacao(c => ({ ...c, email: e.target.value }))} placeholder="Seu email" />
            <select className="input mt-1" value={comunicacao.tipoEmail} onChange={e => setComunicacao(c => ({ ...c, tipoEmail: e.target.value }))}>
              <option>Pessoal</option>
              <option>Profissional</option>
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-1">Telefone</label>
            <input type="tel" className="input" value={comunicacao.telefone} onChange={e => setComunicacao(c => ({ ...c, telefone: e.target.value }))} placeholder="Seu telefone" />
            <select className="input mt-1" value={comunicacao.tipoTelefone} onChange={e => setComunicacao(c => ({ ...c, tipoTelefone: e.target.value }))}>
              <option>Pessoal</option>
              <option>Profissional</option>
            </select>
          </div>
        </div>
      </div>
      {/* Section Interesses */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Heart className="w-5 h-5 text-emerald-600" /> Interesses</h3>
        <div className="flex flex-wrap gap-3">
          {interessesList.map((int) => (
            <label key={int} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={interesses.includes(int)} onChange={() => toggleInteresse(int)} />
              <span>{int}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Section Casa */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Home className="w-5 h-5 text-emerald-600" /> Casa</h3>
        <select className="input w-full max-w-xs" value={casa} onChange={e => setCasa(e.target.value)}>
          <option value="">Selecione</option>
          <option value="Aluguel">Aluguel</option>
          <option value="Própria">Própria</option>
          <option value="Com família">Com família</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      {/* Section Parceiro(a) */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" /> Parceiro(a)</h3>
        <input type="text" className="input max-w-xs" value={parceiro} onChange={e => setParceiro(e.target.value)} placeholder="Nome do parceiro(a)" />
      </div>
      {/* Section Dependentes */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><UserPlus className="w-5 h-5 text-emerald-600" /> Dependentes</h3>
        <input type="text" className="input max-w-xs" placeholder="Nome do dependente" onKeyDown={e => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            setDependentes(d => [...d, e.currentTarget.value]);
            e.currentTarget.value = '';
          }
        }} />
        <ul className="mt-2 flex flex-wrap gap-2">
          {dependentes.map((dep, i) => (
            <li key={i} className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-2">{dep} <button onClick={() => setDependentes(d => d.filter((_, j) => j !== i))} className="text-red-500 ml-1">&times;</button></li>
          ))}
        </ul>
      </div>
      {/* Bouton Save en bas */}
      <div className="flex justify-end mt-8">
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition" onClick={handleSalvar} disabled={saving}>Salvar</button>
      </div>
      {emailMsg && <div className="mt-2 text-blue-700 font-semibold">{emailMsg}</div>}
      {msg && <div className="mt-4 text-green-700 font-semibold">{msg}</div>}
      <div className="flex justify-end mt-8">
        <button className="text-red-600 underline text-sm" onClick={handleDeleteAccount}>
          Supprimer mon compte et mes données
        </button>
      </div>
    </div>
  );
}

// Styles input (peut être déplacé dans le CSS global)
// .input { @apply border rounded px-3 py-2 w-full outline-none focus:ring-2 focus:ring-emerald-300 transition; } 