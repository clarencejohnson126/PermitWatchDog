import { describe, it, expect } from 'vitest';
import { ExtractedBescheid } from './extract';

describe('ExtractedBescheid Zod schema', () => {
  it('accepts a complete, well-formed Gemini response', () => {
    const result = ExtractedBescheid.safeParse({
      project_name: 'Mehrfamilienhaus Q5,18',
      address: 'Q5, 18 — 68159 Mannheim',
      gemarkung: 'Mannheim',
      flur: '1',
      flurstueck: '4823/2',
      bauantrag_nr: 'BA-2026-MA-00234',
      aktenzeichen: 'AZ-2026-MA-00234',
      lifecycle_stage: 'approved',
      bescheid_auflagen: [
        'DIN 4109 — Schallschutz',
        'Solarpflicht BW § 8a EWärmeG',
      ],
      abstandsflaeche_nachbarn: ['Nordseite 3,0 m'],
      parse_confidence: 'high',
    });
    expect(result.success).toBe(true);
  });

  it('fills sensible defaults for optional fields', () => {
    const result = ExtractedBescheid.safeParse({
      project_name: 'Einfamilienhaus',
      address: 'Hauptstraße 12, 68159 Mannheim',
      gemarkung: '',
      flur: '',
      flurstueck: '',
      bauantrag_nr: '',
      aktenzeichen: '',
      lifecycle_stage: 'approved',
      bescheid_auflagen: [],
      abstandsflaeche_nachbarn: [],
      parse_confidence: 'medium',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.bescheid_auflagen).toEqual([]);
      expect(result.data.lifecycle_stage).toBe('approved');
    }
  });

  it('rejects garbage with missing required fields', () => {
    const result = ExtractedBescheid.safeParse({
      foo: 'bar',
      project_name: 12345, // wrong type
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid lifecycle_stage enum values', () => {
    const result = ExtractedBescheid.safeParse({
      project_name: 'X',
      address: 'Y',
      gemarkung: '',
      flur: '',
      flurstueck: '',
      bauantrag_nr: '',
      aktenzeichen: '',
      lifecycle_stage: 'demolished', // not in enum
      bescheid_auflagen: [],
      abstandsflaeche_nachbarn: [],
      parse_confidence: 'high',
    });
    expect(result.success).toBe(false);
  });
});
