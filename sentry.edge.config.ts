// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5292e285d655546df0fbabd9d978df9f@o4509595092189184.ingest.us.sentry.io/4509595093696512",
  // En production, on réduit le sampling pour limiter la charge et la taille du bundle
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  debug: false,
  // Désactivez les intégrations inutiles pour alléger le bundle (ajustez si besoin)
  integrations: [],
});
