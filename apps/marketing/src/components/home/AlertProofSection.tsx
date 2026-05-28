export default function AlertProofSection() {
  return (
    <section className="bg-zinc-900 py-32 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-sans tracking-widest text-white mb-16 text-center uppercase">
          SO SIEHT EIN VOB/B-ENTWURF AUS
        </h2>
        
        <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl border border-zinc-200">
          {/* Outlook Header Fake */}
          <div className="bg-zinc-100 border-b border-zinc-200 px-6 py-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-sans text-xl text-zinc-900 tracking-wide">
                  Bauamt-Alert: Q5,18 — Stadtfest Vollsperrungen 23.-25. Mai
                </h3>
                <p className="text-sm font-body text-zinc-500 mt-1">Von: alert@permitwatchdog.de</p>
                <p className="text-sm font-body text-zinc-500">An: clarencejohnson@hotmail.de</p>
              </div>
              <span className="text-xs font-sans bg-blue/10 text-blue px-3 py-1 rounded">HEUTE, 06:12 UHR</span>
            </div>
          </div>
          
          {/* Email Body */}
          <div className="p-8 md:p-12 font-serif text-zinc-800 text-lg leading-relaxed space-y-6">
            <p>Sehr geehrte Damen und Herren,</p>
            <p>
              Wir nehmen Bezug auf die im Amtsblatt KW 21 veröffentlichten Verkehrsinformationen 
              zum Stadtfest, welche in der Kalenderwoche 21 Gültigkeit erlangen.
            </p>
            <p>
              Der Bestandsschutz der erteilten Baugenehmigung für das Bauvorhaben Wohnhaus Q5, 18 
              greift voraussichtlich. Die bekannt gegebenen Verkehrsinformationen bezüglich des 
              Stadtfestes, insbesondere die Vollsperrungen am Friedrichsring/Kaiserring und die 
              daraus resultierenden Verkehrsbeeinträchtigungen, stellen jedoch eine wesentliche 
              Erschwernis für die termingerechte Anlieferung von Baumaterialien und die Zufahrt 
              der Baufahrzeuge dar. Dies tangiert unmittelbar die vereinbarte Baulogistik und 
              kann zu Ablaufstörungen führen.
            </p>
            <p>
              Wir fordern Sie daher auf, die Auswirkungen dieser Verkehrsmaßnahmen auf die 
              Bauablaufplanung und das Logistikkonzept des Bauvorhabens Q5, 18 umgehend zu 
              prüfen und erforderliche Anpassungen der Ausführungsplanung vorzunehmen. Eventuell 
              notwendige Fristverlängerungs- oder Mehrkostenforderungen gemäß § 6 Abs. 2 VOB/B 
              sind in diesem Kontext zu evaluieren.
            </p>
            <p>Mit freundlichen Grüßen<br/>Clarence Johnson<br/>RebelzBau Mannheim GmbH</p>
          </div>
        </div>
      </div>
    </section>
  );
}
