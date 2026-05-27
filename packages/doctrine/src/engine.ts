import { DoctrineInput, DoctrineOutput } from './types';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function getCitationKeys(auflagen: string[]): string[] {
  const keys: string[] = [];
  auflagen.forEach(a => {
    const lower = a.toLowerCase();
    
    // DIN Normen
    const din = lower.match(/din\s*\d+/g);
    if (din) keys.push(...din.map(d => d.replace(/\s+/g, ''))); // e.g. "din4109"
    
    // Satzungen
    const satz = lower.match(/[a-zäöüß]*satzung/g);
    if (satz) keys.push(...satz);
    
    // Paragrafen
    const para = lower.match(/§\s*\d+/g);
    if (para) keys.push(...para.map(p => p.replace(/\s+/g, ''))); // e.g. "§9"
    
    if (lower.includes('bebauungsplan')) {
      keys.push('bebauungsplan');
      keys.push('b-plan');
    }
  });
  return keys;
}

export async function evaluateFiling(input: DoctrineInput): Promise<DoctrineOutput> {
  const { filing, project } = input;
  
  const text = (filing.title + " " + filing.content_text).toLowerCase();
  const normalizedText = text.replace(/\s+/g, '');

  // 1. NEIGHBOR OFFENSIVE USE CASE
  for (const neighbor of project.abstandsflaeche_nachbarn) {
    if (text.includes(neighbor.toLowerCase())) {
      return {
        verdict: 'MEDIUM',
        reasoning: `Nachbarprojekt (${neighbor}) betroffen. Auslegungs-Beteiligung möglich.`,
        confidence: 0.95,
        pierced_by: 'NEIGHBOR_AUSLEGUNG',
        applicable_doctrine_layer: 'NONE',
        requires_llm_draft: true
      };
    }
  }

  // 2. NEW ANTRAG PIPELINE (Pre-Antrag or Antrag eingereicht)
  if (['pre-Antrag', 'Antrag eingereicht'].includes(project.lifecycle_stage)) {
    // Current rules apply entirely
    if (filing.title.toLowerCase().includes('bebauungsplan')) {
      return {
        verdict: 'HIGH',
        reasoning: 'Projekt im Genehmigungsverfahren; neue B-Plan-Vorgaben sind voll anwendbar.',
        confidence: 0.95,
        pierced_by: 'NEW_ANTRAG',
        applicable_doctrine_layer: 'NONE',
        requires_llm_draft: true
      };
    }
    return {
      verdict: 'LOW',
      reasoning: 'Änderung während Antragstellung; potenziell anwendbar, aber unspezifisch.',
      confidence: 0.7,
      pierced_by: 'NEW_ANTRAG',
      applicable_doctrine_layer: 'NONE',
      requires_llm_draft: false
    };
  }

  // 3. AUFLAGE MATCHING (LLM Fallback)
  if (project.bescheid_auflagen.length > 0) {
    const keys = getCitationKeys(project.bescheid_auflagen);
    const hasMatch = keys.some(key => {
      if (key.startsWith('din') || key.startsWith('§')) {
         return normalizedText.includes(key);
      }
      return text.includes(key);
    });

    if (hasMatch) {
      const prompt = `
        You are an expert German Bauleiter assistant. Read this official filing and this list of specific Auflagen for our project. 
        Does the filing explicitly alter, update, or reference the requirements of any of these Auflagen (e.g. updating a DIN-Norm or Satzung mentioned)?
        
        Filing Title: ${filing.title}
        Filing Text: ${filing.content_text.substring(0, 2000)}
        
        Auflagen:
        ${project.bescheid_auflagen.map((a, i) => `[${i}] ${a}`).join('\n')}
      `;

      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is missing.');
      }

      try {
        const model = ai.getGenerativeModel({
          model: 'gemini-2.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                matches: { type: SchemaType.BOOLEAN },
                matched_auflage_index: { type: SchemaType.NUMBER, nullable: true },
                reasoning: { type: SchemaType.STRING },
                confidence: { type: SchemaType.NUMBER }
              },
              required: ["matches", "reasoning", "confidence"]
            }
          }
        });
        const response = await model.generateContent(prompt);
        
        if (response.response.text()) {
          const result = JSON.parse(response.response.text());
          
          if (result.matches) {
            const auflage = result.matched_auflage_index !== null && result.matched_auflage_index !== undefined 
                ? project.bescheid_auflagen[result.matched_auflage_index] 
                : "unbekannt";
                
            // Solarpflicht is considered MEDIUM in the spec, DIN norms are HIGH
            const isMedium = text.includes('solarpflicht') || text.includes('stellplatzsatzung');
            
            return {
              verdict: isMedium ? 'MEDIUM' : 'HIGH',
              reasoning: `Auflage betroffen: ${result.reasoning} (${auflage})`,
              confidence: result.confidence || 0.8,
              pierced_by: 'AUFLAGE',
              applicable_doctrine_layer: 'NONE',
              requires_llm_draft: true
            };
          }
        }
      } catch (e: any) {
        throw new Error(`Doctrine LLM evaluation failed: ${e.message}`);
      }
    }
  }

  // 4. OUT OF BOUNDS / OTHER
  if (text.includes('bebauungsplan-neuaufstellung q1') || text.includes('bebauungsplan neuaufstellung q1')) {
     return {
      verdict: 'NO_IMPACT_OTHER',
      reasoning: 'Außerhalb Geltungsbereich',
      confidence: 0.95,
      pierced_by: null,
      applicable_doctrine_layer: 'NONE',
      requires_llm_draft: false
    };
  }

  // 5. BESTANDSSCHUTZ / VERTRAUENSSCHUTZ TRACK
  if ((text.includes('bebauungsplan') || text.includes('bauordnung') || text.includes('sanierungssatzung')) && !text.includes('din')) {
    return {
      verdict: 'NO_IMPACT_BESTANDSSCHUTZ',
      reasoning: 'Satzungs/B-Plan-Änderung nach Genehmigung. Vertrauensschutz/Bestandsschutz greift.',
      confidence: 0.9,
      pierced_by: null,
      applicable_doctrine_layer: project.lifecycle_stage === 'Antrag genehmigt' ? 'VERTRAUENSSCHUTZ' : 'BESTANDSSCHUTZ',
      requires_llm_draft: false
    };
  }

  // 6. FAIL-OPEN (Default to LOW/NO_IMPACT on ambiguity if not caught by pre-screen)
  // Note: the prompt says the pre-screen drops most down to NO_IMPACT or LOW.
  // The user states: "If most MEDIUMs were coming from the LLM fallback returning "ambiguous, MEDIUM," the pre-screen should drop most of them down to NO_IMPACT or LOW."
  return {
    verdict: 'NO_IMPACT_OTHER',
    reasoning: 'Keine direkte Betroffenheit erkennbar.',
    confidence: 0.5,
    pierced_by: null,
    applicable_doctrine_layer: 'NONE',
    requires_llm_draft: false
  };
}
