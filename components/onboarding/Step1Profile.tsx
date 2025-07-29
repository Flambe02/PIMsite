import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Step1Profile({ onNext, locale }: { onNext: () => void, locale: string }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Pré-remplissage depuis le profil utilisateur (robuste)
  useEffect(() => {
    async function fetchProfile() {
      setFetching(true);
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          console.log("Profil reçu:", data);
          if (data) {
            // Mapping robuste
            if (data.nome) {
              const parts = String(data.nome).trim().split(" ");
              setFirstName(parts[0] || "");
              setLastName(parts.slice(1).join(" ") || "");
            } else if (data.firstName || data.lastName) {
              setFirstName(data.firstName || "");
              setLastName(data.lastName || "");
            } else if (data.email) {
              setFirstName(data.email.split("@")[0]);
              setLastName("");
            }
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setFetching(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true); setError(""); setSuccess(false);
    try {
      const res = await fetch(`/api/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: { firstName, lastName } }),
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSuccess(true);
      onNext();
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center items-center min-h-[200px]">Carregando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full px-2">
      <h2 className="text-2xl font-bold mb-4">
        {locale === "br" ? "Etapa 1: Perfil" : "Étape 1 : Profil"}
      </h2>
      <input
        className="border rounded px-4 py-2 mb-4 w-full"
        placeholder={locale === "br" ? "Nome" : "Nom"}
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <input
        className="border rounded px-4 py-2 mb-4 w-full"
        placeholder={locale === "br" ? "Sobrenome" : "Prénom"}
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">{locale === "br" ? "Salvo com sucesso!" : "Enregistré avec succès !"}</div>}
      <Button
        className="w-full"
        onClick={handleSave}
        disabled={loading || !firstName || !lastName}
      >
        {loading
          ? (locale === "br" ? "Salvando..." : "Sauvegarde...")
          : (locale === "br" ? "Salvar e continuar" : "Sauvegarder et continuer")}
      </Button>
    </div>
  );
} 