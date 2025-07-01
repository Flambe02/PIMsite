"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCountry } from "@/app/admin/actions"
import { useRouter } from "next/navigation"

export function AddCountryForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createCountry(formData)
      
      if (result.success) {
        // Close the dialog and refresh the page
        router.refresh()
        // You might want to close the dialog here if you have access to it
      } else {
        setError(result.error || 'Failed to create country')
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
          placeholder="Ex: Brasil"
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
          placeholder="Ex: BRA"
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
          placeholder="Ex: BRL"
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
          placeholder="Ex: R$"
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
          placeholder="2025"
          defaultValue="2025"
          min="2020"
          max="2030"
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar País"}
        </Button>
      </div>
    </form>
  )
} 