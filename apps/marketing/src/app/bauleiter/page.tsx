import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Image from 'next/image';
import CTAButton from '../../components/CTAButton';

export default function BauleiterPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />
      
      {/* Video Prelude */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center overflow-hidden border-b border-zinc-900">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
        >
          <source src="/videos/bauleiter-life.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <SectionWrapper className="relative z-10 pb-0">
          <div className="max-w-3xl">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4">
              Für Bauleiter & Kleinbetriebe
            </p>
            <h1 className="text-5xl md:text-7xl font-sans tracking-widest text-white mb-6 uppercase">
              DEIN <span className="text-blue">RÜCKEN-</span><br/>DECKER.
            </h1>
          </div>
        </SectionWrapper>
      </section>

      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-4xl text-white mb-8 leading-tight">
              Um 5:30 Uhr auf der Baustelle. Keine Zeit für das Amtsblatt.
            </h2>
            <div className="space-y-6 font-body text-zinc-400 text-lg leading-relaxed">
              <p>
                Als Einzelkämpfer oder Bauleiter in einem Kleinbetrieb hast du keine 
                Stabsabteilung, die für dich städtische Bekanntmachungen filtert. 
                Du erfährst von der Vollsperrung, wenn der Betonmischer nicht durchkommt.
              </p>
              <p>
                PermitWatchDog ändert das. Wir überwachen deine Baustellen. 
                Vollautomatisch. Jeden Morgen um 06:00 Uhr hast du die relevanten Alerts 
                auf dem Handy – inklusive vorbereitetem VOB/B-Schreiben für den Bauherrn.
              </p>
              <ul className="space-y-4 py-4 text-zinc-300">
                <li className="flex items-center gap-3"><span className="text-blue font-bold">✓</span> Keine verpassten Fristen mehr.</li>
                <li className="flex items-center gap-3"><span className="text-blue font-bold">✓</span> Automatische Behinderungsanzeigen.</li>
                <li className="flex items-center gap-3"><span className="text-blue font-bold">✓</span> Rechtssicherheit wie bei den Großen.</li>
              </ul>
              <div className="pt-8">
                <CTAButton href="/preise">JETZT ABSICHERN</CTAButton>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/bauleiter_portrait.png" 
              alt="Bauleiter auf Baustelle" 
              fill 
              className="object-cover" 
            />
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
