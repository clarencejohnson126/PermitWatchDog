import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
const { PrismaClient } = require('../../infra/cloud-sql/node_modules/@prisma/client');
import { matchFilingToProject } from '../services/crossref';
import { scoreFiling } from '../services/scorer';
import { draftAddendum } from '../services/drafter';

const prisma = new PrismaClient();

async function runDemo() {
  console.log('============================================');
  console.log(' PermitWatchDog End-to-End Demo Runner');
  console.log('============================================\n');

  // 1. Load Project
  const project = await prisma.project.findFirst({
    where: { project_name: { contains: 'Q5' } }
  });

  if (!project) {
    console.error('Project Q5,18 not found. Did you run the seeder?');
    process.exit(1);
  }

  console.log(`[Loaded Project] ${project.project_name} (Status: ${project.lifecycle_stage})`);

  // 2. Load Filings
  const dbFilings = await prisma.filing.findMany();
  
  const synthetic1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../../evals/golden_set/synthetic/synthetic_1.json'), 'utf-8'));
  const synthetic2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../../evals/golden_set/synthetic/synthetic_2.json'), 'utf-8'));
  synthetic1.id = 'synthetic-1';
  synthetic2.id = 'synthetic-2';

  const filings = [...dbFilings, synthetic1, synthetic2];
  console.log(`[Loaded Filings] ${dbFilings.length} from DB, 2 Synthetic\n`);

  const stats: Record<string, number> = {
    'NO_IMPACT_OTHER': 0,
    'NO_IMPACT_BESTANDSSCHUTZ': 0,
    'LOW': 0,
    'MEDIUM': 0,
    'HIGH': 0
  };

  const outputsDir = path.join(__dirname, 'sample_outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  // 3. Process Pipeline
  for (const filing of filings) {
    const crossref = matchFilingToProject(filing, project);
    
    if (!crossref.matches) {
       // Didn't even match the geographic or keyword filters
       stats['NO_IMPACT_OTHER']++;
       continue;
    }

    const doctrine = await scoreFiling(filing, project);
    stats[doctrine.verdict]++;

    if (doctrine.verdict !== 'NO_IMPACT_BESTANDSSCHUTZ' && doctrine.verdict !== 'NO_IMPACT_OTHER') {
       const draft = await draftAddendum(filing, project, doctrine);
       
       const content = `
# PermitWatchDog Alert: ${doctrine.verdict}

**Filing:** ${filing.title}
**Source:** ${filing.source_url || filing.source_type}
**Date:** ${filing.publish_date}

## Doctrine Reasoning
${doctrine.reasoning}
**Pierced By:** ${doctrine.pierced_by || 'N/A'}

## Drafted Addendum
${draft}
`;
       fs.writeFileSync(path.join(outputsDir, `alert_${filing.id}.md`), content);
       console.log(`- Generated ${doctrine.verdict} alert for: ${filing.title}`);
    } else if (doctrine.verdict === 'NO_IMPACT_BESTANDSSCHUTZ') {
       // Log to show we caught it
       console.log(`- Suppressed (Bestandsschutz): ${filing.title}`);
    }
  }

  console.log('\n============================================');
  console.log(' Demo Summary');
  console.log('============================================');
  console.table(stats);
  console.log(`\nGenerated drafts saved to ${outputsDir}`);

  await prisma.$disconnect();
}

runDemo().catch(console.error);
