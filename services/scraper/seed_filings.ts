import { PrismaClient } from '../../infra/cloud-sql/node_modules/@prisma/client';
import { MannheimBekanntmachungenScraper } from './src/mannheim';

const prisma = new PrismaClient();

async function main() {
  console.log('Running scraper to seed 93 filings...');
  const scraper = new MannheimBekanntmachungenScraper();
  const records = await scraper.run();
  
  let inserted = 0;
  for (const r of records) {
    if (!r.source_url) continue;
    await prisma.filing.upsert({
      where: { source_url: r.source_url },
      update: {},
      create: {
        source_url: r.source_url,
        publish_date: r.publish_date || new Date(),
        gemeinde: r.gemeinde || 'Mannheim',
        title: r.title,
        content_text: r.content_text || '',
        source_type: r.source_type || 'unknown',
        parse_confidence: r.parse_confidence || 'high'
      }
    });
    inserted++;
  }
  console.log(`Seeded ${inserted} filings into Postgres.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
