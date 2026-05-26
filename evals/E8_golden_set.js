require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { evaluateFiling } = require('../packages/doctrine/dist/engine.js');

async function runE8() {
  console.log(`\n============================================`);
  console.log(` E8: Doctrine Module Golden Set Regression  `);
  console.log(`============================================\n`);

  const fixturesPath = path.join(__dirname, 'golden_set', 'mannheim_q5_expected.json');
  const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf-8'));

  let passCount = 0;
  let failCount = 0;
  const failures = [];

  console.log(`Testing ${fixtures.length} scenarios against the legal engine...`);

  for (const fixture of fixtures) {
    try {
      const output = await evaluateFiling(fixture.input);
      
      const verdictMatches = output.verdict === fixture.expected.verdict;
      const layerMatches = !fixture.expected.applicable_doctrine_layer || output.applicable_doctrine_layer === fixture.expected.applicable_doctrine_layer;
      const piercedMatches = !fixture.expected.pierced_by || output.pierced_by === fixture.expected.pierced_by;
      
      if (verdictMatches && layerMatches && piercedMatches) {
        process.stdout.write('✅');
        passCount++;
      } else {
        process.stdout.write('❌');
        failCount++;
        failures.push({
          description: fixture.description,
          expected: fixture.expected,
          actual: output
        });
      }
    } catch (e) {
      process.stdout.write('❌');
      failCount++;
      failures.push({
        description: fixture.description,
        error: e.message
      });
    }
  }

  console.log(`\n\nResults: ${passCount} PASS | ${failCount} FAIL`);

  if (failCount > 0) {
    console.log(`\n--- FAILURES ---`);
    for (const fail of failures) {
      console.log(`\nScenario: ${fail.description}`);
      if (fail.error) {
        console.log(`Error: ${fail.error}`);
      } else {
        console.log(`Expected: ${JSON.stringify(fail.expected, null, 2)}`);
        console.log(`Actual:   ${JSON.stringify(fail.actual, null, 2)}`);
      }
    }
    process.exit(1);
  } else {
    console.log(`\n✅ RESULT: PASS (100% Golden Set Match)`);
    process.exit(0);
  }
}

runE8();
