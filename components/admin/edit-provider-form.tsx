"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateBenefitProvider } from "@/app/admin/actions"

interface Provider {
  id: string
  name: string
  description: string
  website_url: string
}

interface EditProviderFormProps {
  provider: Provider
}

export function EditProviderForm({ provider }: EditProviderFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  return (
    <form
      action={async (formData: FormData) => {
        setError(null)
        startTransition(async () => {
          const result = await updateBenefitProvider(formData, provider.id)
          if (!result.success) {
            setError(result.error || "Erreur inconnue")
          }
        })
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={provider.name}
          required 
          disabled={isPending} 
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          name="description" 
          defaultValue={provider.description}
          disabled={isPending} 
        />
      </div>
      <div>
        <Label htmlFor="website_url">Site Web</Label>
        <Input 
          id="website_url" 
          name="website_url" 
          type="url" 
          defaultValue={provider.website_url}
          required 
          disabled={isPending} 
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Mise à jour..." : "Mettre à jour"}
      </Button>
    </form>
  )
} 