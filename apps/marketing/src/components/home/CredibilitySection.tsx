import Image from 'next/image';

export default function CredibilitySection() {
  return (
    <section className="bg-zinc-900 py-32 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-sans tracking-widest text-white mb-8 uppercase">
            GEBAUT VON BAULEITERN, <span className="text-blue">FÜR BAULEITER.</span>
          </h2>
          <div className="font-body text-lg text-zinc-400 leading-relaxed space-y-6">
            <p>
              Nach 10 Jahren auf Baustellen in der Rhein-Neckar-Region habe ich 
              PermitWatchDog entwickelt, um ein massives Problem zu lösen: 
              Die asymmetrische Informationsverteilung zwischen Behörden und Bauleitern.
            </p>
            <p>
              Große Konzerne haben Abteilungen, die das Amtsblatt scannen. Der Mittelstand 
              zahlt die Zeche, wenn eine kurzfristige Vollsperrung oder Lärmschutzauflage 
              übersehen wird.
            </p>
            <p className="text-white font-serif italic text-2xl mt-8">
              "Wir bauen das, was Strabag schon hat, für den Ein-LKW-Betrieb."
            </p>
            <p className="font-sans tracking-widest text-blue mt-4">
              — CLARENCE JOHNSON, FOUNDER
            </p>
          </div>
        </div>
        <div className="w-full md:w-[500px] aspect-[4/5] relative rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
          <Image 
            src="/images/credibility_team.png" 
            alt="Team auf der Baustelle" 
            fill 
            className="object-cover" 
          />
        </div>
      </div>
    </section>
  );
}
