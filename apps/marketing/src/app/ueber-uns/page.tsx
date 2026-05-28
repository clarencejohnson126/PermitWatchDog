import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Image from 'next/image';

export default function UeberUnsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />

      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4">
              Über Uns
            </p>
            <h1 className="text-5xl md:text-7xl font-sans tracking-widest text-white mb-8 uppercase">
              VON DER <span className="text-blue">GRUBE.</span>
            </h1>
            <div className="space-y-6 font-body text-zinc-400 text-lg leading-relaxed">
              <p>
                PermitWatchDog wurde nicht in einem Silicon Valley Inkubator geboren, 
                sondern auf den Baustellen im Rhein-Neckar-Kreis.
              </p>
              <p>
                Clarence Johnson arbeitete zehn Jahre als Bauleiter in Mannheim und Umgebung. 
                Er sah aus erster Hand, wie asymmetrisch Informationen zwischen den Bauämtern 
                und dem Baugewerbe verteilt sind. Während Großkonzerne Stabsabteilungen 
                beschäftigen, um Amtsblätter zu scannen, zahlt der Mittelstand die Zeche 
                für übersehene Auflagen und unvorhergesehene Sperrungen.
              </p>
              <p>
                Um dieses Missverhältnis aufzulösen, gründete er Rebelz AI und baute 
                PermitWatchDog: Ein System, das die rechtliche Power einer Großkanzlei 
                mit der Präzision moderner KI vereint.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/founder_portrait.png" 
              alt="Clarence Johnson" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
            />
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
