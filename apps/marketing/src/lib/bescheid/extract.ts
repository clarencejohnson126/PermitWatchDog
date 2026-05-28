// Bescheid (German building permit) extraction via Gemini 2.0 Flash.
// Sends PDF bytes directly (Gemini multimodal supports PDF). Returns a
// strict-typed object matching the projects table schema, including the
// list of Auflagen (conditions) we'll monitor for piercing.

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { z } from 'zod';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  // Defer the throw to call-time so importing this module in tests doesn't crash.
  console.warn('[bescheid/extract] GEMINI_API_KEY not set — extraction will fail when called.');
}

export const ExtractedBescheid = z.object({
  project_name: z.string().min(1),
  address: z.string().min(1),
  gemarkung: z.string().default(''),
  flur: z.string().default(''),
  flurstueck: z.string().default(''),
  bauantrag_nr: z.string().default(''),
  aktenzeichen: z.string().default(''),
  lifecycle_stage: z.enum(['approved', 'under_construction', 'completed', 'unknown']).default('approved'),
  bescheid_auflagen: z.array(z.string()).default([]),
  abstandsflaeche_nachbarn: z.array(z.string()).default([]),
  parse_confidence: z.enum(['high', 'medium', 'low']).default('medium'),
  parse_notes: z.string().optional(),
});

export type ExtractedBescheid = z.infer<typeof ExtractedBescheid>;

const SYSTEM_PROMPT = `Du bist ein präziser Extraktor für deutsche Bauamts-Bescheide (Baugenehmigungen).

Lies den beiliegenden Bescheid und extrahiere strikt die folgenden Felder. Erfinde NICHTS — wenn ein Feld fehlt, gib einen leeren String oder leere Liste zurück.

Für Auflagen: Liste JEDE einzelne Auflage als separaten String, im Originalwortlaut so kompakt wie möglich. Beispiele:
- "DIN 4109 — Schallschutz: Nachweis vor Baubeginn"
- "Solarpflicht BW § 8a EWärmeG"
- "Brandschutz GK 4 nach MBO 2002"

Setze parse_confidence:
- "high" wenn alle Felder klar lesbar
- "medium" wenn 1-2 Felder unklar oder fehlend
- "low" wenn das Dokument schlecht lesbar oder kein echter Bescheid ist`;

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    project_name: { type: SchemaType.STRING, description: 'Kurzbezeichnung des Bauvorhabens' },
    address: { type: SchemaType.STRING, description: 'Vollständige Bau-Adresse' },
    gemarkung: { type: SchemaType.STRING },
    flur: { type: SchemaType.STRING },
    flurstueck: { type: SchemaType.STRING },
    bauantrag_nr: { type: SchemaType.STRING },
    aktenzeichen: { type: SchemaType.STRING },
    lifecycle_stage: {
      type: SchemaType.STRING,
      enum: ['approved', 'under_construction', 'completed', 'unknown'],
    },
    bescheid_auflagen: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: 'Jede einzelne Auflage als separater String',
    },
    abstandsflaeche_nachbarn: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: 'Abstandsflächen zu Nachbargrundstücken, falls erwähnt',
    },
    parse_confidence: {
      type: SchemaType.STRING,
      enum: ['high', 'medium', 'low'],
    },
    parse_notes: { type: SchemaType.STRING, nullable: true },
  },
  required: [
    'project_name',
    'address',
    'gemarkung',
    'flur',
    'flurstueck',
    'bauantrag_nr',
    'aktenzeichen',
    'lifecycle_stage',
    'bescheid_auflagen',
    'abstandsflaeche_nachbarn',
    'parse_confidence',
  ],
};

export async function extractBescheid(pdfBytes: Buffer, mimeType = 'application/pdf'): Promise<ExtractedBescheid> {
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    // gemini-2.0-flash is deprecated for new accounts → use 2.5-flash.
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      // The Gemini SDK accepts schema as a typed object; cast to any to satisfy
      // the SDK's looser typing.
      responseSchema: RESPONSE_SCHEMA as any,
    },
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: pdfBytes.toString('base64'),
      },
    },
    'Extrahiere den Bescheid streng nach Schema.',
  ]);

  const text = result.response.text();
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}`);
  }

  const parsed = ExtractedBescheid.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Gemini output failed schema validation: ${parsed.error.message}`);
  }
  return parsed.data;
}
