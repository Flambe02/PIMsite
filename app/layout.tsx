import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { SupabaseProvider } from "@/components/supabase-provider";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { createClient } from "@/lib/supabase/server";

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
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Définir la langue basée sur l'URL (côté client uniquement)
              if (typeof window !== 'undefined') {
                const path = window.location.pathname;
                const localeMatch = path.match(/^\/([a-z]{2}(-[a-z]{2})?)/);
                const locale = localeMatch ? localeMatch[1] : 'br';
                document.documentElement.lang = locale;
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
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