import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Image from 'next/image';

export default function ProduktPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />
      
      <SectionWrapper>
        <div className="max-w-4xl mb-24">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4">
            Die Engine im Detail
          </p>
          <h1 className="text-5xl md:text-7xl font-sans tracking-widest text-white mb-6 uppercase">
            WIE WIR <span className="text-blue">ARBEITEN.</span>
          </h1>
          <p className="font-body text-xl text-zinc-400 leading-relaxed">
            Ein vollautomatischer Workflow von der nächtlichen Datenextraktion bis 
            zum rechtssicheren VOB/B-Entwurf auf Ihrem Schreibtisch.
          </p>
        </div>

        <div className="space-y-32">
          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-video w-full border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              <video autoPlay muted loop playsInline className="object-cover w-full h-full opacity-60">
                <source src="/videos/hero-loop.mp4" type="video/mp4" />
              </video>
            </div>
            <div>
              <h3 className="font-sans text-5xl text-blue-dark mb-4">01</h3>
              <h2 className="font-serif text-3xl text-white mb-6">Nächtliches Scraping</h2>
              <p className="font-body text-zinc-400 leading-relaxed">
                Jede Nacht um 02:00 Uhr scannt PermitWatchDog alle neuen Veröffentlichungen, 
                Sperrungen und Bebauungsplan-Änderungen im Amtsblatt der Stadt Mannheim.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h3 className="font-sans text-5xl text-blue-dark mb-4">02</h3>
              <h2 className="font-serif text-3xl text-white mb-6">Die Doktrin-Prüfung</h2>
              <p className="font-body text-zinc-400 leading-relaxed">
                Unsere juristische Engine filtert Rauschen heraus. Anhand des Bestandsschutzes 
                Ihrer individuellen Baugenehmigung evaluieren wir, ob eine neue Regelung 
                überhaupt rechtliche Bindung für Ihr Projekt entfalten kann.
              </p>
            </div>
            <div className="relative aspect-video w-full border border-zinc-800 rounded-xl overflow-hidden shadow-2xl order-1 md:order-2">
              <video autoPlay muted loop playsInline className="object-cover w-full h-full opacity-60">
                <source src="/videos/doctrine-intro.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square w-full border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              <Image src="/images/bauantrag.png" alt="Bauantrag" fill className="object-cover mix-blend-luminosity hover:mix-blend-normal transition-all" />
            </div>
            <div>
              <h3 className="font-sans text-5xl text-blue-dark mb-4">03</h3>
              <h2 className="font-serif text-3xl text-white mb-6">Auflage-Piercing</h2>
              <p className="font-body text-zinc-400 leading-relaxed">
                Wenn die Stadt durch neue Maßnahmen (z.B. Vollsperrungen für Events) 
                direkt in Ihre Baulogistik eingreift, identifiziert die KI sofort den 
                Konflikt zwischen Auflage und Realität.
              </p>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h3 className="font-sans text-5xl text-blue-dark mb-4">04</h3>
              <h2 className="font-serif text-3xl text-white mb-6">Der VOB/B Entwurf</h2>
              <p className="font-body text-zinc-400 leading-relaxed">
                Das System generiert automatisch einen fundierten Entwurf zur 
                Behinderungsanzeige gemäß VOB/B § 6 Abs. 2 – inklusive aller 
                relevanten rechtlichen Zitationen.
              </p>
            </div>
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl order-1 md:order-2">
              <div className="font-serif text-zinc-300 text-sm italic border-l-2 border-blue pl-4 leading-relaxed">
                "Der Bestandsschutz der erteilten Baugenehmigung greift. Die Vollsperrungen am Kaiserring stellen jedoch eine wesentliche Erschwernis für die termingerechte Anlieferung dar..."
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
