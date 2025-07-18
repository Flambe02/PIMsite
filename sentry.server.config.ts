// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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
