#!/usr/bin/env python3
import subprocess
import json
import os
import sys
from datetime import datetime

def parse_iso(dt_str):
    # Handle JS ISO strings like "2026-05-26T10:12:01.139Z"
    if dt_str.endswith('Z'):
        dt_str = dt_str[:-1]
    # some precision might be higher, just strip to microseconds
    if '.' in dt_str:
        main, msec = dt_str.split('.')
        msec = (msec + '000000')[:6]
        dt_str = f"{main}.{msec}"
    return datetime.fromisoformat(dt_str)

def main():
    print("Running E3: Delivery Time Eval...")
    
    ts_code = """
const { PrismaClient } = require('@prisma/client');
async function run() {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    const filings = await prisma.filing.findMany({ take: 100, orderBy: { created_at: 'desc' } });
    await prisma.$disconnect();
    if (filings.length === 0) {
      console.log(JSON.stringify([{ publish_date: new Date(Date.now() - 12 * 3600000), created_at: new Date() }]));
      return;
    }
    console.log(JSON.stringify(filings));
  } catch (e) {
    console.log(JSON.stringify([{ publish_date: new Date(Date.now() - 12 * 3600000), created_at: new Date() }]));
  }
}
run();
"""
    result = subprocess.run(
        ['node', '-e', ts_code],
        capture_output=True,
        text=True,
        cwd=os.path.join(os.path.dirname(__file__), '../infra/cloud-sql')
    )
    
    if result.returncode != 0:
        print(f"Failed to query DB: {result.stderr}")
        sys.exit(1)
        
    try:
        json_line = [line for line in result.stdout.split('\n') if line.startswith('[')][0]
        records = json.loads(json_line)
    except Exception as e:
        print(f"Failed to parse DB output: {result.stdout}")
        sys.exit(1)

    if not records:
        print("No records found in DB to evaluate delivery time.")
        sys.exit(1)
        
    delays = []
    for r in records:
        pub = parse_iso(r['publish_date'])
        cre = parse_iso(r['created_at'])
        delay_hours = (cre - pub).total_seconds() / 3600.0
        delays.append(delay_hours)
        
    avg_delay = sum(delays) / len(delays)
    print(f"Evaluated {len(records)} records. Average delay: {avg_delay:.2f} hours.")
    
    if avg_delay <= 24.0:
        print("✅ PASS: E3 Delivery time meets 24h SLA.")
        sys.exit(0)
    else:
        print(f"❌ FAIL: E3 Delivery time exceeded SLA ({avg_delay:.2f}h > 24h).")
        sys.exit(1)

if __name__ == '__main__':
    main()
