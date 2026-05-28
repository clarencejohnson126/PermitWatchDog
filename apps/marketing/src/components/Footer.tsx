import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-sans tracking-wide mb-4 inline-block">
            <span className="text-white">PERMIT</span><span className="text-blue-dark">WATCHDOG</span>
          </Link>
          <p className="font-body text-zinc-500 max-w-sm">
            Die erste KI-gestützte Bauaufsicht für Mannheim. Behördliche Baustopps verhindern, bevor sie entstehen.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-white tracking-widest mb-6">PRODUKT</h4>
          <ul className="flex flex-col gap-4 font-body text-zinc-400 text-sm">
            <li><Link href="/produkt" className="hover:text-blue-light transition-colors">Tour</Link></li>
            <li><Link href="/doktrin" className="hover:text-blue-light transition-colors">Doktrin</Link></li>
            <li><Link href="/preise" className="hover:text-blue-light transition-colors">Preise</Link></li>
            <li><Link href="/mannheim" className="hover:text-blue-light transition-colors">Pilotstadt Mannheim</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-white tracking-widest mb-6">RECHTLICHES</h4>
          <ul className="flex flex-col gap-4 font-body text-zinc-400 text-sm">
            <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
            <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
            <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
            <li><a href="/llm.txt" className="hover:text-white transition-colors">llm.txt</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-body text-zinc-600">
        <p>© 2026 Rebelz AI / PermitWatchDog. Alle Rechte vorbehalten.</p>
        <p className="mt-4 md:mt-0">Gebaut in Mannheim.</p>
      </div>
    </footer>
  );
}
