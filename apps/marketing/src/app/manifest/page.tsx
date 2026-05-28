import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';

export default function ManifestPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />

      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4 text-center">
            Unsere Vision
          </p>
          <h1 className="text-5xl md:text-7xl font-sans tracking-widest text-white mb-16 uppercase text-center">
            DAS BÜROKRATIE-<span className="text-blue">MANIFEST.</span>
          </h1>

          <div className="space-y-8 font-serif text-xl text-zinc-300 leading-relaxed">
            <p>
              Das deutsche Bauwesen erstickt nicht an mangelnder Innovation, sondern an 
              Intransparenz. Jede Woche produzieren Ämter Tausende Seiten an PDF-Bekanntmachungen, 
              Amtsblättern und Verordnungen. Die Daten sind da, aber sie sind nicht nutzbar.
            </p>
            <p>
              Wir glauben, dass rechtliche Klarheit kein Privileg für Baukonzerne mit eigenen 
              Rechtsabteilungen sein darf. Wenn die Regulierung algorithmisch wird, muss auch 
              die Compliance algorithmisch werden.
            </p>
            <p className="text-2xl text-white font-bold py-6 border-l-4 border-blue pl-6 my-8">
              "Wir bauen die digitale Infrastruktur, die eigentlich der Staat bereitstellen müsste."
            </p>
            <p>
              PermitWatchDog ist der erste Schritt. Wir extrahieren die unstrukturierten Daten 
              der Bauämter, interpretieren sie durch unsere proprietäre juristische Engine und 
              liefern dem Bauleiter am nächsten Morgen genau den einen Satz, der sein Projekt rettet.
            </p>
            <p>
              Das langfristige Ziel? Offene Standards. Föderierte WebMCP-Schnittstellen für alle 
              europäischen Bauämter, wie es die EU-PSI-Richtlinie längst fordert. Bis die Politik 
              liefert, liefern wir.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
