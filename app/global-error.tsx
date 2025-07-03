"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  // Defensive normalization
  let displayMessage = "Ocorreu um erro inesperado.";
  if (error instanceof Error) {
    displayMessage = error.message || displayMessage;
  } else if (typeof error === 'object' && error !== null && 'type' in error) {
    // Likely an Event object
    displayMessage = `Erro: Um objeto de evento foi lançado em vez de um erro. Verifique o código que gerou este erro.`;
    // Optionally log the event for debugging
    // eslint-disable-next-line no-console
    console.error('Objeto de evento lançado como erro:', error);
  } else if (typeof error === 'string') {
    displayMessage = error;
  }

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: 32, fontFamily: 'sans-serif', color: '#b91c1c', background: '#fff0f0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Erro na aplicação</h1>
          <p style={{ fontSize: 18, marginTop: 16 }}>{displayMessage}</p>
          <p style={{ fontSize: 14, marginTop: 24, color: '#666' }}>Se o problema persistir, entre em contato com o suporte.</p>
        </div>
        {/* Optionally render NextError for fallback */}
        {/* <NextError statusCode={0} /> */}
      </body>
    </html>
  );
}