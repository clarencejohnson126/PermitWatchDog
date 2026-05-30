// T0 keyword matcher — given a Project's Auflagen and a Filing's content,
// decide whether the filing might pierce any Auflage. Returns matches with
// confidence + the matched keyword that triggered.
//
// This is the simple keyword path. T1+ swaps this for an LLM call into
// packages/doctrine/engine.ts that runs the full 4-layer reasoning.

// DE-specific theme vocabulary (Mannheim, Heidelberg, etc.)
const THEMES_DE = [
  'schallschutz', 'lärmschutz', 'lärm',
  'brandschutz', 'feuerwiderstand', 'rauchschutz',
  'wärmeschutz', 'wärmedämmung', 'gebäudeenergiegesetz', 'geg', 'enev',
  'solarpflicht', 'photovoltaik', 'pv-pflicht', 'ewärmeg',
  'abstandsfläche', 'grenzbebauung', 'nachbarrecht',
  'stellplatzpflicht', 'parkplatz', 'stellplatznachweis',
  'denkmalschutz', 'denkmalpflege',
  'bebauungsplan', 'b-plan', 'flächennutzungsplan',
  'mbo', 'lbo', 'landesbauordnung', 'musterbauordnung',
  'vob/b', 'vob', 'hoai',
  'barrierefrei', 'din 18040', 'din18040',
  'gk 1', 'gk 2', 'gk 3', 'gk 4', 'gk 5', 'gebäudeklasse',
];

// US-specific theme vocabulary (San Francisco, Palo Alto, etc.)
const THEMES_US = [
  // California / SF Building Code
  'title 24', 'calgreen', 'cal green',
  'planning code', 'building code', 'municipal code',
  'sf planning code', 'sf building code',
  // Permit types & decisions
  'conditional use authorization', 'cu authorization', 'conditional use',
  'variance', 'rear yard variance', 'side yard variance',
  'discretionary review', 'dr motion',
  'demolition permit', 'site permit', 'site work permit',
  'certificate of occupancy', 'co inspection',
  // Land use & zoning concepts
  'rh-1', 'rh-2', 'rh-3', 'rm-1', 'rm-2',  // residential zones
  'rear yard', 'rear yard setback', 'side yard', 'setback',
  'height limit', 'massing', 'fariness', 'fundamentally',
  'lrsud', 'special use district', 'sud',
  // Compliance
  'ceqa', 'environmental review', 'mitigated negative declaration',
  'ada compliance', 'ansi a117', 'accessibility',
  'inclusionary housing', 'ihca', 'rent control',
  'historic preservation', 'mills act', 'article 10', 'article 11',
  // Inspection & enforcement
  'notice of violation', 'nov', 'stop work order', 'red tag',
  'code enforcement', 'abatement',
  'public works code', 'sidewalk permit',
];

/** Extract meaningful keywords from an Auflage string. Country routes vocabulary. */
function keywordsFromAuflage(auflage: string, country: 'DE' | 'US' | string = 'DE'): string[] {
  const out = new Set<string>();
  const text = auflage.toLowerCase();

  // DIN/EN/ISO references: "DIN 4109", "EN 1992-1-1"
  for (const m of text.matchAll(/\b(din|en|iso|vdi|atv)\s*[-\s]?\s*(\d{2,5}(?:[-]\d+(?:[-]\d+)?)?)/gi)) {
    out.add(`${m[1]} ${m[2]}`.toLowerCase().replace(/\s+/g, ' '));
  }

  // ASTM / ANSI / IBC / IRC references (US codes)
  for (const m of text.matchAll(/\b(astm|ansi|ibc|irc|iebc|nfpa)\s*[-\s]?\s*([a-z]?\d{1,5}(?:[-]\d+)?)/gi)) {
    out.add(`${m[1]} ${m[2]}`.toLowerCase().replace(/\s+/g, ' '));
  }

  const themes = country === 'US' ? THEMES_US : THEMES_DE;
  for (const t of themes) if (text.includes(t)) out.add(t);

  // Paragraph references: "§ 8a", "§§ 48-49" (works for both DE codes and SF Planning Code)
  for (const m of text.matchAll(/§§?\s*\d+[a-z]?(?:[-–]\d+[a-z]?)?/gi)) {
    out.add(m[0].toLowerCase().replace(/\s+/g, ' '));
  }

  // "Title 24, Part 6" → already covered by THEMES_US 'title 24'
  // "Chapter 13C" / "Article 11" / "§ 311" – section refs (US Code, SF code)
  for (const m of text.matchAll(/\b(chapter|article|section|part)\s+\d+[A-Z]?/gi)) {
    out.add(m[0].toLowerCase().replace(/\s+/g, ' '));
  }
  return [...out];
}

export interface PierceMatch {
  auflage_index: number;
  auflage_text: string;
  matched_keyword: string;
  matched_excerpt: string;
  severity: 'high' | 'medium' | 'low';
}

/** Check a single filing against a single project's Auflagen.
 *  `country` routes the vocabulary (DE themes vs US themes). */
export function matchFilingAgainstProject(
  filingContent: string,
  filingTitle: string,
  auflagen: string[],
  country: 'DE' | 'US' | string = 'DE',
): PierceMatch[] {
  const haystack = (filingTitle + '\n' + filingContent).toLowerCase();
  const matches: PierceMatch[] = [];

  for (let i = 0; i < auflagen.length; i++) {
    const a = auflagen[i];
    const keywords = keywordsFromAuflage(a, country);
    let best: PierceMatch | null = null;

    for (const kw of keywords) {
      // Word-boundary match avoids 'mbo' matching 'mannheim' or 'lbo' matching 'global'.
      // For paragraph refs (§ 8a) and DIN/EN refs, use a more lenient pattern.
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = kw.startsWith('§')
        ? new RegExp(escaped.replace(/\\\s/g, '\\s*'), 'i')
        : new RegExp(`(?:^|[^a-zäöü0-9])${escaped}(?:$|[^a-zäöü0-9])`, 'i');

      const m = pattern.exec(haystack);
      if (!m) continue;

      const idx = m.index;
      const start = Math.max(0, idx - 80);
      const end = Math.min(haystack.length, idx + m[0].length + 80);
      const excerpt = haystack.slice(start, end).replace(/\s+/g, ' ').trim();

      // Severity: DIN/EN refs + paragraph refs are precise → high.
      // Thematic keywords are noisy → medium.
      const severity: PierceMatch['severity'] =
        /^(din|en|iso|vdi|atv)\s/.test(kw) || kw.startsWith('§')
          ? 'high'
          : 'medium';

      const candidate: PierceMatch = {
        auflage_index: i,
        auflage_text: a,
        matched_keyword: kw,
        matched_excerpt: excerpt,
        severity,
      };

      // Keep the strongest match (high beats medium beats low). One alert per Auflage.
      if (!best || severityRank(candidate.severity) > severityRank(best.severity)) {
        best = candidate;
      }
    }

    if (best) matches.push(best);
  }

  return matches;
}

function severityRank(s: 'high' | 'medium' | 'low'): number {
  return s === 'high' ? 3 : s === 'medium' ? 2 : 1;
}
