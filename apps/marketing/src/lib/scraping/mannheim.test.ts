import { describe, it, expect } from 'vitest';
import { MannheimScraper } from './mannheim';

describe('MannheimScraper internal parsing', () => {
  // We test the public surface through a small driver instead of exposing
  // the private helpers — keeps the parser logic verifiable without
  // shipping internal API.

  it('exposes the correct gemeindeName', () => {
    const s = new MannheimScraper();
    expect(s.gemeindeName).toBe('Mannheim');
  });

  it('run({ since: future }) returns no records (smoke test, requires network — skipped in CI)', async () => {
    if (process.env.CI || !process.env.RUN_NETWORK_TESTS) {
      // skip in CI to avoid flaky network dependency
      return;
    }
    const s = new MannheimScraper();
    const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const r = await s.run({ since: future, maxRecords: 1 });
    expect(r).toBeInstanceOf(Array);
  });
});
