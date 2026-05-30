// Per-user dashboard: list projects + alerts.
// Email-based identification (no full auth yet) — MVP. Use `?email=...` query
// or set the `pwd_email` cookie via the upload form for persistence.

import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { AlertCircle, CheckCircle2, ExternalLink, FileText, Home, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

const SEVERITY_LABEL: Record<string, string> = { high: 'HOCH', medium: 'MITTEL', low: 'NIEDRIG' };
const SEVERITY_COLOR: Record<string, string> = {
  high: 'border-red-500/40 bg-red-500/10 text-red-300',
  medium: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  low: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-300',
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const email = (sp.email ?? cookieStore.get('pwd_email')?.value ?? '').toLowerCase().trim();

  if (!email) return <NoEmailState />;

  const projects = await prisma.project.findMany({
    where: { user_email: email },
    include: {
      alerts: {
        include: { filing: true },
        orderBy: [{ created_at: 'desc' }],
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />
      <section className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-16 w-full">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-3">Dashboard</p>
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
          Ihre <span className="text-blue">Bauvorhaben</span>
        </h1>
        <p className="text-zinc-400 text-sm mb-10">
          <span className="font-mono">{email}</span>
          {' · '}
          {projects.length} Projekt{projects.length === 1 ? '' : 'e'}
          {' · '}
          {projects.reduce((a, p) => a + p.alerts.length, 0)} Alerts gesamt
        </p>

        {projects.length === 0 && <EmptyState email={email} />}

        <div className="space-y-12">
          {projects.map((p) => {
            const open = p.alerts.filter((a) => !a.notified_at).length;
            const sent = p.alerts.filter((a) => a.notified_at).length;
            return (
              <article key={p.id} className="border border-zinc-800 rounded-2xl bg-zinc-950/60 overflow-hidden">
                <header className="p-6 md:p-8 border-b border-zinc-800">
                  <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-blue-light mb-2">Projekt</p>
                      <h2 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-1">
                        {p.project_name}
                      </h2>
                      <p className="text-zinc-400 text-sm">
                        {p.address}
                        {p.bauantrag_nr && (
                          <>
                            {' · '}
                            <span className="font-mono text-zinc-500">{p.bauantrag_nr}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <Pill label={`${open} offen`} tone={open > 0 ? 'amber' : 'zinc'} />
                      <Pill label={`${sent} versendet`} tone="zinc" />
                      <Pill label={p.lifecycle_stage} tone="blue" />
                    </div>
                  </div>

                  {p.bescheid_auflagen.length > 0 && (
                    <details className="mt-6 group">
                      <summary className="cursor-pointer text-sm text-blue-light hover:text-white inline-flex items-center gap-2 list-none">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {p.bescheid_auflagen.length} überwachte Auflagen anzeigen
                      </summary>
                      <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-zinc-300">
                        {p.bescheid_auflagen.map((a, i) => (
                          <li key={i} className="pl-2 leading-relaxed">{a}</li>
                        ))}
                      </ol>
                    </details>
                  )}
                </header>

                <div className="p-6 md:p-8">
                  {p.alerts.length === 0 ? (
                    <div className="flex items-start gap-3 text-sm text-zinc-500">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400/70" />
                      <span>Bisher keine Alerts. Stille bedeutet: nichts hat eine Auflage durchbrochen.</span>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {p.alerts.map((a) => {
                        const r = a.doctrine_reasoning as {
                          method?: string;
                          reasoning?: string;
                          doctrine_layer?: string;
                          confidence?: number;
                          matched_keyword?: string;
                          matched_excerpt?: string;
                        };
                        return (
                          <li
                            key={a.id}
                            className={`rounded-lg border p-4 md:p-5 ${SEVERITY_COLOR[a.pierce_severity] ?? SEVERITY_COLOR.low}`}
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                              <div className="flex items-center gap-3">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-[10px] tracking-[0.25em] uppercase font-mono">
                                  {SEVERITY_LABEL[a.pierce_severity] ?? a.pierce_severity}
                                </span>
                                {r.doctrine_layer && (
                                  <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-mono">
                                    {r.doctrine_layer.replace(/_/g, ' ')}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] tracking-widest uppercase text-zinc-500">
                                {a.notified_at ? 'GESENDET' : 'OFFEN'}
                                {' · '}
                                {new Date(a.created_at).toLocaleDateString('de-DE')}
                              </span>
                            </div>

                            <p className="font-serif text-base md:text-lg text-white leading-snug mb-3">
                              {a.pierced_auflage}
                            </p>

                            {r.reasoning && (
                              <p className="text-sm text-zinc-300 italic mb-3 leading-relaxed">
                                „{r.reasoning}"
                              </p>
                            )}

                            <div className="flex items-start gap-3 text-xs text-zinc-400 border-t border-white/5 pt-3">
                              <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 break-all">
                                <p className="mb-1">
                                  <span className="text-zinc-500">Quelle:</span> {a.filing.title}
                                </p>
                                <a
                                  href={a.filing.source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-light hover:text-white break-all"
                                >
                                  {a.filing.source_url}
                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Pill({ label, tone }: { label: string; tone: 'amber' | 'zinc' | 'blue' }) {
  const cls =
    tone === 'amber'
      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
      : tone === 'blue'
        ? 'border-blue/40 bg-blue/10 text-blue-light'
        : 'border-zinc-700 bg-zinc-900/50 text-zinc-400';
  return (
    <span className={`text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function NoEmailState() {
  return (
    <main className="flex min-h-screen flex-col bg-black pt-20">
      <Nav />
      <section className="flex-1 max-w-md mx-auto px-6 py-24 w-full text-center">
        <Home className="w-10 h-10 text-blue mx-auto mb-4" />
        <h1 className="font-serif text-3xl text-white mb-3">Dashboard</h1>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          Wir brauchen Ihre E-Mail-Adresse, um Ihre Projekte zu finden. Tragen Sie diese als
          URL-Parameter ein:
        </p>
        <form method="get" className="space-y-3">
          <input
            type="email"
            name="email"
            required
            placeholder="bauleiter@firma.de"
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue text-sm"
          />
          <button
            type="submit"
            className="w-full bg-blue hover:bg-blue-light text-white text-xs tracking-widest uppercase font-bold py-3 rounded"
          >
            Projekte anzeigen
          </button>
        </form>
        <p className="text-xs text-zinc-600 mt-6">
          Noch keinen Bescheid hochgeladen?{' '}
          <Link href="/upload" className="text-blue hover:underline">
            Hier starten
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}

function EmptyState({ email }: { email: string }) {
  return (
    <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center">
      <Home className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
      <p className="text-zinc-400 text-sm mb-4">
        Kein Projekt für <span className="font-mono">{email}</span> gefunden.
      </p>
      <Link
        href="/upload"
        className="inline-flex items-center gap-2 bg-blue hover:bg-blue-light text-white px-5 py-2.5 rounded text-xs tracking-widest uppercase font-bold"
      >
        Bescheid hochladen
      </Link>
    </div>
  );
}
