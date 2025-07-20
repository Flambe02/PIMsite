import { notFound } from 'next/navigation';
import { Header } from '@/components/header'
import Image from "next/image";
import '../globals.css';
import { getMessages, isValidLocale } from '@/lib/i18n-simple';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) notFound();

  // Get messages for the current locale
  const messages = getMessages(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {/* Footer global simplifié */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6 bg-white items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
            <path d="M12 18L13.09 14.26L20 13L13.09 12.74L12 6L10.91 12.74L4 13L10.91 14.26L12 18Z" fill="white"/>
          </svg>
        </div>
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
