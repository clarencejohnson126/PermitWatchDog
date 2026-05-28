import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-sans tracking-wide">
          <span className="text-white">PERMIT</span>
          <span className="text-blue-light">WATCHDOG</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/produkt" className="text-sm font-body text-zinc-400 hover:text-white transition-colors">Produkt</Link>
          <Link href="/doktrin" className="text-sm font-body text-zinc-400 hover:text-white transition-colors">Doktrin</Link>
          <Link href="/preise" className="text-sm font-body text-zinc-400 hover:text-white transition-colors">Preise</Link>
          <Link href="/mannheim" className="text-sm font-body text-zinc-400 hover:text-white transition-colors">Mannheim Pilot</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-body text-zinc-400 hover:text-white transition-colors hidden md:block">Login</Link>
          <Link href="/preise" className="bg-blue hover:bg-blue-light text-white text-sm font-bold font-sans tracking-widest px-6 py-2.5 rounded transition-all shadow-[0_0_15px_rgba(22,84,255,0.3)] hover:shadow-[0_0_25px_rgba(58,123,255,0.5)]">
            ABSICHERN
          </Link>
        </div>
      </div>
    </nav>
  );
}
