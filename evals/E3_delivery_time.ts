// E3 — delivery-time SLA.
// Measures elapsed scrape time as a proxy for the 3-hour
// 03:00→06:00 cron window. Evaluable at any time of day —
// not clock-dependent.
// TODO(v0.2): extend completion measurement to include the
//             Outlook Graph draft-queued timestamp once that
//             stage of the pipeline is wired.

import { PrismaClient } from '@prisma/client';

const SLA_SECONDS = 3 * 3600;  // 3-hour 03:00→06:00 budget

async function runE3() {
  const prisma = new PrismaClient();

  try {
    const lastRun = await prisma.scraperRun.findFirst({
      orderBy: { started_at: 'desc' },
    });

    if (!lastRun) {
      console.log(`\n❌ RESULT: FAIL - No scraper runs to evaluate. Run the daily scraper first.`);
      process.exit(1);
    }

    const elapsedMs = lastRun.completed_at.getTime() - lastRun.started_at.getTime();
    const elapsedSeconds = elapsedMs / 1000;
    
    console.log(`\n--- E3: Delivery Time ---`);
    console.log(`Latest Run ID: ${lastRun.id}`);
    console.log(`Started At:    ${lastRun.started_at.toISOString()}`);
    console.log(`Completed At:  ${lastRun.completed_at.toISOString()}`);
    console.log(`Elapsed Time:  ${elapsedSeconds.toFixed(2)} seconds`);
    console.log(`Filings:       ${lastRun.total_filings_ingested}`);
    console.log(`Errors:        ${lastRun.errors_count}`);
    console.log(`SLA Budget:    ${SLA_SECONDS} seconds`);

    // Pass criterion: < 3 hours elapsed time
    if (elapsedSeconds < SLA_SECONDS) {
      console.log(`\n✅ RESULT: PASS (Scrape completed within ${SLA_SECONDS} seconds budget)`);
      process.exit(0);
    } else {
      console.log(`\n❌ RESULT: FAIL (Scrape exceeded ${SLA_SECONDS} seconds budget)`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error in E3 eval:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runE3();
