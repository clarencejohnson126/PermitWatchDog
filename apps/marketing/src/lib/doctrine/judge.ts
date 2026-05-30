// Per-match LLM judge — the precision layer that kills T0's keyword spam.
//
// The keyword matcher in src/lib/orchestrator/matcher.ts is a RECALL gate:
// it surfaces every candidate filing that *could* affect an Auflage.
// This judge is the PRECISION gate: it reads the candidate filing + Auflage
// + Bescheid context and decides whether the filing actually CHANGES the
// regulation cited in the Auflage in a way that would pierce the permit.
//
// The judge explicitly considers the four-layer doctrine:
//   1. Bestandsschutz   — Bescheid issued before filing? Existing permit protected.
//   2. Vertrauensschutz — Good-faith reliance on the existing rules.
//   3. Verhältnismäßigkeit — Is the change disproportionate to the existing build?
//   4. Übergangsregelungen — Transition periods that may delay impact.
// Plus: Auflage-Piercing exception — explicit reference to a DIN/§ that just
// got changed *does* pierce, even with Bestandsschutz.

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { z } from 'zod';

export const JudgeVerdict = z.object({
  pierces: z.boolean(),
  severity: z.enum(['high', 'medium', 'low']).nullable(),
  doctrine_layer_applied: z.enum([
    // German doctrine
    'BESTANDSSCHUTZ',
    'VERTRAUENSSCHUTZ',
    'VERHAELTNISMAESSIGKEIT',
    'UEBERGANGSREGELUNG',
    'AUFLAGE_PIERCING',
    // US doctrine equivalents
    'VESTED_RIGHTS',          // ↔ Bestandsschutz
    'EQUITABLE_ESTOPPEL',     // ↔ Vertrauensschutz
    'REASONABLE_NECESSITY',   // ↔ Verhältnismäßigkeit
    'GRANDFATHERING',         // ↔ Übergangsregelung
    'CONDITION_PIERCING',     // ↔ Auflage-Piercing
    'NONE',
  ]),
  reasoning_de: z.string().min(5).max(400), // language depends on country; field name kept for back-compat
  confidence: z.number().min(0).max(1),
});
export type JudgeVerdict = z.infer<typeof JudgeVerdict>;

const SYSTEM_DE = `Du bist ein präziser Bauleiter-Assistent in Deutschland und prüfst, ob ein neu veröffentlichtes Amtsblatt-Filing eine konkrete Auflage einer bereits genehmigten Baugenehmigung "durchbricht" (Auflage-Piercing).

Wende strikt die vier Schichten deutscher Verwaltungsdoktrin an:
1. BESTANDSSCHUTZ — Wurde der Bescheid VOR dem Filing erteilt? Dann schützt Art. 14 GG die genehmigte Bauausführung in fast allen Fällen.
2. VERTRAUENSSCHUTZ — §§ 48-49 VwVfG. Hat der Bauherr in gutem Glauben auf die Gültigkeit gebaut?
3. VERHÄLTNISMÄSSIGKEIT — Wäre eine Anpassung verhältnismäßig (Art. 20 III GG)?
4. ÜBERGANGSREGELUNGEN — Schützt eine BauGB/LBO-Übergangsfrist den Antrag?

AUSNAHME (Auflage-Piercing): Wenn das Filing eine DIN-Norm oder einen Paragrafen ändert, auf den die Auflage EXPLIZIT mit "in der jeweils gültigen Fassung" verweist, dann durchbricht es trotz Bestandsschutz.

Sei EXTREM konservativ. Wenn du nicht sicher bist → pierces=false. False-Negatives sind besser als False-Positives. Die Email darf nur kommen wenn der Bauleiter WIRKLICH handeln muss.

Antworte ausschließlich im strikten JSON-Schema. reasoning_de auf DEUTSCH, max 50 Wörter, doctrine_layer_applied aus BESTANDSSCHUTZ/VERTRAUENSSCHUTZ/VERHAELTNISMAESSIGKEIT/UEBERGANGSREGELUNG/AUFLAGE_PIERCING/NONE.`;

const SYSTEM_US = `You are a precise building-project assistant in the United States, evaluating whether a newly published municipal filing (Planning Commission decision, Building Department notice, Board of Supervisors ordinance, etc.) "pierces" a specific Condition of Approval attached to an already-issued building permit.

Apply the four-layer US building doctrine strictly:
1. VESTED_RIGHTS — Was the permit issued BEFORE the filing was published? Then under the doctrine of vested rights (e.g. Avco Community Developers v. South Coast Regional Commission, 17 Cal.3d 785), the existing permit is protected from subsequent regulatory changes in most cases.
2. EQUITABLE_ESTOPPEL — Did the owner reasonably rely in good faith on the existing rules (City of Long Beach v. Mansell, 3 Cal.3d 462)?
3. REASONABLE_NECESSITY — Would forcing an adjustment be reasonable / proportionate (substantive due process, US Const. Amend. XIV)?
4. GRANDFATHERING — Is the project protected by an explicit grandfathering provision or transitional clause in the new ordinance?

EXCEPTION (CONDITION_PIERCING): If the filing amends a specific code section, ordinance, or DIN/ASTM/IBC standard that the Condition of Approval EXPLICITLY references with "as amended" / "as the same may be amended" / "in effect at the time of construction" language, then the new rule pierces the existing permit despite vested rights.

Be EXTREMELY conservative. If uncertain → pierces=false. False-negatives beat false-positives. An alert email goes out ONLY when the builder MUST take action.

Reply strictly in JSON. reasoning_de in ENGLISH (max 50 words; field name is reasoning_de for backwards compatibility), doctrine_layer_applied from VESTED_RIGHTS/EQUITABLE_ESTOPPEL/REASONABLE_NECESSITY/GRANDFATHERING/CONDITION_PIERCING/NONE.`;

const SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    pierces: { type: SchemaType.BOOLEAN, description: 'true nur wenn der Bauleiter handeln muss' },
    severity: {
      type: SchemaType.STRING,
      enum: ['high', 'medium', 'low'],
      nullable: true,
    },
    doctrine_layer_applied: {
      type: SchemaType.STRING,
      enum: [
        'BESTANDSSCHUTZ', 'VERTRAUENSSCHUTZ', 'VERHAELTNISMAESSIGKEIT',
        'UEBERGANGSREGELUNG', 'AUFLAGE_PIERCING',
        'VESTED_RIGHTS', 'EQUITABLE_ESTOPPEL', 'REASONABLE_NECESSITY',
        'GRANDFATHERING', 'CONDITION_PIERCING',
        'NONE',
      ],
    },
    reasoning_de: { type: SchemaType.STRING, description: 'max. 50 Wörter, deutsch' },
    confidence: { type: SchemaType.NUMBER },
  },
  required: ['pierces', 'severity', 'doctrine_layer_applied', 'reasoning_de', 'confidence'],
};

export interface JudgeInput {
  /** Specific Auflage text being evaluated */
  auflage_text: string;
  /** When the Bescheid was issued (used for Bestandsschutz timing) */
  bescheid_issued_at: Date;
  /** Project lifecycle stage */
  lifecycle_stage: string;
  /** Project country — 'DE' or 'US'. Routes the doctrine + reasoning language. */
  country: 'DE' | 'US' | string;
  /** Filing title + content excerpt */
  filing_title: string;
  filing_content: string;
  filing_publish_date: Date;
  filing_source_type: string;
  /** The keyword that triggered this match (helps the LLM focus) */
  matched_keyword: string;
}

export async function judgeMatch(input: JudgeInput): Promise<JudgeVerdict> {
  // Read at call time so .env loaded after import (CLI scripts, tests) still works.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const isUS = (input.country || 'DE').toUpperCase() === 'US';
  const systemInstruction = isUS ? SYSTEM_US : SYSTEM_DE;
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    systemInstruction,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 600,
      responseMimeType: 'application/json',
      responseSchema: SCHEMA as any,
    },
  });

  // Hard-cap content so the prompt stays small + fast.
  const contentExcerpt = input.filing_content.slice(0, 3000);
  const issuedISO = input.bescheid_issued_at.toISOString().split('T')[0];
  const publishedISO = input.filing_publish_date.toISOString().split('T')[0];

  const prompt = isUS
    ? `CONTEXT — Permit:
- Issued on: ${issuedISO}
- Project lifecycle: ${input.lifecycle_stage}

THE CONDITION (evaluate THIS specifically):
"${input.auflage_text}"

THE FILING:
- Source: ${input.filing_source_type}
- Title: ${input.filing_title}
- Published: ${publishedISO}
- Matched keyword: "${input.matched_keyword}"
- Content excerpt:
${contentExcerpt}

QUESTION: Does this filing pierce the above specific Condition of Approval?
Apply the doctrine (vested rights / estoppel / reasonable necessity / grandfathering / condition-piercing) and answer in the JSON schema.`
    : `KONTEXT — Bescheid:
- Erteilt am: ${issuedISO}
- Lifecycle: ${input.lifecycle_stage}

DIE AUFLAGE (genau diese prüfen):
"${input.auflage_text}"

DAS FILING:
- Quelle: ${input.filing_source_type}
- Titel: ${input.filing_title}
- Veröffentlicht: ${publishedISO}
- Treffer-Keyword: "${input.matched_keyword}"
- Inhalts-Auszug:
${contentExcerpt}

FRAGE: Durchbricht dieses Filing die obige konkrete Auflage des Bauherrn?
Wende die Doktrin an (Bestandsschutz/Vertrauensschutz/...) und antworte im JSON-Schema.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Judge returned non-JSON: ${text.slice(0, 200)}`);
  }

  const v = JudgeVerdict.safeParse(parsed);
  if (!v.success) {
    throw new Error(`Judge output schema invalid: ${v.error.message}`);
  }
  return v.data;
}
