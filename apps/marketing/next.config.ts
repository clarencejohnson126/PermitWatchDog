import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  output: 'standalone',

  // Prisma + pdf-parse are Node-only with native bindings and dynamic
  // requires that Vercel's bundler chokes on. Mark them as external so
  // they're resolved at runtime from node_modules instead of bundled.
  serverExternalPackages: ['@prisma/client', 'prisma', 'pdf-parse'],

  experimental: {
    serverActions: { bodySizeLimit: '15mb' }, // Bescheid PDF uploads
  },
};

// Sentry wrapper — events flow via DSN regardless of org/project slugs here.
// We skip source-map upload (no SENTRY_AUTH_TOKEN at build time) and use the
// tunnel route so ad-blockers don't drop events.
export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  tunnelRoute: '/monitoring',
});
