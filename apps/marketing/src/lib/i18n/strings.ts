// Translation table for the top-funnel pages.
// Keep keys short, hierarchical (page.section.label), and stable.
// Deep pages (legal, doctrine deep-dives) stay German-only until they're
// translated by a human. The toggle hides them when lang='en' is a future
// improvement.

export type Lang = 'de' | 'en';

export const STRINGS = {
  // Nav
  'nav.product': { de: 'Produkt', en: 'Product' },
  'nav.doctrine': { de: 'Doktrin', en: 'Doctrine' },
  'nav.pricing': { de: 'Preise', en: 'Pricing' },
  'nav.pilot': { de: 'Mannheim Pilot', en: 'Palo Alto Pilot' },
  'nav.login': { de: 'Login', en: 'Login' },
  'nav.dashboard': { de: 'Dashboard', en: 'Dashboard' },
  'nav.cta': { de: 'BESCHEID HOCHLADEN', en: 'UPLOAD PERMIT' },

  // Hero
  'hero.eyebrow': { de: 'Der Bauantrags-Copilot', en: 'The Building-Permit Copilot' },
  'hero.title': {
    de: 'Die erste KI-gestützte Bauaufsicht',
    en: 'The first AI-powered building-permit watchdog',
  },
  'hero.subtitle': {
    de: 'Verhindern Sie behördliche Baustopps in Mannheim. Wir überwachen das Amtsblatt und wehren überzogene Auflagen durch automatisierte Verhältnismäßigkeits-Prüfungen ab.',
    en: 'Avoid city stop-work orders in Palo Alto. We watch every Planning Commission notice and challenge over-broad conditions through automated proportionality review.',
  },
  'hero.cta_primary': { de: 'Bauvorhaben absichern', en: 'Protect your project' },
  'hero.cta_secondary': { de: 'Doktrin ansehen', en: 'See the doctrine' },

  // Welcome video section
  'welcome.eyebrow': { de: '44 Sekunden · Hochdeutsch', en: '44 seconds · German voiceover' },
  'welcome.title': {
    de: 'Auflagen geändert? Wir sagen Bescheid.',
    en: 'Conditions changed? We let you know.',
  },
  'welcome.subtitle': {
    de: 'Was PermitWatchDog macht — in einem kompakten Tutorial. Echte Praxis, kein Marketing-Geblubber.',
    en: 'What PermitWatchDog does — in a compact tutorial. Real practice, not marketing fluff.',
  },
  'welcome.duration': { de: 'Dauer · 0:44', en: 'Length · 0:44' },
  'welcome.meta': { de: 'Hochdeutsch · ElevenLabs v3 · mit Untertiteln', en: 'German voice · ElevenLabs v3 · with subtitles' },

  // Upload page
  'upload.eyebrow': { de: 'Bescheid hochladen', en: 'Upload your permit' },
  'upload.title_left': { de: 'Drei Minuten Setup.', en: 'Three minutes of setup.' },
  'upload.title_right': { de: 'Wir lesen den Rest.', en: 'We read the rest.' },
  'upload.lead': {
    de: 'Lade Deinen Genehmigungs-Bescheid als PDF hoch. Wir extrahieren jede Auflage automatisch und vergleichen sie ab morgen jede Nacht gegen Bauamt-Änderungen.',
    en: 'Upload your building permit as a PDF. We extract every condition automatically and compare it against city notices every night, starting tomorrow.',
  },
  'upload.email_label': { de: 'E-Mail · für Alerts', en: 'Email · for alerts' },
  'upload.drop': { de: 'Bescheid hier ablegen', en: 'Drop your permit here' },
  'upload.drop_hint': { de: 'PDF · max 12 MB · ein einzelner Bescheid pro Upload', en: 'PDF · max 12 MB · one permit per upload' },
  'upload.reading': { de: 'Lese PDF…', en: 'Reading PDF…' },
  'upload.extracting': { de: 'Extrahiere Auflagen via Gemini…', en: 'Extracting conditions via Gemini…' },
  'upload.wait': { de: 'Das dauert 10–30 Sekunden. Nicht schließen.', en: 'This takes 10–30 seconds. Keep this tab open.' },
  'upload.done_title': { de: 'Bescheid eingelesen.', en: 'Permit ingested.' },
  'upload.done_body': {
    de: 'Projekt-ID {id} aktiv. Ab Morgen 06:00 wachen wir über jede Auflage.',
    en: 'Project {id} active. From tomorrow 06:00 we watch every condition.',
  },
  'upload.auflagen_count': { de: '{n} Auflagen erkannt', en: '{n} conditions extracted' },
  'upload.upload_another': { de: 'Weiteren Bescheid hochladen', en: 'Upload another permit' },
  'upload.privacy_note': {
    de: 'Das PDF wird nur einmalig durch Gemini gelesen und nicht gespeichert. Nur die extrahierten Auflagen + Projekt-Metadaten landen in unserer Datenbank.',
    en: 'The PDF is read once by Gemini and never stored. Only the extracted conditions and project metadata land in our database.',
  },
  'upload.errors.invalid_email': { de: 'Bitte zuerst eine gültige E-Mail-Adresse eintragen.', en: 'Enter a valid email address first.' },
  'upload.errors.not_pdf': { de: 'Nur PDF-Bescheide werden akzeptiert.', en: 'Only PDF permits are accepted.' },

  // Dashboard
  'dashboard.eyebrow': { de: 'Dashboard', en: 'Dashboard' },
  'dashboard.title_left': { de: 'Ihre', en: 'Your' },
  'dashboard.title_right': { de: 'Bauvorhaben', en: 'projects' },
  'dashboard.summary': { de: '{n} Projekt{plural} · {alerts} Alerts gesamt', en: '{n} project{plural} · {alerts} alerts total' },
  'dashboard.open': { de: 'offen', en: 'open' },
  'dashboard.sent': { de: 'versendet', en: 'sent' },
  'dashboard.no_alerts': {
    de: 'Bisher keine Alerts. Stille bedeutet: nichts hat eine Auflage durchbrochen.',
    en: 'No alerts yet. Silence means: nothing has pierced a condition.',
  },
  'dashboard.show_auflagen': { de: '{n} überwachte Auflagen anzeigen', en: 'Show {n} monitored conditions' },
  'dashboard.source': { de: 'Quelle:', en: 'Source:' },
  'dashboard.empty_email': { de: 'Kein Projekt für {email} gefunden.', en: 'No project found for {email}.' },
  'dashboard.cta_upload': { de: 'Bescheid hochladen', en: 'Upload permit' },

  // Generic
  'generic.lang_toggle_to_en': { de: 'English', en: 'English' },
  'generic.lang_toggle_to_de': { de: 'Deutsch', en: 'Deutsch' },
} satisfies Record<string, { de: string; en: string }>;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang, vars?: Record<string, string | number>): string {
  const entry = STRINGS[key] as { de: string; en: string } | undefined;
  let str: string = entry?.[lang] ?? entry?.de ?? String(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}
