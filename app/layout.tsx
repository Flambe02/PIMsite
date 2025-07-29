import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { SupabaseProvider } from "@/components/supabase-provider";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { createClient } from "@/lib/supabase/server";
import { LocaleHandler } from "@/components/LocaleHandler";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PIM',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return (
    <html lang="br">
      <body className={inter.className}>
        <LocaleHandler />
        <SupabaseProvider initialSession={session}>
          <ReactQueryProvider>
            {children}
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </ReactQueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
} 