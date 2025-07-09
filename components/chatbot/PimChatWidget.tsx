"use client";
import { useState, useRef } from "react";
import { usePimChat } from "@/hooks/usePimChat";
import { Bot, Send, Loader2 } from "lucide-react";

export function PimChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, loading } = usePimChat();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white rounded-full p-4 shadow-lg hover:bg-emerald-700"
        onClick={() => setOpen(o => !o)}
      >
        <Bot className="w-6 h-6" />
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-xl shadow-lg border p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-6 h-6 text-emerald-600" />
            <span className="font-bold">PIM - Chatbot</span>
          </div>
          <div className="flex-1 overflow-y-auto mb-2 max-h-64">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 text-sm ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span className={`inline-block px-2 py-1 rounded ${msg.sender === "user" ? "bg-emerald-100" : "bg-gray-100"}`}>
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center my-2">
                <Loader2 className="animate-spin w-5 h-5 text-emerald-400" />
              </div>
            )}
          </div>
          <form
            className="flex gap-2"
            onSubmit={e => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage(input);
                setInput("");
                inputRef.current?.focus();
              }
            }}
          >
            <input
              ref={inputRef}
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={loading}
            />
            <button type="submit" className="bg-emerald-600 text-white rounded p-2" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
} 