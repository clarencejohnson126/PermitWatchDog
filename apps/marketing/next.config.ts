import type { NextConfig } from 'next';

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

export default nextConfig;
