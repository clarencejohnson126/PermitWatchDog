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

const apiKey = process.env.GEMINI_API_KEY;

export const JudgeVerdict = z.object({
  pierces: z.boolean(),
  severity: z.enum(['high', 'medium', 'low']).nullable(),
  doctrine_layer_applied: z.enum([
    'BESTANDSSCHUTZ',
    'VERTRAUENSSCHUTZ',
    'VERHAELTNISMAESSIGKEIT',
    'UEBERGANGSREGELUNG',
    'AUFLAGE_PIERCING',
    'NONE',
  ]),
  reasoning_de: z.string().min(5).max(400),
  confidence: z.number().min(0).max(1),
});
export type JudgeVerdict = z.infer<typeof JudgeVerdict>;

const SYSTEM = `Du bist ein präziser Bauleiter-Assistent in Deutschland und prüfst, ob ein neu veröffentlichtes Amtsblatt-Filing eine konkrete Auflage einer bereits genehmigten Baugenehmigung "durchbricht" (Auflage-Piercing).

Wende strikt die vier Schichten deutscher Verwaltungsdoktrin an:
1. BESTANDSSCHUTZ — Wurde der Bescheid VOR dem Filing erteilt? Dann schützt Art. 14 GG die genehmigte Bauausführung in fast allen Fällen.
2. VERTRAUENSSCHUTZ — §§ 48-49 VwVfG. Hat der Bauherr in gutem Glauben auf die Gültigkeit gebaut?
3. VERHÄLTNISMÄSSIGKEIT — Wäre eine Anpassung verhältnismäßig (Art. 20 III GG)?
4. ÜBERGANGSREGELUNGEN — Schützt eine BauGB/LBO-Übergangsfrist den Antrag?

AUSNAHME (Auflage-Piercing): Wenn das Filing eine DIN-Norm oder einen Paragrafen ändert, auf den die Auflage EXPLIZIT mit "in der jeweils gültigen Fassung" verweist, dann durchbricht es trotz Bestandsschutz.

Sei EXTREM konservativ. Wenn du nicht sicher bist → pierces=false. False-Negatives sind besser als False-Positives. Die Email darf nur kommen wenn der Bauleiter WIRKLICH handeln muss.

Antworte ausschließlich im strikten JSON-Schema.`;

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
        'BESTANDSSCHUTZ',
        'VERTRAUENSSCHUTZ',
        'VERHAELTNISMAESSIGKEIT',
        'UEBERGANGSREGELUNG',
        'AUFLAGE_PIERCING',
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
  /** Filing title + content excerpt */
  filing_title: string;
  filing_content: string;
  filing_publish_date: Date;
  filing_source_type: string;
  /** The keyword that triggered this match (helps the LLM focus) */
  matched_keyword: string;
}

export async function judgeMatch(input: JudgeInput): Promise<JudgeVerdict> {
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    systemInstruction: SYSTEM,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 600,
      responseMimeType: 'application/json',
      responseSchema: SCHEMA as any,
    },
  });

  // Hard-cap content so the prompt stays small + fast.
  const contentExcerpt = input.filing_content.slice(0, 3000);

  const prompt = `KONTEXT — Bescheid:
- Erteilt am: ${input.bescheid_issued_at.toISOString().split('T')[0]}
- Lifecycle: ${input.lifecycle_stage}

DIE AUFLAGE (genau diese prüfen):
"${input.auflage_text}"

DAS FILING:
- Quelle: ${input.filing_source_type}
- Titel: ${input.filing_title}
- Veröffentlicht: ${input.filing_publish_date.toISOString().split('T')[0]}
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
