import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Image from 'next/image';

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
          <p className="font-sans tracking-widest text-blue-light mb-4 text-sm uppercase border border-blue-light/30 bg-blue-light/10 px-4 py-2 rounded-full inline-block backdrop-blur-md">
            Die Logik der Entscheidungen
          </p>
        </div>
      </section>
      
      <SectionWrapper>
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-sans tracking-widest text-white mb-8">
            DIE <span className="text-blue">DOKTRIN.</span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-zinc-400 leading-relaxed mb-16">
            Die Bauaufsicht ist kein Suchspiel. Es ist ein rechtliches Filterproblem. 
            PermitWatchDog wertet Dokumente auf Basis von fünf spezifischen Schichten 
            des deutschen Baurechts aus.
          </p>
        </div>

        <div className="space-y-16">
          {/* Layer 1 */}
          <div className="grid md:grid-cols-2 gap-12 group">
            <div className="relative aspect-square w-full md:w-2/3 border border-zinc-800 rounded-xl overflow-hidden group-hover:border-blue transition-colors">
              <Image src="/images/bestandsschutz_shield.png" alt="Bestandsschutz" fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-sans text-6xl text-blue-dark mb-4">1</h3>
              <h2 className="font-serif text-3xl text-white mb-6">Bestandsschutz</h2>
              <p className="font-body text-zinc-400 leading-relaxed mb-8">
                Sobald eine Baugenehmigung erteilt ist, entfaltet sie Bestandsschutz. 
                Die Engine prüft, ob neue Festsetzungen im Amtsblatt überhaupt noch in 
                laufende Projekte eingreifen können oder durch Art. 14 GG gedeckt sind.
              </p>
              <div className="border-t border-zinc-800 pt-4 mt-auto">
                <p className="font-sans text-xs tracking-widest text-zinc-500">
                  CITATION: ART. 14 GG (EIGENTUMS- UND BESTANDSSCHUTZ)
                </p>
              </div>
            </div>
          </div>

          {/* Layer 2 */}
          <div className="grid md:grid-cols-2 gap-12 group">
            <div className="flex flex-col justify-center order-2 md:order-1">
              <h3 className="font-sans text-6xl text-blue-dark mb-4">2</h3>
              <h2 className="font-serif text-3xl text-white mb-6">Vertrauensschutz</h2>
              <p className="font-body text-zinc-400 leading-relaxed mb-8">
                Wir identifizieren Fälle, in denen bereits erteilte Zusagen der Baubehörde bindend sind. 
                Dies verhindert unnötige Panik bei nachträglichen Planänderungen, wenn der Vertrauensschutz 
                gemäß VwVfG greift.
              </p>
              <div className="border-t border-zinc-800 pt-4 mt-auto">
                <p className="font-sans text-xs tracking-widest text-zinc-500">
                  CITATION: § 48 VwVfG (VERTRAUENSSCHUTZ BEI RÜCKNAHME)
                </p>
              </div>
            </div>
            <div className="relative aspect-square w-full md:w-2/3 border border-zinc-800 rounded-xl overflow-hidden group-hover:border-blue transition-colors order-1 md:order-2 ml-auto">
              <Image src="/images/bautraeger_executive.png" alt="Vertrauensschutz" fill className="object-cover mix-blend-luminosity" />
            </div>
          </div>

          {/* Layer 5: Exception */}
          <div className="grid md:grid-cols-2 gap-12 group mt-32 border border-blue bg-blue/5 p-8 md:p-12 rounded-xl">
            <div className="relative aspect-square w-full md:w-2/3 border border-blue-dark rounded-xl overflow-hidden shadow-[0_0_30px_rgba(22,84,255,0.2)]">
              <Image src="/images/auflage_piercing_chain.png" alt="Auflage-Piercing" fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-sans text-6xl text-blue mb-4">5</h3>
              <h2 className="font-serif text-3xl text-white mb-6">Auflage-Piercing</h2>
              <p className="font-body text-zinc-300 leading-relaxed mb-8">
                Die wichtigste Ausnahmeregelung. Greift eine neue städtische Regelung direkt in 
                Ihre spezifischen Genehmigungsauflagen ein, durchbricht dies den Bestandsschutz. 
                Ein klassisches Beispiel ist die Lärmschutzvorgabe nach DIN 4109 in Verbindung 
                mit temporären Event-Einschränkungen (z.B. Stadtfest). Hier generiert die KI 
                sofort einen <strong className="text-white">HIGH Impact Alert</strong>.
              </p>
              <div className="border-t border-blue-dark pt-4 mt-auto">
                <p className="font-sans text-xs tracking-widest text-blue-light">
                  CITATION: VOB/B § 6 ABS. 2 (BEHINDERUNG UND UNTERBRECHUNG)
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
