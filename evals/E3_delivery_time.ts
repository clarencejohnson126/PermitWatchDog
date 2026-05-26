// TODO(v0.2): once Outlook Graph API delivery is wired, change
//             completion measurement from "scrape_complete" to
//             "all drafts queued in Outlook drafts folder"

import { PrismaClient } from '@prisma/client';

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
    const elapsedSeconds = (elapsedMs / 1000).toFixed(2);
    
    // "would have delivered by" is effectively the completed_at time for now
    const deliveryTime = new Date(lastRun.started_at.getTime() + elapsedMs);
    
    // Format to Europe/Berlin timezone
    const berlinTimeStr = deliveryTime.toLocaleTimeString('en-GB', {
      timeZone: 'Europe/Berlin',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    console.log(`\n--- E3: Delivery Time ---`);
    console.log(`Latest Run ID: ${lastRun.id}`);
    console.log(`Started At:    ${lastRun.started_at.toISOString()}`);
    console.log(`Completed At:  ${lastRun.completed_at.toISOString()}`);
    console.log(`Elapsed Time:  ${elapsedSeconds} seconds`);
    console.log(`Filings:       ${lastRun.total_filings_ingested}`);
    console.log(`Errors:        ${lastRun.errors_count}`);
    console.log(`\nWould Deliver By (Berlin TZ): ${berlinTimeStr}`);

    // Parse the Berlin time string "HH:MM:SS"
    const [hour, minute] = berlinTimeStr.split(':').map(Number);

    // Pass criterion: < 06:00 local time
    if (hour < 6) {
      console.log(`\n✅ RESULT: PASS (Delivery before 06:00 Berlin time)`);
      process.exit(0);
    } else {
      console.log(`\n❌ RESULT: FAIL (Delivery at or after 06:00 Berlin time)`);
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
