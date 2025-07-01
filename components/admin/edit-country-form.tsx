"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateCountry } from "@/app/admin/actions"
import { useRouter } from "next/navigation"

type EditCountryFormProps = {
  country: {
    id: string
    name: string
    code: string
    currency_code: string
    currency_symbol: string
    tax_year: number
    is_active: boolean
  }
}

export function EditCountryForm({ country }: EditCountryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    try {
      const result = await updateCountry(formData, country.id)
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Failed to update country')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do País</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={country.name}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">Código do País</Label>
        <Input
          id="code"
          name="code"
          type="text"
          defaultValue={country.code}
          required
          maxLength={3}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currency_code">Código da Moeda</Label>
        <Input
          id="currency_code"
          name="currency_code"
          type="text"
          defaultValue={country.currency_code}
          required
          maxLength={3}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currency_symbol">Símbolo da Moeda</Label>
        <Input
          id="currency_symbol"
          name="currency_symbol"
          type="text"
          defaultValue={country.currency_symbol}
          required
          maxLength={5}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tax_year">Ano Fiscal</Label>
        <Input
          id="tax_year"
          name="tax_year"
          type="number"
          defaultValue={country.tax_year}
          min="2020"
          max="2030"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="is_active">Ativo?</Label>
        <select
          id="is_active"
          name="is_active"
          defaultValue={country.is_active ? 'true' : 'false'}
          disabled={isLoading}
          className="w-full border rounded h-10 px-2"
        >
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
} 