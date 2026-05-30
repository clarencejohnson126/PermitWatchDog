// Geographic pre-filter — kills Sandhofen-style false-positives before
// they even reach the Gemini judge. The principle: a filing that talks
// ONLY about other districts in the same city cannot meaningfully pierce
// a permit issued for THIS district.
//
// Strategy:
//   1. Identify the project's district (Stadtteil / neighborhood) from
//      its address fields.
//   2. Extract district mentions from the filing's title + content.
//   3. If the filing mentions OTHER districts AND does NOT mention the
//      project's district AND has no city-wide regulatory signal,
//      reject.
//
// We err on the side of KEEPING (the Gemini judge is the final precision
// gate). This filter just removes obvious geo mismatches cheaply.

interface DistrictRegistry {
  /** city name (e.g. 'mannheim', 'palo alto') */
  city: string;
  /** all known sub-districts (lowercased) */
  districts: string[];
  /**
   * Map specific tokens that appear in addresses to their district.
   * E.g. for Mannheim Quadrate: addresses like "P3, 16" or "Q5, 18"
   * map to "innenstadt". Used to derive project district when explicit
   * district name isn't in `address`/`gemarkung`.
   */
  addressTokensToDistrict: { pattern: RegExp; district: string }[];
  /** Title/content phrases that signal city-wide impact — never reject. */
  cityWideMarkers: RegExp[];
}

const MANNHEIM: DistrictRegistry = {
  city: 'mannheim',
  // 17 Stadtteile + alias forms. Lower-case, no umlauts collapsed (we lowercase
  // input but preserve umlauts so the match is precise).
  districts: [
    'innenstadt', 'quadrate',
    'lindenhof', 'neckarstadt-ost', 'neckarstadt-west', 'neckarstadt',
    'jungbusch', 'schwetzingerstadt', 'oststadt', 'feudenheim',
    'käfertal', 'kaefertal', 'vogelstang', 'wallstadt', 'sandhofen',
    'schönau', 'schoenau', 'waldhof', 'gartenstadt', 'luzenberg',
    'rheinau', 'neckarau', 'almenhof', 'niederfeld',
    'seckenheim', 'friedrichsfeld', 'hochstätt', 'hochstaett',
    'mannheim-süd', 'mannheim-nord', 'mannheim-ost', 'mannheim-west',
  ],
  addressTokensToDistrict: [
    // Mannheim Quadrate (Innenstadt): A1-U7 grid notation
    { pattern: /\b[a-u]\s?\d{1,2}\s?,?\s?\d{1,3}\b/i, district: 'innenstadt' },
  ],
  cityWideMarkers: [
    /landesbauordnung|lbo\s|mbo\s|baugesetzbuch|baugb|baunvo/i,
    /din\s*\d/i,                         // DIN-Norm changes apply city-wide
    /e[wö]ärmeg|geg\s|gebäudeenergie/i, // Energy law city-wide
    /\bganz\s+(?:mannheim|der\s+stadt)\b/i,
    /amtsblatt\s+kw/i,                   // weekly Amtsblatt usually mixes everything
  ],
};

const PALO_ALTO: DistrictRegistry = {
  city: 'palo alto',
  districts: [
    'university south', 'professorville', 'downtown north',
    'crescent park', 'community center', 'duveneck/st\\.?\\s*francis',
    'duveneck', 'st. francis',
    'old palo alto', 'south of midtown', 'midtown',
    'south of forest', 'evergreen park', 'mayfield',
    'college terrace', 'stanford research park',
    'ventura', 'barron park', 'green acres', 'fairmeadow',
    'palo verde', 'greer park', 'monroe park',
    'leland manor', 'garland', 'triple el',
    'eichler', 'stanford', 'east palo alto',
  ],
  addressTokensToDistrict: [],
  cityWideMarkers: [
    /\bcity\s*-?\s*wide\b/i,
    /comprehensive\s+plan/i,
    /title\s+18/i,                       // Zoning code = city-wide
    /municipal\s+code/i,
    /general\s+plan/i,
    /ordinance\s+no\b/i,
    /ceqa/i,
    /\bcity\s+of\s+palo\s+alto\s+only\b/i,
  ],
};

const REGISTRIES: DistrictRegistry[] = [MANNHEIM, PALO_ALTO];

export interface GeoCheckResult {
  decision: 'keep' | 'reject';
  reason: string;
  project_district?: string;
  filing_districts: string[];
}

function pickRegistry(gemeinde: string): DistrictRegistry | null {
  const g = gemeinde.toLowerCase().trim();
  return REGISTRIES.find((r) => g.includes(r.city)) ?? null;
}

function findDistricts(text: string, reg: DistrictRegistry): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const d of reg.districts) {
    // Word-boundary match — avoid "Almenhof" matching inside "Mannhof" etc.
    const escaped = d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|[^a-zäöüß])${escaped}(?:$|[^a-zäöüß])`, 'i');
    if (re.test(lower)) found.add(d);
  }
  return [...found];
}

function deriveProjectDistrict(
  project: { address: string; gemarkung: string },
  reg: DistrictRegistry,
): string | undefined {
  // First: explicit district name in address or gemarkung
  const blob = `${project.address} ${project.gemarkung}`;
  const explicit = findDistricts(blob, reg);
  if (explicit.length > 0) return explicit[0];

  // Second: address-pattern → district mapping (e.g. Mannheim Quadrate)
  for (const { pattern, district } of reg.addressTokensToDistrict) {
    if (pattern.test(project.address)) return district;
  }
  return undefined;
}

export function geoCheck(
  project: { address: string; gemarkung: string },
  filing: { title: string; content_text: string; gemeinde: string },
): GeoCheckResult {
  const reg = pickRegistry(filing.gemeinde);
  if (!reg) {
    return { decision: 'keep', reason: 'unknown city, no district registry', filing_districts: [] };
  }

  const projectDistrict = deriveProjectDistrict(project, reg);
  if (!projectDistrict) {
    return { decision: 'keep', reason: 'cannot derive project district — defer to judge', filing_districts: [] };
  }

  // City-wide markers always pass.
  const filingBlob = `${filing.title} ${filing.content_text}`;
  for (const re of reg.cityWideMarkers) {
    if (re.test(filingBlob)) {
      return {
        decision: 'keep',
        reason: 'city-wide regulatory marker found',
        project_district: projectDistrict,
        filing_districts: findDistricts(filingBlob, reg),
      };
    }
  }

  const filingDistricts = findDistricts(filingBlob, reg);

  // If filing has no district info at all → keep (could be anything).
  if (filingDistricts.length === 0) {
    return {
      decision: 'keep',
      reason: 'no district mentions, defer to judge',
      project_district: projectDistrict,
      filing_districts: [],
    };
  }

  // If any mentioned district matches the project's → keep.
  if (filingDistricts.includes(projectDistrict)) {
    return {
      decision: 'keep',
      reason: `project district "${projectDistrict}" explicitly mentioned`,
      project_district: projectDistrict,
      filing_districts: filingDistricts,
    };
  }

  // Filing talks only about OTHER districts → reject.
  return {
    decision: 'reject',
    reason: `filing only mentions other districts: ${filingDistricts.join(', ')}; project district is "${projectDistrict}"`,
    project_district: projectDistrict,
    filing_districts: filingDistricts,
  };
}
