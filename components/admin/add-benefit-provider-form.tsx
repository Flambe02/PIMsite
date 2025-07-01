"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createBenefitProvider } from "@/app/admin/actions"

export function AddBenefitProviderForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  return (
    <form
      action={async (formData: FormData) => {
        setError(null)
        startTransition(async () => {
          const result = await createBenefitProvider(formData)
          if (!result.success) {
            setError(result.error || "Erreur inconnue")
          }
        })
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required disabled={isPending} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" disabled={isPending} />
      </div>
      <div>
        <Label htmlFor="website_url">Site Web</Label>
        <Input id="website_url" name="website_url" type="url" required disabled={isPending} />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Ajout..." : "Ajouter"}
      </Button>
    </form>
  )
} 