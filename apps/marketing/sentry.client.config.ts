// Client-side Sentry initialization (runs in the browser).
// Same Sentry org as BarberBuddy but tagged so events stay separable.

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 1.0,
  initialScope: {
    tags: { app: 'permit-watchdog', surface: 'client' },
  },
  beforeSend(event) {
    // Block accidental leakage of the dispatcher's cron secret.
    if (event.request?.headers && 'authorization' in event.request.headers) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});
