"use client"

import CreateAccount from "@/components/CreateAccount"
import { useSearchParams } from "next/navigation"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Crie sua conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou {" "}
            <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              entre na sua conta existente
            </a>
          </p>
        </div>
            {message && (
          <div className="mb-4 text-red-600 text-center font-medium">{message}</div>
        )}
        <CreateAccount />
      </div>
    </div>
  )
} 