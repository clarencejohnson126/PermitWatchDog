import { describe, it, expect } from 'vitest';
import { matchFilingAgainstProject } from './matcher';

describe('matchFilingAgainstProject', () => {
  it('matches a DIN reference with word boundary precision', () => {
    const matches = matchFilingAgainstProject(
      'Die neue Fassung der DIN 4109 tritt am 01.07.2026 in Kraft.',
      'DIN 4109 Novelle',
      ['DIN 4109 — Schallschutz: Nachweis vor Baubeginn'],
    );
    expect(matches).toHaveLength(1);
    expect(matches[0].severity).toBe('high');
    expect(matches[0].matched_keyword).toContain('din 4109');
  });

  it('rejects substring matches that would create false positives', () => {
    // "mbo" must NOT match inside "mannheim" or "ombudsmann"
    const matches = matchFilingAgainstProject(
      'Die Stadt Mannheim hat einen neuen Ombudsmann für Bauangelegenheiten benannt.',
      'Mannheim · Ombudsmann',
      ['Brandschutz GK 4 nach MBO 2002'],
    );
    expect(matches).toHaveLength(0);
  });

  it('matches paragraph references like § 8a with spacing tolerance', () => {
    const matches = matchFilingAgainstProject(
      'Eine Änderung des § 8a EWärmeG wurde im Bundesanzeiger veröffentlicht.',
      'EWärmeG-Novelle',
      ['Solarpflicht BW § 8a EWärmeG'],
    );
    expect(matches.length).toBeGreaterThan(0);
    const paragraphMatch = matches.find((m) => m.matched_keyword.startsWith('§'));
    expect(paragraphMatch).toBeDefined();
    expect(paragraphMatch!.severity).toBe('high');
  });

  it('returns at most one match per Auflage (no spammy duplicates)', () => {
    // schallschutz appears 3 times in the text but should fire only once.
    const matches = matchFilingAgainstProject(
      'Schallschutz ist wichtig. Schallschutz hier, Schallschutz dort, überall Schallschutz.',
      'Schallschutz × 4',
      ['DIN 4109 — Schallschutz'],
    );
    const schallMatches = matches.filter((m) => m.matched_keyword === 'schallschutz');
    expect(schallMatches.length).toBeLessThanOrEqual(1);
  });

  it('returns empty when no Auflage matches', () => {
    const matches = matchFilingAgainstProject(
      'Heute findet das Sommerfest im Schlosspark statt. Eintritt frei.',
      'Sommerfest',
      ['DIN 4109 — Schallschutz', 'Brandschutz GK 4'],
    );
    expect(matches).toHaveLength(0);
  });
});
