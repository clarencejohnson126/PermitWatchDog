// City and County of San Francisco scraper.
//
// Replaces the Palo Alto attempt — Palo Alto's CMS is WAF-blocked
// (Akamai 403) and its Legistar instance is not API-enabled. San
// Francisco runs DataSF (Socrata-based open data), which is the gold
// standard for US municipal open data and has clean JSON for every
// permit-related dataset.
//
// Sources (verified 2026-05-30):
//   - DataSF Building Permits  https://data.sfgov.org/resource/i98e-djp9.json
//     ~4M records. Updated daily. Includes addresses, descriptions,
//     filing/issue dates. Filtered server-side via SoQL ($where) to
//     surface permits that touch the Planning Code, variances,
//     conditional-use, discretionary review — i.e. regulatory activity
//     that could actually pierce an existing permit's Conditions of
//     Approval.
//
// Future endpoints (TODO):
//   - Board of Supervisors Legislative Files (need to confirm correct
//     dataset ID — 4nyk-tym2 returned an error)
//   - Planning Commission Actions
//   - Code Enforcement notices
//
// Product positioning for SF:
//   Bescheid  →  Building Permit / Planning Permit
//   Auflage   →  Condition of Approval / Variance condition
//   Bauleitplanung / B-Plan → Planning Code amendments, General Plan updates
//   Bauaufsichtliche Anordnung → Notice of Violation, DR (Discretionary Review)

import type { ScrapedRecord, SourceType, ParseConfidence } from './types';

const DATA_SF_PERMITS = 'https://data.sfgov.org/resource/i98e-djp9.json';

// Permit descriptions matching any of these terms signal real regulatory
// activity that could affect a neighbor's existing permit. Pure variance /
// conditional-use / code-amendment activity is the highest-signal subset.
const RELEVANT_PATTERNS = [
  '%variance%',
  '%conditional use%',
  '%code amend%',
  '%discretionary review%',
  '%appeal%',
  '%legalization%',
  '%nonconform%',
  '%setback%',
];

interface SFBuildingPermit {
  permit_number?: string;
  description?: string;
  status?: string;
  status_definition?: string;
  filed_date?: string;
  issued_date?: string;
  permit_creation_date?: string;
  status_date?: string;
  street_number?: string;
  street_name?: string;
  street_suffix?: string;
  block?: string;
  lot?: string;
  zipcode?: string;
  neighborhoods_analysis_boundaries?: string;
  existing_use?: string;
  proposed_use?: string;
  estimated_cost?: string;
  permit_type_definition?: string;
}

function fmtAddress(p: SFBuildingPermit): string {
  return [p.street_number, p.street_name, p.street_suffix]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .join(' ');
}

function fmtTitle(p: SFBuildingPermit): string {
  const addr = fmtAddress(p);
  const action = (p.description ?? '').split(/[.;]/)[0].slice(0, 120);
  return `SF Building Permit ${p.permit_number ?? '?'} · ${addr || '(address pending)'} — ${action}`;
}

function permitToRecord(p: SFBuildingPermit): ScrapedRecord | null {
  // Some old SF records have a missing filed_date but a valid creation date.
  // Walk fallbacks; reject only if ALL are missing/invalid.
  const dateStr = p.filed_date ?? p.permit_creation_date ?? p.issued_date ?? p.status_date;
  if (!dateStr) return null;
  const publishDate = new Date(dateStr);
  if (isNaN(publishDate.getTime())) return null;

  const fields = [
    p.description ?? '',
    p.permit_type_definition ? `Type: ${p.permit_type_definition}` : '',
    p.existing_use ? `Existing use: ${p.existing_use}` : '',
    p.proposed_use ? `Proposed use: ${p.proposed_use}` : '',
    p.estimated_cost ? `Estimated cost: $${p.estimated_cost}` : '',
    p.status_definition ? `Status: ${p.status_definition}` : '',
    p.block && p.lot ? `Block/Lot: ${p.block}/${p.lot}` : '',
    p.zipcode ? `ZIP: ${p.zipcode}` : '',
    p.neighborhoods_analysis_boundaries ? `Neighborhood: ${p.neighborhoods_analysis_boundaries}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const content = `${fmtAddress(p)}\n\n${fields}`.trim();
  const confidence: ParseConfidence = content.length > 100 ? 'high' : 'low';
  return {
    // Browser-friendly viewer URL for the specific permit on DataSF's portal.
    source_url: `https://data.sfgov.org/Housing-and-Buildings/Building-Permits/i98e-djp9/explore/query/SELECT%20%2A%20WHERE%20permit_number%3D%22${encodeURIComponent(p.permit_number ?? '')}%22`,
    publish_date: publishDate,
    gemeinde: 'San Francisco',
    title: fmtTitle(p),
    content_text: content,
    parse_confidence: confidence,
    source_type: 'bekanntmachung' as SourceType,
  };
}

export class SFScraper {
  public readonly gemeindeName = 'San Francisco';

  /**
   * Pull recent SF Building Permits whose description matches one of the
   * regulatory-activity patterns above. Filter server-side via Socrata's
   * SoQL `$where` to keep the response small.
   */
  async run(opts: { since?: Date; maxRecords?: number } = {}): Promise<ScrapedRecord[]> {
    const { since, maxRecords = 100 } = opts;
    const records: ScrapedRecord[] = [];

    // Build the SoQL where clause. `lower(description) like %pattern%` for each
    // relevant pattern, OR-joined. `filed_date >= 'ISO'` for incremental runs.
    const patternClauses = RELEVANT_PATTERNS.map(
      (p) => `lower(description) like '${p.replace(/'/g, "''")}'`,
    ).join(' OR ');
    let where = `(${patternClauses})`;
    if (since) {
      const iso = since.toISOString().split('T')[0];
      where = `${where} AND filed_date >= '${iso}T00:00:00'`;
    }

    const params = new URLSearchParams({
      '$where': where,
      '$order': 'filed_date DESC',
      '$limit': String(maxRecords),
    });

    const url = `${DATA_SF_PERMITS}?${params.toString()}`;
    let payload: SFBuildingPermit[] = [];
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        // DataSF is a public Socrata host — no auth needed for reads under the
        // throttle limit (~1000 req/h). For higher volume we'd need an app token.
      });
      if (!res.ok) {
        console.error(`[sf] DataSF responded ${res.status}`);
        return records;
      }
      payload = (await res.json()) as SFBuildingPermit[];
    } catch (e) {
      console.error('[sf] DataSF fetch failed:', e);
      return records;
    }

    for (const p of payload) {
      const rec = permitToRecord(p);
      if (rec) records.push(rec);
      if (records.length >= maxRecords) break;
    }

    return records;
  }
}
