// Singleton Prisma client for the marketing/API app.
// On Vercel, hot-reload in dev can spawn many clients; the global cache prevents that.
// In production each Lambda gets its own instance (already singletoned within the cold start).

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
