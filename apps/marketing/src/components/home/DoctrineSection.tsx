import Image from 'next/image';

export default function DoctrineSection() {
  return (
    <section className="bg-black py-32 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl font-sans tracking-widest text-white mb-6">
            DIE <span className="text-blue">DOKTRIN.</span>
          </h2>
          <p className="font-body text-xl text-zinc-400 max-w-3xl leading-relaxed">
            PermitWatchDog filtert nicht nur nach Stichworten. Unsere Engine wendet 
            tiefgreifende juristische Prüfroutinen an, die speziell auf das deutsche 
            Baurecht zugeschnitten sind. Jede Ebene hat genau einen Job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 mb-20">
          <div>
            <h3 className="font-sans text-8xl text-blue-dark mb-4">1</h3>
            <h4 className="font-serif text-2xl text-white mb-4">Bestandsschutz</h4>
            <p className="font-body text-zinc-400 leading-relaxed">
              Erkennt, wenn neue Verordnungen Ihr laufendes Projekt aufgrund des genehmigten 
              Bauantrags nicht mehr tangieren, und filtert diese irrelevante Flut aus.
            </p>
          </div>
          <div>
            <h3 className="font-sans text-8xl text-blue-dark mb-4">2</h3>
            <h4 className="font-serif text-2xl text-white mb-4">Vertrauensschutz</h4>
            <p className="font-body text-zinc-400 leading-relaxed">
              Identifiziert Fälle, in denen bereits erteilte Zusagen der Baubehörde 
              bindend sind und verhindert unnötige Panik bei nachträglichen Planänderungen.
            </p>
          </div>
          <div>
            <h3 className="font-sans text-8xl text-blue-dark mb-4">3</h3>
            <h4 className="font-serif text-2xl text-white mb-4">Verhältnismäßigkeit</h4>
            <p className="font-body text-zinc-400 leading-relaxed">
              Wägt ab, ob eine neue Auflage eine zumutbare Härte darstellt oder 
              unmittelbar operativ wirken kann.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="border border-zinc-900 bg-zinc-900/20 p-10 rounded-lg">
            <h3 className="font-sans text-8xl text-blue-dark mb-4">4</h3>
            <h4 className="font-serif text-2xl text-white mb-4">Übergangsregelungen</h4>
            <p className="font-body text-zinc-400 leading-relaxed">
              Prüft Fristen präzise, um sicherzustellen, dass Sie Handlungsfenster 
              für Widersprüche oder formale Anpassungen nicht verpassen.
            </p>
          </div>
          <div className="border border-blue/30 bg-blue/5 p-10 rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="font-sans text-8xl text-blue mb-4 relative z-10">5</h3>
            <h4 className="font-serif text-2xl text-white mb-4 relative z-10">Auflage-Piercing</h4>
            <p className="font-body text-zinc-300 leading-relaxed relative z-10">
              Die Ausnahmeregelung. Greift eine städtische Regelung direkt in Ihre 
              spezifischen Genehmigungsauflagen ein, durchbricht dies den Bestandsschutz. 
              Sie erhalten sofort einen <strong>HIGH Impact Alert</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
