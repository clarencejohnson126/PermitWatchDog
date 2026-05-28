import * as fs from 'fs';
import * as path from 'path';

let cachedAccessToken: string | null = null;
let tokenExpiryTime: number = 0; // Epoch ms

async function getValidAccessToken(): Promise<string> {
  const now = Date.now();
  // Buffer of 60 seconds
  if (cachedAccessToken && tokenExpiryTime > now + 60000) {
    return cachedAccessToken;
  }

  const refreshToken = process.env.OUTLOOK_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("OUTLOOK_REFRESH_TOKEN environment variable is missing. Please run the OAuth flow.");
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID!;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
  const redirectUri = process.env.NODE_ENV === 'production' 
    ? process.env.MICROSOFT_REDIRECT_URI_PROD!
    : process.env.MICROSOFT_REDIRECT_URI!;
  
  if (!clientId || !clientSecret) {
    throw new Error("Missing MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    redirect_uri: redirectUri,
    grant_type: 'refresh_token'
  });

  const res = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to refresh token: ${res.status} - ${errText}. Re-authorization required.`);
  }

  const data = await res.json() as any;
  cachedAccessToken = data.access_token;
  tokenExpiryTime = now + (data.expires_in * 1000);

  // If a new refresh token is issued, update .env.local
  if (data.refresh_token && data.refresh_token !== refreshToken) {
    process.env.OUTLOOK_REFRESH_TOKEN = data.refresh_token;
    updateEnvFile('OUTLOOK_REFRESH_TOKEN', data.refresh_token);
    console.warn("⚠️  OUTLOOK_REFRESH_TOKEN was rotated by Microsoft. .env.local has been updated.");
    console.warn("⚠️  Ensure you do NOT commit .env.local, but keep it safe for the next run.");
  }

  return cachedAccessToken!;
}

function updateEnvFile(key: string, value: string) {
  const envPath = path.join(__dirname, '../../.env.local');
  if (!fs.existsSync(envPath)) return;
  
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');
  let updated = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`${key}=`)) {
      lines[i] = `${key}=${value}`;
      updated = true;
      break;
    }
  }

  if (!updated) {
    lines.push(`${key}=${value}`);
  }

  fs.writeFileSync(envPath, lines.join('\n'));
}

export async function createDraft(params: {
  subject: string;
  bodyText: string;
  toRecipient: string;
  ccRecipient?: string;
}): Promise<string> {
  const token = await getValidAccessToken();

  const { subject, bodyText, toRecipient, ccRecipient } = params;

  const payload: any = {
    subject,
    body: {
      contentType: "Text",
      content: bodyText,
    },
    toRecipients: [
      {
        emailAddress: {
          address: toRecipient,
        },
      },
    ],
  };

  if (ccRecipient) {
    payload.ccRecipients = [
      {
        emailAddress: {
          address: ccRecipient,
        },
      },
    ];
  }

  const res = await fetch("https://graph.microsoft.com/v1.0/me/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new Error("Outlook Graph token expired — refresh required (see backlog)");
  }

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Graph API error: ${res.status} ${res.statusText} - ${errorBody}`);
  }

  const data = await res.json() as any;
  return data.id;
}
