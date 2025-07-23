"use client";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { useParams } from "next/navigation";
import { Menu, UserCircle, Shield, ChevronDown } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const { isAdmin, loading, error } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { session } = useSupabase(); // Récupérer la session ici
  
  const getCurrentLocale = () => {
    const localeMatch = pathname.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
    return localeMatch ? localeMatch[1] : 'br';
  };

  const currentLocale = getCurrentLocale();

  const switchCountry = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    const newPathname = newLocale === 'br' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;
    router.push(newPathname);
    setCountryMenuOpen(false);
  };

  const getCountryInfo = (locale: string) => {
    switch(locale) {
      case 'br':
        return { flag: '🇧🇷', name: 'Brasil', code: 'BR', language: 'PT' };
      case 'fr':
        return { flag: '🇫🇷', name: 'France', code: 'FR', language: 'FR' };
      default:
        return { flag: '🇧🇷', name: 'Brasil', code: 'BR', language: 'PT' };
    }
  };

  const currentCountry = getCountryInfo(currentLocale);

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!session) {
      e.preventDefault(); // Empêche la navigation du Link
      router.push(`/${currentLocale}/login`);
    }
  };

  return (
    <>
      <header className="w-full border-b bg-[#1a2e22] shadow-md sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto grid grid-cols-12 items-center h-16 px-4 sm:px-6 lg:px-8 relative">
          {/* Hamburger mobile */}
          <button className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-[#223c2c] border border-[#3a5c47] rounded-full p-2 shadow-md text-white hover:bg-[#2e4a38] transition" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-7 h-7" />
          </button>
          {/* Logo aligné avec la sidebar */}
          <div className="col-span-3 xl:col-span-2 flex items-center gap-4">
            <Logo />
          </div>
          {/* Espace central vide (pour centrer le logo) */}
          <div className="hidden lg:block col-span-6 xl:col-span-7"></div>
          {/* Actions alignées à droite (desktop only) */}
          <div className="hidden lg:flex col-span-3 xl:col-span-3 items-center justify-end gap-4">
            <Link href="/br/recursos" className="text-white px-5 py-2 h-11 flex items-center rounded-full font-semibold shadow-sm border border-[#3a5c47] bg-[#223c2c] hover:bg-[#2e4a38] hover:text-emerald-300 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap">Recursos</Link>
            <Link href="/br/guia-paises" className="text-white px-5 py-2 h-11 flex items-center rounded-full font-semibold shadow-sm border border-[#3a5c47] bg-[#223c2c] hover:bg-[#2e4a38] hover:text-emerald-300 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap">Guia dos Países</Link>
            <Link 
              href={`/${currentLocale}/dashboard`} 
              onClick={handleDashboardClick}
              className="text-white px-5 py-2 h-11 flex items-center rounded-full font-semibold shadow-sm border border-[#3a5c47] bg-[#223c2c] hover:bg-[#2e4a38] hover:text-emerald-300 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap"
            >
              Dashboard
            </Link>
            <div className="relative ml-2">
              <button
                onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 text-white hover:text-emerald-300 transition-all duration-150"
              >
                <span className="text-sm font-medium">{currentCountry.code} {currentCountry.language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${countryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {countryMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-50">
                  <button
                    onClick={() => switchCountry('br')}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${
                      currentLocale === 'br' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">🇧🇷</span>
                    <div className="flex flex-col">
                      <span className="font-medium">Brasil</span>
                      <span className="text-xs text-gray-500">Português</span>
                    </div>
                  </button>
                  <button
                    onClick={() => switchCountry('fr')}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${
                      currentLocale === 'fr' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">🇫🇷</span>
                    <div className="flex flex-col">
                      <span className="font-medium">France</span>
                      <span className="text-xs text-gray-500">Français</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
            <HeaderClient />
          </div>
          {/* Mobile drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex" role="dialog" aria-modal="true">
              <div className="w-[80vw] max-w-xs bg-emerald-50 h-full p-6 flex flex-col gap-8 animate-fadeIn shadow-2xl">
                <button className="self-end mb-4 text-gray-500 text-3xl" onClick={() => setMobileMenuOpen(false)}>&times;</button>
                <nav className="flex flex-col gap-4 w-full mt-8" aria-label="Navigation mobile principale">
                  <Link href="/br/recursos" className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all" onClick={() => setMobileMenuOpen(false)}>Recursos</Link>
                  <Link href="/br/guia-paises" className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all" onClick={() => setMobileMenuOpen(false)}>Guia dos Países</Link>
                  <Link 
                    href={`/${currentLocale}/dashboard`} 
                    onClick={(e) => {
                      handleDashboardClick(e);
                      setMobileMenuOpen(false);
                    }}
                    className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all" 
                  >
                    Dashboard
                  </Link>
                  <Link href="/br/profile" className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all" onClick={() => setMobileMenuOpen(false)}>Perfil</Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-emerald-100 border-b border-emerald-100 transition-all flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <Shield className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}
                  {/* Sélecteur de pays mobile avec langue automatique */}
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Pays</span>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          switchCountry('br');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 ${
                          currentLocale === 'br' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">🇧🇷</span>
                        <div className="flex flex-col">
                          <span className="font-medium">Brasil</span>
                          <span className="text-xs text-gray-500">Português</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          switchCountry('fr');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 ${
                          currentLocale === 'fr' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">🇫🇷</span>
                        <div className="flex flex-col">
                          <span className="font-medium">France</span>
                          <span className="text-xs text-gray-500">Français</span>
                        </div>
                      </button>
                    </div>
                  </div>
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
    </>
  );
}

function HeaderClient() {
  const router = useRouter();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : Array.isArray(params.locale) ? params.locale[0] : 'br';
  const { isAdmin } = useAdmin();
  const { supabase, session } = useSupabase();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  }

  // Rendu pour utilisateur connecté (Sair, Profil, etc.)
  if (session) {
    return (
      <>
        {isAdmin && (
          <Link 
            href="/admin" 
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#eaf6f0] hover:bg-emerald-50 transition-colors" 
            title="Admin Panel"
          >
            <Shield className="w-6 h-6 text-emerald-700" />
          </Link>
        )}
        <Link href={`/${locale}/profile`} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1a2e22] hover:bg-emerald-50 transition-colors" title="Perfil">
          <UserCircle className="w-6 h-6 text-emerald-700" />
        </Link>
        <button onClick={handleLogout} className="text-sm px-3 py-1 border rounded bg-red-500 text-white">Sair</button>
      </>
    );
  }

  // Rendu pour utilisateur non connecté (Entrar)
  return (
      <Link 
        href={`/${locale}/login`}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full shadow transition text-lg"
      >
        Entrar
      </Link>
  );
} 