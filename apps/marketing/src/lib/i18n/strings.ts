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
  'nav.pilot': { de: 'Mannheim Pilot', en: 'San Francisco Pilot' },
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
    en: 'Avoid stop-work orders in San Francisco. We watch every Planning Department filing and challenge over-broad Conditions of Approval through automated proportionality review.',
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
  'generic.loading': { de: 'Lädt…', en: 'Loading…' },

  // ── How-It-Works section ──
  'how.eyebrow': { de: 'Wie es funktioniert', en: 'How it works' },
  'how.title': { de: 'Vier Schritte, jede Nacht.', en: 'Four steps. Every night.' },
  'how.step1.title': { de: 'Scrapen', en: 'Scrape' },
  'how.step1.body': { de: 'Wir lesen jeden Eintrag im Bauamt-Portal und im Amtsblatt — automatisiert.', en: 'We read every entry in the city building portal and gazette — automated.' },
  'how.step2.title': { de: 'Parsen', en: 'Parse' },
  'how.step2.body': { de: 'PDFs werden in strukturierte Daten zerlegt: Bauantrag-Nr., Auflagen, Paragrafen.', en: 'PDFs are parsed into structured data: permit numbers, conditions, code sections.' },
  'how.step3.title': { de: 'Abgleichen', en: 'Cross-reference' },
  'how.step3.body': { de: 'Jedes Filing wird mit Ihrem Bescheid abgeglichen. Vier-Schichten-Doktrin filtert das Rauschen.', en: 'Every filing is matched against your permit. The four-layer doctrine filters the noise.' },
  'how.step4.title': { de: 'Entwurf', en: 'Draft' },
  'how.step4.body': { de: 'Bei einem Treffer: fertige E-Mail in Ihrem Outlook um 06:00 — mit Paragrafen und Frist.', en: 'On a real hit: drafted email in your Outlook by 06:00 — with code sections and deadline.' },

  // ── Doctrine section (home teaser) ──
  'doctrine.eyebrow': { de: 'Die Vier-Schichten-Doktrin', en: 'The Four-Layer Doctrine' },
  'doctrine.title': { de: 'Warum die meisten Änderungen Sie nicht betreffen.', en: 'Why most changes do not affect you.' },
  'doctrine.layer1.name': { de: 'Bestandsschutz', en: 'Vested Rights' },
  'doctrine.layer1.ref': { de: 'Art. 14 GG', en: 'Avco v. South Coast (1976)' },
  'doctrine.layer2.name': { de: 'Vertrauensschutz', en: 'Equitable Estoppel' },
  'doctrine.layer2.ref': { de: '§§ 48–49 VwVfG', en: 'Long Beach v. Mansell (1970)' },
  'doctrine.layer3.name': { de: 'Verhältnismäßigkeit', en: 'Reasonable Necessity' },
  'doctrine.layer3.ref': { de: 'Art. 20 III GG', en: 'US Const. Amend. XIV' },
  'doctrine.layer4.name': { de: 'Übergangsregelungen', en: 'Grandfathering' },
  'doctrine.layer4.ref': { de: 'BauGB / LBO', en: 'Transitional clauses' },
  'doctrine.cta': { de: 'Doktrin im Detail', en: 'Doctrine in detail' },

  // ── Pricing teaser ──
  'pricing.eyebrow': { de: 'Preise', en: 'Pricing' },
  'pricing.title': { de: 'Pro Projekt. Keine Setup-Gebühr.', en: 'Per project. No setup fee.' },
  'pricing.t0.name': { de: 'Plain Alerts', en: 'Plain Alerts' },
  'pricing.t0.body': { de: 'Tägliche E-Mail mit gefundenen Änderungen. Ohne Doktrin-Filter. Für Neugierige.', en: 'Daily email with matched changes. No doctrine filter. For the curious.' },
  'pricing.t1.name': { de: 'Watchdog', en: 'Watchdog' },
  'pricing.t1.body': { de: 'Doktrin-gefilterte Alerts + Outlook-Drafts mit Paragrafen, Frist und VOB/B-Anhang.', en: 'Doctrine-filtered alerts + Outlook drafts with code sections, deadlines, and contract addendum.' },
  'pricing.t2.name': { de: 'Bauträger', en: 'Developer' },
  'pricing.t2.body': { de: 'Bis zu 10 Projekte, prioritäre Doktrin-Beratung, monatlicher Status-Report.', en: 'Up to 10 projects, priority doctrine consulting, monthly status report.' },
  'pricing.cta_view': { de: 'Alle Preise ansehen', en: 'View all pricing' },

  // ── FAQ teaser ──
  'faq.title': { de: 'Häufige Fragen', en: 'Frequently asked questions' },
  'faq.q1': { de: 'Was kostet es?', en: 'How much does it cost?' },
  'faq.a1': { de: 'Pro Projekt — der Watchdog-Tarif liegt bei 49 € / Monat. Plain Alerts kostenlos für 14 Tage Test.', en: 'Per project — Watchdog is €49/month. Plain Alerts free for a 14-day trial.' },
  'faq.q2': { de: 'Was passiert mit meinem PDF?', en: 'What happens to my PDF?' },
  'faq.a2': { de: 'Es wird einmal von Gemini gelesen und nicht gespeichert. Nur die extrahierten Auflagen landen in unserer Datenbank.', en: 'It is read once by Gemini and not stored. Only the extracted conditions go to our database.' },
  'faq.q3': { de: 'Welche Städte werden überwacht?', en: 'Which cities are monitored?' },
  'faq.a3': { de: 'Aktuell Mannheim (Pilot) und San Francisco. Nächste DACH-Stadt nach Kundennachfrage.', en: 'Currently Mannheim (pilot) and San Francisco. Next cities driven by customer demand.' },

  // ── Footer ──
  'footer.tagline': { de: 'KI-gestützte Bauaufsicht für Mannheim & San Francisco.', en: 'AI-powered building-permit watchdog for Mannheim & San Francisco.' },
  'footer.product': { de: 'Produkt', en: 'Product' },
  'footer.legal': { de: 'Rechtliches', en: 'Legal' },
  'footer.company': { de: 'Unternehmen', en: 'Company' },
  'footer.imprint': { de: 'Impressum', en: 'Imprint' },
  'footer.privacy': { de: 'Datenschutz', en: 'Privacy' },
  'footer.about': { de: 'Über uns', en: 'About' },
  'footer.architects': { de: 'Für Architekten', en: 'For architects' },
  'footer.bauleiter': { de: 'Für Bauleiter', en: 'For project managers' },
  'footer.developers': { de: 'Für Bauträger', en: 'For developers' },
  'footer.copyright': { de: '© {year} PermitWatchDog · Rebelz AI · Mannheim', en: '© {year} PermitWatchDog · Rebelz AI · Mannheim' },

  // ── Pilot page (Mannheim or SF, depending on lang) ──
  'pilot.eyebrow': { de: 'Pilot-Stadt', en: 'Pilot city' },
  'pilot.title': {
    de: 'Mannheim zuerst — der Quadrate-Live-Test.',
    en: 'San Francisco — the DataSF live integration.',
  },
  'pilot.lead': {
    de: 'Mannheim hat seit April 2024 ein vollständig digitales Bauamt (ViBa). Strukturierte Daten existieren — wir machen sie agentenlesbar.',
    en: 'San Francisco publishes every building permit on DataSF (Socrata REST API). Structured data already exists — we make it judgement-ready.',
  },
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
