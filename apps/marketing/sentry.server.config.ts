// Server-side Sentry initialization (runs in Node serverless functions).

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  initialScope: {
    tags: { app: 'permit-watchdog', surface: 'server' },
  },
  beforeSend(event) {
    if (event.request?.headers && 'authorization' in event.request.headers) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});
