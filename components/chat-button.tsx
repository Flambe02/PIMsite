"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Show the button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Add animation class when visible
  const buttonClasses = `fixed bottom-6 right-6 z-50 transition-all duration-300 ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`

  return (
    <>
      <div className={buttonClasses}>
        {isOpen ? (
          <div className="bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Image
                  src="/images/pim-avatar.png"
                  alt="PIM"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-emerald-200 mr-2"
                />
                <h3 className="font-medium">PIM - Assistente Financeiro</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Olá! Sou o PIM, seu assistente financeiro. Posso analisar seu holerite e encontrar oportunidades de
              economia!
            </p>
            <Link href="/chat-com-pim">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Conversar com PIM</Button>
            </Link>
          </div>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg flex items-center justify-center sticky-cta"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>
    </>
  )
}
