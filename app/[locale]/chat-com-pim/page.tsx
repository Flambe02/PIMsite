"use client"

import dynamic from "next/dynamic"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Upload, Paperclip } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

const FloatingChatWidget = dynamic(() => import("@/components/floating-chat-widget").then(m => m.FloatingChatWidget), {
  loading: () => <div className="fixed bottom-20 right-6 z-40 p-4 bg-white rounded-lg shadow">Chargement du chat rapide...</div>,
  ssr: false
})

type MessageType = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  attachmentUrl?: string
}

const initialMessages: MessageType[] = [
  {
    id: "1",
    content:
      "Olá! Eu sou o PIM, seu assistente virtual especializado em análise de holerite e questões financeiras. Estou aqui para ajudar você a entender melhor sua situação financeira e encontrar oportunidades de otimização.\n\nComo posso te ajudar hoje?\n\n• Analisar seu holerite\n• Calcular seu salário líquido\n• Comparar regimes CLT e PJ\n• Informações sobre Imposto de Renda para PJ\n• Oferecer dicas de planejamento financeiro\n• Responder dúvidas sobre impostos e benefícios",
    sender: "assistant",
    timestamp: new Date(),
  },
]

export default function ChatComPim() {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [uploadMode, setUploadMode] = useState(false)
  const [payrollType, setPayrollType] = useState<"CLT" | "PJ" | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (message?: string) => {
    const messageToSend = message || input.trim()
    if (messageToSend === "") return

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate PIM thinking and responding
    setTimeout(() => {
      let responseContent = ""

      // If payroll type not selected yet, determine it from the message
      if (!payrollType) {
        if (
          input.toLowerCase().includes("clt") ||
          input.toLowerCase().includes("carteira") ||
          input.toLowerCase().includes("contratado")
        ) {
          setPayrollType("CLT")
          responseContent =
            "Entendi que você é CLT! Pode me enviar uma foto do seu holerite ou me contar os principais valores? Preciso saber seu salário bruto, descontos de INSS, IRRF e outros benefícios para te ajudar melhor."
        } else if (
          input.toLowerCase().includes("pj") ||
          input.toLowerCase().includes("cnpj") ||
          input.toLowerCase().includes("empresa")
        ) {
          setPayrollType("PJ")
          responseContent =
            "Entendi que você é PJ! Pode me informar seu faturamento mensal, valor do pró-labore, regime tributário (Simples Nacional, Lucro Presumido) e principais despesas? Assim posso te ajudar a otimizar sua situação fiscal."
        } else {
          responseContent =
            "Você poderia me dizer se você é CLT ou PJ? Isso vai me ajudar a personalizar minhas recomendações para você."
        }
      } else if (payrollType === "CLT") {
        // Analyze CLT information
        if (
          input.toLowerCase().includes("salário") ||
          input.toLowerCase().includes("bruto") ||
          input.toLowerCase().includes("r$")
        ) {
          responseContent =
            "Obrigado pelas informações! Baseado no que você compartilhou, vejo algumas oportunidades:\n\n1️⃣ Você poderia otimizar suas deduções de IR com previdência privada\n2️⃣ Verifique se sua empresa oferece benefícios flexíveis\n3️⃣ Considere a declaração completa de IR\n\nQuer que eu detalhe alguma dessas oportunidades?"
        } else {
          responseContent =
            "Entendi! Para te ajudar melhor com seu holerite CLT, preciso de algumas informações como:\n• Salário bruto\n• Descontos de INSS e IRRF\n• Benefícios recebidos (VR, VA, plano de saúde)\n\nVocê pode compartilhar esses valores ou enviar uma foto do seu holerite."
        }
      } else if (payrollType === "PJ") {
        // Analyze PJ information
        if (
          input.toLowerCase().includes("faturamento") ||
          input.toLowerCase().includes("pró-labore") ||
          input.toLowerCase().includes("r$")
        ) {
          responseContent =
            "Obrigado pelas informações! Como PJ, vejo estas oportunidades:\n\n1️⃣ Otimização do pró-labore para reduzir a carga tributária\n2️⃣ Revisão das despesas dedutíveis do seu negócio\n3️⃣ Verificação do enquadramento tributário ideal\n\nGostaria de saber mais sobre alguma dessas estratégias?"
        } else {
          responseContent =
            "Para te ajudar como PJ, preciso saber:\n• Seu faturamento mensal médio\n• Valor do pró-labore atual\n• Regime tributário (Simples, Lucro Presumido)\n• Principais despesas da empresa\n\nVocê pode compartilhar essas informações ou enviar um relatório financeiro."
        }
      } else if (
        input.toLowerCase().includes("pj") ||
        input.toLowerCase().includes("pessoa jurídica") ||
        input.toLowerCase().includes("imposto de renda pj") ||
        input.toLowerCase().includes("ir pj")
      ) {
        setTimeout(() => {
          setIsTyping(false)
          const assistantMessage: MessageType = {
            id: (Date.now() + 1).toString(),
            content:
              "# Informações sobre Imposto de Renda para Pessoa Jurídica (IRPJ)\n\n" +
              "No Brasil, existem diferentes regimes tributários para empresas, cada um com suas próprias regras para cálculo e pagamento do Imposto de Renda:\n\n" +
              "## Simples Nacional\n" +
              "• **Elegibilidade**: Microempresas (ME) com faturamento até R$ 360 mil/ano e Empresas de Pequeno Porte (EPP) com faturamento até R$ 4,8 milhões/ano\n" +
              "• **Tributação**: Pagamento unificado mensal (DAS) que inclui IRPJ, CSLL, PIS, COFINS, ISS e INSS patronal\n" +
              "• **Alíquotas**: Variam de 4% a 33%, dependendo da atividade e faturamento\n" +
              "• **Vantagens**: Simplificação contábil e fiscal, redução da carga tributária para muitas atividades\n" +
              "• **Declarações**: DEFIS (anual) e PGDAS-D (mensal)\n\n" +
              "## Lucro Presumido\n" +
              "• **Elegibilidade**: Empresas com faturamento até R$ 78 milhões/ano\n" +
              "• **Base de cálculo**: Percentual do faturamento (presunção de lucro):\n" +
              "  - 8% para comércio, indústria e serviços hospitalares\n" +
              "  - 16% para transporte\n" +
              "  - 32% para serviços em geral\n" +
              "• **Alíquota IRPJ**: 15% + adicional de 10% sobre parcela que exceder R$ 20 mil/mês\n" +
              "• **CSLL**: 9% sobre base presumida (12% ou 32% do faturamento)\n" +
              "• **Declarações**: ECF (anual) e EFD-Contribuições (mensal)\n\n" +
              "## Lucro Real\n" +
              "• **Elegibilidade**: Obrigatório para empresas com faturamento acima de R$ 78 milhões/ano\n" +
              "• **Base de cálculo**: Lucro contábil ajustado (receitas - despesas dedutíveis)\n" +
              "• **Alíquota IRPJ**: 15% + adicional de 10% sobre parcela que exceder R$ 20 mil/mês\n" +
              "• **CSLL**: 9% sobre o lucro real (algumas atividades têm alíquotas diferenciadas)\n" +
              "• **Periodicidade**: Trimestral ou anual com antecipações mensais\n" +
              "• **Declarações**: ECF, EFD-Contribuições, EFD-REINF, entre outras\n\n" +
              "## Prazos importantes para 2025\n" +
              "• **ECF (Escrituração Contábil Fiscal)**: Último dia útil de julho\n" +
              "• **DEFIS (Simples Nacional)**: 31 de março\n" +
              "• **EFD-Contribuições**: Dia 15 do segundo mês subsequente\n\n" +
              "Gostaria de informações mais detalhadas sobre algum desses regimes ou sobre como otimizar a tributação da sua empresa?",
            sender: "assistant",
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev, assistantMessage])
          setIsTyping(false)
        }, 1500)
      } else {
        const assistantMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          sender: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      }
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a message with the attachment
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: "Enviei meu holerite para análise.",
      sender: "user",
      timestamp: new Date(),
      attachmentUrl: URL.createObjectURL(file),
    }

    setMessages((prev) => [...prev, userMessage])
    setUploadMode(false)
    setIsTyping(true)

    // Simulate PIM analyzing the document
    setTimeout(() => {
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: "Recebi seu holerite! Estou analisando os detalhes...",
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Second response after "analysis"
      setTimeout(() => {
        const analysisMessage: MessageType = {
          id: (Date.now() + 2).toString(),
          content:
            payrollType === "CLT"
              ? "Analisei seu holerite CLT e encontrei algumas oportunidades:\n\n✅ Otimização de IR: Você poderia economizar até R$ 180/mês investindo em previdência privada\n\n✅ Benefícios: Sua empresa oferece programa de benefícios flexíveis que você não está utilizando completamente\n\n✅ Plano de saúde: Você pode incluir dependentes com custo reduzido\n\nGostaria de detalhes sobre alguma dessas oportunidades?"
              : "Analisei seus dados como PJ e identifiquei estas oportunidades:\n\n✅ Pró-labore: Ajustando para 28% do faturamento, você pode economizar até R$ 320/mês em tributos\n\n✅ Despesas: Identifiquei categorias adicionais de despesas dedutíveis para seu tipo de atividade\n\n✅ Regime tributário: Vale a pena verificar se o Simples Nacional é a melhor opção para seu faturamento atual\n\nQuer que eu explique melhor alguma dessas estratégias?",
          sender: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, analysisMessage])
        setIsTyping(false)
      }, 3000)
    }, 1500)
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex max-w-[80%] md:max-w-[70%]">
                {message.sender === "assistant" && (
                  <div className="mr-2 flex-shrink-0">
                    <Image
                      src="/images/pim-avatar.png"
                      alt="PIM"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-emerald-200"
                    />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {message.content.split("\n").map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>
                      {line}
                    </p>
                  ))}
                  {message.attachmentUrl && (
                    <div className="mt-2">
                      <Image
                        src={message.attachmentUrl || "/placeholder.svg"}
                        alt="Anexo"
                        width={400}
                        height={300}
                        className="max-w-full rounded border"
                      />
                    </div>
                  )}
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
                <div className="mr-2 flex-shrink-0">
                  <Image
                    src="/images/pim-avatar.png"
                    alt="PIM"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-emerald-200"
                  />
                </div>
                <div className="rounded-lg p-3 bg-white border border-gray-200 text-gray-800">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handleSend("Como analisar meu holerite?")}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            Como analisar meu holerite?
          </button>
          <button
            onClick={() => handleSend("Diferenças entre CLT e PJ")}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            Diferenças entre CLT e PJ
          </button>
          <button
            onClick={() => handleSend("Informações sobre IR para PJ")}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            Informações sobre IR para PJ
          </button>
          <button
            onClick={() => handleSend("Dicas de economia")}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            Dicas de economia
          </button>
        </div>

        {/* Upload Mode */}
        {uploadMode ? (
          <Card className="p-4 mb-4">
            <div className="text-center">
              <h3 className="font-medium mb-2">Envie seu holerite</h3>
              <p className="text-sm text-gray-500 mb-4">Envie uma foto ou PDF do seu holerite para análise</p>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={triggerFileUpload}
              >
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Clique para selecionar ou arraste o arquivo aqui</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setUploadMode(false)}>
                  Cancelar
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={triggerFileUpload}>
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          /* Input Area */
          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 flex-shrink-0"
              onClick={() => setUploadMode(true)}
              aria-label="Joindre un fichier"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 bg-white rounded-lg border border-gray-300 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="min-h-[60px] max-h-[200px] border-0 focus-visible:ring-0 resize-none"
              />
            </div>
            <Button
              className="rounded-full h-10 w-10 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700"
              size="icon"
              onClick={() => handleSend()}
              disabled={input.trim() === ""}
              aria-label="Envoyer le message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Floating Chat Widget */}
      <FloatingChatWidget />
    </div>
  )
}
