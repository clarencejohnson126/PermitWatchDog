// Microsoft Graph helpers — per-user OAuth token refresh + Outlook draft creation.
// Used by the T1+ dispatcher to land alerts as drafted emails in the user's
// own Outlook inbox (instead of sending from Resend).
//
// The refresh_token lives in permit_watchdog.oauth_tokens. We refresh access
// tokens on-demand if expired or missing, then persist the new pair.

import { prisma } from '@/lib/db/prisma';

const MS_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const MS_GRAPH = 'https://graph.microsoft.com/v1.0';

interface TokenRefreshResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
}

/** Returns a valid access_token for the user, refreshing if needed. */
export async function getAccessTokenForUser(userEmail: string): Promise<string | null> {
  const row = await prisma.oAuthToken.findUnique({
    where: { user_email_provider: { user_email: userEmail, provider: 'microsoft' } },
  });
  if (!row) return null;

  // Use the cached access_token if it's still valid for at least 2 more minutes.
  if (row.access_token && row.expires_at && row.expires_at.getTime() > Date.now() + 120 * 1000) {
    return row.access_token;
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const scopes = process.env.MICROSOFT_SCOPES;
  if (!clientId || !clientSecret || !scopes) {
    throw new Error('Microsoft OAuth env vars not configured');
  }

  const res = await fetch(MS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: row.refresh_token,
      grant_type: 'refresh_token',
      scope: scopes,
    }).toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[outlook] refresh failed for ${userEmail}:`, errText);
    return null;
  }

  const data = (await res.json()) as TokenRefreshResponse;
  const newRefresh = data.refresh_token ?? row.refresh_token; // MS rotates refresh tokens on use
  const expiresAt = new Date(Date.now() + (data.expires_in - 60) * 1000);

  await prisma.oAuthToken.update({
    where: { user_email_provider: { user_email: userEmail, provider: 'microsoft' } },
    data: {
      access_token: data.access_token,
      refresh_token: newRefresh,
      expires_at: expiresAt,
      scope: data.scope ?? row.scope,
    },
  });

  return data.access_token;
}

/** Creates a draft message in the user's Outlook inbox. Returns the message id. */
export async function createOutlookDraft(args: {
  userEmail: string;
  subject: string;
  htmlBody: string;
  toRecipients?: string[];
}): Promise<string | null> {
  const accessToken = await getAccessTokenForUser(args.userEmail);
  if (!accessToken) return null;

  const res = await fetch(`${MS_GRAPH}/me/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      subject: args.subject,
      body: { contentType: 'HTML', content: args.htmlBody },
      toRecipients: (args.toRecipients ?? []).map((email) => ({ emailAddress: { address: email } })),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[outlook] draft creation failed for ${args.userEmail}:`, errText);
    return null;
  }

  const msg = (await res.json()) as { id: string };
  return msg.id;
}
