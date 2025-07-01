"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, X, Minimize2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type MessageType = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

const initialMessages: MessageType[] = [
  {
    id: "1",
    content: "Olá! Sou o PIM em modo rápido. Como posso ajudar?",
    sender: "assistant",
    timestamp: new Date(),
  },
]

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  // Show widget after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate PIM thinking and responding
    setTimeout(() => {
      const quickResponses = [
        "Entendi! Posso te ajudar com isso. Você poderia fornecer mais detalhes sobre seu holerite?",
        "Claro! Para analisar melhor sua situação, preciso saber se você é CLT ou PJ. Pode me informar?",
        "Ótima pergunta! Existem várias maneiras de otimizar seus benefícios. Gostaria de discutir isso em mais detalhes na conversa completa?",
        "Isso é interessante! Para uma análise mais detalhada, recomendo usar a conversa completa onde posso analisar seu holerite.",
        "Posso te ajudar com isso! Para uma análise completa, que tal usar o chat principal? Lá posso te dar recomendações mais detalhadas.",
      ]

      const responseIndex = Math.floor(Math.random() * quickResponses.length)

      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: quickResponses[responseIndex],
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed bottom-20 right-6 z-40 transition-all duration-300 ease-in-out ${
        isMinimized ? "w-auto h-auto" : "w-80 h-96"
      }`}
    >
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-12 w-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg flex items-center justify-center"
        >
          <Image src="/images/pim-avatar.png" alt="PIM" width={30} height={30} className="rounded-full" />
        </Button>
      ) : (
        <div className="flex flex-col h-full rounded-lg shadow-xl border border-gray-200 bg-white overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-emerald-600 text-white">
            <div className="flex items-center">
              <Image src="/images/pim-avatar.png" alt="PIM" width={24} height={24} className="rounded-full mr-2" />
              <span className="font-medium text-sm">Chat Rápido com PIM</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-emerald-700 rounded-full"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-emerald-700 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex max-w-[85%]">
                  {message.sender === "assistant" && (
                    <div className="mr-1.5 flex-shrink-0 self-end">
                      <Image src="/images/pim-avatar.png" alt="PIM" width={20} height={20} className="rounded-full" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-2 text-sm ${
                      message.sender === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {message.content}
                    <div className={`text-xs mt-1 ${message.sender === "user" ? "text-emerald-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="mr-1.5 flex-shrink-0 self-end">
                    <Image src="/images/pim-avatar.png" alt="PIM" width={20} height={20} className="rounded-full" />
                  </div>
                  <div className="rounded-lg p-2 bg-white border border-gray-200">
                    <div className="flex space-x-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-1">
              <div className="flex-1 bg-gray-50 rounded border border-gray-300 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mensagem rápida..."
                  className="min-h-[40px] max-h-[100px] text-sm border-0 focus-visible:ring-0 resize-none py-2 px-3"
                />
              </div>
              <Button
                className="rounded-full h-8 w-8 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700"
                size="icon"
                onClick={handleSend}
                disabled={input.trim() === ""}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-1 text-xs text-center text-gray-500">Chat rápido para perguntas simples</div>
          </div>
        </div>
      )}
    </div>
  )
}
