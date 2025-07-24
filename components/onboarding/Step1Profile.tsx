import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Step1Profile({ onNext, locale }: { onNext: () => void, locale: string }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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