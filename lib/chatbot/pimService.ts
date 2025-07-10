export async function sendPimMessage(message: string, context: unknown = {}) {
  // Appel à OpenAI ou API interne avec contexte RAG
  const response = await fetch("/api/pim-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context }),
  });
  const data = await response.json();
  return data.reply;
} 