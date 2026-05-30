// Edge runtime Sentry (used by middleware.ts).

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.05,
  initialScope: {
    tags: { app: 'permit-watchdog', surface: 'edge' },
  },
});
