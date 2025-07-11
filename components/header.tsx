"use client";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Menu, UserCircle } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="w-full border-b bg-white sticky top-0 z-30">
      <div className="max-w-[1280px] mx-auto grid grid-cols-12 items-center h-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Hamburger mobile */}
        <button className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-white border rounded-full p-2 shadow-md" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-7 h-7" />
        </button>
        {/* Logo aligné avec la sidebar */}
        <div className="col-span-3 xl:col-span-2 flex items-center">
        <Logo />
        </div>
        {/* Espace central vide (pour centrer le logo) */}
        <div className="hidden lg:block col-span-6 xl:col-span-7"></div>
        {/* Actions alignées à droite (desktop only) */}
        <div className="hidden lg:flex col-span-3 xl:col-span-3 items-center justify-end gap-4">
          <Link href="/recursos" className="text-sm px-5 py-2 h-11 flex items-center rounded-full font-semibold shadow-sm border border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap">Recursos</Link>
          <Link href="/guia-paises" className="text-sm px-5 py-2 h-11 flex items-center rounded-full font-semibold shadow-sm border border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap">Guia dos Países</Link>
          <Link href="/dashboard" className="text-sm px-5 py-2 h-11 flex items-center rounded-full font-semibold shadow-sm border border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap">Dashboard</Link>
          <HeaderClient />
        </div>
        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-[80vw] max-w-xs bg-emerald-50 h-full p-6 flex flex-col gap-8 animate-fadeIn shadow-2xl">
              <button className="self-end mb-4 text-gray-500 text-3xl" onClick={() => setMobileMenuOpen(false)}>&times;</button>
              <nav className="flex flex-col gap-4 w-full mt-8">
                <Link href="/recursos" className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all" onClick={() => setMobileMenuOpen(false)}>Recursos</Link>
                <Link href="/guia-paises" className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all" onClick={() => setMobileMenuOpen(false)}>Guia dos Países</Link>
                <Link href="/dashboard" className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Link href="/profile" className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all" onClick={() => setMobileMenuOpen(false)}>Perfil</Link>
                <div className="mt-6 flex flex-col gap-3">
                  <HeaderClient />
                </div>
        </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
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
        {/* <Link href="/dashboard" className="text-sm px-3 py-1 border rounded">Dashboard</Link> */}
        <Link href="/profile" className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 hover:bg-emerald-50 transition-colors" title="Perfil">
          <UserCircle className="w-6 h-6 text-emerald-700" />
        </Link>
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