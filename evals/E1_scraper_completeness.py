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
    html_gt = load_ground_truth('E1_bekanntmachung.txt')
    pdf_gt = load_ground_truth('E1_amtsblatt.txt')
    
    html_match = False
    pdf_match = False
    
    for r in records:
        text = r.get('content_text', '').strip()
        if text == html_gt:
            html_match = True
        if text == pdf_gt:
            pdf_match = True
            
    if html_match and pdf_match:
        print("✅ PASS: E1 Scraper completeness is 100%")
        sys.exit(0)
    else:
        print(f"❌ FAIL: E1 Scraper completeness failed. HTML Match: {html_match}, PDF Match: {pdf_match}")
        sys.exit(1)

if __name__ == '__main__':
    main()
