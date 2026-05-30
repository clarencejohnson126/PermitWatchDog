// Daily status mail — ALWAYS sent per project per day, even when 0 alerts.
//
// Without this the user has no daily signal that the system is alive.
// "Stille bis es zählt" only works if you trust the silence — and trust
// comes from a daily proof-of-life that says: scan ran, sources hit,
// here's what we found.
//
// Sent at 06:30 Berlin via the dispatcher cron after the orchestrator
// has completed. One mail per active project, addressed to the user's
// Outlook (Microsoft Graph drafts — same path as alerts).

import { prisma } from '@/lib/db/prisma';
import { createOutlookDraft } from './outlook';

export interface DailyStatusSummary {
  started_at: string;
  completed_at: string;
  duration_ms: number;
  projects: number;
  status_mails_drafted: number;
  failed: number;
  skipped_no_outlook: number;
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Send one daily status mail per project to its user's Outlook. */
export async function sendDailyStatus(): Promise<DailyStatusSummary> {
  const started_at = new Date();
  let drafted = 0;
  let failed = 0;
  let skippedNoOutlook = 0;

  const projects = await prisma.project.findMany({
    where: { lifecycle_stage: { in: ['approved', 'under_construction'] } },
    include: {
      alerts: { where: { created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } },
    },
  });

  // Get latest scraper run for the status numbers
  const lastRun = await prisma.scraperRun.findFirst({
    where: { errors_count: 0 },
    orderBy: { completed_at: 'desc' },
  });
  const filingsInWindow = await prisma.filing.count({
    where: { created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });

  // Group emails to dedupe — one mail per (user_email).
  const byEmail = new Map<string, typeof projects>();
  for (const p of projects) {
    if (!p.user_email) continue;
    const arr = byEmail.get(p.user_email) ?? [];
    arr.push(p);
    byEmail.set(p.user_email, arr);
  }

  // Check who has Outlook connected.
  const tokens = await prisma.oAuthToken.findMany({
    where: { user_email: { in: [...byEmail.keys()] }, provider: 'microsoft' },
  });
  const connected = new Set(tokens.map((t) => t.user_email));

  const todayDe = started_at.toLocaleDateString('de-DE', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  for (const [email, ps] of byEmail.entries()) {
    if (!connected.has(email)) {
      skippedNoOutlook += 1;
      continue;
    }
    const totalAlertsLast24h = ps.reduce((acc, p) => acc + p.alerts.length, 0);
    const totalAuflagen = ps.reduce((acc, p) => acc + p.bescheid_auflagen.length, 0);

    const subject =
      totalAlertsLast24h > 0
        ? `[PermitWatchDog · Tages-Status] ${totalAlertsLast24h} neue Alert${totalAlertsLast24h === 1 ? '' : 's'} · ${todayDe}`
        : `[PermitWatchDog · Tages-Status] Alles ruhig · ${todayDe}`;

    const projectsHtml = ps
      .map((p) => {
        const open = p.alerts.length;
        return `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;">
              <strong>${escape(p.project_name)}</strong>
              ${p.bauantrag_nr ? ` · <span style="color:#888;font-family:monospace;font-size:12px;">${escape(p.bauantrag_nr)}</span>` : ''}
              <br/>
              <span style="font-size:12px;color:#888;">${escape(p.address)} · ${p.bescheid_auflagen.length} überwachte Auflagen</span>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">
              ${open > 0
                ? `<span style="background:#fee2e2;color:#dc2626;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:bold;">${open} neu</span>`
                : `<span style="color:#10b981;font-size:14px;">✓ ruhig</span>`}
            </td>
          </tr>`;
      })
      .join('');

    const html = `
<!DOCTYPE html><html lang="de"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#f7f7f9;color:#0a0a0e;">
  <div style="background:#fff;border-radius:8px;padding:32px;border-left:4px solid #1654FF;">
    <p style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#1654FF;margin:0 0 8px;">PermitWatchDog · Tages-Status</p>
    <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px;">${todayDe}</h1>
    <p style="color:#555;margin:0 0 24px;">
      ${totalAlertsLast24h > 0
        ? `<strong>${totalAlertsLast24h} neue Alert${totalAlertsLast24h === 1 ? '' : 's'}</strong> in den letzten 24 Stunden. Details unten — die Drafts liegen separat in Ihrem Posteingang.`
        : `<strong>Alles ruhig.</strong> Nichts hat eine Ihrer Auflagen durchbrochen — Ihr Bauvorhaben kann weiterlaufen.`}
    </p>

    <h3 style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin:24px 0 8px;">Scan-Statistik</h3>
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#888;width:50%;">Letzter erfolgreicher Scan</td><td>${lastRun ? lastRun.completed_at.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' }) : '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Filings in den letzten 24h ingested</td><td>${filingsInWindow}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Überwachte Projekte</td><td>${ps.length}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Überwachte Auflagen gesamt</td><td>${totalAuflagen}</td></tr>
    </table>

    <h3 style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin:24px 0 8px;">Ihre Projekte</h3>
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      ${projectsHtml}
    </table>

    <p style="font-size:12px;color:#888;margin:32px 0 0;border-top:1px solid #eee;padding-top:16px;">
      Dieser Status-Report wird täglich erzeugt, damit Sie sicher sein können, dass das System läuft.
      Quellen heute: Mannheim Bauamt (Bekanntmachungen, Vergaben, Bauleitplanung), Mannheim Amtsblatt-Archiv, SF DataSF Building Permits.<br/>
      — <strong>PermitWatchDog</strong> · <a href="https://permit-watch-dog.vercel.app/dashboard?email=${encodeURIComponent(email)}" style="color:#1654FF;">Dashboard öffnen</a>
    </p>
  </div>
</body></html>`.trim();

    try {
      const id = await createOutlookDraft({
        userEmail: email,
        subject,
        htmlBody: html,
        toRecipients: [email],
      });
      if (!id) throw new Error('Outlook draft returned null');
      drafted += 1;
    } catch (e) {
      failed += 1;
      console.error(`[daily-status] draft failed for ${email}:`, e);
    }
  }

  const completed_at = new Date();
  return {
    started_at: started_at.toISOString(),
    completed_at: completed_at.toISOString(),
    duration_ms: completed_at.getTime() - started_at.getTime(),
    projects: projects.length,
    status_mails_drafted: drafted,
    failed,
    skipped_no_outlook: skippedNoOutlook,
  };
}
