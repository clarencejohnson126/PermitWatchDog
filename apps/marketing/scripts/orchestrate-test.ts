import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

import { runOrchestrator } from '../src/lib/orchestrator/run';

async function main() {
  const r = await runOrchestrator({ lookbackDays: 365 * 30 });
  console.log(JSON.stringify(r, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
