"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from './logo'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet'
import { DialogTitle } from './ui/dialog'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/calculadora', label: 'Calculadora' },
  { href: '/guia-paises', label: 'Guia de Países' },
  { href: '/precos', label: 'Preços' },
  { href: '/sobre', label: 'Sobre' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => setOpen(false)

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40 w-full">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        <Logo />
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:underline underline-offset-4 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm" className="rounded-full px-6 py-2">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-6 py-2 text-white">
              Cadastrar
            </Button>
          </Link>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden">
          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Ouvrir le menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <DialogTitle className="sr-only">Menu principal</DialogTitle>
                <div className="flex flex-col gap-2 p-6">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium py-2"
                      onClick={handleClose}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/login" onClick={handleClose}>
                      <Button variant="outline" size="sm" className="w-full rounded-full px-6 py-2">
                        Entrar
                      </Button>
                    </Link>
                    <Link href="/cadastro" onClick={handleClose}>
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full px-6 py-2 text-white">
                        Cadastrar
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button variant="outline" size="icon" aria-label="Ouvrir le menu">
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
} 