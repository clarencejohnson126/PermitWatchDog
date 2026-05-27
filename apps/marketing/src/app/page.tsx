import Link from "next/link";
import { Mail, CheckCircle2, Search, ArrowRight, ShieldAlert, FileText, Lock, Clock } from "lucide-react";

export default function Home() {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "#";

  return (
    <main className="flex-1 flex flex-col items-center overflow-x-hidden">
      {/* Navigation */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">PermitWatchDog</span>
        </div>
        <Link 
          href={stripeLink}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
        >
          Anmelden
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center z-10">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
          KI-gestützte Bauaufsicht für Mannheim
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-tight mb-6">
          Behördliche Baustopps verhindern, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">bevor sie entstehen.</span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mb-10">
          Die erste KI-gestützte Bauaufsicht für Mannheim. Wir lesen das Amtsblatt, prüfen den Bestandsschutz und schreiben den VOB/B-konformen Anhang für Ihren Architekten – jeden Morgen um 06:00 Uhr.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            href={stripeLink}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
          >
            Bauvorhaben absichern
            <ArrowRight className="w-5 h-5" />
          </Link>
          <span className="text-zinc-500 text-sm">29 € / Monat. Jederzeit kündbar.</span>
        </div>

        <p className="mt-12 text-sm text-zinc-500 italic border-t border-zinc-800 pt-6">
          Entwickelt aus 10 Jahren Bauleitungserfahrung in der Rhein-Neckar-Region.
        </p>
      </section>

      {/* The Pain & How It Works */}
      <section className="w-full bg-zinc-900/50 border-y border-zinc-800 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Sie übersehen das Amtsblatt. Die Behörde nicht.</h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Während Großkonzerne eigene Rechtsabteilungen beschäftigen, die städtische Veröffentlichungen manuell nach Planänderungen filtern, tappen lokale Bauträger oft im Dunkeln. Eine übersehene Vollsperrung oder eine neue Lärmschutzauflage kann Wochen an Bauverzug und zehntausende Euro kosten. PermitWatchDog automatisiert diesen Prozess.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Search, title: "Tägliches Screening", desc: "Wir scannen jeden Nacht automatisch das Mannheimer Amtsblatt." },
                  { icon: Lock, title: "Juristische Filterung", desc: "Unsere KI prüft, ob Ihr Bestandsschutz greift oder durchbrochen wird." },
                  { icon: Mail, title: "VOB/B-konformer Entwurf", desc: "Vor dem Frühstück erhalten Sie eine fertige E-Mail für Ihren Architekten." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <item.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <p className="text-zinc-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proof Render */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-2xl blur-2xl" />
              <div className="relative bg-[#1E1E1E] border border-[#333] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
                {/* Mac Window Chrome */}
                <div className="h-10 bg-[#2D2D2D] border-b border-[#1E1E1E] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  <div className="mx-auto text-xs text-zinc-400 font-medium">Architekten-Korrespondenz</div>
                </div>
                
                {/* Email Header */}
                <div className="bg-[#252525] p-6 border-b border-[#333]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">Bauamt-Alert: Q5,18 — Stadtfest Vollsperrungen 23.-25. Mai</h3>
                      <p className="text-sm text-zinc-400 mt-1">Von: <span className="text-blue-400">alert@permitwatchdog.de</span></p>
                    </div>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">HEUTE, 06:12 UHR</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs px-2 py-1 rounded font-medium">
                      <ShieldAlert className="w-3 h-3" />
                      IMPACT: MEDIUM
                    </span>
                    <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs px-2 py-1 rounded font-medium">
                      <FileText className="w-3 h-3" />
                      Amtsblatt KW 21
                    </span>
                  </div>
                </div>

                {/* Email Body - Font Serif */}
                <div className="p-6 overflow-y-auto bg-white">
                  <div className="font-serif text-[15px] text-zinc-900 leading-relaxed max-w-none space-y-4">
                    <p>Sehr geehrte Damen und Herren,</p>
                    <p>
                      Wir nehmen Bezug auf die im Amtsblatt KW 21 veröffentlichten Verkehrsinformationen zum Stadtfest, welche in der Kalenderwoche 21 Gültigkeit erlangen.
                    </p>
                    <p>
                      Der Bestandsschutz der erteilten Baugenehmigung für das Bauvorhaben Wohnhaus Q5, 18 greift voraussichtlich. Die bekannt gegebenen Verkehrsinformationen bezüglich des Stadtfestes, insbesondere die Vollsperrungen am Friedrichsring/Kaiserring und die daraus resultierenden Verkehrsbeeinträchtigungen, stellen jedoch eine wesentliche Erschwernis für die termingerechte Anlieferung von Baumaterialien und die Zufahrt der Baufahrzeuge dar. Dies tangiert unmittelbar die vereinbarte Baulogistik und kann zu Ablaufstörungen führen.
                    </p>
                    <p>
                      Wir fordern Sie daher auf, die Auswirkungen dieser Verkehrsmaßnahmen auf die Bauablaufplanung und das Logistikkonzept des Bauvorhabens Q5, 18 umgehend zu prüfen und erforderliche Anpassungen der Ausführungsplanung vorzunehmen. Eventuell notwendige Fristverlängerungs- oder Mehrkostenforderungen gemäß § 6 Abs. 2 VOB/B sind in diesem Kontext zu evaluieren.
                    </p>
                    <p>Mit freundlichen Grüßen<br/>Clarence Johnson<br/>RebelzBau Mannheim GmbH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Four-Layer DACH Doctrine */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Die Rechtliche Engine (DACH-Raum)</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            PermitWatchDog filtert nicht nur nach Stichworten, sondern wendet tiefgreifende juristische Prüfroutinen an, die speziell auf das deutsche Baurecht zugeschnitten sind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Bestandsschutz",
              desc: "Unsere Engine erkennt, wenn neue Verordnungen Ihr laufendes Projekt aufgrund des genehmigten Bauantrags nicht mehr tangieren, und filtert diese irrelevante Flut aus."
            },
            {
              title: "Vertrauensschutz",
              desc: "Wir identifizieren Fälle, in denen bereits erteilte Zusagen der Baubehörde bindend sind und verhindern unnötige Panik bei nachträglichen Planänderungen im Amtsblatt."
            },
            {
              title: "Verhältnismäßigkeit",
              desc: "Die KI wägt ab, ob eine neue Auflage eine zumutbare Härte darstellt oder operativ wirken kann."
            },
            {
              title: "Übergangsregelungen",
              desc: "Wir prüfen Fristen präzise, um sicherzustellen, dass Sie Handlungsfenster für Widersprüche oder Anpassungen nicht verpassen."
            }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
          
          <div className="md:col-span-2 bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/30 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold text-lg">Ausnahmeregelung (Auflage-Piercing)</h3>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Die wichtigste Funktion – greift eine neue städtische Regelung direkt in Ihre spezifischen Genehmigungsauflagen (z. B. Lärmschutz DIN 4109) ein, durchbricht dies den Bestandsschutz. Sie erhalten umgehend eine Warnung (HIGH Impact) inklusive VOB/B-Handlungsempfehlung.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Ladder */}
      <section className="w-full bg-zinc-900 border-y border-zinc-800 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Investition in Bau-Sicherheit</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Wählen Sie den Plan, der zur Größe Ihrer Pipeline passt. Wir starten mit Mannheim.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* T0 Plan */}
            <div className="bg-black border border-blue-500/50 rounded-2xl p-8 relative shadow-[0_0_30px_-10px_rgba(37,99,235,0.3)]">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                AKTIV
              </div>
              <h3 className="text-xl font-bold text-white mb-2">T0: Single Project</h3>
              <div className="text-3xl font-bold text-white mb-6">29 € <span className="text-zinc-500 text-lg font-normal">/ Monat</span></div>
              <ul className="space-y-4 mb-8 text-zinc-300 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> 1 aktives Bauprojekt</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Tägliches Screening (Mannheim)</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> VOB/B Email-Entwürfe</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> 4-Schichten Rechts-Engine</li>
              </ul>
              <Link
                href={stripeLink}
                className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Jetzt abonnieren
              </Link>
            </div>

            {/* T1 Plan */}
            <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 relative opacity-75">
              <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-400 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                IN VORBEREITUNG
              </div>
              <h3 className="text-xl font-bold text-white mb-2">T1: Pipeline</h3>
              <div className="text-3xl font-bold text-white mb-6">99 € <span className="text-zinc-500 text-lg font-normal">/ Monat</span></div>
              <ul className="space-y-4 mb-8 text-zinc-400 text-sm">
                <li className="flex gap-2"><Clock className="w-5 h-5 text-zinc-600 shrink-0" /> Bis zu 5 Bauprojekte</li>
                <li className="flex gap-2"><Clock className="w-5 h-5 text-zinc-600 shrink-0" /> Rhein-Neckar-Kreis Abdeckung</li>
                <li className="flex gap-2"><Clock className="w-5 h-5 text-zinc-600 shrink-0" /> Team-Alerts (Slack/Email)</li>
              </ul>
              <button disabled className="w-full bg-zinc-800 text-zinc-500 py-3 rounded-lg font-semibold cursor-not-allowed">
                Interesse anmelden
              </button>
            </div>

            {/* T2 Plan */}
            <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 relative opacity-75">
              <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-400 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                IN VORBEREITUNG
              </div>
              <h3 className="text-xl font-bold text-white mb-2">T2: Enterprise</h3>
              <div className="text-3xl font-bold text-white mb-6">499 € <span className="text-zinc-500 text-lg font-normal">/ Monat</span></div>
              <ul className="space-y-4 mb-8 text-zinc-400 text-sm">
                <li className="flex gap-2"><Clock className="w-5 h-5 text-zinc-600 shrink-0" /> Unbegrenzte Projekte</li>
                <li className="flex gap-2"><Clock className="w-5 h-5 text-zinc-600 shrink-0" /> API-Integration (Procore/BIM)</li>
                <li className="flex gap-2"><Clock className="w-5 h-5 text-zinc-600 shrink-0" /> Anwaltlich geprüfte Vorlagen</li>
              </ul>
              <button disabled className="w-full bg-zinc-800 text-zinc-500 py-3 rounded-lg font-semibold cursor-not-allowed">
                Interesse anmelden
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">Häufig gestellte Fragen</h2>
        <div className="space-y-6">
          {[
            { q: "Wo funktioniert PermitWatchDog aktuell?", a: "Derzeit werten wir ausschließlich das Amtsblatt und städtische Bekanntmachungen der Stadt Mannheim aus. Eine Ausweitung auf den gesamten Rhein-Neckar-Kreis ist für Q4 geplant." },
            { q: "Ersetzt das System einen Baurechtler?", a: "Nein. PermitWatchDog ist ein Frühwarnsystem, kein Anwaltsersatz. Wir liefern Ihnen und Ihrem Architekten den VOB/B-konformen Erstentwurf, um Fristen zu wahren und Verzögerungen formal anzumelden." },
            { q: "Wie schnell ist PermitWatchDog?", a: "Die Behördendokumente werden nachts gescannt. Findet die KI eine Relevanz für Ihr Projekt, haben Sie den Alert samt Handlungsentwurf um 06:00 Uhr morgens in der Inbox." },
            { q: "Wie sieht es mit Datenschutz aus (DSGVO)?", a: "Wir verarbeiten nur die nötigsten Projektdaten (Adresse, Eck-Auflagen). Es findet kein Training der KI-Modelle mit Ihren sensiblen Projektdaten statt." },
            { q: "Ist das nicht sehr teuer?", a: "29 € im Monat kosten weniger als ein halber Kubikmeter Beton. Ein einziger unentdeckter Baustopp oder eine verpasste Widerspruchsfrist kostet in der Regel fünf- bis sechsstellige Summen." },
            { q: "Wie lange dauert das Setup?", a: "Weniger als 5 Minuten. Sie registrieren sich, geben die Adresse Ihres Bauvorhabens sowie 1-2 Kern-Auflagen der Baugenehmigung an, und die Überwachung startet." },
          ].map((faq, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 bg-[#050505] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-zinc-500" />
            <span className="text-zinc-500 font-semibold tracking-tight">PermitWatchDog</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white transition-colors">AGB</Link>
            <a href="https://github.com/clarencejohnson126/PermitWatchDog/blob/main/llm.txt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">llm.txt</a>
            <a href="mailto:contact@permitwatchdog.de" className="hover:text-white transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
