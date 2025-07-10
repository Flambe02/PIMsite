"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Criar uma conta</h2>
            <p className="mt-2 text-sm text-gray-600">
              Preencha o formulário para criar sua conta.
            </p>
          </div>
          <Card className="rounded-2xl shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle>Cadastro</CardTitle>
              <CardDescription>Insira suas informações para se cadastrar</CardDescription>
            </CardHeader>
            <CardContent>
              <form action="/auth/signup" method="POST" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Seu email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Crie uma senha"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Confirme a senha"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full px-6 py-3 font-semibold bg-emerald-600 hover:bg-emerald-700 shadow">
                  Criar minha conta
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-500 font-medium">
                  Entrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6 bg-white/80 backdrop-blur-md">
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