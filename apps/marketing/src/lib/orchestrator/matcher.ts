// T0 keyword matcher — given a Project's Auflagen and a Filing's content,
// decide whether the filing might pierce any Auflage. Returns matches with
// confidence + the matched keyword that triggered.
//
// This is the simple keyword path. T1+ swaps this for an LLM call into
// packages/doctrine/engine.ts that runs the full 4-layer reasoning.

/** Extract meaningful keywords from an Auflage string. */
function keywordsFromAuflage(auflage: string): string[] {
  const out = new Set<string>();
  const text = auflage.toLowerCase();

  // DIN/EN/ISO references: "DIN 4109", "EN 1992-1-1"
  for (const m of text.matchAll(/\b(din|en|iso|vdi|atv)\s*[-\s]?\s*(\d{2,5}(?:[-]\d+(?:[-]\d+)?)?)/gi)) {
    out.add(`${m[1]} ${m[2]}`.toLowerCase().replace(/\s+/g, ' '));
  }
  // Bauamts-Domänen
  const themes = [
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
  for (const t of themes) if (text.includes(t)) out.add(t);

  // Paragraph references: "§ 8a", "§§ 48-49"
  for (const m of text.matchAll(/§§?\s*\d+[a-z]?(?:[-–]\d+[a-z]?)?/gi)) {
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

/** Check a single filing against a single project's Auflagen. */
export function matchFilingAgainstProject(
  filingContent: string,
  filingTitle: string,
  auflagen: string[],
): PierceMatch[] {
  const haystack = (filingTitle + '\n' + filingContent).toLowerCase();
  const matches: PierceMatch[] = [];

  for (let i = 0; i < auflagen.length; i++) {
    const a = auflagen[i];
    const keywords = keywordsFromAuflage(a);
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

      // Severity heuristic: DIN/EN refs + paragraph refs → high; thematic keyword → medium.
      const severity: PierceMatch['severity'] =
        /^(din|en|iso|vdi|atv)\s/.test(kw) || kw.startsWith('§')
          ? 'high'
          : 'medium';

      matches.push({
        auflage_index: i,
        auflage_text: a,
        matched_keyword: kw,
        matched_excerpt: excerpt,
        severity,
      });
      break; // one match per Auflage is enough — we don't want spammy alerts
    }
  }

  return matches;
}
