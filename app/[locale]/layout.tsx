import { notFound } from 'next/navigation';
import { Header } from '@/components/header'
import Image from "next/image";
import '../globals.css';

// Can be imported from a shared config
const locales = ['br', 'fr', 'en', 'fr-ca', 'pt-pt', 'en-gb'];

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Enable static rendering
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {/* Footer global simplifié */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6 bg-white items-center justify-between">
        <div className="flex items-center">
          <Image src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={32} height={32} className="h-8 w-auto mr-2" />
          <span className="font-bold text-emerald-200">Pimentão Rouge Company</span>
          <span className="text-[10px] text-gray-400 ml-2">V2.0.0</span>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="hover:bg-[#223c2c] hover:text-emerald-200 px-3 py-1 rounded-full transition" href="#">Termos de Serviço</a>
          <a className="hover:bg-[#223c2c] hover:text-emerald-200 px-3 py-1 rounded-full transition" href="#">Privacidade</a>
          <a className="hover:bg-[#223c2c] hover:text-emerald-200 px-3 py-1 rounded-full transition" href="#">Sobre</a>
          <a className="hover:bg-[#223c2c] hover:text-emerald-200 px-3 py-1 rounded-full transition" href="#">Contato</a>
          <a className="hover:bg-[#223c2c] hover:text-emerald-200 px-3 py-1 rounded-full transition" href="#">FAQ</a>
        </nav>
      </footer>
    </div>
  );
}
