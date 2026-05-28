// Dispatcher — creates DRAFTED emails in each user's own Outlook inbox via
// Microsoft Graph. Matches the product promise: "fertige E-Mail in IHREM
// Outlook" — never sent from a third-party domain, always pre-staged for the
// user to review and forward to their architect/Bauamt.
//
// If a user hasn't connected Outlook yet, their alerts are queued (notified_at
// stays NULL) and will dispatch automatically once they complete the OAuth
// flow at /oauth/microsoft/start.

import { prisma } from '@/lib/db/prisma';
import { createOutlookDraft } from './outlook';

const MAX_PER_RUN = 100;

export interface DispatchSummary {
  started_at: string;
  completed_at: string;
  duration_ms: number;
  drafts_created: number;
  failed: number;
  skipped_no_outlook: number;
  skipped_no_email: number;
}

function buildEmail(args: {
  project_name: string;
  pierced_auflage: string;
  severity: string;
  filing_title: string;
  filing_url: string;
  filing_publish_date: Date;
  matched_keyword: string;
  matched_excerpt: string;
  bauantrag_nr: string;
}): { subject: string; text: string; html: string } {
  const severityWord =
    args.severity === 'high'
      ? 'HOHE Priorität'
      : args.severity === 'medium'
        ? 'mittlere Priorität'
        : 'geringe Priorität';
  const publishDate = args.filing_publish_date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const subject = `[PermitWatchDog · ${severityWord}] ${args.pierced_auflage.slice(0, 80)}`;

  const text = [
    'Hallo,',
    '',
    'eine Änderung wurde gefunden, die möglicherweise eine Ihrer Auflagen betrifft.',
    '',
    `Projekt:      ${args.project_name}${args.bauantrag_nr ? ' (' + args.bauantrag_nr + ')' : ''}`,
    `Auflage:      ${args.pierced_auflage}`,
    `Priorität:    ${severityWord}`,
    `Treffer:      "${args.matched_keyword}"`,
    '',
    `Quelle:       ${args.filing_title}`,
    `Veröffentl.:  ${publishDate}`,
    `Original:     ${args.filing_url}`,
    '',
    'Kontext (gefundene Stelle):',
    `  …${args.matched_excerpt}…`,
    '',
    'Was jetzt zu tun ist:',
    '1. Originalquelle prüfen (Link oben)',
    '2. Mit dem Architekten klären, ob die Änderung die Auflage tatsächlich verschiebt',
    '3. Bei einer echten Auflage-Piercing: VOB/B § 6 Abs. 2 Anzeige vorbereiten',
    '',
    'Dieser Entwurf wurde von PermitWatchDog erzeugt — prüfen, anpassen, senden.',
    '— PermitWatchDog',
    'https://permit-watch-dog.vercel.app',
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html lang="de">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#f7f7f9;color:#0a0a0e;">
  <div style="background:#fff;border-radius:8px;padding:32px;border-left:4px solid ${args.severity === 'high' ? '#dc2626' : args.severity === 'medium' ? '#f59e0b' : '#64748b'};">
    <p style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#1654FF;margin:0 0 8px;">PermitWatchDog · ${severityWord}</p>
    <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px;">${escape(args.pierced_auflage)}</h1>
    <p style="color:#555;margin:0 0 24px;">Eine Änderung wurde gefunden, die möglicherweise <strong>Ihre Auflage</strong> betrifft.</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#888;width:120px;">Projekt</td><td><strong>${escape(args.project_name)}</strong>${args.bauantrag_nr ? ' · <span style="color:#888;font-family:monospace;">' + escape(args.bauantrag_nr) + '</span>' : ''}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Auflage</td><td>${escape(args.pierced_auflage)}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Quelle</td><td><a href="${escape(args.filing_url)}" style="color:#1654FF;">${escape(args.filing_title)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#888;">Veröffentl.</td><td>${publishDate}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Treffer</td><td><code style="background:#f0f0f3;padding:2px 6px;border-radius:3px;">${escape(args.matched_keyword)}</code></td></tr>
    </table>

    <blockquote style="margin:24px 0;padding:12px 16px;background:#f0f0f3;border-left:3px solid #ccc;font-style:italic;color:#444;font-size:13px;">…${escape(args.matched_excerpt)}…</blockquote>

    <h3 style="font-size:14px;margin:24px 0 8px;">Was jetzt zu tun ist:</h3>
    <ol style="font-size:14px;line-height:1.6;padding-left:20px;color:#444;">
      <li>Originalquelle prüfen (<a href="${escape(args.filing_url)}" style="color:#1654FF;">Link</a>)</li>
      <li>Mit dem Architekten klären, ob die Änderung die Auflage tatsächlich verschiebt</li>
      <li>Bei echter Auflage-Piercing: VOB/B § 6 Abs. 2 Anzeige vorbereiten</li>
    </ol>

    <p style="font-size:12px;color:#888;margin:32px 0 0;border-top:1px solid #eee;padding-top:16px;">
      Dieser Entwurf wurde von <strong>PermitWatchDog</strong> erzeugt — prüfen, anpassen, senden.<br/>
      <a href="https://permit-watch-dog.vercel.app" style="color:#1654FF;">permit-watch-dog.vercel.app</a>
    </p>
  </div>
</body>
</html>
`.trim();

  return { subject, text, html };
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function dispatchAlerts(): Promise<DispatchSummary> {
  const started_at = new Date();
  let drafts = 0;
  let failed = 0;
  let skippedNoOutlook = 0;
  let skippedNoEmail = 0;

  const pending = await prisma.alert.findMany({
    where: { notified_at: null },
    include: { project: true, filing: true },
    orderBy: { created_at: 'asc' },
    take: MAX_PER_RUN,
  });

  // Cache lookups for which users have connected Outlook (one Prisma trip
  // per unique email instead of one per alert).
  const uniqueEmails = [...new Set(pending.map((a) => a.project.user_email).filter(Boolean))];
  const tokens = await prisma.oAuthToken.findMany({
    where: { user_email: { in: uniqueEmails }, provider: 'microsoft' },
  });
  const connected = new Set(tokens.map((t) => t.user_email));

  for (const alert of pending) {
    if (!alert.project.user_email) {
      skippedNoEmail += 1;
      continue;
    }
    if (!connected.has(alert.project.user_email)) {
      // User hasn't connected Outlook yet — leave notified_at NULL so the
      // alert auto-dispatches once they complete OAuth.
      skippedNoOutlook += 1;
      continue;
    }

    const reasoning = alert.doctrine_reasoning as {
      matched_keyword?: string;
      matched_excerpt?: string;
    };

    const { subject, text, html } = buildEmail({
      project_name: alert.project.project_name,
      pierced_auflage: alert.pierced_auflage,
      severity: alert.pierce_severity,
      filing_title: alert.filing.title,
      filing_url: alert.filing.source_url,
      filing_publish_date: alert.filing.publish_date,
      matched_keyword: reasoning.matched_keyword ?? '?',
      matched_excerpt: reasoning.matched_excerpt ?? '',
      bauantrag_nr: alert.project.bauantrag_nr,
    });

    try {
      const messageId = await createOutlookDraft({
        userEmail: alert.project.user_email,
        subject,
        htmlBody: html,
        // Empty toRecipients — user will add their architect/Bauamt manually before sending.
        // Or wire a project.default_recipient later.
        toRecipients: [],
      });
      if (!messageId) throw new Error('Outlook draft creation returned null');

      await prisma.alert.update({
        where: { id: alert.id },
        data: {
          notified_at: new Date(),
          drafted_email_subject: subject,
          drafted_email_body: text,
          outlook_message_id: messageId,
        },
      });
      drafts += 1;
    } catch (e) {
      failed += 1;
      console.error(`[dispatch] outlook draft failed for alert ${alert.id}:`, e);
    }
  }

  const completed_at = new Date();
  return {
    started_at: started_at.toISOString(),
    completed_at: completed_at.toISOString(),
    duration_ms: completed_at.getTime() - started_at.getTime(),
    drafts_created: drafts,
    failed,
    skipped_no_outlook: skippedNoOutlook,
    skipped_no_email: skippedNoEmail,
  };
}
