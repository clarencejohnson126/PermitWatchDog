import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createDraft } from "./graph_client";

// Load .env.local from the service directory or root
dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function main() {
  const recipient = process.env.NOTIFIER_TEST_RECIPIENT || "clarencejohnson@hotmail.de";
  const sampleOutputsDir = path.join(__dirname, "../../../demo/sample_outputs");
  
  if (!fs.existsSync(sampleOutputsDir)) {
    console.error(`Directory not found: ${sampleOutputsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(sampleOutputsDir).filter(f => f.endsWith(".md"));
  
  let successCount = 0;
  let failCount = 0;
  const createdDraftIds: string[] = [];

  for (const file of files) {
    // Parse verdict from filename: {id}_{VERDICT}_{date}.md
    const parts = file.split("_");
    if (parts.length < 3) continue;
    
    // Some IDs might have underscores, but we know VERDICT is the second to last, or just use regex
    const match = file.match(/_(HIGH|MEDIUM|NO_IMPACT[A-Z_]*)_/);
    if (!match) continue;
    
    const verdict = match[1];
    if (verdict.startsWith("NO_IMPACT")) {
      console.log(`Skipping ${file} (Verdict: ${verdict})`);
      continue;
    }

    const content = fs.readFileSync(path.join(sampleOutputsDir, file), "utf-8");
    
    // Extract title
    const titleMatch = content.match(/\*\*Filing:\*\*\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : "Unknown Filing";
    
    // Extract body (everything below ## Drafted Addendum)
    const bodySplit = content.split("## Drafted Addendum");
    if (bodySplit.length < 2) {
      console.log(`Skipping ${file} (No Drafted Addendum section)`);
      continue;
    }
    const bodyText = bodySplit[1].trim();

    const subject = `[PermitWatchDog Alert] ${verdict} — ${title}`;

    try {
      console.log(`Creating draft for: ${subject}...`);
      const draftId = await createDraft({
        subject,
        bodyText,
        toRecipient: recipient,
      });
      console.log(` ✅ Draft created. ID: ${draftId}`);
      createdDraftIds.push(draftId);
      successCount++;
    } catch (err: any) {
      console.error(` ❌ Failed to create draft for ${file}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\nCreated ${successCount} Outlook drafts; ${failCount} failed.`);
  console.log(`Drafts now visible in: ${recipient}'s Drafts folder at outlook.live.com\n`);
  
  if (createdDraftIds.length > 0) {
    console.log("Created Draft IDs:");
    createdDraftIds.forEach((id, i) => console.log(`  ${i+1}. ${id}`));
  }
}

main().catch(console.error);
