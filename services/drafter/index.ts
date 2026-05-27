import { GoogleGenerativeAI } from '@google/generative-ai';

export async function draftAddendum(filing: any, project: any, doctrineOutput: any) {
  if (!process.env.GEMINI_API_KEY) {
    return "ENTWURF (Mock):\n\nSehr geehrte Damen und Herren,\n\naufgrund der neuesten Bekanntmachung (" + filing.title + ") bitten wir um zeitnahe Prüfung des Vorhabens " + project.project_name + ". Wie besprochen: " + doctrineOutput.reasoning + "\n\nMit freundlichen Grüßen,\nClarence Johnson\nRebelzBau Mannheim GmbH";
  }

  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const prompt = `
    Sie sind ein professioneller deutscher Bauleiter. Schreiben Sie einen kurzen E-Mail-Entwurf (max 4 Absätze) an den Architekten.
    Thema der behördlichen Änderung: ${filing.title}
    Details: ${filing.content_text}
    Projekt: ${project.project_name} (Status: ${project.lifecycle_stage})
    Rechtliche Einordnung (sehr wichtig für den Architekten): ${doctrineOutput.reasoning}

    Nutzen Sie die formelle Sie-Form. Kein Marketing-Sprech. Keine Emojis. Fokussieren Sie sich auf die praktischen Auswirkungen für den Bauantrag bzw. das Bauvorhaben.
  `;
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-3.1-flash' });
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch(e: any) {
     console.error("Drafter API error", e.message);
     return "ENTWURF (API Fallback):\n\nSehr geehrte Damen und Herren,\n\naufgrund der neuesten Bekanntmachung (" + filing.title + ") bitten wir um zeitnahe Prüfung des Vorhabens " + project.project_name + ". Wie besprochen: " + doctrineOutput.reasoning + "\n\nMit freundlichen Grüßen,\nClarence Johnson\nRebelzBau Mannheim GmbH";
  }
}
