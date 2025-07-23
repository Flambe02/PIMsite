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
      <footer className="w-full border-t bg-white flex flex-col items-center justify-center py-3 px-2 text-xs text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Image src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={24} height={24} className="h-6 w-auto" />
          <span className="font-bold text-emerald-700">Pimentão Rouge</span>
          <span className="text-[10px] text-gray-400 ml-1">V2.0.0</span>
        </div>
        <nav className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-center justify-center">
          <a className="hover:underline" href="#">Termos</a>
          <a className="hover:underline" href="#">Privacidade</a>
          <a className="hover:underline" href="#">Sobre</a>
          <a className="hover:underline" href="#">Contato</a>
          <a className="hover:underline" href="#">FAQ</a>
        </nav>
      </footer>
    </div>
  );
}
