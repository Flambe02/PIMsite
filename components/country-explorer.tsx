"use client"

import { useState } from "react"
import { Search, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getEmojiFlag } from "@/lib/utils"
import Link from "next/link"

type Country = { code: string; name: string }
type CountryExplorerProps = { countries: Country[] }

export function CountryExplorer({ countries }: CountryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4 py-12">
          <h1 className="text-4xl font-bold tracking-tight text-blue-900">Country Guides</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Seu guia para gerenciar equipes internacionais e entender requisitos locais de folha de pagamento,
            benefícios e conformidade
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar país (ex: Brasil, BR)"
              className="pl-10 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredCountries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCountries.map((country) => (
              <Link
                key={country.code}
                href={`/guia-paises/${country.code.toLowerCase()}`}
                className="bg-white rounded-2xl shadow-md border hover:shadow-lg transition-shadow p-6 flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  {getEmojiFlag(country.code)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold group-hover:text-emerald-600 transition-colors">{country.name}</h3>
                  <p className="text-gray-500 text-sm">Explorar guia completo</p>
                </div>
                <Globe className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum país encontrado</h3>
            <p className="text-gray-600">
              Tente ajustar sua busca ou entre em contato conosco para adicionar um novo país.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
