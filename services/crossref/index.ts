export function matchFilingToProject(filing: any, project: any) {
  const text = (filing.title + " " + filing.content_text).toLowerCase();
  
  if (text.includes(project.flurstueck.toLowerCase())) {
     return { matches: true, match_type: 'FLURSTUECK' };
  }
  
  // Keyword match
  const geoKeywords = ['q5', 'innenstadt', 'quadrat'];
  for (const kw of geoKeywords) {
     if (text.includes(kw)) {
       return { matches: true, match_type: 'GEOGRAPHIC' };
     }
  }

  // Auflage keywords
  const auflageKeywords = ['din 4109', 'brandschutz', 'din 4102', 'solarpflicht', 'stellplatzsatzung', 'lbo'];
  for (const kw of auflageKeywords) {
     if (text.includes(kw)) {
        return { matches: true, match_type: 'AUFLAGE' };
     }
  }

  return { matches: false, match_type: null };
}
