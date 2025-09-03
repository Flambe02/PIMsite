// Temporairement désactivé pour validation V2
// import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Temporairement désactivé pour validation V2
  // if (process.env.NEXT_RUNTIME === 'nodejs') {
  //   await import('./sentry.server.config');
  // }

  // if (process.env.NEXT_RUNTIME === 'edge') {
  //   await import('./sentry.edge.config');
  // }
}

// export const onRequestError = Sentry.captureRequestError;