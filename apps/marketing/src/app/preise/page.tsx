'use client';

import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Tier = {
  key: string;
  name: string;
  price: string;
  cadence: string;
  audience: string;
  description: string;
  features: string[];
  cta: { label: string; href: string; primary: boolean };
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    key: 'T0',
    name: 'Bauamt-Alerts',
    price: '29 €',
    cadence: 'pro Monat',
    audience: 'Solo-Bauleiter · Kleinbetriebe',
    description:
      'Tägliche Frühwarnung aus Ihrem Bauamt. Sie geben Gemeinde und Flurstück an &mdash; wir lesen das Amtsblatt für Sie.',
    features: [
      'Tägliche Auswertung des Mannheimer Amtsblatts',
      'E-Mail-Alert nur bei relevanten Änderungen',
      'Vier-Schichten-Doktrin filtert Bestandsschutz-irrelevante Notizen heraus',
      'Eine Gemeinde, ein Flurstück',
      'Kündbar zum Monatsende',
    ],
    cta: {
      label: 'Bauvorhaben absichern',
      href: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_T0 ?? '/danke',
      primary: true,
    },
  },
  {
    key: 'T1',
    name: 'Project-Aware',
    price: '149 €',
    cadence: 'pro Monat',
    audience: 'Bauleiter mit 1&ndash;5 aktiven Projekten',
    description:
      'Alerts mit Projektbezug. Sie pflegen Ihre laufenden Vorhaben &mdash; wir referenzieren jede Bekanntmachung darauf.',
    features: [
      'Alles aus T0',
      'Projekt-Stammdaten: Adresse, Bauantrag-Nr., Lifecycle-Stage',
      'Lebenszyklus-bewusste Suppression irrelevanter Änderungen',
      'Bis zu 5 aktive Projekte',
      'Wöchentliche Zusammenfassung an Wunsch-Empfänger',
    ],
    cta: { label: 'Interesse anmelden', href: 'mailto:hallo@permitwatchdog.com?subject=T1%20Interesse', primary: false },
  },
  {
    key: 'T2',
    name: 'Blueprint-Integrated',
    price: '499 €',
    cadence: 'pro Monat',
    audience: 'Bauträger · Architekturbüros',
    description:
      'Geometriebewusste Auswertung mit fertig vorbereitetem VOB/B-Anhang. Wir lesen Ihre Pläne, nicht nur Ihre Adressen.',
    features: [
      'Alles aus T1',
      'Upload von Bauanträgen und Plänen (PDF, multimodal ausgewertet)',
      'Geometriebewusste Konfliktanalyse (Abstandsflächen, Bauordnung)',
      'Vorbereiteter VOB/B-§6-Anhang für Ihren Architekten',
      'Vorabprüfung von Genehmigungsauflagen (Auflage-Piercing)',
      'Bis zu 25 aktive Projekte',
    ],
    cta: { label: 'Beratungsgespräch buchen', href: 'mailto:hallo@permitwatchdog.com?subject=T2%20Beratung', primary: false },
    highlight: true,
  },
  {
    key: 'T3',
    name: 'Full Project Partner',
    price: '2 000 &ndash; 5 000 €',
    cadence: 'pro Monat',
    audience: 'Mittelständische Bauunternehmen',
    description:
      'Voller Workflow-Partner. Finanzauswirkung pro Alert, Routing an Architekten und Statiker, Portfolioübersicht.',
    features: [
      'Alles aus T2',
      'Finanzauswirkungs-Schätzung pro Alert',
      'Automatisches Routing an Architekten / Statiker',
      'Portfolio-Dashboard mit Risiko-Heatmap',
      'Nachbar-Bauantrag-Frühwarnung (Auslegungsfenster)',
      'Unbegrenzte Projekte · SLA inklusive',
    ],
    cta: { label: 'Beratungsgespräch buchen', href: 'mailto:hallo@permitwatchdog.com?subject=T3%20Beratung', primary: false },
  },
  {
    key: 'T4',
    name: 'On-Prem Bauträger',
    price: '5 000 &ndash; 15 000 €',
    cadence: 'pro Monat + 15&ndash;40 k Setup',
    audience: 'Bauträger · Projektentwickler',
    description:
      'Gemma-4 auf Ihrem Server, LoRA-feinabgestimmt auf Ihre Bauanträge. Ihre Pläne verlassen nie Ihr Netzwerk.',
    features: [
      'Alles aus T3',
      'Gemma-4-Modell auf Ihrer eigenen Infrastruktur',
      'LoRA-Feinabstimmung auf Ihre historischen Bauanträge',
      'Air-Gapped: Pläne verlassen nie Ihr Netzwerk',
      'Eigenes Branding für Architekten-Korrespondenz',
      'Persönlicher Solutions-Engineer',
    ],
    cta: { label: 'Anfrage stellen', href: 'mailto:hallo@permitwatchdog.com?subject=T4%20On-Prem', primary: false },
  },
];

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />

      <SectionWrapper>
        <div className="max-w-4xl">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-6">Preise</p>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-white mb-8">
            {"Bauen ohne Bauamt-Überraschungen.".split(' ').map((word, i) => (
              <motion.span
                key={i}
                className={`inline-block ${word.includes('Überraschungen') ? 'text-blue' : ''}`}
                initial={{ opacity: 0, y: 40, rotateX: -45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: i * 0.08, ease: [0.22, 0.8, 0.4, 1] }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </h1>
          <p className="font-body text-xl md:text-2xl text-zinc-400 leading-relaxed mb-16">
            Vom Ein-LKW-Betrieb bis zum Bauträger mit eigenem Rechenzentrum &mdash; PermitWatchDog
            skaliert mit Ihrem Portfolio. Sie zahlen für regulatorische Intelligenz, nicht für
            Compliance-Theater.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative flex flex-col rounded-xl p-8 md:p-10 border transition-colors ${
                tier.highlight
                  ? 'border-blue bg-blue/5 shadow-[0_0_60px_rgba(22,84,255,0.08)]'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {tier.highlight && (
                <p className="absolute -top-3 left-8 bg-blue text-white text-xs tracking-widest uppercase px-3 py-1 rounded">
                  Empfohlen für Bauträger
                </p>
              )}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-body text-xs tracking-[0.25em] uppercase text-zinc-500">{tier.key}</span>
                <h2 className="font-serif text-3xl text-white" dangerouslySetInnerHTML={{ __html: tier.name }} />
              </div>
              <p className="font-body text-sm text-zinc-400 mb-6" dangerouslySetInnerHTML={{ __html: tier.audience }} />

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-serif text-5xl text-white" dangerouslySetInnerHTML={{ __html: tier.price }} />
                <span className="font-body text-sm text-zinc-500" dangerouslySetInnerHTML={{ __html: tier.cadence }} />
              </div>

              <p className="font-body text-zinc-300 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: tier.description }} />

              <ul className="space-y-3 mb-10 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 font-body text-zinc-400">
                    <span className="text-blue mt-1">·</span>
                    <span dangerouslySetInnerHTML={{ __html: feature }} />
                  </li>
                ))}
              </ul>

              <Link
                href={tier.cta.href}
                target={tier.cta.href.startsWith('http') ? '_blank' : undefined}
                className={`inline-flex items-center justify-center px-6 py-3 font-serif tracking-wide rounded transition-all ${
                  tier.cta.primary
                    ? 'bg-blue hover:bg-blue-light text-white shadow-[0_0_15px_rgba(22,84,255,0.3)] hover:shadow-[0_0_25px_rgba(58,123,255,0.5)]'
                    : 'border border-zinc-700 text-white hover:border-blue hover:text-blue'
                }`}
              >
                {tier.cta.label} →
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-32 border-t border-zinc-800 pt-12">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-8">Häufige Fragen</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl text-white mb-2">Ist das nicht teuer für ein E-Mail-Tool?</h3>
              <p className="font-body text-zinc-400 leading-relaxed">
                PermitWatchDog ist kein E-Mail-Tool. Sie zahlen für regulatorische Intelligenz: die
                Auswertung jeder neuen Bekanntmachung gegen Ihre konkreten Projekte und Auflagen
                durch eine KI, die die deutsche Vier-Schichten-Doktrin beherrscht. Ein einziger
                übersehener Baustopp kostet zwischen 50 k€ und 200 k€ &mdash; die T0-Lizenz amortisiert
                sich damit über ein einzelnes Jahr Hunderte Male.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-white mb-2">Wird mein Projekt-Datensatz an Dritte weitergegeben?</h3>
              <p className="font-body text-zinc-400 leading-relaxed">
                Nein. T0&ndash;T3 laufen in der Frankfurter Google-Cloud-Region (DE) unter
                DSGVO-konformem Auftragsverarbeitungsvertrag. T4 läuft komplett auf Ihrer eigenen
                Infrastruktur &mdash; Ihre Pläne verlassen nie Ihr Netzwerk. Siehe{' '}
                <Link href="/datenschutz" className="text-blue hover:text-blue-light">Datenschutzerklärung</Link>.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-white mb-2">Kann ich monatlich kündigen?</h3>
              <p className="font-body text-zinc-400 leading-relaxed">
                T0&ndash;T1 sind monatlich kündbar zum Monatsende. T2 mit 3-Monats-Frist. T3 und T4
                werden individuell vereinbart, üblicherweise 12 Monate Erstlaufzeit.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-white mb-2">Welche Gemeinden sind abgedeckt?</h3>
              <p className="font-body text-zinc-400 leading-relaxed">
                Aktuell <Link href="/mannheim" className="text-blue hover:text-blue-light">Mannheim</Link>{' '}
                als Pilot-Gemeinde. Heidelberg und Ludwigshafen folgen im Anschluss, dann die
                Top 50 DACH-Städte. Für individuelle Gemeinden außerhalb des Plans: melden Sie
                Interesse an, wir priorisieren nach Nachfrage.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
