import { CountryExplorer } from "@/components/country-explorer"
import { Logo } from "@/components/logo"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/server'

export default async function CountryGuidePage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('code, name')
    .order('name', { ascending: true })

  let countries = data ?? []
  if (error || !data) {
    countries = []
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Início
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/recursos">
            Recursos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/guia-paises">
            Guia de Países
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/sobre">
            Sobre
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Cadastrar
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <CountryExplorer countries={countries} />
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <div className="flex items-center">
          <Image src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={32} height={32} className="h-8 w-auto mr-2" />
          <p className="text-xs text-gray-500">© 2025 The Pimentão Rouge Company. Todos os direitos reservados.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}
