import { GoogleGenerativeAI } from '@google/generative-ai';

export async function draftAddendum(filing: any, project: any, doctrineOutput: any) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const safeContent = filing.content_text ? filing.content_text.replace(/mah_hp[\w_.]+/gi, '') : '';
  const prompt = `
    Verfassen Sie einen kurzen, formellen E-Mail-Entwurf (exakt 4 Absätze) an den Architekten des Bauvorhabens.
    Nutzen Sie authentische deutsche Bauwesen-Sprache (VOB/B-Jargon).
    STRENG VERBOTEN: Marketing-Sprech, Entschuldigungen, Füllwörter wie "Ich hoffe", "Wir freuen uns".
    STRENG VERBOTEN: Platzhalter wie "[Name]" oder "{Architekt}". Verwenden Sie als Anrede exakt: "Sehr geehrte Damen und Herren,".
    STRENG VERBOTEN: Die Nennung von internen Dokument-IDs oder CMS-Dateinamen (z.B. mah_hp03_amtsb.01). Beziehen Sie sich nur auf den Titel.

    Eingabedaten:
    Thema: ${filing.title}
    Details: ${safeContent.substring(0, 1000)}
    Projekt: ${project.project_name} (Status: ${project.lifecycle_stage})
    Rechtliche Einordnung (enthält die betroffene Auflage): ${doctrineOutput.reasoning}
    Verdict: ${doctrineOutput.verdict}

    Struktur (exakt 4 Absätze):
    1. Bezugnahme auf die Bekanntmachung/Änderung.
    2. Rechtliche Einordnung:
       - Wenn Verdict = MEDIUM: "Bestandsschutz greift voraussichtlich, aber [Thema] könnte Auswirkungen haben."
       - Wenn Verdict = HIGH: Konkrete Benennung der spezifischen Auflage (siehe 'Rechtliche Einordnung') und kurze Begründung, warum Bestandsschutz durchbrochen wird.
    3. Konkrete Handlungsaufforderung (z.B. Prüfung der Planung, Anpassung des Brandschutznachweises).
    4. Formelle Verabschiedung (Mit freundlichen Grüßen, Clarence Johnson, RebelzBau Mannheim GmbH).
  `;
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent(prompt);
    const draftText = response.response.text();

    const criticModel = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const criticPrompt = `
       You are a strict German-language editor reviewing AI-generated
       text for a construction-industry product. Read the following
       text and identify any token that is NOT a valid German word
       or recognized abbreviation. IGNORE these as valid:
         - Proper nouns: street names, company names (RebelzBau
           Mannheim GmbH), people names (Clarence Johnson),
           project names (Q5, 18, Wohnhaus Q5,18)
         - Standard abbreviations: VOB/B, DIN, BGB, KW, BauGB,
           LBO, BauR, m², m³, %, §
         - Numbers and dates
         - Compound technical Bauwesen terms even if rare:
           Bauantrags-Addendum, Bestandsschutz, Vertrauensschutz,
           Übergangsregelung, Abstandsfläche, Genehmigungsbescheid,
           Auslegungsfrist, etc.

       Return ONLY JSON in this exact shape, no markdown:
         {
           "has_invalid": boolean,
           "invalid_tokens": ["word1", "word2"],
           "reasoning": "short explanation in DE"
         }

       Be strict on syllable-drop typos (e.g., 'Vosperrungen' for
       'Vollsperrungen', 'beeinfesondere' for 'beeinflussen.
       Insbesondere'). These are the primary failure modes.

       Text to review:
       ---
       ${draftText}
       ---
    `;
    const criticResponse = await criticModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: criticPrompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
    });
    const criticJson = JSON.parse(criticResponse.response.text());
    if (criticJson.has_invalid) {
       throw new Error(`Self-Critic Guard: Dropped draft due to invalid tokens: ${criticJson.invalid_tokens.join(', ')}. Reasoning: ${criticJson.reasoning}`);
    }

    return draftText;
  } catch (e: any) {
     throw new Error(`Drafter Gemini API failed: ${e.message}`);
  }
}
