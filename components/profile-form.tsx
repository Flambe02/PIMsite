"use client";
import { useState, FormEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function ProfileForm({
  initialFirst,
  initialLast,
  email,
}: {
  initialFirst: string;
  initialLast: string;
  email: string;
}) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [first, setFirst] = useState(initialFirst);
  const [last, setLast] = useState(initialLast);
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // 1) update profile table
    const { error: pErr } = await supabase
      .from("profiles")
      .update({ first_name: first, last_name: last })
      .eq("id", (await supabase.auth.getUser()).data.user?.id);

    if (pErr) {
      setMsg(pErr.message);
      setLoading(false);
      return;
    }

    // 2) change password (si renseigné)
    if (pwd1 || pwd2) {
      if (pwd1 !== pwd2) {
        setMsg("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }
      const { error: pwErr } = await supabase.auth.updateUser({
        password: pwd1,
      });
      if (pwErr) {
        setMsg(pwErr.message);
        setLoading(false);
        return;
      }
    }

    setMsg("Profil mis à jour ✅");
    setLoading(false);
  }

  async function deleteAccount() {
    if (!confirm("Supprimer définitivement votre compte ?")) return;
    setLoading(true);

    // Supprimer données annexes
    const userId = (await supabase.auth.getUser()).data.user?.id;
    await supabase.from("holerites").delete().eq("user_id", userId);
    // …supprime aussi profile
    await supabase.from("profiles").delete().eq("id", userId);

    // Supprime le compte auth (edge fonction admin ou RPC)
    const { error } = await supabase.functions.invoke("delete-user", {
      body: { uid: userId },
    });
    if (error) alert(error.message);
    else router.push("/goodbye");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Prénom"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Nom"
          value={last}
          onChange={(e) => setLast(e.target.value)}
        />
      </div>

      <input
        className="border p-2 w-full bg-gray-100"
        value={email}
        disabled
      />

      <hr />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Nouveau mot de passe"
        value={pwd1}
        onChange={(e) => setPwd1(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Confirmer mot de passe"
        value={pwd2}
        onChange={(e) => setPwd2(e.target.value)}
      />

      {msg && <p className="text-sm text-red-600">{msg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? "…Enregistrement" : "Enregistrer"}
      </button>

      <button
        type="button"
        onClick={deleteAccount}
        className="text-sm text-red-600 ml-4"
      >
        Supprimer mon compte
      </button>
    </form>
  );
} 