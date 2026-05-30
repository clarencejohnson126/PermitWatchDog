// Debug what the doctrine judge says about the synthetic DIN-4109 novelle.
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

import { prisma } from '../src/lib/db/prisma';
import { judgeMatch } from '../src/lib/doctrine/judge';

async function main() {
  const filing = await prisma.filing.findFirst({
    where: { source_url: 'https://permitwatchdog.demo/synthetic/din-4109-novelle-2026q3' },
  });
  const project = await prisma.project.findFirst({
    where: { user_email: 'clarencejohnson@hotmail.de' },
  });
  if (!filing || !project) throw new Error('filing or project not found');

  console.log(`Bescheid issued: ${project.created_at.toISOString()}`);
  console.log(`Filing published: ${filing.publish_date.toISOString()}`);
  console.log(`Total Auflagen on project: ${project.bescheid_auflagen.length}\n`);

  for (let i = 0; i < project.bescheid_auflagen.length; i++) {
    const a = project.bescheid_auflagen[i];
    console.log(`\n── Auflage ${i + 1}: ${a.slice(0, 80)}…`);
    try {
      const v = await judgeMatch({
        auflage_text: a,
        bescheid_issued_at: project.created_at,
        lifecycle_stage: project.lifecycle_stage,
        country: project.country ?? 'DE',
        filing_title: filing.title,
        filing_content: filing.content_text,
        filing_publish_date: filing.publish_date,
        filing_source_type: filing.source_type,
        matched_keyword: 'din 4109',
      });
      console.log(`  pierces=${v.pierces}  severity=${v.severity}  layer=${v.doctrine_layer_applied}  conf=${v.confidence}`);
      console.log(`  reasoning: ${v.reasoning_de}`);
    } catch (e) {
      console.error(`  ERROR:`, e instanceof Error ? e.message : e);
    }
  }
}

main().finally(() => prisma.$disconnect());
