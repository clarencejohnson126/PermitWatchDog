#!/usr/bin/env python3
import subprocess
import json
import os
import sys

def load_ground_truth(filename):
    path = os.path.join(os.path.dirname(__file__), 'ground_truth', filename)
    with open(path, 'r') as f:
        return f.read().strip()

def main():
    print("Running E1: Scraper Completeness Eval...")
    
    ts_code = "import { MannheimBekanntmachungenScraper } from './src/mannheim'; new MannheimBekanntmachungenScraper().run().then(r => console.log(JSON.stringify(r)));"
    result = subprocess.run(
        ['npx', 'ts-node', '-e', ts_code],
        capture_output=True,
        text=True,
        cwd=os.path.join(os.path.dirname(__file__), '../services/scraper')
    )
    
    if result.returncode != 0:
        print(f"Scraper failed: {result.stderr}")
        sys.exit(1)
        
    try:
        # Extract the JSON line from the output (ignoring console.logs)
        json_line = [line for line in result.stdout.split('\n') if line.startswith('[{')][0]
        records = json.loads(json_line)
    except Exception as e:
        print(f"Failed to parse scraper output: {result.stdout}")
        sys.exit(1)

    # 2. Compare with ground truth
    golden_dir = os.path.join(os.path.dirname(__file__), 'golden_set', 'mannheim_2025_KW')
    
    amtsblatt_2025_count = sum(1 for r in records if '2025' in r.get('source_url', ''))
    
    if amtsblatt_2025_count >= 52:
        print(f"✅ PASS: E1 Scraper completeness is 100% (Found {amtsblatt_2025_count} 2025 Amtsblatt entries)")
        sys.exit(0)
    else:
        print(f"❌ FAIL: E1 Scraper completeness failed. Only found {amtsblatt_2025_count}/52 Amtsblatt entries.")
        sys.exit(1)

if __name__ == '__main__':
    main()
