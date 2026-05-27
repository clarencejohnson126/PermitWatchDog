import { GoogleGenerativeAI } from '@google/generative-ai';

export async function draftAddendum(filing: any, project: any, doctrineOutput: any) {
  const fallbackText = doctrineOutput.verdict === 'HIGH' 
    ? `Sehr geehrte Damen und Herren,\n\nwir nehmen Bezug auf die aktuelle Bekanntmachung "${filing.title}".\n\nDa unser Bauvorhaben "${project.project_name}" derzeit den Status "${project.lifecycle_stage}" aufweist, durchbricht diese Änderung den Bestandsschutz. Konkret ist die Auflage ${doctrineOutput.pierced_by} betroffen, was eine Anpassung der Ausführungsplanung erzwingt.\n\nWir bitten um umgehende Prüfung des Sachverhalts und Rückmeldung zur notwendigen Planungsanpassung.\n\nMit freundlichen Grüßen,\nClarence Johnson\nRebelzBau Mannheim GmbH`
    : `Sehr geehrte Damen und Herren,\n\nwir nehmen Bezug auf die aktuelle Bekanntmachung "${filing.title}".\n\nFür unser Bauvorhaben "${project.project_name}" (Status: ${project.lifecycle_stage}) greift voraussichtlich der Bestandsschutz, aber die vorliegende Änderung könnte dennoch planungsrelevante Auswirkungen haben.\n\nWir bitten um kurze überschlägige Prüfung, ob sich hieraus Handlungsbedarf für die weitere Umsetzung ergibt.\n\nMit freundlichen Grüßen,\nClarence Johnson\nRebelzBau Mannheim GmbH`;

  if (!process.env.GEMINI_API_KEY) {
    return `ENTWURF (System Fallback):\n\n${fallbackText}`;
  }

  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const prompt = `
    Verfassen Sie einen kurzen, formellen E-Mail-Entwurf (exakt 4 Absätze) an den Architekten des Bauvorhabens.
    Nutzen Sie authentische deutsche Bauwesen-Sprache (VOB/B-Jargon).
    STRENG VERBOTEN: Marketing-Sprech, Entschuldigungen, Füllwörter wie "Ich hoffe", "Wir freuen uns".

    Eingabedaten:
    Thema: ${filing.title}
    Details: ${filing.content_text ? filing.content_text.substring(0, 1000) : ''}
    Projekt: ${project.project_name} (Status: ${project.lifecycle_stage})
    Rechtliche Einordnung: ${doctrineOutput.reasoning}
    Betroffene Auflage/DIN: ${doctrineOutput.pierced_by || 'Keine'}
    Verdict: ${doctrineOutput.verdict}

    Struktur (exakt 4 Absätze):
    1. Bezugnahme auf die Bekanntmachung/Änderung.
    2. Rechtliche Einordnung:
       - Wenn Verdict = MEDIUM: "Bestandsschutz greift voraussichtlich, aber [Thema] könnte Auswirkungen haben."
       - Wenn Verdict = HIGH: Konkrete Benennung der betroffenen Auflage (${doctrineOutput.pierced_by}) und warum Bestandsschutz durchbrochen wird.
    3. Konkrete Handlungsaufforderung (z.B. Prüfung der Planung, Anpassung des Brandschutznachweises).
    4. Formelle Verabschiedung (Mit freundlichen Grüßen, Clarence Johnson, RebelzBau Mannheim GmbH).
  `;
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-3.1-flash' });
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch(e: any) {
     console.error("Drafter API error", e.message);
     return `ENTWURF (API Fallback):\n\n${fallbackText}`;
  }
}
