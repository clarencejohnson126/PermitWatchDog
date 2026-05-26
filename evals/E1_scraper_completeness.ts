import fs from 'fs';
import path from 'path';
import { MannheimBekanntmachungenScraper } from '../services/scraper/src/mannheim';

async function runEval() {
  const fixturePath = process.argv[2];
  if (!fixturePath) {
    console.error('Usage: npx ts-node E1_scraper_completeness.ts <path_to_fixture>');
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), fixturePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Fixture not found: ${absolutePath}`);
    process.exit(1);
  }

  const groundTruth = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
  console.log(`Loaded ${groundTruth.length} ground-truth entries.`);

  const scraper = new MannheimBekanntmachungenScraper();
  console.log('Running scraper to get current snapshot...');
  const currentRecords = await scraper.run();
  console.log(`Scraper returned ${currentRecords.length} total entries.`);

  let matchedCount = 0;
  const missed: any[] = [];

  const expectedCount = groundTruth.length;

  for (const gt of groundTruth) {
    if (gt._comment) continue;

    // Primary match: source_url + publish_date
    let match = currentRecords.find((r: any) => 
      r.source_url === gt.source_url && 
      new Date(r.publish_date).getTime() === new Date(gt.publish_date).getTime()
    );

    // Fallback match: title + publish_date
    if (!match) {
      match = currentRecords.find((r: any) => 
        r.title === gt.title && 
        new Date(r.publish_date).getTime() === new Date(gt.publish_date).getTime()
      );
    }

    if (match) {
      matchedCount++;
    } else {
      missed.push(gt);
    }
  }

  const validExpectedCount = groundTruth.filter((g: any) => !g._comment).length;
  const captureRate = validExpectedCount === 0 ? 100 : (matchedCount / validExpectedCount) * 100;
  
  console.log(`\n--- E1: Scraper Completeness ---`);
  console.log(`Total Expected Ground Truth: ${validExpectedCount}`);
  console.log(`Matched: ${matchedCount}`);
  console.log(`Missed:  ${missed.length}`);
  console.log(`Capture Rate: ${captureRate.toFixed(2)}%`);

  if (missed.length > 0) {
    console.log(`\n--- DELTAS (Missed Entries) ---`);
    missed.forEach(m => console.log(`- [${m.source_type}] ${m.title} (${m.publish_date}) | ${m.source_url}`));
  }

  const isHistorical = absolutePath.includes('2025');
  const passThreshold = isHistorical ? 100 : 98;

  if (captureRate >= passThreshold) {
    console.log(`\n✅ RESULT: PASS (≥${passThreshold}%)`);
    process.exit(0);
  } else {
    console.log(`\n❌ RESULT: FAIL (<${passThreshold}%)`);
    process.exit(1);
  }
}

runEval().catch(err => {
  console.error('Eval failed to run:', err);
  process.exit(1);
});
