"use client";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Menu, UserCircle, Shield, ChevronDown, X } from "lucide-react";
import LoginModal from "@/components/auth/LoginModal";
import { useAdmin } from "@/hooks/useAdmin";
import { useCountry, useCountryInfo } from "@/lib/geo";
import { useTranslations } from '@/hooks/useTranslations';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const { isAdmin, loading, error } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  
  // Utilisation du nouveau hook useCountry
  const currentCountry = useCountry();
  const countryInfo = useCountryInfo();
  
  const switchCountry = (newCountry: 'br' | 'fr') => {
    const pathWithoutLocale = pathname.replace(/^\/(br|fr)/, '') || '/';
    const newPathname = newCountry === 'br' ? pathWithoutLocale : `/${newCountry}${pathWithoutLocale}`;
    router.push(newPathname);
    setCountryMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full border-b bg-[#1a2e22] shadow-md sticky top-0 z-30">
        {/* Container mobile-first avec flex-col par défaut */}
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between h-16 px-4 sm:px-6 lg:px-8 relative">
          
          {/* Section gauche : Logo et menu mobile */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Hamburger mobile - plus discret */}
            <button 
              className="md:hidden flex items-center justify-center w-8 h-8 bg-[#223c2c] border border-[#3a5c47] rounded-lg text-white hover:bg-[#2e4a38] transition-colors" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
            
            {/* Logo - centré sur mobile, aligné à gauche sur desktop */}
            <div className="flex items-center justify-center md:justify-start flex-1 md:flex-none">
              <Logo />
            </div>
            
            {/* Sélecteur de pays mobile - plus compact */}
            <div className="md:hidden relative">
              <button
                onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 text-white hover:text-emerald-300 transition-colors rounded text-xs"
                aria-label="Sélectionner le pays"
              >
                <span className="font-medium">{countryInfo.flag} {countryInfo.code.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${countryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {countryMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                  <button
                    onClick={() => switchCountry('br')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm ${
                      currentCountry === 'br' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-base">🇧🇷</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">Brasil</span>
                      <span className="text-xs text-gray-500">PT</span>
                    </div>
                  </button>
                  <button
                    onClick={() => switchCountry('fr')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm ${
                      currentCountry === 'fr' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-base">🇫🇷</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">France</span>
                      <span className="text-xs text-gray-500">FR</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation desktop - cachée sur mobile */}
          <nav className="hidden md:flex items-center justify-center gap-4 flex-1 max-w-2xl">
            <Link 
              href={`/${currentCountry}/recursos`} 
              className="text-white px-4 py-2 h-10 flex items-center rounded-full font-semibold shadow-sm border border-[#3a5c47] bg-[#223c2c] hover:bg-[#2e4a38] hover:text-emerald-300 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap"
            >
              {t.navigation?.recursos || 'Recursos'}
            </Link>
            <Link 
              href={`/${currentCountry}/guia-paises`} 
              className="text-white px-4 py-2 h-10 flex items-center rounded-full font-semibold shadow-sm border border-[#3a5c47] bg-[#223c2c] hover:bg-[#2e4a38] hover:text-emerald-300 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap"
            >
              {t.navigation?.['guia-paises'] || 'Guia dos Países'}
            </Link>
            <Link 
              href={`/${currentCountry}/dashboard`} 
              className="text-white px-4 py-2 h-10 flex items-center rounded-full font-semibold shadow-sm border border-[#3a5c47] bg-[#223c2c] hover:bg-[#2e4a38] hover:text-emerald-300 transition-all duration-150 focus:ring-2 focus:ring-emerald-300 whitespace-nowrap"
            >
              {t.navigation?.dashboard || 'Dashboard'}
            </Link>
          </nav>

          {/* Actions droite - desktop seulement */}
          <div className="hidden md:flex items-center justify-end gap-4">
            {/* Sélecteur de pays desktop */}
            <div className="relative">
              <button
                onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 text-white hover:text-emerald-300 transition-colors rounded-lg"
                aria-label="Sélectionner le pays"
              >
                <span className="text-sm font-medium">{countryInfo.flag} {countryInfo.code.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${countryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {countryMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-50">
                  <button
                    onClick={() => switchCountry('br')}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${
                      currentCountry === 'br' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
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
                      currentCountry === 'fr' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
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
        </div>

        {/* Menu mobile - plus discret et élégant */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/20 flex md:hidden" role="dialog" aria-modal="true">
            {/* Menu latéral discret */}
            <div className="w-72 bg-white h-full flex flex-col shadow-2xl">
              {/* Header du menu mobile - plus compact */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Menu</h2>
                <button 
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors" 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Navigation mobile - plus compacte */}
              <nav className="flex flex-col flex-1 p-4 gap-1" aria-label="Navigation mobile principale">
                <Link 
                  href={`/${currentCountry}/recursos`} 
                  className="text-base font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.navigation?.recursos || 'Recursos'}
                </Link>
                <Link 
                  href={`/${currentCountry}/guia-paises`} 
                  className="text-base font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.navigation?.['guia-paises'] || 'Guia dos Países'}
                </Link>
                <Link 
                  href={`/${currentCountry}/dashboard`} 
                  className="text-base font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.navigation?.dashboard || 'Dashboard'}
                </Link>
                  <Link 
                    href={`/${currentCountry}/profile`} 
                    className="text-base font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                  {currentCountry === 'br' ? 'Perfil' : 'Profil'}
                  </Link>
                
                {/* Admin panel mobile */}
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-base font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                
                {/* Sélecteur de pays mobile - plus compact */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500 mb-2 block px-3">Pays</span>
                  <div className="space-y-1">
                  <button 
                      onClick={() => switchCountry('br')}
                      className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                        currentCountry === 'br' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">🇧🇷</span>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">Brasil</span>
                        <span className="text-xs text-gray-500">PT</span>
                      </div>
                  </button>
                    <button
                      onClick={() => switchCountry('fr')}
                      className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                        currentCountry === 'fr' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">🇫🇷</span>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">France</span>
                        <span className="text-xs text-gray-500">FR</span>
                      </div>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
            
            {/* Overlay pour fermer le menu */}
            <div 
              className="flex-1" 
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
          </div>
        )}
      </header>
    </>
  );
}

function HeaderClient() {
  const [session, setSession] = useState<unknown>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin } = useAdmin();
  const currentCountry = useCountry();
  
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
    router.push("/");
  }

  if (session) {
    return (
      <>
        {/* Lien Admin pour les utilisateurs admin */}
        {isAdmin && (
          <Link 
            href="/admin" 
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#eaf6f0] hover:bg-emerald-50 transition-colors" 
            title="Admin Panel"
          >
            <Shield className="w-5 h-5 text-emerald-700" />
          </Link>
        )}
        <Link 
          href={`/${currentCountry}/profile`} 
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2e22] hover:bg-emerald-50 transition-colors" 
          title={currentCountry === 'br' ? 'Perfil' : 'Profil'}
        >
          <UserCircle className="w-5 h-5 text-emerald-700" />
        </Link>
        <button 
          onClick={handleLogout} 
          className="text-xs px-2 py-1 border rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          {currentCountry === 'br' ? 'Sair' : 'Déconnexion'}
        </button>
      </>
    );
  }
  return (
    <>
      <button
        onClick={() => {
          if (pathname === "/login") {
            router.push("/login");
          } else {
            setLoginOpen(true);
          }
        }}
        className="text-xs px-2 py-1 border rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
      >
        {currentCountry === 'br' ? 'Entrar' : 'Connexion'}
      </button>
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
} 