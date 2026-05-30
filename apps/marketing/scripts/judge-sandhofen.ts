// Prove the T1 doctrine judge correctly rejects geographically-irrelevant filings.
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

import { prisma } from '../src/lib/db/prisma';
import { judgeMatch } from '../src/lib/doctrine/judge';

async function main() {
  const project = await prisma.project.findFirst({
    where: { user_email: 'clarencejohnson@hotmail.de' },
  });
  if (!project) throw new Error('project not found');

  // Find any Werner-Nagel-Ring / Sandhofen filing
  const filing = await prisma.filing.findFirst({
    where: {
      OR: [
        { title: { contains: 'Werner-Nagel', mode: 'insensitive' } },
        { title: { contains: 'Sandhofen', mode: 'insensitive' } },
        { content_text: { contains: 'Werner-Nagel-Ring' } },
      ],
    },
  });
  if (!filing) {
    console.log('No Werner-Nagel / Sandhofen filing in DB.');
    return;
  }
  console.log(`Filing: "${filing.title}" (${filing.source_type}, ${filing.publish_date.toISOString().split('T')[0]})`);
  console.log(`Project location: ${project.address}\n`);

  const abstandAuflage = project.bescheid_auflagen.find((a) => a.toLowerCase().includes('abstandsfl'));
  if (!abstandAuflage) {
    console.log('No abstandsfläche Auflage on project — skipping');
    return;
  }

  console.log(`Auflage: ${abstandAuflage}\n`);
  console.log('Asking the T1 doctrine judge…\n');

  const v = await judgeMatch({
    auflage_text: abstandAuflage,
    bescheid_issued_at: project.created_at,
    lifecycle_stage: project.lifecycle_stage,
    filing_title: filing.title,
    filing_content: filing.content_text,
    filing_publish_date: filing.publish_date,
    filing_source_type: filing.source_type,
    matched_keyword: 'abstandsfläche',
  });

  console.log(`pierces:               ${v.pierces}`);
  console.log(`severity:              ${v.severity}`);
  console.log(`doctrine_layer:        ${v.doctrine_layer_applied}`);
  console.log(`confidence:            ${v.confidence}`);
  console.log(`reasoning:             ${v.reasoning_de}`);
}

main().finally(() => prisma.$disconnect());
