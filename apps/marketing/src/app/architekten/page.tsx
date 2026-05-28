import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Image from 'next/image';
import CTAButton from '../../components/CTAButton';

export default function ArchitektenPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />

      <SectionWrapper>
        <div className="max-w-3xl mb-24">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4">
            Für Architekten & Planer
          </p>
          <h1 className="text-5xl md:text-7xl font-sans tracking-widest text-white mb-6 uppercase">
            PLANUNGS-<span className="text-blue">SICHERHEIT.</span>
          </h1>
          <p className="font-body text-xl text-zinc-400 leading-relaxed">
            Reagieren Sie auf behördliche Änderungen, bevor der Bauherr anruft.
            Präzise juristische Einordnung direkt in die Inbox.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-4xl text-white mb-8 leading-tight">
              Der VOB/B-Entwurf ist schon da.
            </h2>
            <div className="space-y-6 font-body text-zinc-400 text-lg leading-relaxed">
              <p>
                Die Ausführungsplanung ist abgeschlossen, der Rohbau läuft. Doch die 
                Baubehörde veröffentlicht nachträgliche Lärmschutzauflagen für das 
                angrenzende Quartier. Betrifft Sie das?
              </p>
              <p>
                PermitWatchDog filtert das Rauschen. Wenn eine neue Regelung via 
                Auflage-Piercing in Ihre Genehmigung eingreift, haben Sie um 06:00 Uhr 
                morgens die Analyse und den VOB/B-Entwurf vorliegen. Sie können sofort 
                handeln, nicht erst wenn das Problem eskaliert.
              </p>
              <div className="pt-8">
                <CTAButton href="/doktrin" variant="secondary">WIE DIE ENGINE FUNKTIONIERT</CTAButton>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/architect_portrait.png" 
              alt="Architekt im Büro" 
              fill 
              className="object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" 
            />
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
