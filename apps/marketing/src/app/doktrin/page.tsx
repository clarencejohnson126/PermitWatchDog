'use client';

import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Image from 'next/image';
import { motion } from 'framer-motion';

type DoctrineLayerProps = {
  number: string;
  title: string;
  image: string;
  imageAlt: string;
  body: string;
  citation: string;
  imageLeft: boolean;
};

function DoctrineLayer({
  number,
  title,
  image,
  imageAlt,
  body,
  citation,
  imageLeft,
}: DoctrineLayerProps) {
  return (
    <div className="grid md:grid-cols-2 gap-12 group items-center">
      <div
        className={`relative aspect-[4/3] w-full border border-zinc-800 rounded-xl overflow-hidden group-hover:border-blue transition-colors ${
          imageLeft ? '' : 'md:order-2'
        }`}
      >
        <Image src={image} alt={imageAlt} fill className="object-cover" />
      </div>
      <div className={`flex flex-col justify-center ${imageLeft ? '' : 'md:order-1'}`}>
        <h3 className="font-serif text-7xl text-blue-dark mb-4 leading-none">{number}</h3>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">{title}</h2>
        <p className="font-body text-zinc-400 text-lg leading-relaxed mb-8">{body}</p>
        <div className="border-t border-zinc-800 pt-4">
          <p className="font-body text-xs tracking-widest text-zinc-500 uppercase">
            Citation: {citation}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DoktrinPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />

      {/* Video Prelude */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden border-b border-zinc-900">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/videos/doctrine-intro.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="relative z-10 text-center">
          <p className="font-body tracking-[0.25em] text-blue-light mb-4 text-sm uppercase border border-blue-light/30 bg-blue-light/10 px-4 py-2 rounded-full inline-block backdrop-blur-md">
            Die Logik der Entscheidungen
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-white mb-8">
            {"Die Doktrin.".split(' ').map((word, i) => (
              <motion.span
                key={i}
                className={`inline-block ${word.includes('Doktrin') ? 'text-blue' : ''}`}
                initial={{ opacity: 0, y: 40, rotateX: -45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: i * 0.08, ease: [0.22, 0.8, 0.4, 1] }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </h1>
          <p className="font-body text-xl md:text-2xl text-zinc-400 leading-relaxed mb-20">
            Die Bauaufsicht ist kein Suchspiel. Sie ist ein rechtliches Filterproblem.
            PermitWatchDog wertet jede neue Bekanntmachung über fünf Schichten des
            deutschen Baurechts &mdash; bevor Sie einen Anruf vom Architekten bekommen.
          </p>
        </div>

        <div className="space-y-32">
          <DoctrineLayer
            number="1"
            title="Bestandsschutz"
            image="/images/bestandsschutz_apartment.png"
            imageAlt="Bewohntes Mannheimer Wohnhaus im Alltag"
            body="Sobald eine Baugenehmigung rechtskräftig erteilt ist, entfaltet sie Bestandsschutz. Die Engine prüft, ob neue Festsetzungen im Amtsblatt überhaupt noch in laufende oder fertige Projekte eingreifen können – oder ob das Eigentumsgrundrecht aus Art. 14 GG den Eingriff bereits ausschließt."
            citation="Art. 14 GG · BVerfGE 35, 263 · BVerwGE 50, 49"
            imageLeft={true}
          />

          <DoctrineLayer
            number="2"
            title="Vertrauensschutz"
            image="/images/vertrauensschutz_bauamt.png"
            imageAlt="Sachbearbeiter im Bauamt beim Prüfen eines Bauantrags"
            body="Wir identifizieren Fälle, in denen bereits erteilte Zusagen der Baubehörde rechtsverbindlich sind. Das verhindert unnötige Panik bei nachträglichen Planänderungen, wenn der Vertrauensschutz nach §§ 48–49 VwVfG greift."
            citation="§ 48 + § 49 VwVfG (Rücknahme / Widerruf)"
            imageLeft={false}
          />

          <DoctrineLayer
            number="3"
            title="Verhältnismäßigkeit"
            image="/images/verhaeltnis_baustelle.png"
            imageAlt="Bauleiter und Architekt im Gespräch auf der Baustelle"
            body="Jede staatliche Maßnahme muss geeignet, erforderlich und angemessen sein. Die KI gewichtet automatisch den Eingriff gegen das Bauinteresse ab und filtert pauschale Verschärfungen heraus, die einer Verhältnismäßigkeitsprüfung nicht standhalten würden."
            citation="Art. 20 III GG (Rechtsstaatsprinzip)"
            imageLeft={true}
          />

          <DoctrineLayer
            number="4"
            title="Übergangsregelungen"
            image="/images/uebergang_stamp.png"
            imageAlt="Sachbearbeiter beim Stempeln eines Bauantrags"
            body="Bauordnungs-Novellen enthalten fast immer Übergangsregelungen, die laufende Verfahren ausdrücklich schützen – aber nur, wenn die Fristen gewahrt bleiben. Wir prüfen jede Frist präzise, damit Sie das Handlungsfenster für Widerspruch oder Anpassung nicht verpassen."
            citation="Übergangsbestimmungen LBO BW (je Novelle)"
            imageLeft={false}
          />

          {/* Layer 5 — Auflage-Piercing (exception, special styling) */}
          <div className="grid md:grid-cols-2 gap-12 group items-center mt-16 border border-blue bg-blue/5 p-8 md:p-12 rounded-xl shadow-[0_0_60px_rgba(22,84,255,0.08)]">
            <div className="relative aspect-[4/3] w-full border border-blue-dark rounded-xl overflow-hidden shadow-[0_0_30px_rgba(22,84,255,0.2)]">
              <Image
                src="/images/auflage_piercing_pen.png"
                alt="Roter Stift markiert Auflage 04 auf einem Bauantrag"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4">
                Ausnahme &mdash; bricht den Bestandsschutz
              </p>
              <h3 className="font-serif text-7xl text-blue mb-4 leading-none">5</h3>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Auflage-Piercing</h2>
              <p className="font-body text-zinc-300 text-lg leading-relaxed mb-8">
                Die wichtigste Ausnahmeregelung. Greift eine neue städtische Regelung
                direkt in eine spezifische Auflage Ihres Genehmigungsbescheids ein,
                durchbricht das den Bestandsschutz. Klassisches Beispiel: ändert sich
                die DIN 4109 (Schallschutz) und Ihr Bescheid trägt eine entsprechende
                Auflage, generiert die KI sofort einen{' '}
                <strong className="text-white">HIGH-Impact-Alert</strong> mit
                vorgefertigtem VOB/B-Anhang für Ihren Architekten.
              </p>
              <div className="border-t border-blue-dark pt-4">
                <p className="font-body text-xs tracking-widest text-blue-light uppercase">
                  Citation: VOB/B § 6 Abs. 2 (Behinderung und Unterbrechung)
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
