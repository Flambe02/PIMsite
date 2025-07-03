import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PIM',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <footer className="flex flex-col sm:flex-row items-center justify-between py-4 w-full border-t px-4 md:px-6 bg-emerald-50 mt-auto text-sm">
            <div className="flex items-center mb-2 sm:mb-0 flex-col items-start">
              <div className="flex items-center">
                <img src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={28} height={28} className="h-7 w-auto mr-2" />
                <span className="font-bold text-emerald-700">Pimentão Rouge Company</span>
                <span className="text-[10px] text-gray-400 ml-2">V0.1.0</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 text-center sm:text-left max-w-md leading-snug mb-2 sm:mb-0">
              Nossa missão: ajudar todos os brasileiros a entender e otimizar seus benefícios  de forma simples, segura e transparente.<br/>
            </div>
            <nav className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 items-center">
              <a className="hover:underline underline-offset-4 text-emerald-700" href="#">Termos de Serviço</a>
              <a className="hover:underline underline-offset-4 text-emerald-700" href="#">Privacidade</a>
              <a className="hover:underline underline-offset-4 text-emerald-700" href="#">Sobre</a>
              <a className="hover:underline underline-offset-4 text-emerald-700" href="#">Contato</a>
              <a className="hover:underline underline-offset-4 text-emerald-700" href="#">FAQ</a>
              <span className="flex gap-2 ml-2">
                <a href="#" aria-label="Instagram" className="text-emerald-700 hover:text-emerald-900"><svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" /></svg></a>
                <a href="#" aria-label="LinkedIn" className="text-emerald-700 hover:text-emerald-900"><svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" /></svg></a>
                <a href="#" aria-label="Twitter" className="text-emerald-700 hover:text-emerald-900"><svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path d="M5 15c6 0 9-5 9-9v-1a6 6 0 0 0 1-1" /></svg></a>
              </span>
            </nav>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
