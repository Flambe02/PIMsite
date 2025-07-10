"use client";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export function Header() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
        <Logo />
        {/* Partie navigation et actions */}
        <nav className="flex items-center gap-4">
          {/* Onglets toujours visibles */}
          <Link href="/recursos" className="text-sm px-3 py-1 border rounded">Recursos</Link>
          <Link href="/guia-paises" className="text-sm px-3 py-1 border rounded">Guia dos Países</Link>
          {/* Partie client (session, login, logout) */}
          <HeaderClient />
        </nav>
      </div>
    </header>
  );
}

function HeaderClient() {
  const [session, setSession] = useState<unknown>(null);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase, setSession]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (session) {
    return (
      <>
        <Link href="/dashboard" className="text-sm px-3 py-1 border rounded">Dashboard</Link>
        <Link href="/profile" className="text-sm px-3 py-1 border rounded">Perfil</Link>
        <button onClick={handleLogout} className="text-sm px-3 py-1 border rounded bg-red-500 text-white">Sair</button>
      </>
    );
  }
  return (
    <>
      <Link href="/signup" className="text-sm px-3 py-1 border rounded hover:bg-gray-50">Criar conta</Link>
      <Link href="/login" className="text-sm px-3 py-1 border rounded bg-emerald-600 text-white hover:bg-emerald-700">Entrar</Link>
    </>
  );
} 