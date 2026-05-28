import Link from 'next/link';

export default function PricingTeaserSection() {
  return (
    <section className="bg-black py-32 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-sans tracking-widest text-white mb-16 text-center">
          INVESTITION IN <span className="text-blue">SICHERHEIT.</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* T0 */}
          <div className="bg-zinc-900 border border-blue p-8 rounded-lg relative hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(22,84,255,0.2)] transition-all duration-300">
            <div className="absolute top-0 right-0 bg-blue text-white text-xs font-sans tracking-widest px-3 py-1 rounded-bl-lg rounded-tr-lg">AKTIV</div>
            <h3 className="font-serif text-2xl text-white mb-2">T0: Single Project</h3>
            <p className="font-body text-zinc-400 mb-6">Perfekt für den Start.</p>
            <div className="font-sans text-5xl text-white mb-8">29 € <span className="text-xl text-zinc-500">/ MONAT</span></div>
            <ul className="space-y-4 font-body text-zinc-300 mb-8">
              <li>1 aktives Bauprojekt</li>
              <li>Tägliches Screening</li>
              <li>VOB/B Email-Entwürfe</li>
            </ul>
          </div>
          {/* T1 */}
          <div className="bg-black border border-zinc-800 p-8 rounded-lg relative opacity-50 grayscale">
            <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-400 text-xs font-sans tracking-widest px-3 py-1 rounded-bl-lg rounded-tr-lg">IN VORBEREITUNG</div>
            <h3 className="font-serif text-2xl text-white mb-2">T1: Pipeline</h3>
            <p className="font-body text-zinc-400 mb-6">Für wachsende Portfolios.</p>
            <div className="font-sans text-5xl text-white mb-8">99 € <span className="text-xl text-zinc-500">/ MONAT</span></div>
            <ul className="space-y-4 font-body text-zinc-300 mb-8">
              <li>Bis zu 5 Projekte</li>
              <li>Rhein-Neckar-Kreis</li>
              <li>Team-Alerts</li>
            </ul>
          </div>
          {/* T2 */}
          <div className="bg-black border border-zinc-800 p-8 rounded-lg relative opacity-50 grayscale">
            <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-400 text-xs font-sans tracking-widest px-3 py-1 rounded-bl-lg rounded-tr-lg">IN VORBEREITUNG</div>
            <h3 className="font-serif text-2xl text-white mb-2">T2: Portfolio</h3>
            <p className="font-body text-zinc-400 mb-6">Für Großbauträger.</p>
            <div className="font-sans text-5xl text-white mb-8">499 € <span className="text-xl text-zinc-500">/ MONAT</span></div>
            <ul className="space-y-4 font-body text-zinc-300 mb-8">
              <li>Unbegrenzte Projekte</li>
              <li>API-Integration</li>
              <li>Geprüfte Vorlagen</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/preise" className="font-sans text-blue tracking-widest hover:text-white transition-colors border-b border-blue hover:border-white pb-1">
            ZUR KOMPLETTEN PREISÜBERSICHT
          </Link>
        </div>
      </div>
    </section>
  );
}
