// Smoke test: insert + read + delete one ScraperRun row.
// Confirms DATABASE_URL is wired, the permit_watchdog schema is reachable,
// Prisma client maps PascalCase models → snake_case tables, and RLS doesn't
// block the service_role connection.
//
// Run: cd infra/cloud-sql && npx tsx scripts/smoke-test.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

async function main() {
  console.log('→ Connecting to Postgres…');
  await prisma.$connect();
  console.log('✓ Connected');

  console.log('→ Inserting test ScraperRun…');
  const run = await prisma.scraperRun.create({
    data: {
      started_at: new Date(),
      completed_at: new Date(),
      total_filings_ingested: 0,
      errors_count: 0,
      source_breakdown: {
        test: true,
        invoked_by: 'smoke-test',
        message: 'connection verification — safe to delete',
      },
    },
  });
  console.log(`✓ Inserted row id=${run.id}`);

  console.log('→ Reading back…');
  const back = await prisma.scraperRun.findUnique({ where: { id: run.id } });
  if (!back) throw new Error('Round-trip read returned null');
  console.log(`✓ Read back: started_at=${back.started_at.toISOString()}`);

  console.log('→ Cleaning up…');
  await prisma.scraperRun.delete({ where: { id: run.id } });
  console.log('✓ Deleted');

  console.log('\n🟢 SMOKE TEST PASS — Supabase Postgres reachable, permit_watchdog schema writable.');
}

main()
  .catch((e) => {
    console.error('\n🔴 SMOKE TEST FAIL');
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
