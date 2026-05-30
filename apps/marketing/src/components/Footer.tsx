'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n/LangContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-sans tracking-wide mb-4 inline-block">
            <span className="text-white">PERMIT</span><span className="text-blue-dark">WATCHDOG</span>
          </Link>
          <p className="font-body text-zinc-500 max-w-sm">{t('footer.tagline')}</p>
        </div>
        <div>
          <h4 className="font-sans text-white tracking-widest mb-6">{t('footer.product').toUpperCase()}</h4>
          <ul className="flex flex-col gap-4 font-body text-zinc-400 text-sm">
            <li><Link href="/produkt" className="hover:text-blue-light transition-colors">{t('nav.product')}</Link></li>
            <li><Link href="/doktrin" className="hover:text-blue-light transition-colors">{t('nav.doctrine')}</Link></li>
            <li><Link href="/preise" className="hover:text-blue-light transition-colors">{t('nav.pricing')}</Link></li>
            <li><Link href="/mannheim" className="hover:text-blue-light transition-colors">{t('nav.pilot')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-white tracking-widest mb-6">{t('footer.product').toUpperCase()}</h4>
          <ul className="flex flex-col gap-4 font-body text-zinc-400 text-sm">
            <li><Link href="/bautraeger" className="hover:text-blue-light transition-colors">{t('footer.developers')}</Link></li>
            <li><Link href="/bauleiter" className="hover:text-blue-light transition-colors">{t('footer.bauleiter')}</Link></li>
            <li><Link href="/architekten" className="hover:text-blue-light transition-colors">{t('footer.architects')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-white tracking-widest mb-6">{t('footer.company').toUpperCase()}</h4>
          <ul className="flex flex-col gap-4 font-body text-zinc-400 text-sm">
            <li><Link href="/ueber-uns" className="hover:text-blue-light transition-colors">{t('footer.about')}</Link></li>
            <li><Link href="/manifest" className="hover:text-blue-light transition-colors">Manifest</Link></li>
            <li><Link href="/impressum" className="hover:text-blue-light transition-colors">{t('footer.imprint')}</Link></li>
            <li><Link href="/datenschutz" className="hover:text-blue-light transition-colors">{t('footer.privacy')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-body text-zinc-600">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
