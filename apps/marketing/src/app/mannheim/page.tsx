import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Image from 'next/image';
import Link from 'next/link';
import InteractiveBauantrag from '../../components/InteractiveBauantrag';

const roadmap = [
  { phase: 'Phase 1', when: 'Aug 2026', cities: ['Mannheim'], note: 'Pilot-Start · erste zahlende Kunden im Rhein-Neckar-Raum' },
  { phase: 'Phase 2', when: 'Q4 2026', cities: ['Heidelberg', 'Ludwigshafen', 'Stuttgart'], note: 'Rhein-Neckar-Cluster · CMS-Pattern-Skraper' },
  { phase: 'Phase 3', when: '2027', cities: ['Top 50 DACH-Städte'], note: 'Geleitet durch Kundennachfrage' },
  { phase: 'Phase 4', when: '2028', cities: ['Long-Tail · 5 000+ Bauämter'], note: 'WebMCP-Adoption · föderierte Beiträge' },
];

export default function MannheimPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden">
      <Nav />

      {/* Hero with Wasserturm video background */}
      <section className="relative w-full h-[70vh] min-h-[520px] flex items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/mannheim_skyline_real.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/mannheim-aerial.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-blue-dark/20 mix-blend-multiply" />

        <SectionWrapper>
          <div className="relative max-w-3xl pb-12">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4">
              Pilot-Gemeinde
            </p>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-white mb-6">
              Mannheim <span className="text-blue">zuerst.</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-zinc-200 leading-relaxed">
              Wir starten dort, wo das Bauamt schon digital denkt &mdash; und der Gründer
              zehn Jahre auf den Baustellen verbracht hat.
            </p>
          </div>
        </SectionWrapper>
      </section>

      {/* Why Mannheim first */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-4">Warum Mannheim zuerst</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-8">
              Eine Stadt, die seit April 2024 alle Bauanträge digital prüft.
            </h2>
            <div className="space-y-6 font-body text-zinc-400 text-lg leading-relaxed">
              <p>
                Mannheim hat mit <strong className="text-white">ViBa &mdash; das virtuelle Bauamt</strong>{' '}
                bereits 2024 vollständig auf digitale Bauanträge umgestellt. Damit gehört die
                Stadt zu den am weitesten digitalisierten Bauämtern im DACH-Raum &mdash; die
                strukturierten Daten existieren bereits, sie sind nur noch nicht
                agentenlesbar exponiert.
              </p>
              <p>
                Genau hier setzt PermitWatchDog an: Wir lesen das Mannheimer Amtsblatt und
                die öffentlichen Bekanntmachungen jede Nacht. Wir bereiten die Inhalte in
                strukturierter Form für die Mannheimer Bauträger und Bauleiter auf &mdash; und
                helfen der Stadt mittelfristig, ihrer EU-PSI-Richtlinien-Pflicht durch eine
                offene WebMCP-Schnittstelle nachzukommen.
              </p>
              <p>
                Der Gründer Clarence Johnson kennt die Region: zehn Jahre Bauleitung im
                Rhein-Neckar-Dreieck. Kein Berater von außen, sondern jemand, der die
                Mannheimer Bauamts-Realität von beiden Seiten kennt.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full border border-zinc-800 rounded-xl overflow-hidden">
            <Image
              src="/images/mannheim_skyline_real.jpg"
              alt="Mannheimer Wasserturm und Innenstadt zur blauen Stunde"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Pilot project Q5,18 */}
      <SectionWrapper>
        <div className="border border-blue bg-blue/5 rounded-xl p-8 md:p-12">
          <div className="mb-12">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4">
              Pilot-Projekt &mdash; Q5,18
            </p>
            <h2 className="font-serif text-4xl text-white mb-6">
              Ein Neubau in der Innenstadt als lebendes Testfeld.
            </h2>
            <div className="space-y-4 font-body text-zinc-300 leading-relaxed max-w-3xl">
              <p>
                Unser erster Pilot-Bauträger errichtet ein Mehrfamilienhaus mit 10 Wohneinheiten
                im Quadrat Q5, 18 &mdash; Bauantrag genehmigt, Rohbau begonnen, drei explizite
                Genehmigungs-Auflagen (Lärmschutz nach DIN 4109, Solarpflicht BW,
                Brandschutz GK 4).
              </p>
              <p>
                Genau die Konstellation, in der die Vier-Schichten-Doktrin zeigt, wo sie
                Wert schafft: pauschale Bebauungsplan-Änderungen fallen unter
                Bestandsschutz heraus, aber wenn die DIN 4109 novelliert wird, durchbricht
                das die Auflage 04 &mdash; und PermitWatchDog generiert vor 06:00 morgens
                einen HIGH-Impact-Alert mit fertig vorbereitetem VOB/B-Anhang für den
                Architekten.
              </p>
              <p className="text-sm text-zinc-500 italic pt-4">
                Stammdaten anonymisiert · vollständiges Projektprofil unter NDA verfügbar.
              </p>
            </div>
          </div>
          
          {/* Interactive Inspector replacing static image */}
          <InteractiveBauantrag />
        </div>
      </SectionWrapper>
      
      {/* Skyline Pan Video Section */}
      <section className="relative w-full py-32 overflow-hidden border-y border-zinc-900 bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
        >
          <source src="/videos/mannheim-skyline.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black/80" />
        <SectionWrapper className="relative z-10">
          <div className="max-w-2xl">
            <h2 className="font-sans text-5xl md:text-6xl text-white tracking-widest mb-6 uppercase">
              Die Stadt <span className="text-blue">als System.</span>
            </h2>
            <p className="font-serif text-xl text-zinc-300 leading-relaxed">
              Jede Baustelle ist ein Knotenpunkt in einem komplexen regulatorischen Netzwerk.
              PermitWatchDog überwacht die Signalflüsse der Verwaltung und macht sie für Sie nutzbar.
            </p>
          </div>
        </SectionWrapper>
      </section>

      {/* Roadmap */}
      <SectionWrapper>
        <div className="max-w-4xl">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-4">Roadmap</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-12">
            Mannheim heute. <span className="text-blue">DACH morgen.</span>
          </h2>
          <div className="space-y-6">
            {roadmap.map((r) => (
              <div
                key={r.phase}
                className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_180px_1fr] gap-6 border-t border-zinc-800 pt-6"
              >
                <div>
                  <p className="font-serif text-2xl text-blue">{r.phase}</p>
                  <p className="font-body text-xs tracking-widest text-zinc-500 uppercase mt-1">{r.when}</p>
                </div>
                <div className="hidden md:block">
                  <p className="font-serif text-lg text-white">{r.cities.join(' · ')}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="font-serif text-lg text-white md:hidden mb-2">{r.cities.join(' · ')}</p>
                  <p className="font-body text-zinc-400">{r.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Partnership pitch */}
      <SectionWrapper>
        <div className="max-w-3xl">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-4">
            An die Stadt Mannheim
          </p>
          <h2 className="font-serif text-4xl text-white mb-8">
            Wir wollen Partner sein, nicht Konkurrent.
          </h2>
          <div className="space-y-6 font-body text-zinc-400 text-lg leading-relaxed">
            <p>
              Die Stadt Mannheim trägt einen Großteil der Last bei der Vermittlung neuer
              Bauordnungs-Vorgaben an Bauträger und Bauleiter. Jede Bekanntmachung erzeugt
              Telefonate, verspätete Einwendungen, wiederholte Anfragen.
            </p>
            <p>
              Wir reduzieren diese Last: Bauträger, die unsere Alerts abonnieren, erscheinen
              vorbereitet zum Termin im Bauamt. Sie kennen die rechtliche Position bereits,
              haben den Anhang vorbereitet, stellen präzise Fragen.
            </p>
            <p>
              Mittelfristig wollen wir gemeinsam eine{' '}
              <strong className="text-white">offene WebMCP-Schnittstelle</strong>{' '}
              für Mannheimer Bekanntmachungen aufbauen &mdash; ein konkreter Schritt zur
              Erfüllung der EU-PSI-Richtlinien-Vorgaben. Der erste deutsche Bauamt-Pilot
              auf dem neuen Standard.
            </p>
            <p>
              Ein 30-minütiges Sondierungsgespräch genügt, um die Idee zu prüfen.
            </p>
            <Link
              href="mailto:hallo@permitwatchdog.com?subject=Sondierungsgespr%C3%A4ch%20Stadt%20Mannheim"
              className="inline-flex items-center justify-center mt-4 px-6 py-3 font-sans tracking-widest rounded bg-blue hover:bg-blue-light text-white shadow-[0_0_15px_rgba(22,84,255,0.3)] hover:shadow-[0_0_25px_rgba(58,123,255,0.5)] transition-all uppercase"
            >
              Sondierungsgespräch anfragen
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
