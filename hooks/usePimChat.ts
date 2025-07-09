import { useState } from "react";
import { sendPimMessage } from "@/lib/chatbot/pimService";

export function usePimChat(initialPrompt = "Olá! Como posso te ajudar?") {
  const [messages, setMessages] = useState([{ sender: "bot", text: initialPrompt }]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    setMessages(msgs => [...msgs, { sender: "user", text }]);
    setLoading(true);
    const reply = await sendPimMessage(text);
    setMessages(msgs => [...msgs, { sender: "bot", text: reply }]);
    setLoading(false);
  }

  return { messages, sendMessage, loading };
} 